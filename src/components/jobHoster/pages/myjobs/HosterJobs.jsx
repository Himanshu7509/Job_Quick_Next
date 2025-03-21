"use client";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { getJobsApi } from "@/components/utils/hosterApi/HosterApi";
import { TbCategory } from "react-icons/tb";
import { FaUserClock } from "react-icons/fa";
import { GiWallet } from "react-icons/gi";
import { GrUserWorker } from "react-icons/gr";
import { BsPersonWorkspace } from "react-icons/bs";
import { IoLocationOutline } from "react-icons/io5";
import Sidebar from "../../common/sidebar/Sidebar";

const HosterJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  const fetchJobs = async () => {
    try {
      const hosterId = Cookies.get("userId");
      if (!hosterId) {
        console.error("Hoster ID not found in cookies");
        return;
      }
      const response = await getJobsApi(hosterId);
      const data = response.data.jobs;
      console.log("Fetched Jobs:", data);
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="flex">
    <div>
    <Sidebar/>
    </div>
      <div className="w-full min-h-screen pt-20 py-12 px-2 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-teal-800 px-6 py-5 flex justify-between items-center">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                Posted Jobs
              </h2>
            </div>

            <div className="p-4 md:p-6">
              {jobs.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-xl text-gray-500">No jobs found</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-6">
                  {jobs.map((job) => {
                    const isExpanded = expandedId === job?._id;

                    return (
                      <div
                        key={job?._id}
                        className={`bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl p-4 md:p-6 ${
                          isExpanded ? "h-auto" : "h-fit"
                        }`}
                      >
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <div className="rounded-full">
                              <img
                                src="https://www.pngkey.com/png/full/191-1911374_company-building-png-office-building-png.png"
                                className="w-12 h-12"
                              />
                            </div>
                            <div className="w-full">
                              <p className="font-semibold text-gray-900 text-lg">
                                {job.companyName}
                              </p>
                              <p className="text-sm text-gray-700 truncate max-w-full overflow-hidden whitespace-nowrap">
                                {new Date(job.dateCreated).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div>
                              <p className="font-medium text-gray-900">
                                {job.title}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() =>
                              setExpandedId(isExpanded ? null : job?._id)
                            }
                            className=" text-teal-800 font-semibold cursor-pointer"
                          >
                            {isExpanded ? "View Less" : "View More"}
                          </button>

                          {isExpanded && (
                            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="flex items-center gap-3">
                                <BsPersonWorkspace className="w-5 h-5 text-teal-800" />
                                <div>
                                  <p className="text-sm text-gray-800">
                                    Work Type
                                  </p>
                                  <p className="font-medium text-gray-900">
                                    {job.workType}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <FaUserClock className="w-5 h-5 text-teal-800" />
                                <div>
                                  <p className="text-sm text-gray-800">
                                    Job Type
                                  </p>
                                  <p className="font-medium text-gray-900">
                                    {job.jobType}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <GiWallet className="w-5 h-5 text-teal-800" />
                                <div>
                                  <p className="text-sm text-gray-800">
                                    Package
                                  </p>
                                  <p className="font-medium text-gray-900">
                                    ${job.minPackage} - ${job.maxPackage}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <IoLocationOutline className="w-5 h-5 text-teal-800" />
                                <div>
                                  <p className="text-sm text-gray-800">
                                    Location
                                  </p>
                                  <p className="font-medium text-gray-900">
                                    {job.location}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <GrUserWorker className="w-5 h-5 text-teal-800" />
                                <div>
                                  <p className="text-sm text-gray-800">
                                    Experience
                                  </p>
                                  <p className="font-medium text-gray-900">
                                    {job.experience}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <TbCategory className="w-5 h-5 text-teal-800" />
                                <div>
                                  <p className="text-sm text-gray-800">
                                    Category
                                  </p>
                                  <p className="font-medium text-gray-900">
                                    {job.category?.title || "Uncategorized"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="flex justify-between w-full mt-4 space-x-4">
                            <button className="flex-1 h-10 border border-teal-700 bg-transparent text-black rounded-lg text-base font-semibold shadow-md hover:text-white hover:bg-teal-700">
                              Applicants
                            </button>
                            <button
                              //  onClick={() => setSelectedJob(job._id)}
                              className="flex-1 h-10 border border-red-500 text-black hover:text-white rounded-lg text-base font-semibold shadow-md  hover:bg-red-500"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {/* {selectedJob && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
        <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md text-center">
          <h2 className="text-xl font-semibold text-gray-900">Are you sure you want to delete this job?</h2>
          <div className="mt-6 flex justify-center gap-6">
            <button
              onClick={handleDeleteJob}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition shadow-md"
            >
              Delete
            </button>
            <button
              onClick={() => setSelectedJob(null)}
              className="bg-gray-300 text-black px-6 py-2 rounded-lg hover:bg-gray-400 transition shadow-md"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HosterJobs;
