import React, { useEffect, useState, useContext } from "react";
import {
  FileText,
  UserCheck,
  Clock,
  BookOpen,
  MessageSquare,
  Calendar,
  Search,
  Download,
  Users,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../../contexts/Auth/AuthContext";

const API_BASE = "http://localhost:5000";

const StudentDashboard = () => {
  const { user } = useContext(AuthContext); // expects user._id, user.role, user.name, etc.
  const navigate = useNavigate();

  // Local state
  const [loading, setLoading] = useState(true);
  const [proposals, setProposals] = useState([]); // user's proposals
  const [assignedSupervisor, setAssignedSupervisor] = useState(null);
  const [deadlines, setDeadlines] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [savedPapersCount, setSavedPapersCount] = useState(0);
  const [stats, setStats] = useState({
    proposalsCount: 0,
    approvedCount: 0,
    pendingCount: 0,
  });

  // Fetch student-related data
  useEffect(() => {
    if (!user?.uid && !user?._id) {
      setLoading(false);
      return;
    }

    const studentId = user._id || user.uid;

    const fetchAll = async () => {
      setLoading(true);
      try {
        // 1) Fetch proposals for this student
        const pRes = await fetch(`${API_BASE}/proposals?studentId=${studentId}`);
        const pJson = pRes.ok ? await pRes.json() : [];

        // 2) Fetch user to get assigned supervisor (if stored in users collection)
        const uRes = await fetch(`${API_BASE}/users/${studentId}`);
        const uJson = uRes.ok ? await uRes.json() : null;

        // 3) Deadlines (global)
        const dRes = await fetch(`${API_BASE}/deadlines`);
        const dJson = dRes.ok ? await dRes.json() : [];

        // 4) Feedbacks for this student
        const fRes = await fetch(`${API_BASE}/feedbacks?studentId=${studentId}`);
        const fJson = fRes.ok ? await fRes.json() : [];

        // 5) Saved papers count
        const sRes = await fetch(`${API_BASE}/saved-papers/count?studentId=${studentId}`);
        const sJson = sRes.ok ? await sRes.json() : { count: 0 };

        setProposals(pJson || []);
        setAssignedSupervisor(uJson?.assignedSupervisor || null);
        setDeadlines(dJson || []);
        setFeedbacks(fJson || []);
        setSavedPapersCount(sJson.count || 0);

        // stats
        const approvedCount = (pJson || []).filter((p) => p.status === "Approved").length;
        const pendingCount = (pJson || []).filter((p) => p.status === "Pending").length;
        setStats({
          proposalsCount: (pJson || []).length,
          approvedCount,
          pendingCount,
        });
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [user]);

  // UI helpers
  const getSupervisorName = () => {
    if (!assignedSupervisor) return "Not assigned";
    // assignedSupervisor might be an ID or object; try to render intelligently
    return assignedSupervisor.name || assignedSupervisor.displayName || assignedSupervisor.email || assignedSupervisor;
  };

  // Quick actions (navigate to pages you already have)
  const gotoSubmitProposal = () => navigate("/thesis-proposal");
  const gotoSearchPapers = () => navigate("/search");
  const gotoSavedPapers = () => navigate("/saved-papers");
  const gotoScheduleMeeting = () => navigate("/schedule-meeting");
  const gotoDownloadFinal = () => navigate("/thesis-list");

  return (
    <section className="min-h-screen bg-white dark:bg-slate-900 transition-colors p-6">
      <div className="container mx-auto">
        {/* Greeting + quick stats */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
              Welcome, {user?.name || user?.displayName || "Student"}
            </h1>
            <p className="text-slate-600 dark:text-gray-400 mt-1">
              Here's your thesis dashboard — quick links, statuses, deadlines and feedback.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 shadow flex items-center gap-3 min-w-[150px]">
              <FileText className="w-6 h-6 text-[#7b1e3c]" />
              <div>
                <div className="text-sm text-slate-600 dark:text-gray-400">Proposals</div>
                <div className="font-semibold text-slate-900 dark:text-white">{stats.proposalsCount}</div>
              </div>
            </div>

            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 shadow flex items-center gap-3 min-w-[150px]">
              <UserCheck className="w-6 h-6 text-[#7b1e3c]" />
              <div>
                <div className="text-sm text-slate-600 dark:text-gray-400">Supervisor</div>
                <div className="font-semibold text-slate-900 dark:text-white">{getSupervisorName()}</div>
              </div>
            </div>

            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 shadow flex items-center gap-3 min-w-[150px]">
              <BookOpen className="w-6 h-6 text-[#7b1e3c]" />
              <div>
                <div className="text-sm text-slate-600 dark:text-gray-400">Saved Papers</div>
                <div className="font-semibold text-slate-900 dark:text-white">{savedPapersCount}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button onClick={gotoSubmitProposal} className="px-4 py-2 bg-[#7b1e3c] text-white rounded-lg hover:bg-[#651730] transition">
            Submit Proposal
          </button>
          <button onClick={gotoSearchPapers} className="px-4 py-2 border border-[#7b1e3c] text-[#7b1e3c] rounded-lg hover:bg-[#7b1e3c] hover:text-white transition">
            <Search className="inline w-4 h-4 mr-2" /> Search Papers
          </button>
          <button onClick={gotoSavedPapers} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg border border-gray-200 dark:border-slate-700">
            View Saved Papers
          </button>
          <button onClick={gotoScheduleMeeting} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg border border-gray-200 dark:border-slate-700">
            Schedule Meeting
          </button>
          <button onClick={gotoDownloadFinal} className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white">
            <Download className="inline w-4 h-4 mr-2" /> Download Final Thesis
          </button>
        </div>

        {/* Two-column: Left -> Status & Proposals, Right -> Deadlines & Feedback */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Proposals & statuses */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-5 shadow border border-gray-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Your Proposals</h2>

              {loading ? (
                <div className="text-slate-500">Loading proposals...</div>
              ) : proposals.length === 0 ? (
                <div className="text-slate-500">No proposals found. Submit your first proposal.</div>
              ) : (
                <div className="space-y-3">
                  {proposals.map((p) => (
                    <div key={p._id || p.id} className="p-3 rounded-lg border border-gray-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white">{p.title}</h3>
                          <p className="text-sm text-slate-600 dark:text-gray-400 truncate max-w-xl">{p.abstract}</p>
                          <div className="text-xs mt-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${p.status === "Approved" ? "bg-green-100 text-green-800" : p.status === "Rejected" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}>
                              {p.status || "Pending"}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-sm text-slate-600 dark:text-gray-400">{p.submittedAt ? new Date(p.submittedAt).toLocaleDateString() : ""}</div>
                          <Link to={`/proposals/${p._id}`} className="text-xs text-[#7b1e3c] hover:underline mt-2 inline-block">View details</Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Supervisor feedback (recent) */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-5 shadow border border-gray-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Recent Supervisor Feedback</h2>
              {feedbacks.length === 0 ? (
                <div className="text-slate-500">No feedback yet.</div>
              ) : (
                <ul className="space-y-3">
                  {feedbacks.slice(0, 5).map((fb) => (
                    <li key={fb._id || fb.id} className="p-3 rounded border border-gray-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                      <div className="text-sm text-slate-700 dark:text-gray-300">{fb.comment}</div>
                      <div className="text-xs text-slate-500 mt-1">{fb.fromName || "Supervisor"} — {new Date(fb.createdAt).toLocaleString()}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Right column: Deadlines & Quick Links */}
          <aside className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-5 shadow border border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Upcoming Deadlines</h3>
                <Clock className="w-5 h-5 text-[#7b1e3c]" />
              </div>

              {deadlines.length === 0 ? (
                <div className="text-slate-500">No deadlines configured.</div>
              ) : (
                <ul className="space-y-3">
                  {deadlines.slice(0, 6).map((d) => (
                    <li key={d._id || d.id} className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-[#7b1e3c] mt-1" />
                      <div>
                        <div className="text-sm text-slate-900 dark:text-white">{d.title}</div>
                        <div className="text-xs text-slate-500 dark:text-gray-400">{d.dueDate ? new Date(d.dueDate).toLocaleDateString() : d.date}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg p-5 shadow border border-gray-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Quick Links</h3>
              <div className="flex flex-col gap-2">
                <button onClick={gotoSubmitProposal} className="text-left px-3 py-2 rounded hover:bg-slate-50 dark:hover:bg-slate-700">Submit Proposal</button>
                <button onClick={gotoScheduleMeeting} className="text-left px-3 py-2 rounded hover:bg-slate-50 dark:hover:bg-slate-700">Schedule Meeting</button>
                <button onClick={gotoSearchPapers} className="text-left px-3 py-2 rounded hover:bg-slate-50 dark:hover:bg-slate-700">Search Papers</button>
                <button onClick={gotoSavedPapers} className="text-left px-3 py-2 rounded hover:bg-slate-50 dark:hover:bg-slate-700">Saved Papers</button>
                <Link to="/find-group" className="text-left px-3 py-2 rounded hover:bg-slate-50 dark:hover:bg-slate-700">Find Groupmates</Link>
                <Link to="/faqs" className="text-left px-3 py-2 rounded hover:bg-slate-50 dark:hover:bg-slate-700">FAQs</Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default StudentDashboard;
