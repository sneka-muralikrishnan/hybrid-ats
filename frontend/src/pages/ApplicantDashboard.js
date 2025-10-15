import React, { useEffect, useState } from "react";
import axios from "axios";

const ApplicantDashboard = () => {
  const [applications, setApplications] = useState([]);
  const token = localStorage.getItem("token");

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
    <div style={{ maxWidth: "800px", margin: "30px auto" }}>
      <h2>My Applications</h2>
      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        applications.map((app) => (
          <div
            key={app._id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "8px",
            }}
          >
            <h3>{app.roleName}</h3>
            <p><b>Type:</b> {app.roleType}</p>
            <p><b>Current Status:</b> {app.status}</p>

            <h4>History</h4>
            <ul>
              {app.history.map((entry, index) => (
                <li key={index}>
                  <b>{entry.status}</b> — updated by {entry.updatedBy} <br />
                  <small>
                    {new Date(entry.timestamp).toLocaleString()} — {entry.comment}
                  </small>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default ApplicantDashboard;
