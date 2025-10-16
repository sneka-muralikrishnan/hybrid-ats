import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";


const BotDashboard = () => {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const token = localStorage.getItem("token");

  const runBot = async () => {
    setRunning(true);
    setResult(null);
    try {
      const res = await axios.post("/api/bot/run", {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResult(res.data);
    } catch (err) {
      console.error("Error running bot:", err);
      setResult({ error: err.response?.data?.message || "Bot run failed" });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="max-w-4xl mx-auto p-6 flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl  font-semibold mb-4">Bot Dashboard</h2>

        <div className="mb-6">
          <button
            onClick={runBot}
            disabled={running}
            className={`px-4 py-2 rounded font-semibold ${running ? "bg-gray-400 text-gray-200" : "bg-yellow-400 text-black hover:bg-yellow-600"}`}
          >
            {running ? "Running..." : "Run Bot Automation"}
          </button>
        </div>

        <div className="bg-white p-4 rounded shadow">
          {result ? (
            result.error ? (
              <div className="text-red-600">Error: {result.error}</div>
            ) : (
              <>
                <p className="mb-2 font-medium">{result.message}</p>
                <p className="mb-4">Updated count: <strong>{result.updatedCount}</strong></p>

                {result.updatedApps && result.updatedApps.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Updated Applications</h4>
                    <ul className="space-y-2">
                      {result.updatedApps.map((u) => (
                        <li key={u.id} className="border p-3 rounded">
                          <div><strong>{u.roleName}</strong> — {u.applicant?.name || "Unknown"}</div>
                          <div className="text-sm text-gray-600">{u.oldStatus} → <span className="font-semibold">{u.newStatus}</span></div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )
          ) : (
            <p className="text-gray-600">No run results yet. Click &quot;Run Bot Automation&quot; to start.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BotDashboard;
