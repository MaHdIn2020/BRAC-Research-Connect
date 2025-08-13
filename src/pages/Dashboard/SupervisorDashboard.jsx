import React, { useContext, useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router";
import { FileText, Users, BookOpen } from "lucide-react";
import { AuthContext } from "../../contexts/Auth/AuthContext";
const API_BASE = "http://localhost:3000";
const SupervisorDashboard = () => {
  const { user } = useContext(AuthContext);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const data = useLoaderData();
  const User = data.find((u) => u.email === user?.email);

  useEffect(() => {
    if (!User?._id) {
      setLoading(false);
      return;
    }
    const supervisorId = User._id;

    const fetchProposals = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${API_BASE}/proposals?supervisorId=${supervisorId}`
        );
        if (!res.ok) throw new Error("Failed to fetch proposals");
        const data = await res.json();
        setProposals(data);
      } catch (err) {
        console.error("Error fetching proposals:", err);
        setProposals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [User]);

  return (
    <section className="min-h-screen bg-white dark:bg-slate-900 p-6 transition-colors">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
              Welcome, {user?.name || user?.displayName || "Supervisor"}
            </h1>
            <p className="text-slate-600 dark:text-gray-400 mt-1">
              Manage your students, recommend papers, schedule meetings and
              assign final grades.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 shadow flex items-center gap-3 min-w-[150px]">
              <Users className="w-6 h-6 text-[#7b1e3c]" />
              <div>
                <div className="text-sm text-slate-600 dark:text-gray-400">
                  Assigned Students
                </div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  0
                </div>
              </div>
            </div>

            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 shadow flex items-center gap-3 min-w-[150px]">
              <FileText className="w-6 h-6 text-[#7b1e3c]" />
              <div>
                <div className="text-sm text-slate-600 dark:text-gray-400">
                  Pending Proposals
                </div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  0
                </div>
              </div>
            </div>

            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 shadow flex items-center gap-3 min-w-[150px]">
              <BookOpen className="w-6 h-6 text-[#7b1e3c]" />
              <div>
                <div className="text-sm text-slate-600 dark:text-gray-400">
                  Active Theses
                </div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  0
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <button className="px-4 py-2 bg-[#7b1e3c] text-white rounded-lg">
            Create Announcement
          </button>
          <button className="px-4 py-2 border border-[#7b1e3c] text-[#7b1e3c] rounded-lg">
            Search arXiv
          </button>
          <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
            View All Theses
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-5 shadow border border-gray-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                Assigned Students
              </h2>
              <div className="text-slate-500">No students assigned yet.</div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg p-5 shadow border border-gray-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                Upcoming Meetings
              </h2>
              <div className="text-slate-500">No meetings scheduled.</div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-5 shadow border border-gray-200 dark:border-slate-700 max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Proposals Submitted to You
                </h3>
                <FileText className="w-5 h-5 text-[#7b1e3c]" />
              </div>

              {loading ? (
                <div className="text-slate-500">Loading proposals...</div>
              ) : proposals.length === 0 ? (
                <div className="text-slate-500">
                  No proposals submitted yet.
                </div>
              ) : (
                <>
                  <ul className="space-y-3 max-h-80 overflow-y-auto">
                    {proposals.map((p) => (
                      <li
                        key={p._id || p.id}
                        className="p-3 rounded border border-gray-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                      >
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {p.title}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-gray-400 mb-1">
                          {p.groupName || "Unknown Student"} —{" "}
                          {new Date(p.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-slate-700 dark:text-gray-300 mb-2">
                          {p.abstract}
                        </div>
                        <div className="flex gap-2 text-xs">
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
                          <a
                            href={p.driveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#7b1e3c] hover:underline"
                          >
                            Drive Link
                          </a>
                        </div>
                      </li>
                    ))}
                  </ul>
                  {/* New View All Proposals button */}
                  <div className="mt-4 text-center">
                    <Link
                      to="/view-proposals"
                      className="inline-block px-4 py-2 bg-[#7b1e3c] text-white rounded-lg hover:bg-[#691832] transition-colors"
                    >
                      View All Proposals
                    </Link>
                  </div>
                </>
              )}
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg p-5 shadow border border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Theses You Supervise
                </h3>
                <BookOpen className="w-5 h-5 text-[#7b1e3c]" />
              </div>
              <div className="text-slate-500">No supervised theses found.</div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg p-5 shadow border border-gray-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                Quick Actions
              </h3>
              <div className="flex flex-col gap-2">
                <button className="text-left px-3 py-2 rounded hover:bg-slate-50 dark:hover:bg-slate-700">
                  Search arXiv
                </button>
                <button className="text-left px-3 py-2 rounded hover:bg-slate-50 dark:hover:bg-slate-700">
                  View Recommendations
                </button>
                <button className="text-left px-3 py-2 rounded hover:bg-slate-50 dark:hover:bg-slate-700">
                  Schedule Meeting
                </button>
                <Link
                  to="/theses"
                  className="text-left px-3 py-2 rounded hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  All Theses
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default SupervisorDashboard;
