import React, { useState } from "react";

const supervisors = [
  "Dr. Md. Golam Rabiul Alam",
  "Dr. Muhammad Iqbal Hossain",
  "Dr. Farig Yousuf Sadeque",
  "Dr. Sadia Hamid Kazi",
];

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
  "AI in Business Applications"
];

const ThesisProposalForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    domain: "",
    supervisor: "",
    pdfFile: null,
  });

  const [pdfName, setPdfName] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        alert("Only PDF files are allowed.");
        e.target.value = null;
        return;
      }
      setFormData((prev) => ({ ...prev, pdfFile: file }));
      setPdfName(file.name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.abstract ||
      !formData.domain ||
      !formData.supervisor ||
      !formData.pdfFile
    ) {
      alert("Please fill out all fields and upload your PDF.");
      return;
    }


    alert("Thesis Proposal Submitted! (Demo)");


    setFormData({
      title: "",
      abstract: "",
      domain: "",
      supervisor: "",
      pdfFile: null,
    });
    setPdfName("");
  };

  return (
    <section className="min-h-screen bg-white dark:bg-slate-900 transition-colors px-6 py-12 flex justify-center">
      <div className="max-w-3xl w-full bg-slate-100 dark:bg-slate-800 rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white text-center">
          Submit Thesis Proposal
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">


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


          <div>
            <label className="block mb-1 font-medium text-slate-700 dark:text-gray-300">
              Supervisor
            </label>
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
                <option key={sup} value={sup}>
                  {sup}
                </option>
              ))}
            </select>
          </div>

 
          <div>
            <label className="block mb-1 font-medium text-slate-700 dark:text-gray-300">
              Upload Proposal PDF
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePdfChange}
              className="block w-full text-gray-700 dark:text-gray-300 bg-white rounded-md px-4 py-2 max-w-xs"
              required
            />
            {pdfName && (
              <p className="mt-2 text-sm text-slate-600 dark:text-gray-400">
                Selected file: <span className="font-semibold">{pdfName}</span>
              </p>
            )}
          </div>

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
