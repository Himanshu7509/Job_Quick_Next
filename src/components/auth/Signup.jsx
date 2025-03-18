"use client";

import React, { useState } from "react";
import { signupApi } from "@/components/utils/userApi/UserApi";
import { BriefcaseBusiness, CalendarDays, Trophy } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Signup = () => {
  const router = useRouter();
  const [data, setData] = useState({
    email: "",
    password: "",
    role: "seeker",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Email:", data.email);
    console.log("Password:", data.password);
    console.log("Role:", data.role);

    try {
      const response = await signupApi(data);
      console.log("Signup Response:", response);

      if (response) {
        setSuccess("Account created successfully!");
        setError(null);
        router.push("/user-login");
      } else {
        throw new Error("Signup failed");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      setError("Signup failed. Please try again.");
      setSuccess(null);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://plus.unsplash.com/premium_photo-1675448891100-3dbf439d2db3?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
      }}
    >
      <div className="flex flex-col lg:flex-row justify-center items-center min-h-screen w-full p-4 md:p-8 lg:p-12 backdrop-blur-sm">
        <div className="w-full max-w-md bg-white p-6 md:p-8 lg:p-12 rounded-lg shadow-lg">
          <h2 className="text-xl md:text-2xl font-semibold mb-6 text-center">Sign Up</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-1">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={data.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-gray-700 text-sm font-medium mb-1">Role</label>
              <select
                id="role"
                name="role"
                value={data.role}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="seeker">Seeker</option>
                <option value="hoster">Hoster</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="showPassword" className="text-sm text-gray-700">Show Password</label>
            </div>

            <button
              type="submit"
              className="w-full bg-teal-700 text-white py-2 rounded hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-300"
            >
              SIGN UP
            </button>

            {error && <div className="text-red-500 text-sm">{error}</div>}
            {success && <div className="text-green-500 text-sm">{success}</div>}
          </form>

          <div className="mt-6 text-center text-gray-500">OR</div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4">
            <button className="w-full bg-teal-950 text-white py-2 rounded hover:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-300">FACEBOOK</button>
            <button className="w-full bg-teal-500 text-white py-2 rounded hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-300">TWITTER</button>
          </div>

          <div className="mt-6 text-center">
            Already have an account? <Link href="/user-login" className="text-teal-500">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
