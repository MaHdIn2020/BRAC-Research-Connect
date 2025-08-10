import React, { useEffect, useMemo, useState } from "react";

const API_BASE = "http://localhost:5000";

const AssignSupervisor = () => {
  const [students, setStudents] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [picks, setPicks] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [stuRes, supRes] = await Promise.all([
          fetch(`${API_BASE}/users?role=student`),
          fetch(`${API_BASE}/users?role=supervisor`),
        ]);
        const [stu, sup] = await Promise.all([stuRes.json(), supRes.json()]);
        setStudents(stu);
        setSupervisors(sup);
      } catch (e) {
        console.error(e);
        alert("Failed to load users");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const supervisorNameById = useMemo(() => {
    const m = new Map();
    supervisors.forEach((s) => m.set(String(s._id), s.name));
    return m;
  }, [supervisors]);

  const handlePick = (studentId, supervisorId) => {
    setPicks((prev) => ({ ...prev, [studentId]: supervisorId }));
  };

  const assign = async (studentId) => {
    const supervisorId = picks[studentId];
    if (!supervisorId) {
      alert("Please select a supervisor first.");
      return;
    }
    try {
      const res = await fetch(
        `${API_BASE}/users/${studentId}/assign-supervisor`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ supervisorId }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Failed to assign");
      }
      // Optimistic UI update
      setStudents((prev) =>
        prev.map((s) =>
          String(s._id) === String(studentId)
            ? { ...s, assignedSupervisor: supervisorId }
            : s
        )
      );
      alert("Assigned successfully");
    } catch (e) {
      console.error(e);
      alert(e.message || "Failed to assign");
    }
  };
  const unassign = async (studentId) => {
    try {
      const res = await fetch(
        `${API_BASE}/users/${studentId}/unassign-supervisor`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Failed to unassign");
      }
      // Optimistic UI update
      setStudents((prev) =>
        prev.map((s) =>
          String(s._id) === String(studentId)
            ? { ...s, assignedSupervisor: null }
            : s
        )
      );
      setPicks((prev) => ({ ...prev, [studentId]: "" }));
      alert("Unassigned successfully");
    } catch (e) {
      console.error(e);
      alert(e.message || "Failed to unassign");
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-slate-700 dark:text-gray-200">
        Loading students…
      </div>
    );
  }

  return (
    <section className="px-6 py-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-white mb-5">
            Supervisor Assignment
          </h1>
          <p className="text-sm md:text-base text-slate-600 dark:text-gray-300 mt-1">
            Assign approved supervisors to students. Choose a supervisor and hit{" "}
            <span className="font-medium text-[#7b1e3c]">Assign</span>.
          </p>
        </div>

        <div className="inline-flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-slate-700 dark:bg-slate-800 dark:text-gray-200">
            Total Students: {students.length}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#7b1e3c]/10 text-[#7b1e3c]">
            Supervisors: {supervisors.length}
          </span>
        </div>
      </div>

      {/* Table wrapper */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-slate-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[780px] w-full text-left">
            <thead className="bg-gray-50 dark:bg-slate-800 sticky top-0 z-10">
              <tr className="text-xs uppercase tracking-wide text-slate-600 dark:text-gray-300">
                <th className="px-4 py-3 font-semibold">Student</th>
                <th className="px-4 py-3 font-semibold">Student ID</th>
                <th className="px-4 py-3 font-semibold">Assigned Supervisor</th>
                <th className="px-4 py-3 font-semibold">Select Supervisor</th>
                <th className="px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {students.map((s) => {
                const assignedName = s.assignedSupervisor
                  ? supervisorNameById.get(String(s.assignedSupervisor)) || "—"
                  : "Unassigned";

                const selected = picks[String(s._id)];

                return (
                  <tr
                    key={String(s._id)}
                    className="bg-white dark:bg-slate-900 hover:bg-gray-50/70 dark:hover:bg-slate-800/70 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900 dark:text-white">
                          {s.name}
                        </span>
                        {s.email && (
                          <span className="text-sm text-slate-500 dark:text-gray-400">
                            {s.email}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className="inline-block px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-slate-700 dark:bg-slate-800 dark:text-gray-200">
                        {s.studentId || "—"}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      {assignedName === "Unassigned" ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300">
                          Unassigned
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[#7b1e3c]/10 text-[#7b1e3c]">
                          {assignedName}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <div className="relative">
                        <select
                          className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-[#7b1e3c] focus:border-[#7b1e3c] transition"
                          value={selected || ""}
                          onChange={(e) =>
                            handlePick(String(s._id), e.target.value)
                          }
                          aria-label={`Select supervisor for ${s.name}`}
                        >
                          <option value="">— Select —</option>
                          {supervisors.map((sup) => (
                            <option
                              key={String(sup._id)}
                              value={String(sup._id)}
                            >
                              {sup.name} ({sup.email})
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => assign(String(s._id))}
                          className="inline-flex items-center justify-center px-3 py-2 rounded-lg bg-[#7b1e3c] text-white hover:bg-[#651730] disabled:opacity-50 disabled:cursor-not-allowed transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#7b1e3c]"
                          title="Assign selected supervisor"
                        >
                          Assign
                        </button>

                        <button
                          onClick={() => unassign(String(s._id))}
                          disabled={!s.assignedSupervisor}
                          className="inline-flex items-center justify-center px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-slate-700 dark:text-gray-100 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#7b1e3c]"
                          title="Remove assigned supervisor"
                        >
                          Unassign
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {students.length === 0 && (
                <tr>
                  <td
                    className="px-4 py-10 text-center text-slate-600 dark:text-gray-300"
                    colSpan={5}
                  >
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer note */}
        <div className="px-4 py-3 bg-gray-50 dark:bg-slate-800 text-xs text-slate-600 dark:text-gray-300">
          Tip: Use the dropdown to pick a supervisor, then click{" "}
          <span className="font-semibold text-[#7b1e3c]">Assign</span>.
        </div>
      </div>
    </section>
  );
};

export default AssignSupervisor;
