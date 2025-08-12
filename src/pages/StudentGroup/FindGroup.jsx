import React, { useContext, useEffect, useMemo, useState } from "react";
import { NavLink, useParams } from "react-router";
import { AuthContext } from "../../contexts/Auth/AuthContext";

const API_BASE = "http://localhost:5000";

const FindGroup = () => {
  const { user } = useContext(AuthContext);          // Firebase user (login gate only)
  const { id: routeUserId } = useParams();           // Mongo user _id in URL, e.g. /find-group/:id

  const [dbUser, setDbUser] = useState(null);        // Full user from Mongo
  const [loadingUser, setLoadingUser] = useState(true);

  const [groups, setGroups] = useState([]);          // All groups
  const [loadingGroups, setLoadingGroups] = useState(true);

  const [joining, setJoining] = useState({});        // { [groupId]: boolean } for per-card spinner/disable

  // Load Mongo user by :id
  useEffect(() => {
    let ignore = false;
    const loadUser = async () => {
      setLoadingUser(true);
      try {
        if (!routeUserId) {
          setDbUser(null);
          return;
        }
        const res = await fetch(`${API_BASE}/users/${routeUserId}`);
        if (!res.ok) {
          setDbUser(null);
          return;
        }
        const data = await res.json();
        if (!ignore) setDbUser(data);
      } catch (e) {
        console.error("Failed to load user:", e);
        if (!ignore) setDbUser(null);
      } finally {
        if (!ignore) setLoadingUser(false);
      }
    };
    loadUser();
    return () => { ignore = true; };
  }, [routeUserId]);

  // Load all groups
  useEffect(() => {
    let ignore = false;
    const loadGroups = async () => {
      setLoadingGroups(true);
      try {
        const res = await fetch(`${API_BASE}/groups`);
        const data = res.ok ? await res.json() : [];
        if (!ignore) setGroups(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to load groups:", e);
        if (!ignore) setGroups([]);
      } finally {
        if (!ignore) setLoadingGroups(false);
      }
    };
    loadGroups();
    return () => { ignore = true; };
  }, []);

  // Convenience ids / flags
  const myId = useMemo(
    () => (dbUser?._id ? String(dbUser._id) : null),
    [dbUser?._id]
  );

  // Is the current user already in ANY group?
  const iAmInAnyGroup = useMemo(() => {
    if (!myId) return false;
    return groups.some(
      (g) => Array.isArray(g.members) && g.members.some((m) => String(m) === myId)
    );
  }, [groups, myId]);

  // Per-group derived state
  const joinableState = (g) => {
    const adminId = String(g.admin);
    const isAdmin = myId && adminId === myId;

    const membersArr = Array.isArray(g.members) ? g.members : [];
    const isMember = myId && membersArr.some((m) => String(m) === myId);

    const full = membersArr.length >= (g.maxMembers || 5);

    return { isAdmin, isMember, full };
  };

  // Join handler
  const joinGroup = async (groupId) => {
    if (!myId) return;
    setJoining((p) => ({ ...p, [groupId]: true }));
    try {
      const res = await fetch(`${API_BASE}/groups/${groupId}/join`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: myId }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Failed to join group");
      }
      // Update the specific group locally
      setGroups((prev) =>
        prev.map((g) => (String(g._id) === String(groupId) ? data.group : g))
      );
      alert("Joined group successfully!");
    } catch (e) {
      console.error(e);
      alert(e.message || "Failed to join group");
    } finally {
      setJoining((p) => ({ ...p, [groupId]: false }));
    }
  };

  return (
    <section className="px-6 py-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-white">
            Find Groups
          </h1>
          <p className="text-slate-600 dark:text-gray-300 mt-1">
            Browse existing research groups and join one that matches your interests.
          </p>
        </div>

        {/* Create group button */}
        <div>
          {routeUserId && !iAmInAnyGroup ? (
            <NavLink to={`/create-group/${routeUserId}`}>
              <button className="px-4 py-2 rounded-lg bg-[#7b1e3c] text-white hover:bg-[#651730] transition">
                Create Group
              </button>
            </NavLink>
          ) : (
            <button
              className="px-4 py-2 rounded-lg bg-gray-300 text-gray-700 dark:bg-slate-700 dark:text-gray-300 cursor-not-allowed"
              disabled
              title={
                !routeUserId
                  ? "User id missing in URL"
                  : "You already belong to a group"
              }
            >
              Create Group
            </button>
          )}
        </div>
      </div>

      {/* Global banner if already in a group */}
      {iAmInAnyGroup && (
        <div className="mt-4 p-3 rounded-lg bg-amber-50 text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
          You already belong to a group. You can’t join or create another group.
        </div>
      )}

      {/* List */}
      <div className="mt-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 shadow-sm">
        {loadingUser || loadingGroups ? (
          <div className="p-6 text-slate-600 dark:text-gray-300">Loading groups…</div>
        ) : !user ? (
          <div className="p-6 text-amber-700 dark:text-amber-300">
            Please log in to view and join groups.
          </div>
        ) : groups.length === 0 ? (
          <div className="p-6 text-slate-600 dark:text-gray-300">
            No groups yet. Be the first to create one!
          </div>
        ) : (
          <ul className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((g) => {
              const gid = String(g._id);
              const { isAdmin, isMember, full } = joinableState(g);
              const disabled = !myId || isAdmin || isMember || full || joining[gid] || iAmInAnyGroup;

              return (
                <li
                  key={gid}
                  className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-slate-900 hover:shadow-sm transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {g.name}
                    </h3>
                    <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-slate-800 text-slate-700 dark:text-gray-200">
                      {Array.isArray(g.members) ? g.members.length : 0}/{g.maxMembers || 5}
                    </span>
                  </div>

                  {/* Interests */}
                  {Array.isArray(g.researchInterests) && g.researchInterests.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {g.researchInterests.map((tag) => (
                        <span
                          key={`${gid}-${tag}`}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-[#7b1e3c]/10 text-[#7b1e3c]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Status badges */}
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                    {g.assignedSupervisor ? (
                      <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300">
                        Supervisor Assigned
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300">
                        No Supervisor
                      </span>
                    )}
                    {isAdmin && (
                      <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300">
                        You are the Admin
                      </span>
                    )}
                    {isMember && !isAdmin && (
                      <span className="px-2 py-1 rounded bg-purple-100 text-purple-800 dark:bg-purple-500/15 dark:text-purple-300">
                        You’re a Member
                      </span>
                    )}
                    {full && !isMember && !isAdmin && (
                      <span className="px-2 py-1 rounded bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300">
                        Group Full
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-4">
                    <button
                      onClick={() => joinGroup(gid)}
                      disabled={disabled}
                      className={`w-full inline-flex items-center justify-center px-4 py-2 rounded-lg transition 
                        ${
                          disabled
                            ? "bg-gray-200 text-gray-600 dark:bg-slate-800 dark:text-gray-400 cursor-not-allowed"
                            : "bg-[#7b1e3c] text-white hover:bg-[#651730]"
                        }`}
                      title={
                        !myId
                          ? "User id not loaded"
                          : iAmInAnyGroup
                          ? "You already belong to a group"
                          : isAdmin
                          ? "Group admin cannot join"
                          : isMember
                          ? "You already joined this group"
                          : full
                          ? "Group is full"
                          : "Join this group"
                      }
                    >
                      {joining[gid] ? "Joining…" : "Join Group"}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
};

export default FindGroup;