import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "applicant",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/auth/register", form);
      alert("Registered successfully!");
      navigate("/"); // redirect to login page
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex shadow-lg rounded-lg overflow-hidden max-w-4xl w-full">
        {/* Left yellow Section */}
        <div className="w-1/2 bg-gradient-to-b from-yellow-400 to-yellow-300 flex flex-col justify-center items-center text-white p-10">
          <h1 className="text-4xl font-bold mb-4 text-black text-center">Welcome to Hybrid-ATS</h1>
          <p className="text-center">
            An intelligent recruitment platform combining AI-driven resume screening, job matching, and applicant tracking for smarter hiring decisions.
          </p>
        </div>

        {/* Right Form Section */}
        <div className="w-1/2 bg-white p-10">
          <h2 className="text-2xl font-bold mb-6">Create your account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              placeholder="Name"
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <select
              name="role"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="applicant">Applicant</option>
              <option value="admin">Admin</option>
            </select>
            <button
              type="submit"
              className="w-full bg-yellow-400 text-black font-bold py-2 px-4 rounded hover:bg-yellow-500 transition"
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full border border-gray-300 text-black font-bold py-2 px-4 rounded hover:bg-gray-100 transition"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
