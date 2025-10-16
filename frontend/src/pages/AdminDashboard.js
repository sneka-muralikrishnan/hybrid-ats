import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [comment, setComment] = useState("");
  const token = localStorage.getItem("token");

  const fetchApplications = async () => {
    try {
      const res = await axios.get("/api/applications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data);
    } catch (err) {
      console.error("Error fetching applications:", err);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `/api/applications/${id}`,
        { status, comment },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Application status updated!");
      setComment("");
      fetchApplications();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h2 className="text-3xl font-bold mb-8 text-black">Admin Dashboard</h2>

      {applications.length === 0 ? (
        <p className="text-gray-600 text-lg">No applications found.</p>
      ) : (
        <div className="w-full max-w-4xl space-y-6">
          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-white shadow-md rounded-lg p-6 border-l-4 border-yellow-400"
            >
              <h3 className="text-2xl font-semibold text-black mb-2">
                {app.roleName}
              </h3>
              <p className="text-gray-700">
                <span className="font-semibold">Type:</span> {app.roleType}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Applicant:</span>{" "}
                {app.applicant?.name} ({app.applicant?.email})
              </p>
              <p className="mt-2">
                <span className="font-semibold text-gray-800">Status:</span>{" "}
                <span
                  className={`font-bold ${
                    app.status === "Offer"
                      ? "text-green-600"
                      : app.status === "Interview"
                      ? "text-yellow-600"
                      : "text-gray-600"
                  }`}
                >
                  {app.status}
                </span>
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
                <input
                  placeholder="Add comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full sm:w-auto flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <button
                  onClick={() => updateStatus(app._id, "Interview")}
                  className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded hover:bg-yellow-500 transition"
                >
                  Set Interview
                </button>
                <button
                  onClick={() => updateStatus(app._id, "Offer")}
                  className="bg-black text-white font-semibold px-4 py-2 rounded hover:bg-gray-800 transition"
                >
                  Set Offer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
