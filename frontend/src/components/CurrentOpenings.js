import React, { useEffect, useState } from "react";
import axios from "axios";

const CurrentOpenings = () => {
  const [jobs, setJobs] = useState([]);
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const fetchJobs = async () => {
    try {
      const res = await axios.get("/api/jobs");
      setJobs(res.data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  const deleteJob = async (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await axios.delete(`/api/jobs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Job deleted successfully!");
        fetchJobs();
      } catch (err) {
        console.error("Error deleting job:", err);
        alert("Failed to delete job");
      }
    }
  };

  const applyForJob = async (job) => {
    try {
      const res = await axios.post(
        "/api/applications",
        {
          roleId: job._id,
          roleName: job.title,
          roleType: job.type,
          description: job.description,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Application submitted successfully!");
    } catch (err) {
      console.error("Error applying for job:", err);
      alert(err.response?.data?.message || "Failed to apply for job");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-8 text-indigo-600">
        Current Openings
      </h2>

      {jobs.length === 0 ? (
        <p className="text-gray-600 text-lg">No job openings available right now.</p>
      ) : (
        <div className="w-full max-w-4xl space-y-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-indigo-500"
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                {job.title}
              </h3>
              <p className="text-gray-700">
                <span className="font-semibold">Type:</span> {job.type}
              </p>
              <p className="text-gray-600 mt-2">{job.description}</p>

              <div className="flex justify-end mt-4 gap-2">
                {role === "admin" && (
                  <button
                    onClick={() => deleteJob(job._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                )}

                {role === "applicant" && (
                  <button
                    onClick={() => applyForJob(job)}
                    className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500 transition"
                  >
                    Apply
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrentOpenings;
