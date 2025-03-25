"use client";
import React, { useEffect, useState, useTransition } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { StatData } from "@/components/utils/hosterApi/HosterApi";
import PieChart from "./charts_and_statistics/charts/PieChart";
import LineChart from "./charts_and_statistics/charts/LineChart";
import Sidebar from "../../common/sidebar/Sidebar";
import Statistics from "./charts_and_statistics/Statistics";
import PostedJobs from "./postedjobs/PostedJobs";
import { CirclePlus } from "lucide-react";
import Loader from "@/components/Loader";
import DashboardTable from "./table/DashboardTable";

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplicants: 0,
    totalShortlisted: 0,
  });
  const token = Cookies.get("authToken");

  useEffect(() => {
    const fetchDashboardData = async () => {
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
          setStats(
            response.data.statistics || {
              totalJobs: 0,
              totalApplicants: 0,
              totalShortlisted: 0,
            }
          );
        } else {
          throw new Error(response.message || "Failed to fetch dashboard data");
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message || "Failed to fetch dashboard data");
        setJobs([]);
        setStats({
          totalJobs: 0,
          totalApplicants: 0,
          totalShortlisted: 0,
        });
      }
    };

    startTransition(() => {
      fetchDashboardData();
    });
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
      <div className="w-[10px] lg:w-1/4 h-screen fixed top-0 left-0 z-50">
        <Sidebar />
      </div>

      {isPending ? (
        <Loader />
      ) : (
        <>
          <main className="w-full lg:ml-80 xl:ml-80 p-3 sm:p-4 lg:p-6 xl:p-4 overflow-y-auto">
            <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
                <h1 className="text-2xl text-center lg:text-left w-full sm:text-3xl lg:text-4xl font-bold text-gray-800">
                  Dashboard
                </h1>
                <Link href="/post-job">
                  <button className="hidden lg:w-[178px] sm:w-auto bg-teal-600 hover:bg-teal-700 text-white font-semibold px-2 sm:px-6 py-2 rounded-lg shadow-md border border-teal-700 transition duration-300 lg:flex items-center justify-center gap-2">
                    <CirclePlus className="w-5 h-5" />
                    <span>Post New Job</span>
                  </button>
                </Link>
              </div>

              <Statistics stats={stats} />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 mb-6">
                <div className="lg:col-span-8">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-auto lg:h-[550px] flex flex-col">
                    <div className="p-3 md:p-4 border-b border-gray-100">
                      <h2 className="text-base md:text-lg font-semibold text-gray-900">
                        Applications Trend
                      </h2>
                    </div>
                    <div className="p-3 md:p-4 flex-grow">
                      <LineChart jobs={jobs} />
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-auto lg:h-[550px] flex flex-col">
                    <div className="p-3 md:p-4 border-b border-gray-100">
                      <h2 className="text-base md:text-lg font-semibold text-gray-900">
                        Applications by Company
                      </h2>
                    </div>
                    <div className="p-3 md:p-4 flex-grow">
                      <PieChart jobs={jobs} />
                    </div>
                  </div>
                </div>
              </div>

              <PostedJobs jobs={jobs} error={error} />
              <div>
                <DashboardTable/>
              </div>
            </div>
          </main>
        </>
      )}
    </div>
  );
};

export default Dashboard;
