import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      if (res.data.role === "admin") navigate("/admin");
      else if (res.data.role === "bot") navigate("/bot");
      else navigate("/applicant");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex shadow-lg rounded-lg overflow-hidden max-w-4xl w-full">
        {/* Left Form Section */}
        <div className="w-1/2 bg-white p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-6 text-black">Login to your account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
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
            <button
              type="submit"
              className="w-full bg-yellow-400 text-black font-bold py-2 px-4 rounded hover:bg-yellow-500 transition"
            >
              Login
            </button>
          </form>
          <p className="mt-4 text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link to="/register" className="text-yellow-500 font-semibold hover:underline">
              Register here
            </Link>
          </p>
        </div>

        {/* Right Yellow Section */}
        <div className="w-1/2 bg-gradient-to-b from-yellow-400 to-yellow-300 flex flex-col justify-center items-center text-white p-10">
          <h1 className="text-4xl font-bold mb-4 text-black">Welcome Back!</h1>
          <p className="text-black text-center">
            Access your hATS account to manage applications and streamline hiring effortlessly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

