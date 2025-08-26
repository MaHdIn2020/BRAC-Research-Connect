import { useLoaderData } from "react-router";
import { useState } from "react";

const AllThesis = () => {
  const theses = useLoaderData();
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter theses based on a single search query
  const filteredTheses = theses.filter((t) => {
    const query = searchQuery.toLowerCase();

    const inTitle = t.title?.toLowerCase().includes(query);
    const inSupervisor = t.supervisor?.name?.toLowerCase().includes(query);
    const inGroup = t.groupName?.toLowerCase().includes(query);
    const inStatus = t.status?.toLowerCase().includes(query);
    const inDate = new Date(t.createdAt).toISOString().split("T")[0].includes(query);
    const inDomain =
      t.domain?.some((d) => d.toLowerCase().includes(query));

    return inTitle || inSupervisor || inGroup || inStatus || inDate || inDomain;
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Theses</h2>

      {/* Single Search Bar */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Supervisor, Group, Status, Date, Domain..."
          className="flex-1 border px-4 py-2 rounded"
        />
        <button
          onClick={() => setSearchQuery("")}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Reset
        </button>
      </div>

      {/* Table */}
      <table className="table-auto w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Title</th>
            <th className="border px-4 py-2">Supervisor</th>
            <th className="border px-4 py-2">Group</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Domain</th>
            <th className="border px-4 py-2">Submitted Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredTheses.map((thesis) => (
            <tr key={thesis._id}>
              <td className="border px-4 py-2">{thesis.title}</td>
              <td className="border px-4 py-2">{thesis.supervisor?.name || "N/A"}</td>
              <td
                className="border px-4 py-2 text-blue-600 cursor-pointer hover:underline"
                onClick={() =>
                  setSelectedGroup({
                    name: thesis.groupName,
                    students: thesis.students,
                    domain: thesis.domain,
                  })
                }
              >
                {thesis.groupName || "N/A"}
              </td>
              <td className="border px-4 py-2">{thesis.status}</td>
              <td className="border px-4 py-2 flex flex-wrap gap-2">
                {thesis.domain?.length
                  ? thesis.domain.map((d) => (
                      <button
                        key={d}
                        onClick={() => setSearchQuery(d)}
                        className="px-4 py-2 bg-[#7b1e3c] text-white rounded-lg hover:bg-[#651730] transition disabled:opacity-60"
                      >
                        {d}
                      </button>
                    ))
                  : "N/A"}
              </td>
              <td className="border px-4 py-2">
                {new Date(thesis.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {selectedGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96 max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-2">
              {selectedGroup.name} – Members
            </h3>
            <div className="mb-4 flex flex-wrap gap-2">
              {selectedGroup.domain?.length
                ? selectedGroup.domain.map((d) => (
                    <button
                      key={d}
                      className="px-4 py-2 bg-[#7b1e3c] text-white rounded-lg hover:bg-[#651730] transition disabled:opacity-60"
                    >
                      {d}
                    </button>
                  ))
                : "N/A"}
            </div>
            <ul className="space-y-2">
              {selectedGroup.students.map((s) => (
                <li key={s._id} className="border p-2 rounded">
                  {s.name || "Unnamed Student"} <br />
                  {s.email && (
                    <span className="text-sm text-gray-500">{s.email}</span>
                  )}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setSelectedGroup(null)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllThesis;
