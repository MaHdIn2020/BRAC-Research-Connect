import React, { useState, useEffect, useContext, use } from "react";
import { AuthContext } from "../../contexts/Auth/AuthContext"; // import your Auth context
import { useLoaderData } from "react-router";

const domains = [
  "Machine Learning & AI",
  "Computer Vision",
  "Natural Language Processing",
  "Robotics & AI",
  "Data Science & AI",
  "AI for Healthcare",
  "Autonomous Systems",
  "AI Ethics & Governance",
  "Deep Learning",
  "AI in Business Applications",
];

const ThesisProposalForm = () => {
  const { user } = useContext(AuthContext); // get logged in user
  const data  = useLoaderData();
  const User = data.find((User) => User.email === user?.email);
  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    domain: "",
    supervisor: "",
    driveLink: "",
  });

  const [supervisors, setSupervisors] = useState([]);
  const [loadingSup, setLoadingSup] = useState(true);
  const [errorSup, setErrorSup] = useState(null);

  useEffect(() => {
    const fetchSupervisors = async () => {
      try {
        const res = await fetch("http://localhost:5000/supervisors");
        if (!res.ok) throw new Error("Failed to fetch supervisors");
        const data = await res.json();
        setSupervisors(data);
      } catch (err) {
        console.error(err);
        setErrorSup("Could not load supervisors");
      } finally {
        setLoadingSup(false);
      }
    };
    fetchSupervisors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.abstract ||
      !formData.domain ||
      !formData.supervisor ||
      !formData.driveLink
    ) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          studentId: User?._id, // send logged-in student's ID
        }),
      });

      if (!res.ok) throw new Error("Failed to submit proposal");

      const result = await res.json();
      alert("Thesis Proposal Submitted Successfully!");
      console.log(result);

      setFormData({
        title: "",
        abstract: "",
        domain: "",
        supervisor: "",
        driveLink: "",
      });
    } catch (err) {
      console.error(err);
      alert("Error submitting proposal");
    }
  };

  return (
    <section className="min-h-screen bg-white dark:bg-slate-900 transition-colors px-6 py-12 flex justify-center">
      <div className="max-w-3xl w-full bg-slate-100 dark:bg-slate-800 rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white text-center">
          Submit Thesis Proposal
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block mb-1 font-medium text-slate-700 dark:text-gray-300">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter thesis title"
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7b1e3c]"
              required
            />
          </div>

          {/* Abstract */}
          <div>
            <label className="block mb-1 font-medium text-slate-700 dark:text-gray-300">
              Abstract
            </label>
            <textarea
              name="abstract"
              value={formData.abstract}
              onChange={handleChange}
              placeholder="Write a brief abstract"
              rows={5}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7b1e3c]"
              required
            />
          </div>

          {/* Domain */}
          <div>
            <label className="block mb-1 font-medium text-slate-700 dark:text-gray-300">
              Domain
            </label>
            <select
              name="domain"
              value={formData.domain}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7b1e3c]"
              required
            >
              <option value="" disabled>
                Select your domain
              </option>
              {domains.map((domain) => (
                <option key={domain} value={domain}>
                  {domain}
                </option>
              ))}
            </select>
          </div>

          {/* Supervisor */}
          <div>
            <label className="block mb-1 font-medium text-slate-700 dark:text-gray-300">
              Supervisor
            </label>
            {loadingSup ? (
              <p className="text-sm text-gray-500">Loading supervisors...</p>
            ) : errorSup ? (
              <p className="text-sm text-red-500">{errorSup}</p>
            ) : (
              <select
                name="supervisor"
                value={formData.supervisor}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7b1e3c]"
                required
              >
                <option value="" disabled>
                  Select your supervisor
                </option>
                {supervisors.map((sup) => (
                  <option key={sup._id} value={sup._id}>
                    {sup.name || sup.displayName || sup.email}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Drive Link */}
          <div>
            <label className="block mb-1 font-medium text-slate-700 dark:text-gray-300">
              Google Drive Link
            </label>
            <input
              type="url"
              name="driveLink"
              value={formData.driveLink}
              onChange={handleChange}
              placeholder="Enter your proposal's Google Drive link"
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7b1e3c]"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#7b1e3c] hover:bg-[#651730] text-white font-semibold py-3 rounded-lg transition"
          >
            Submit Proposal
          </button>
        </form>
      </div>
    </section>
  );
};

export default ThesisProposalForm;
