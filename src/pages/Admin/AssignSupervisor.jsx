import React, { useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  FileText,
  Tag,
  Link as LinkIcon,
  Users,
} from "lucide-react";

const API_BASE = "http://localhost:3000";

const statusBadge = (status = "Pending") => {
  const common = "px-2 py-1 rounded-full text-xs font-medium";
  if (status === "Approved") return `${common} bg-green-100 text-green-800`;
  if (status === "Rejected") return `${common} bg-red-100 text-red-800`;
  return `${common} bg-yellow-100 text-yellow-800`;
};

const AssignSupervisor = () => {
  // const users = useLoaderData(); // loader gives you /users from RootLayout (not needed here)
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("All"); // All | Pending | Approved | Rejected
  const [proposals, setProposals] = useState([]);
  const [assigningId, setAssigningId] = useState(null);
  const [error, setError] = useState("");

  const fetchProposals = async () => {
    setLoading(true);
    setError("");
    try {
      let url = `${API_BASE}/proposals?status=Pending`; // default
      if (tab === "Approved" || tab === "Rejected") {
        url = `${API_BASE}/proposals?status=${tab}`;
      } else if (tab === "All") {
        // Pull all three to render client-side
        const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
          fetch(`${API_BASE}/proposals?status=Pending`),
          fetch(`${API_BASE}/proposals?status=Approved`),
          fetch(`${API_BASE}/proposals?status=Rejected`),
        ]);
        const [pending, approved, rejected] = await Promise.all([
          pendingRes.ok ? pendingRes.json() : [],
          approvedRes.ok ? approvedRes.json() : [],
          rejectedRes.ok ? rejectedRes.json() : [],
        ]);
        setProposals(
          [...pending, ...approved, ...rejected].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        );
        setLoading(false);
        return;
      }

      const res = await fetch(url);
      const data = res.ok ? await res.json() : [];
      setProposals(
        (data || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
      );
    } catch (e) {
      console.error(e);
      setError("Failed to load proposals");
      setProposals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const assignSupervisor = async (proposalId) => {
    if (!proposalId) return;
    if (
      !confirm(
        "Assign this proposal’s supervisor to the group? This will remove all other proposals from that group."
      )
    ) {
      return;
    }

    try {
      setAssigningId(proposalId);
      const res = await fetch(`${API_BASE}/admin/assign-supervisor`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proposalId }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.message || "Failed to assign supervisor");
      }

      await fetchProposals();
      alert("Supervisor assigned and notifications sent.");
    } catch (e) {
      alert(e.message || "Failed to assign supervisor");
    } finally {
      setAssigningId(null);
    }
  };

  // small counts for the tabs
  const [counts, setCounts] = useState({
    Pending: 0,
    Approved: 0,
    Rejected: 0,
  });
  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/proposals?status=Pending`),
      fetch(`${API_BASE}/proposals?status=Approved`),
      fetch(`${API_BASE}/proposals?status=Rejected`),
    ])
      .then(async ([a, b, c]) => {
        const [ap, bp, cp] = await Promise.all([
          a.ok ? a.json() : [],
          b.ok ? b.json() : [],
          c.ok ? c.json() : [],
        ]);
        setCounts({
          Pending: ap.length,
          Approved: bp.length,
          Rejected: cp.length,
        });
      })
      .catch(() => {});
  }, []);

  return (
    <section className="min-h-screen bg-white dark:bg-slate-900 p-6 transition-colors">
      <div className="container mx-auto max-w-6xl">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            Manage Proposals & Assign Supervisors
          </h1>
          <p className="text-slate-600 dark:text-gray-400 mt-1">
            View proposals by status. Assign the proposed supervisor to the
            group with one click.
          </p>
        </header>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {["All", "Pending", "Approved", "Rejected"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-lg border text-sm ${
                tab === t
                  ? "bg-[#7b1e3c] text-white border-[#7b1e3c]"
                  : "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-slate-700 dark:text-gray-300"
              }`}
            >
              {t}
              {t !== "All" && (
                <span className="ml-2 text-xs opacity-80">
                  {t === "Pending"
                    ? counts.Pending
                    : t === "Approved"
                    ? counts.Approved
                    : counts.Rejected}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          {loading ? (
            <div className="p-6 text-slate-600 dark:text-gray-300">Loading…</div>
          ) : error ? (
            <div className="p-6 text-rose-600 dark:text-rose-300">{error}</div>
          ) : proposals.length === 0 ? (
            <div className="p-6 text-slate-600 dark:text-gray-300">
              No proposals found.
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-slate-700">
              {proposals.map((p) => {
                {
                  p.supervisorName || p.supervisorEmail || p.supervisor;
                }

                return (
                  <li key={p._id} className="p-5">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      {/* Left: main info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <FileText className="w-4 h-4 text-[#7b1e3c]" />
                          <h3 className="font-semibold text-slate-900 dark:text-white text-lg">
                            {p.title}
                          </h3>
                        </div>

                        <div className="text-xs text-slate-500 dark:text-gray-400 mb-2">
                          Group:{" "}
                          <span className="font-medium">
                            {p.groupName || "Unknown Group"}
                          </span>{" "}
                          •
                          <span className="ml-2">
                            Submitted {new Date(p.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Domain tags */}
                        {Array.isArray(p.domain) && p.domain.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-2">
                            {p.domain.map((d) => (
                              <span
                                key={`${p._id}-${d}`}
                                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-[#7b1e3c]/10 text-[#7b1e3c]"
                              >
                                <Tag className="w-3 h-3" />
                                {d}
                              </span>
                            ))}
                          </div>
                        )}

                        <p className="text-sm text-slate-700 dark:text-gray-300 mb-2">
                          {p.abstract}
                        </p>

                        <div className="flex items-center gap-3 text-xs">
                          <span className={statusBadge(p.status)}>{p.status}</span>
                          {p.driveLink && (
                            <a
                              href={p.driveLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[#7b1e3c] hover:underline"
                            >
                              <LinkIcon className="w-3 h-3" />
                              Drive link
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Right: meta + actions */}
                      <div className="w-full md:w-72 shrink-0">
                        <div className="rounded-lg border border-gray-200 dark:border-slate-700 p-3 bg-slate-50 dark:bg-slate-900">
                          <div className="text-xs text-slate-500 dark:text-gray-400 mb-1">
                            Proposed Supervisor
                          </div>
                          <div className="font-medium text-slate-900 dark:text-white">
                            {p.supervisorName || p.supervisorEmail || p.supervisor}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                            {p.supervisorEmail}
                          </div>
                        </div>

                        <div className="mt-3 text-xs text-slate-500 dark:text-gray-400 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Group: {p.groupName || "Unknown"}
                        </div>

                        {/* Admin action */}
                        <div className="mt-4 flex gap-2">
                          {p.status === "Pending" ? (
                            <button
                              disabled={assigningId === p._id}
                              onClick={() => assignSupervisor(p._id)}
                              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
                              title="Assign this proposed supervisor to the group"
                            >
                              <CheckCircle className="w-4 h-4" />
                              {assigningId === p._id ? "Assigning…" : "Assign Supervisor"}
                            </button>
                          ) : p.status === "Approved" ? (
                            <span className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-emerald-100 text-emerald-800">
                              <CheckCircle className="w-4 h-4" />
                              Already Assigned
                            </span>
                          ) : (
                            // Rejected state – no assigning allowed
                            <span className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-100 text-red-800">
                              <XCircle className="w-4 h-4" />
                              Rejected (via Supervisor)
                            </span>
                          )}
                        </div>

                        {p.status === "Pending" && (
                          <div className="mt-2">
                            <button
                              onClick={async () => {
                                if (!confirm("Mark this proposal as Rejected?")) return;
                                try {
                                  const res = await fetch(
                                    `${API_BASE}/proposals/${p._id}/decision`,
                                    {
                                      method: "PATCH",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({
                                        supervisorId: p.supervisor,
                                        decision: "reject",
                                      }),
                                    }
                                  );
                                  if (!res.ok) {
                                    const j = await res.json().catch(() => ({}));
                                    throw new Error(j.message || "Failed to reject");
                                  }
                                  fetchProposals();
                                } catch (err) {
                                  alert(err.message);
                                }
                              }}
                              className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700"
                            >
                              <XCircle className="w-4 h-4" />
                              Reject (via Sup Endpoint)
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};

export default AssignSupervisor;