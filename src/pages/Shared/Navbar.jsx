/* eslint-disable no-unused-vars */
import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { NavLink, useLoaderData } from "react-router";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import { Bell } from "lucide-react";

const API_BASE = "https://bracu-research-server-teal.vercel.app";

const Navbar = () => {
  const { user, logOut, loading } = useContext(AuthContext);
  const data = useLoaderData();

  // Static (loader) match for role/nav visibility
  const UserFromLoader = useMemo(
    () =>
      Array.isArray(data) ? data.find((u) => u.email === user?.email) : null,
    [data, user?.email]
  );

  // Live user doc for notifications (kept in sync via polling / on-open fetch)
  const [userDoc, setUserDoc] = useState(UserFromLoader || null);

  useEffect(() => {
    setUserDoc(UserFromLoader || null);
  }, [UserFromLoader]);

  const fetchLatestUserDoc = useCallback(async () => {
    if (!UserFromLoader?._id) return;
    try {
      // Prefer GET /users/:id if available; fallback to scanning /users
      let fresh = null;

      // Try direct endpoint
      const r = await fetch(`${API_BASE}/users/${UserFromLoader._id}`);
      if (r.ok) {
        fresh = await r.json();
      } else {
        // Fallback: fetch all and pick (keeps compatibility with your current loader design)
        const all = await fetch(`${API_BASE}/users/`);
        if (all.ok) {
          const arr = await all.json();
          fresh = Array.isArray(arr)
            ? arr.find((u) => u._id === UserFromLoader._id) || null
            : null;
        }
      }

      if (fresh) setUserDoc(fresh);
    } catch (err) {
      // non-fatal
      // console.error("Live user fetch failed:", err);
    }
  }, [UserFromLoader?._id]);

  // Poll every 10s for fresh notifications
  useEffect(() => {
    if (!UserFromLoader?._id) return;
    let cancelled = false;

    const tick = async () => {
      if (cancelled) return;
      await fetchLatestUserDoc();
    };

    // initial & interval
    tick();
    const id = setInterval(tick, 10000);

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [UserFromLoader?._id, fetchLatestUserDoc]);

  const [showNotifications, setShowNotifications] = useState(false);
  const [markingSeen, setMarkingSeen] = useState(false);

  const toggleNotifications = async () => {
    const next = !showNotifications;
    setShowNotifications(next);

    // When opening: pull freshest notifications first
    if (next) {
      await fetchLatestUserDoc();
    }

    // If there are unseen notifications, mark them as seen immediately for UX
    if (
      next &&
      userDoc &&
      userDoc._id &&
      userDoc.isSeen === false &&
      !markingSeen
    ) {
      try {
        setMarkingSeen(true);
        await fetch(`${API_BASE}/users/${userDoc._id}/notifications/seen`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        });
        // Optimistically update local state so the dot disappears right away
        setUserDoc((prev) => (prev ? { ...prev, isSeen: true } : prev));
      } catch (err) {
        // console.error("Mark seen failed:", err);
      } finally {
        setMarkingSeen(false);
      }
    }
  };

  // Prefer live doc for notification UI, fallback to loader user
  const roleUser = UserFromLoader;
  const notifUser = userDoc || UserFromLoader;

  return (
    <nav className="bg-white dark:bg-slate-900 shadow-md">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left - Logo */}
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          BRACU Research <span className="text-[#7b1e3c]">Connect</span>
        </h1>

        {/* Middle - Navigation Links */}
        <ul className="hidden md:flex space-x-8 text-slate-700 dark:text-gray-300 font-medium">
          <NavLink to="/">
            <li className="hover:text-[#7b1e3c] transition">Home</li>
          </NavLink>

          {roleUser?.role === "student" && (
            <>
              <NavLink to="thesis-proposal">
                <li className="hover:text-[#7b1e3c] transition">
                  Proposal Submission
                </li>
              </NavLink>
            </>
          )}

          {(roleUser?.role === "supervisor" ||
            roleUser?.role === "student") && (
            <NavLink to="/view-announcement">
              <li className="hover:text-[#7b1e3c] transition">
                View Announcement
              </li>
            </NavLink>
          )}

          {roleUser?.role === "admin" && (
            <NavLink to="admin-dashboard">
              <li className="hover:text-[#7b1e3c] transition">Dashboard</li>
            </NavLink>
          )}
          {roleUser?.role === "admin" && (
            <NavLink to="semester">
              <li className="hover:text-[#7b1e3c] transition">Semester</li>
            </NavLink>
          )}
          {roleUser?.role === "supervisor" && (
            <NavLink to="supervisor-dashboard">
              <li className="hover:text-[#7b1e3c] transition">Dashboard</li>
            </NavLink>
          )}
          <NavLink to="/all-thesis">
            <li className="hover:text-[#7b1e3c] transition">All Thesis</li>
          </NavLink>

          {roleUser?.role === "student" && (
            <NavLink to="student-dashboard">
              <li className="hover:text-[#7b1e3c] transition">Dashboard</li>
            </NavLink>
          )}
        </ul>

        {/* Right - Notifications, Auth */}
        <div className="flex items-center space-x-4 relative">
          {/* Notifications Bell */}
          {(roleUser?.role === "student" ||
            roleUser?.role === "supervisor") && (
            <div className="relative">
              <button onClick={toggleNotifications} className="relative">
                <Bell className="text-slate-900 dark:text-white" size={22} />
                {notifUser?.isSeen === false && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 max-h-80 overflow-y-auto bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-50">
                  {Array.isArray(notifUser?.notifications) &&
                  notifUser.notifications.length > 0 ? (
                    [...notifUser.notifications].reverse().map((n, i) => (
                      <div
                        key={i}
                        className="px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer"
                        onClick={() => {
                          if (n.link) window.location.href = n.link;
                        }}
                      >
                        <p className="font-medium">{n.message}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(n.date).toLocaleString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="p-4 text-sm text-gray-500">
                      No notifications
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Auth Buttons */}
          {user ? (
            <NavLink to="/login">
              <button
                onClick={logOut}
                disabled={loading}
                className="px-4 py-2 bg-[#7b1e3c] text-white rounded-lg hover:bg-[#651730] transition disabled:opacity-60"
              >
                Logout
              </button>
            </NavLink>
          ) : (
            <NavLink to="/login">
              <button className="px-4 py-2 bg-[#7b1e3c] text-white rounded-lg hover:bg-[#651730] transition">
                Login
              </button>
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
