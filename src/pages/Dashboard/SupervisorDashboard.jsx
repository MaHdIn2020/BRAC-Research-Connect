import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router";
import { FileText, Users, Clock, BookOpen, MessageSquare, Calendar } from "lucide-react";
import { AuthContext } from "../../contexts/Auth/AuthContext";

const API_BASE = "http://localhost:5000"; // replace with your backend

const SupervisorDashboard = () => {
  const { user } = useContext(AuthContext); // expects user._id, user.role, user.name
  const navigate = useNavigate();

  // state
  const [loading, setLoading] = useState(true);
  const [assignedStudents, setAssignedStudents] = useState([]); // array of { student, proposals, status }
  const [supervisedTheses, setSupervisedTheses] = useState([]); // all theses supervised
  const [meetings, setMeetings] = useState([]); // scheduled meetings
  const [recommendModal, setRecommendModal] = useState({ open: false, studentId: null });
  const [gradeModal, setGradeModal] = useState({ open: false, studentId: null, thesisId: null });
  const [stats, setStats] = useState({ students: 0, activeTheses: 0, pendingProposals: 0 });
  const [proposals, setProposals] = useState([]);

  useEffect(() => {
    if (!user?.uid && !user?._id) {
      setLoading(false);
      return;
    }
    const supervisorId = user._id || user.uid;

    const fetchAll = async () => {
      setLoading(true);
      try {
        // 1) assigned students for this supervisor
        const aRes = await fetch(`${API_BASE}/supervisors/${supervisorId}/assigned-students`);
        const aJson = aRes.ok ? await aRes.json() : [];

        // 2) supervised theses
        const tRes = await fetch(`${API_BASE}/supervisors/${supervisorId}/theses`);
        const tJson = tRes.ok ? await tRes.json() : [];

        // 3) meetings
        const mRes = await fetch(`${API_BASE}/supervisors/${supervisorId}/meetings`);
        const mJson = mRes.ok ? await mRes.json() : [];

        // 4) proposals submitted to this supervisor
        const pRes = await fetch(`${API_BASE}/supervisors/${supervisorId}/proposals`);
        const pJson = pRes.ok ? await pRes.json() : [];


        setAssignedStudents(aJson || []);
        setSupervisedTheses(tJson || []);
        setMeetings(mJson || []);
        setProposals(pJson || []);

        // stats
        const pendingProposals = (aJson || []).reduce((acc, s) => {
          const ps = (s.proposals || []).filter((p) => p.status === "Pending").length;
          return acc + ps;
        }, 0);

        setStats({
          students: (aJson || []).length,
          activeTheses: (tJson || []).filter((t) => t.status === "Active").length,
          pendingProposals,
        });
      } catch (err) {
        console.error("Failed to fetch supervisor dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [user]);

  // actions
  const gotoCreateAnnouncement = () => navigate("/announcements/new");
  const gotoArxivSearch = (studentId) => {
    // go to the existing search page (studentId optional param to recommend directly)
    navigate(`/arxiv-search?studentId=${studentId || ""}`);
  };
  const openRecommendModal = (studentId) => setRecommendModal({ open: true, studentId });
  const closeRecommendModal = () => setRecommendModal({ open: false, studentId: null });

  const submitRecommendation = async (studentId, paper) => {
    // POST recommendation to backend (implement endpoint)
    try {
      await fetch(`${API_BASE}/recommendations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ supervisorId: user._id || user.uid, studentId, paper }),
      });
      closeRecommendModal();
      // optionally refresh data
    } catch (err) {
      console.error("Failed to send recommendation", err);
    }
  };

  const openGradeModal = (studentId, thesisId) => setGradeModal({ open: true, studentId, thesisId });
  const closeGradeModal = () => setGradeModal({ open: false, studentId: null, thesisId: null });

  const submitGrade = async (thesisId, grade) => {
    try {
      await fetch(`${API_BASE}/theses/${thesisId}/grade`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ supervisorId: user._id || user.uid, grade }),
      });
      closeGradeModal();
      // refresh list
      const res = await fetch(`${API_BASE}/supervisors/${user._id || user.uid}/theses`);
      if (res.ok) setSupervisedTheses(await res.json());
    } catch (err) {
      console.error("Failed to assign grade", err);
    }
  };

  const scheduleMeeting = async (studentId, dateTime, notes) => {
    try {
      await fetch(`${API_BASE}/meetings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ supervisorId: user._id || user.uid, studentId, dateTime, notes }),
      });
      // refresh meetings
      const res = await fetch(`${API_BASE}/supervisors/${user._id || user.uid}/meetings`);
      if (res.ok) setMeetings(await res.json());
    } catch (err) {
      console.error("Failed to schedule meeting", err);
    }
  };

  // small UI helpers
  const studentName = (s) => s?.name || s?.displayName || s?.email || "Student";

return (
  <section className="min-h-screen bg-white dark:bg-slate-900 p-6 transition-colors">
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            Welcome, {user?.name || user?.displayName || "Supervisor"}
          </h1>
          <p className="text-slate-600 dark:text-gray-400 mt-1">
            Manage your students, recommend papers, schedule meetings and assign final grades.
          </p>
        </div>

        <div className="flex gap-4">
          <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 shadow flex items-center gap-3 min-w-[150px]">
            <Users className="w-6 h-6 text-[#7b1e3c]" />
            <div>
              <div className="text-sm text-slate-600 dark:text-gray-400">Assigned Students</div>
              <div className="font-semibold text-slate-900 dark:text-white">{stats.students}</div>
            </div>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 shadow flex items-center gap-3 min-w-[150px]">
            <FileText className="w-6 h-6 text-[#7b1e3c]" />
            <div>
              <div className="text-sm text-slate-600 dark:text-gray-400">Pending Proposals</div>
              <div className="font-semibold text-slate-900 dark:text-white">{stats.pendingProposals}</div>
            </div>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 shadow flex items-center gap-3 min-w-[150px]">
            <BookOpen className="w-6 h-6 text-[#7b1e3c]" />
            <div>
              <div className="text-sm text-slate-600 dark:text-gray-400">Active Theses</div>
              <div className="font-semibold text-slate-900 dark:text-white">{stats.activeTheses}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button onClick={gotoCreateAnnouncement} className="px-4 py-2 bg-[#7b1e3c] text-white rounded-lg">Create Announcement</button>
        <button onClick={() => gotoArxivSearch()} className="px-4 py-2 border border-[#7b1e3c] text-[#7b1e3c] rounded-lg">Search arXiv</button>
        <button onClick={() => navigate("/theses")} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg">View All Theses</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Assigned students + Meetings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-5 shadow border border-gray-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Assigned Students</h2>

            {loading ? (
              <div className="text-slate-500">Loading students...</div>
            ) : assignedStudents.length === 0 ? (
              <div className="text-slate-500">No students assigned yet.</div>
            ) : (
              <div className="space-y-3">
                {assignedStudents.map((s) => (
                  <div key={s.student?._id || s.student?.uid} className="p-3 rounded-lg border border-gray-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">{studentName(s.student)}</h3>
                        <p className="text-sm text-slate-600 dark:text-gray-400">{s.student?.email}</p>
                        <div className="text-xs mt-2">
                          {(s.proposals || []).slice(0, 2).map((p) => (
                            <span
                              key={p._id || p.id}
                              className={`inline-block px-2 py-1 mr-2 rounded-full text-xs ${
                                p.status === "Approved"
                                  ? "bg-green-100 text-green-800"
                                  : p.status === "Rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {p.title} — {p.status}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="text-right flex flex-col items-end gap-2">
                        <button onClick={() => openRecommendModal(s.student._id || s.student.uid)} className="text-xs text-[#7b1e3c] hover:underline">Recommend Paper</button>
                        <button onClick={() => navigate(`/students/${s.student._id || s.student.uid}`)} className="text-xs text-slate-500 hover:underline">View Profile</button>
                        <button onClick={() => openGradeModal(s.student._id || s.student.uid, s.currentThesis?._id)} className="text-xs text-slate-900 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">Assign Grade</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Meetings */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-5 shadow border border-gray-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Upcoming Meetings</h2>
            {meetings.length === 0 ? (
              <div className="text-slate-500">No meetings scheduled.</div>
            ) : (
              <ul className="space-y-3">
                {meetings.slice(0, 6).map((m) => (
                  <li key={m._id || m.id} className="p-3 rounded border border-gray-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                    <div className="text-sm text-slate-700 dark:text-gray-300">{m.notes || "Meeting"} </div>
                    <div className="text-xs text-slate-500 mt-1">{m.studentName || m.student?.name} — {new Date(m.dateTime).toLocaleString()}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right Sidebar: Proposals + Theses + Quick Actions */}
        <aside className="space-y-6">
          {/* Proposals Section */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-5 shadow border border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Proposals Submitted to You</h3>
              <FileText className="w-5 h-5 text-[#7b1e3c]" />
            </div>

            {proposals.length === 0 ? (
              <div className="text-slate-500">No proposals submitted yet.</div>
            ) : (
              <ul className="space-y-3 max-h-80 overflow-y-auto">
                {proposals.map((p) => (
                  <li key={p._id || p.id} className="p-3 rounded border border-gray-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                    <div className="font-semibold text-slate-900 dark:text-white">{p.title}</div>
                    <div className="text-xs text-slate-500 dark:text-gray-400 mb-1">
                      {p.student?.name || "Unknown Student"} — {new Date(p.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-slate-700 dark:text-gray-300 mb-2">{p.abstract}</div>
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
            )}
          </div>

          {/* Theses You Supervise */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-5 shadow border border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Theses You Supervise</h3>
              <BookOpen className="w-5 h-5 text-[#7b1e3c]" />
            </div>

            {supervisedTheses.length === 0 ? (
              <div className="text-slate-500">No supervised theses found.</div>
            ) : (
              <ul className="space-y-3">
                {supervisedTheses.slice(0, 6).map((t) => (
                  <li key={t._id || t.id} className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-[#7b1e3c] mt-1" />
                    <div>
                      <div className="text-sm text-slate-900 dark:text-white">{t.title}</div>
                      <div className="text-xs text-slate-500 dark:text-gray-400">{t.studentName || t.student?.name} — {t.status}</div>
                      <Link to={`/theses/${t._id}`} className="text-xs text-[#7b1e3c] hover:underline">View</Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-5 shadow border border-gray-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Quick Actions</h3>
            <div className="flex flex-col gap-2">
              <button onClick={() => navigate("/arxiv-search")} className="text-left px-3 py-2 rounded hover:bg-slate-50 dark:hover:bg-slate-700">Search arXiv</button>
              <button onClick={() => navigate("/recommendations")} className="text-left px-3 py-2 rounded hover:bg-slate-50 dark:hover:bg-slate-700">View Recommendations</button>
              <button onClick={() => navigate("/meetings/new")} className="text-left px-3 py-2 rounded hover:bg-slate-50 dark:hover:bg-slate-700">Schedule Meeting</button>
              <Link to="/theses" className="text-left px-3 py-2 rounded hover:bg-slate-50 dark:hover:bg-slate-700">All Theses</Link>
            </div>
          </div>
        </aside>
      </div>

      {/* Simple inline modals / forms (placeholders) */}
      {recommendModal.open && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-6 rounded shadow-lg w-11/12 md:w-1/2">
            <h3 className="font-semibold text-lg mb-3">Recommend a paper to student</h3>
            <p className="text-sm text-slate-600 dark:text-gray-400 mb-3">This is a simple placeholder. Hook into your arXiv search results and call <code>submitRecommendation</code>.</p>
            <div className="flex gap-2 justify-end">
              <button onClick={closeRecommendModal} className="px-4 py-2 rounded border">Cancel</button>
              <button onClick={() => submitRecommendation(recommendModal.studentId, { title: "Example paper", url: "https://arxiv.org/..." })} className="px-4 py-2 bg-[#7b1e3c] text-white rounded">Send</button>
            </div>
          </div>
        </div>
      )}

      {gradeModal.open && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-6 rounded shadow-lg w-11/12 md:w-1/3">
            <h3 className="font-semibold text-lg mb-3">Assign Final Grade</h3>
            <p className="text-sm text-slate-600 dark:text-gray-400 mb-3">Pick a grade and submit. This will call the grade endpoint.</p>
            <div className="flex gap-2 justify-end">
              <button onClick={closeGradeModal} className="px-4 py-2 rounded border">Cancel</button>
              <button onClick={() => submitGrade(gradeModal.thesisId, "A")} className="px-4 py-2 bg-[#7b1e3c] text-white rounded">Submit Grade A</button>
            </div>
          </div>
        </div>
      )}
    </div>
  </section>
);

};

export default SupervisorDashboard;
