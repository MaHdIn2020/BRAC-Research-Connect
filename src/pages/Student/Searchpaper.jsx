import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import { useLoaderData } from "react-router";

const Searchpaper = () => {
  const [query, setQuery] = useState("");
  const [papers, setPapers] = useState([]);
  const [randomPapers, setRandomPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState(null);
  const [bookmarkedPapers, setBookmarkedPapers] = useState([]); // Track bookmarked papers
  const { user } = useContext(AuthContext);
  const userdata = useLoaderData();

  const User = userdata.find((u) => u.email === user?.email);
  const USER_ID = User?._id;

  // Fetch 5 random papers on mount
  useEffect(() => {
    const fetchRandomPapers = async () => {
      try {
        const res = await fetch("http://localhost:3000/random-papers");
        const data = await res.json();
        setRandomPapers(data || []);
      } catch (err) {
        console.error("Error fetching random papers:", err);
      }
    };

    const fetchBookmarkedPapers = async () => {
      try {
        const res = await fetch(`http://localhost:3000/users/${USER_ID}/bookmarks`);
        const data = await res.json();
        // store bookmarked paper IDs
        setBookmarkedPapers(data.map((paper) => paper.paperId));
      } catch (err) {
        console.error("Error fetching bookmarked papers:", err);
      }
    };

    fetchRandomPapers();
    if (USER_ID) fetchBookmarkedPapers();
  }, [USER_ID]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:3000/search-papers?q=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setPapers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch papers");
    }
    setLoading(false);
  };

  const bookmarkPaper = async (paper) => {
    try {
      setSavingId(paper.id);
      const payload = {
        paperId: paper.id,
        title: paper.title,
        authors: paper.authors || [],
        summary: paper.summary || "",
        link: paper.link,
      };

      const res = await fetch(
        `http://localhost:3000/users/${USER_ID}/bookmarks`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const msg = await res.json().catch(() => ({}));
        throw new Error(msg?.message || "Failed to save bookmark");
      }

      // Add to bookmarked list to disable button
      setBookmarkedPapers((prev) => [...prev, paper.id]);
    } catch (e) {
      alert(e.message);
    } finally {
      setSavingId(null);
    }
  };

  const PaperCard = ({ paper }) => {
    const isBookmarked = bookmarkedPapers.includes(paper.id);
    return (
      <div className="border p-4 mb-2 rounded bg-gray-50">
        <h3 className="text-lg font-semibold">{paper.title}</h3>
        <p className="text-sm text-gray-700">
          Authors: {(paper.authors && paper.authors.join(", ")) || "Unknown"}
        </p>
        <p className="text-sm mt-2">{paper.summary}</p>
        <div className="flex items-center gap-4 mt-2">
          <a
            href={paper.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500"
          >
            View Paper
          </a>
          <button
            onClick={() => bookmarkPaper(paper)}
            disabled={savingId === paper.id || isBookmarked}
            className="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-60"
          >
            {isBookmarked ? "Bookmarked" : savingId === paper.id ? "Saving..." : "Bookmark"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Search Academic Papers</h2>

      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Enter keyword or topic"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 flex-grow mr-2"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Search Results */}
      {papers.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-2">Search Results</h3>
          {papers.map((paper) => (
            <PaperCard key={paper.id} paper={paper} />
          ))}
        </div>
      )}

      {/* Suggested Papers (Random 5) */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-2">Suggested Papers</h3>
        {randomPapers.length === 0 ? (
          <p className="text-sm text-gray-600">No suggestions available.</p>
        ) : (
          randomPapers.map((paper) => <PaperCard key={paper.id} paper={paper} />)
        )}
      </div>
    </div>
  );
};

export default Searchpaper;
