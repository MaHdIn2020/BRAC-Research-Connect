import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const SupervisorsList = () => {
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSupervisors = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "https://bracu-research-server-eta.vercel.app/supervisors"
        );
        if (!res.ok) throw new Error("Failed to fetch supervisors");
        const data = await res.json();
        setSupervisors(data);
      } catch (err) {
        console.error(err);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSupervisors();
  }, []);

  if (loading)
    return (
      <p className="text-gray-500 text-center mt-12 text-lg">
        Loading supervisors...
      </p>
    );

  if (!supervisors.length)
    return (
      <p className="text-gray-500 text-center mt-12 text-lg">
        No supervisors available.
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6 sm:p-12">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
          Thesis Supervisors
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Explore the faculty members and their research areas. Connect with the
          right supervisor for your academic journey.
        </p>
      </div>

      {/* Supervisors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {supervisors.map((sup) => (
          <div
            key={sup._id}
            className="bg-white dark:bg-slate-900 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition"
          >
            <div className="flex items-center gap-4 mb-4">
              {sup.photoUrl ? (
                <img
                  src={sup.photoUrl}
                  alt={sup.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#7b1e3c]"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                    {sup.name?.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {sup.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {sup.department || "—"}
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <p>
                <strong>Phone:</strong> {sup.phone || "—"}
              </p>
              <p>
                <strong>Research Area:</strong> {sup.researchArea || "—"}
              </p>
              <p>
                <strong>Email:</strong> {sup.email}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupervisorsList;
