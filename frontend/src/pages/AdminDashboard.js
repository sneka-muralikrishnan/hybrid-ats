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
      fetchApplications(); // refresh after update
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "30px auto" }}>
      <h2>Admin Dashboard</h2>
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
            <p><b>Applicant:</b> {app.applicant?.name} ({app.applicant?.email})</p>
            <p><b>Status:</b> <span style={{ color: "green", fontWeight: "bold" }}>{app.status}</span></p>
            <input
              placeholder="Add comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{ marginRight: "10px" }}
            />
            <button onClick={() => updateStatus(app._id, "Interview")}>
              Set Interview
            </button>
            <button
              onClick={() => updateStatus(app._id, "Offer")}
              style={{ marginLeft: "10px" }}
            >
              Set Offer
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminDashboard;
