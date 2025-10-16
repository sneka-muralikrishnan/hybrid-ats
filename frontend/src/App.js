import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ApplicantDashboard from "./pages/ApplicantDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CurrentOpenings from "./components/CurrentOpenings";
import BotDashboard from "./components/BotDashboard";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="p-4">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/applicant" element={<ApplicantDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/current-openings" element={<CurrentOpenings />} />
            <Route path="/bot" element={<BotDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
