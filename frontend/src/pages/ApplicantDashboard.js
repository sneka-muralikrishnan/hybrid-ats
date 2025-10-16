import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ApplicantDashboard = () => {
  const [applications, setApplications] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get("/api/applications/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(res.data);
      } catch (err) {
        console.error("Error fetching applications:", err);
      }
    };

    fetchApplications();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="flex justify-between w-full max-w-4xl mb-8">
        <h2 className="text-3xl font-bold text-black">My Applications</h2>
        <button
          onClick={() => navigate("/current-openings")}
          className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded hover:bg-yellow-500 transition"
        >
          Apply for More
        </button>
      </div>

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
              <p className="mt-2">
                <span className="font-semibold text-gray-800">
                  Current Status:
                </span>{" "}
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

              <div className="mt-4">
                <h4 className="text-lg font-semibold text-black mb-2">
                  History
                </h4>
                <ul className="space-y-2 text-black-700">
                  {app.history.map((entry, index) => (
                    <li
                      key={index}
                      className="bg-gray-50 p-3 rounded border border-black-200"
                    >
                      <p>
                        <b>{entry.status}</b> — updated by{" "}
                        <span className="text-black">{entry.updatedBy}</span>
                      </p>
                      <small className="block text-gray-500">
                        {new Date(entry.timestamp).toLocaleString()} —{" "}
                        {entry.comment || "No comment"}
                      </small>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicantDashboard;
