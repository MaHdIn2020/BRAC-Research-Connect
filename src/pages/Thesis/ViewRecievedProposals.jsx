import React, { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import { useLoaderData } from "react-router";
import { FileText, Check, X, Link as LinkIcon } from "lucide-react";

const API_BASE = "http://localhost:3000";

const ViewRecievedProposals = () => {
  const { user } = useContext(AuthContext);
  const data = useLoaderData(); // same pattern you’re using elsewhere
  const dbUser = useMemo(
    () => data?.find?.((u) => u.email === user?.email) || null,
    [data, user?.email]
  );
  const supervisorId = dbUser?._id ? String(dbUser._id) : null;

  const [loading, setLoading] = useState(true);
  const [proposals, setProposals] = useState([]);
  const [acting, setActing] = useState({}); // { [proposalId]: boolean }
  const [error, setError] = useState("");

  const fetchProposals = async () => {
    if (!supervisorId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/proposals?supervisorId=${supervisorId}`);
      if (!res.ok) throw new Error("Failed to fetch proposals");
      const data = await res.json();
      setProposals(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setError(e.message || "Failed to fetch proposals");
      setProposals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supervisorId]);

  const decide = async (proposalId, decision) => {
    if (!supervisorId) return;
    setActing((p) => ({ ...p, [proposalId]: true }));
    try {
      const res = await fetch(`${API_BASE}/proposals/${proposalId}/decision`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supervisorId,
          decision, // "approve" | "reject"
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Failed to update proposal");
      }
      // update in place
      setProposals((prev) =>
        prev.map((p) => (String(p._id) === String(proposalId) ? data.proposal : p))
      );
      alert(
        decision === "approve"
          ? "Proposal approved successfully"
          : "Proposal rejected successfully"
      );
    } catch (e) {
      console.error(e);
      alert(e.message || "Failed to update proposal");
    } finally {
      setActing((p) => ({ ...p, [proposalId]: false }));
    }
  };

  return (
    <section className="min-h-screen bg-white dark:bg-slate-900 transition-colors p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center gap-3">
          <FileText className="w-7 h-7 text-[#7b1e3c]" />
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-white">
            Proposals Submitted to You
          </h1>
        </div>

        {!supervisorId ? (
          <div className="text-amber-700 dark:text-amber-300">
            Couldn’t resolve your supervisor account.
          </div>
        ) : loading ? (
          <div className="text-slate-600 dark:text-gray-300">Loading proposals…</div>
        ) : error ? (
          <div className="text-rose-700 dark:text-rose-300">{error}</div>
        ) : proposals.length === 0 ? (
          <div className="text-slate-600 dark:text-gray-300">
            No proposals submitted yet.
          </div>
        ) : (
          <ul className="space-y-4">
            {proposals.map((p) => {
              const pid = String(p._id);
              const pending = p.status === "Pending";
              return (
                <li
                  key={pid}
                  className="rounded-xl border border-gray-200 dark:border-slate-700 p-4 bg-white dark:bg-slate-900"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {p.title}
                      </h3>
                      <div className="text-xs text-slate-500 dark:text-gray-400">
                        {p.groupName || "Unknown Group"} —{" "}
                        {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ""}
                      </div>

                      {Array.isArray(p.domain) && p.domain.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {p.domain.map((d) => (
                            <span
                              key={`${pid}-${d}`}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-[#7b1e3c]/10 text-[#7b1e3c]"
                            >
                              {d}
                            </span>
                          ))}
                        </div>
                      )}

                      <p className="mt-3 text-sm text-slate-700 dark:text-gray-300">
                        {p.abstract}
                      </p>

                      <div className="mt-3 flex items-center gap-2 text-xs">
                        <span
                          className={`px-2 py-1 rounded-full ${
                            p.status === "Approved"
                              ? "bg-green-100 text-green-800"
                              : p.status === "Rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {p.status}
                        </span>
                        {p.driveLink && (
                          <a
                            href={p.driveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[#7b1e3c] hover:underline"
                          >
                            <LinkIcon className="w-3.5 h-3.5" />
                            Drive Link
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="shrink-0 flex flex-col gap-2">
                      <button
                        onClick={() => decide(pid, "approve")}
                        disabled={!pending || acting[pid]}
                        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${
                          !pending || acting[pid]
                            ? "bg-gray-200 text-gray-600 dark:bg-slate-800 dark:text-gray-400 cursor-not-allowed"
                            : "bg-emerald-600 text-white hover:bg-emerald-700"
                        }`}
                        title={pending ? "Approve proposal" : "Action disabled"}
                      >
                        <Check className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => decide(pid, "reject")}
                        disabled={!pending || acting[pid]}
                        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${
                          !pending || acting[pid]
                            ? "bg-gray-200 text-gray-600 dark:bg-slate-800 dark:text-gray-400 cursor-not-allowed"
                            : "bg-rose-600 text-white hover:bg-rose-700"
                        }`}
                        title={pending ? "Reject proposal" : "Action disabled"}
                      >
                        <X className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
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

export default ViewRecievedProposals;