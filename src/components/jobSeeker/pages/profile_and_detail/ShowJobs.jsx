"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { showJobsApi } from "@/components/utils/userApi/UserApi";

export default function ShowJobs() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const showJobs = async () => {
    try {
      setIsLoading(true);
      const userId = Cookies.get("userId");

      if (!userId) {
        throw new Error("User ID not found");
      }

      const response = await showJobsApi(userId);

      if (response.data && response.data.jobs) {
        const validJobs = response.data.jobs.filter((job) => job !== null);
        setJobs(validJobs);
      } else {
        setJobs([]);
      }

      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    showJobs();
  }, []);

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="text-red-500 text-center">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-2 md:p-6 shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span className="w-2 h-6 bg-teal-700 rounded-full"></span>
        Jobs you've applied to
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div
              key={job._id}
              className="bg-gray-50 p-4 rounded-lg transform transition-all duration-300 hover:shadow-md hover:scale-102"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {job.title}
              </h3>
              <p className="text-gray-600 text-sm mb-1">
                <span className="font-medium">Company:</span> {job.companyName}
              </p>
              <p className="text-gray-600 text-sm">
                <span className="font-medium">Location:</span> {job.location}
              </p>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-10 bg-gray-50 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-700 mb-1">
              No Applications Yet
            </h3>
            <p className="text-gray-500 text-center">
              You haven't applied to any jobs yet. Start your job search today!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
