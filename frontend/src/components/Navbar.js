import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we are on dashboard pages
  const isDashboard =
    location.pathname.includes("/admin") ||
    location.pathname.includes("/applicant");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav className="bg-black text-white px-6 py-4 flex justify-between items-center shadow-md">
      <h1
        className="text-xl font-bold cursor-pointer hover:text-yellow-400"
        onClick={() => navigate("/")}
      >
        Hybrid ATS
      </h1>

      {isDashboard && (
        <button
          onClick={handleLogout}
          className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded hover:bg-yellow-500 transition"
        >
          Logout
        </button>
      )}
    </nav>
  );
};

export default Navbar;
