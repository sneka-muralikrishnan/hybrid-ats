import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

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

  // ---- Dynamic Chart Data ----
  const statusData = useMemo(() => {
    return [
      { name: "Interview", value: applications.filter(a => a.status === "Interview").length },
      { name: "Offer", value: applications.filter(a => a.status === "Offer").length },
      { name: "Pending", value: applications.filter(a => a.status === "Pending").length },
    ];
  }, [applications]);

  const typeData = useMemo(() => {
    const counts = applications.reduce((acc, app) => {
      acc[app.roleType] = (acc[app.roleType] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([type, count]) => ({ type, count }));
  }, [applications]);

  const COLORS = ["#FFBB28", "#00C49F", "#FF8042", "#8884d8", "#82ca9d"];

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

      {/* ---- Charts Section ---- */}
      {applications.length > 0 && (
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Status Pie Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-indigo-600">Applications by Status</h3>
            <PieChart width={300} height={300}>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>

          {/* Type Bar Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-indigo-600">Applications by Job Type</h3>
            <BarChart width={300} height={300} data={typeData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </div>
        </div>
      )}

      {applications.length === 0 ? (
        <p className="text-gray-600 text-lg">No applications found.</p>
      ) : (
        <div className="w-full max-w-4xl space-y-6">
          {applications.map((app) => (
            <div key={app._id} className="bg-white shadow-md rounded-lg p-6 border-l-4 border-yellow-400">
              <h3 className="text-2xl font-semibold text-black mb-2">{app.roleName}</h3>
              <p className="text-gray-700"><span className="font-semibold">Type:</span> {app.roleType}</p>
              <p className="mt-2">
                <span className="font-semibold text-gray-800">Current Status:</span>{" "}
                <span className={`font-bold ${app.status === "Offer" ? "text-green-600" : app.status === "Interview" ? "text-yellow-600" : "text-gray-600"}`}>{app.status}</span>
              </p>

              <div className="mt-4">
                <h4 className="text-lg font-semibold text-black mb-2">History</h4>
                <ul className="space-y-2 text-black-700">
                  {app.history.map((entry, index) => (
                    <li key={index} className="bg-gray-50 p-3 rounded border border-black-200">
                      <p>
                        <b>{entry.status}</b> — updated by <span className="text-black">{entry.updatedBy}</span>
                      </p>
                      <small className="block text-gray-500">
                        {new Date(entry.timestamp).toLocaleString()} — {entry.comment || "No comment"}
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
