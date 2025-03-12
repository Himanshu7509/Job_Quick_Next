"use client";

import React, { useState } from "react";
import { loginApi } from "@/components/utils/userApi/UserApi";
import {
  BriefcaseBusiness,
  CalendarDays,
  Trophy,
} from "lucide-react";
import Link from "next/link";

const SeekerLogin = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
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

    try {
      const response = await loginApi(data);
      console.log("Login Response:", response);

      if (response) {
        setSuccess("Login successful!");
        setError(null);
        // You can add your Next.js navigation here if needed
        // For example: router.push('/dashboard');
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setError("Login failed. Please try again.");
      setSuccess(null);
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('https://plus.unsplash.com/premium_photo-1675448891100-3dbf439d2db3?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
      }}
    >
      <div className="flex flex-col lg:flex-row justify-center items-center min-h-screen w-full p-4 md:p-8 lg:p-12 backdrop-blur-sm">
        {/* Login Form Container */}
        <div className="w-full max-w-md bg-white p-6 md:p-8 lg:p-12 rounded-lg shadow-lg">
          <h2 className="text-xl md:text-2xl font-semibold mb-6 text-center">Sign In</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">
                Email
              </label>
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
              <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-1">
                Password
              </label>
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
            
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showPassword"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="showPassword" className="text-sm text-gray-700">
                  Show Password
                </label>
              </div>
              <Link href="/forgot-password" className="text-sm text-teal-500">
                Forgot password?
              </Link>
            </div>
            
            <button
              type="submit"
              className="w-full bg-teal-700 text-white py-2 rounded hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-300"
            >
              LOG IN
            </button>
            
            {error && <div className="text-red-500 text-sm">{error}</div>}
            {success && <div className="text-green-500 text-sm">{success}</div>}
          </form>
          
          <div className="mt-6 text-center text-gray-500">OR</div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4">
            <button className="w-full bg-teal-950 text-white py-2 rounded hover:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-300">
              FACEBOOK
            </button>
            <button className="w-full bg-teal-500 text-white py-2 rounded hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-300">
              TWITTER
            </button>
          </div>
          
          <div className="mt-6 text-center">
            Don&apos;t have an account?{" "}
            <Link href="/user-signup" className="text-teal-500">
              Sign Up
            </Link>
          </div>
        </div>

        {/* Right Side Content */}
        <div className="hidden lg:block lg:w-1/2 lg:max-w-xl xl:max-w-2xl lg:ml-16 text-white">
          <div className="p-8 rounded-lg">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-black">
              Become the best you can be and have fun
            </h2>
            <p className="mb-6 text-teal-500">
              Join the group of more than 300 clients that love us.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center text-black">
                <div className="bg-teal-50 rounded-full flex items-center justify-center w-12 h-12 mr-4 shrink-0">
                  <BriefcaseBusiness className="text-teal-500" />
                </div>
                <p>Something about businesses that makes it special and different from everything else</p>
              </div>
              
              <div className="flex items-center text-black">
                <div className="bg-teal-50 rounded-full flex items-center justify-center w-12 h-12 mr-4 shrink-0">
                  <CalendarDays className="text-teal-500" />
                </div>
                <p>There is this saying about the business and entrepreneurship, but who remembers it anyway</p>
              </div>
              
              <div className="flex items-center text-black">
                <div className="bg-teal-50 rounded-full flex items-center justify-center w-12 h-12 mr-4 shrink-0">
                  <Trophy className="text-teal-500" />
                </div>
                <p>If only there was a template for all your needs wait a second there is and it is called this</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeekerLogin;