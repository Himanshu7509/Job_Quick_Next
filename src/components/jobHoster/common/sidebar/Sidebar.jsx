"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { getHosterProfileApi } from "@/components/utils/hosterApi/HosterApi";
import {
  LogOut,
  User,
  Briefcase,
  Menu,
  X,
  Users,
  BriefcaseBusiness,
  CalendarPlus,
} from "lucide-react";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState("");

  const userId = Cookies.get("userId");

  const clearCookie = (name) => {
    Cookies.remove(name, { path: "/" });
  };

  const handleLogout = () => {
    clearCookie("authToken");
    clearCookie("userId");
    router.push("/");
  };

  const getName = async () => {
    const response = await getHosterProfileApi(userId);
    setData(response.data);
    console.log(response);
  };

  useEffect(() => {
    getName();
  }, []);

  const navItems = [
    { icon: <User className="w-5 h-5" />, label: "My Profile", path: "/host-profile" },
    { icon: <Briefcase className="w-5 h-5" />, label: "My Jobs", path: "/my-jobs" },
    { icon: <CalendarPlus className="w-5 h-5" />, label: "Post Job", path: "/post-job" },
  ];

  const isActiveRoute = (path) => pathname === path;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="fixed top-4 left-4 z-50 block lg:hidden p-2 rounded text-teal-900"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-6 h-6 text-white relative left-[195px] mt-1" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative inset-y-0 left-0 z-40 w-64 bg-teal-900 p-6 transform transition-transform
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:flex flex-col h-screen`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center mb-6">
          <BriefcaseBusiness className="w-6 h-6 text-white" />
          <span className="ml-2 text-2xl font-bold text-white">Job Quick</span>
        </Link>

        {/* Profile Section */}
        <Link href="/hosting-detail-form" className="flex items-center mb-6">
          <div className="relative">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
              <User className="w-8 h-8" />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-teal-900 rounded-full"></div>
          </div>
          <h2 className="text-xl text-white ml-2 font-semibold mb-2">
            {data.fullName || "Admin"}
          </h2>
        </Link>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto">
          <div className="space-y-1">
            <Link href="/dashboard" className="block">
              <div
                className={`flex items-center space-x-3 p-3 ${
                  isActiveRoute("/dashboard") ? "bg-teal-700" : ""
                } text-white hover:bg-teal-100 hover:text-black rounded-lg`}
              >
                <Users className="w-5 h-5" />
                <span className="text-base">Dashboard</span>
              </div>
            </Link>

            {navItems.map((item, index) => (
              <Link href={item.path} key={index} className="block">
                <div
                  className={`flex items-center space-x-3 p-3 ${
                    isActiveRoute(item.path) ? "bg-teal-700" : ""
                  } text-white hover:bg-teal-100 hover:text-black rounded-lg transition-colors duration-200`}
                >
                  {item.icon}
                  <span className="text-base">{item.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="mt-4">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 p-3 text-white hover:bg-teal-100 hover:text-black rounded-lg cursor-pointer transition-colors duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-base">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay - Click to Close */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
