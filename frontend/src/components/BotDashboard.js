import React, { useState, useMemo } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

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

      // Filter only Technical roles
      const technicalApps = res.data.updatedApps?.filter(app => app.roleType === "Technical");

      setResult({
        ...res.data,
        updatedApps: technicalApps
      });
    } catch (err) {
      console.error("Error running bot:", err);
      setResult({ error: err.response?.data?.message || "Bot run failed" });
    } finally {
      setRunning(false);
    }
  };

  // ---- Dynamic Chart Data ----
  const statusData = useMemo(() => {
    if (!result?.updatedApps) return [];
    return [
      { name: "Pending", value: result.updatedApps.filter(a => a.newStatus === "Pending").length },
      { name: "Interview", value: result.updatedApps.filter(a => a.newStatus === "Interview").length },
      { name: "Offer", value: result.updatedApps.filter(a => a.newStatus === "Offer").length },
    ];
  }, [result]);

  const roleData = useMemo(() => {
    if (!result?.updatedApps) return [];
    const counts = result.updatedApps.reduce((acc, app) => {
      acc[app.roleName] = (acc[app.roleName] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([roleName, count]) => ({ roleName, count }));
  }, [result]);

  const COLORS = ["#FFBB28", "#00C49F", "#FF8042", "#8884d8", "#82ca9d"];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-6 flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-semibold mb-4">Bot Dashboard (Technical Roles)</h2>

        <div className="mb-6">
          <button
            onClick={runBot}
            disabled={running}
            className={`px-4 py-2 rounded font-semibold ${running ? "bg-gray-400 text-gray-200" : "bg-yellow-400 text-black hover:bg-yellow-600"}`}
          >
            {running ? "Running..." : "Run Bot Automation"}
          </button>
        </div>

        <div className="bg-white p-4 rounded shadow w-full mb-6">
          {result ? (
            result.error ? (
              <div className="text-red-600">Error: {result.error}</div>
            ) : (
              <>
                <p className="mb-2 font-medium">{result.message}</p>
                <p className="mb-4">Updated Technical Applications: <strong>{result.updatedApps?.length || 0}</strong></p>

                {result.updatedApps && result.updatedApps.length > 0 ? (
                  <div>
                    <h4 className="font-semibold mb-2">Updated Applications</h4>
                    <ul className="space-y-2 mb-4">
                      {result.updatedApps.map((u) => (
                        <li key={u.id} className="border p-3 rounded">
                          <div><strong>{u.roleName}</strong> — {u.applicant?.name || "Unknown"}</div>
                          <div className="text-sm text-gray-600">{u.oldStatus} → <span className="font-semibold">{u.newStatus}</span></div>
                        </li>
                      ))}
                    </ul>

                    {/* ---- Charts ---- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Status Pie Chart */}
                      <div className="bg-gray-50 p-4 rounded shadow">
                        <h4 className="font-semibold mb-2">Updated Status Distribution</h4>
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

                      {/* Role Bar Chart */}
                      <div className="bg-gray-50 p-4 rounded shadow">
                        <h4 className="font-semibold mb-2">Updates per Role</h4>
                        <BarChart width={300} height={300} data={roleData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="roleName" />
                          <YAxis allowDecimals={false} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="count" fill="#8884d8" />
                        </BarChart>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600">No technical applications were updated.</p>
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
