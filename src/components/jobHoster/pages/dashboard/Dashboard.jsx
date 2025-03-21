"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../../common/sidebar/Sidebar";
import Statistics from "./charts_and_statistics/Statistics";
import { StatData } from "@/components/utils/hosterApi/HosterApi";
import PostedJobs from "./postedjobs/PostedJobs";

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const FetchResponse = async () => {
      try {
        const response = await StatData();
        console.log("API Response:", response);
        if (response && response.data && response.data.statistics) {
          setStats(response.data.statistics); // Access the 'statistics' object
        } else {
          console.error("Invalid API response structure:", response);

          setStats({ totalJobs: 0, totalApplicants: 0, totalShortlisted: 0 });
        }
      } catch (error) {
        console.error("Error fetching statistics:", error);

        setStats({ totalJobs: 0, totalApplicants: 0, totalShortlisted: 0 });
      }
    };

    FetchResponse();
  }, []);

  return (
    <div className="w-full flex">
      <Sidebar />

      <div><Statistics stats={stats} /></div>
      
    </div>
  );
};

export default Dashboard;
