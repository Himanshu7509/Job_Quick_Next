'use client';
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { StatData } from '@/components/utils/hosterApi/HosterApi';
import PieChart from "./charts_and_statistics/charts/PieChart";
import LineChart from "./charts_and_statistics/charts/LineChart";
import Sidebar from "../../common/sidebar/Sidebar";
import { FaBriefcase } from "react-icons/fa";
import {
  Building2,
  Users,
  UserCheck,
  CirclePlus,
  Search,
} from "lucide-react";

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ totalJobs: 0, totalApplicants: 0, totalShortlisted: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const token = Cookies.get("authToken");


  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await StatData({
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });


         console.log("API Response:", response);


        if (response && response.data) {
          setJobs(response.data.jobs || []); 
          setStats(response.data.statistics || { totalJobs: 0, totalApplicants: 0, totalShortlisted: 0 });
        } else {
          // Handle API-specific errors (e.g., invalid credentials, data not found)
          throw new Error(response.message || "Failed to fetch dashboard data");
        }


      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message || "Failed to fetch dashboard data");
        setJobs([]);
        setStats({ totalJobs: 0, totalApplicants: 0, totalShortlisted: 0 }); // Reset stats
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);


  useEffect(() => {
    const filtered = jobs.filter((job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredJobs(filtered);
  }, [searchTerm, jobs]);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
      <div className="w-[10px] lg:w-1/4 h-screen fixed top-0 left-0 z-50">
        <Sidebar />
      </div>

      

      <main className="w-full lg:ml-80 xl:ml-80 p-3 sm:p-4 lg:p-6 xl:p-4 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
            <h1 className="text-2xl text-center lg:text-left w-full sm:text-3xl lg:text-4xl font-bold text-gray-800">Dashboard</h1>
            <Link href="/post-job">
              <button className="hidden lg:w-[178px] sm:w-auto bg-teal-600 hover:bg-teal-700 text-white font-semibold px-2 sm:px-6 py-2 rounded-lg shadow-md border border-teal-700 transition duration-300 lg:flex items-center justify-center gap-2">
                <CirclePlus className="w-5 h-5" />
                <span>Post New Job</span>
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 p-3 bg-teal-50 rounded-lg">
                  <Building2 className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Jobs</p>
                  <h3 className="text-xl font-bold text-gray-900">{jobs.length}</h3>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 p-3 bg-teal-50 rounded-lg">
                  <Users className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Applicants</p>
                  <h3 className="text-xl font-bold text-gray-900">{stats?.totalApplicants || 0}</h3>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 p-3 bg-teal-50 rounded-lg">
                  <UserCheck className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Shortlisted</p>
                  <h3 className="text-xl font-bold text-gray-900">{stats?.totalShortlisted || 0}</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 mb-6">
            <div className="lg:col-span-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-auto lg:h-[550px] flex flex-col">
                <div className="p-3 md:p-4 border-b border-gray-100">
                  <h2 className="text-base md:text-lg font-semibold text-gray-900">Applications Trend</h2>
                </div>
                <div className="p-3 md:p-4 flex-grow">
                  <LineChart jobs={jobs} />
                </div>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-auto lg:h-[550px] flex flex-col">
                <div className="p-3 md:p-4 border-b border-gray-100">
                  <h2 className="text-base md:text-lg font-semibold text-gray-900">Applications by Company</h2>
                </div>
                <div className="p-3 md:p-4 flex-grow">
                  <PieChart jobs={jobs} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Job Postings</h2>
              <div className="w-full sm:w-auto relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="p-4">
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600" />
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">{error}</div>
              ) : filteredJobs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No jobs posted yet</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredJobs.map((job) => (
                    <div
                      key={job._id}
                      className="flex items-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 font-semibold">
                      <FaBriefcase />
                      </div>
                      <div className="ml-4 flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">{job.title}</h3>
                        <p className="text-sm text-gray-500 truncate">
                          {job.jobType} • {job.location}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;