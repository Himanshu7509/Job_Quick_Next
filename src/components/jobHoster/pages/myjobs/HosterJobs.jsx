"use client";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { getJobsApi, deletehosterjobApi } from "@/components/utils/hosterApi/HosterApi";
import { BiSolidCategory } from "react-icons/bi";
import { FaUserClock } from "react-icons/fa";
import { GiWallet } from "react-icons/gi";
import { GrUserWorker } from "react-icons/gr";
import { BsPersonWorkspace } from "react-icons/bs";
import { FaLocationDot } from "react-icons/fa6";

import Sidebar from "../../common/sidebar/Sidebar";
import Link from "next/link";


const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, jobTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
        <p className="mb-6">Are you sure you want to delete the job: <span className="font-semibold">{jobTitle}</span>?</p>
        <div className="flex justify-end space-x-4">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const JOB_LIMIT = 6;

const HosterJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
 
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  const fetchJobs = async (newPage) => {
    try {
      setIsLoading(true);
      const hosterId = Cookies.get("userId");
      if (!hosterId) {
        console.error("Hoster ID not found in cookies");
        return;
      }

      const response = await getJobsApi(hosterId, JOB_LIMIT, newPage);
      const data = response.data.jobs;
      console.log("myjob", data);

      if (data.length < JOB_LIMIT) {
        setHasMore(false);
      }

      setJobs((prevJobs) => {
        const newJobs = [...prevJobs, ...data];
        const uniqueJobs = Array.from(
          new Map(newJobs.map((job) => [job._id, job])).values()
        );
        return uniqueJobs;
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(page);
  }, []);

  const loadMoreJobs = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchJobs(nextPage);
  };

  const showLessJobs = () => {
    setPage(1);
    setJobs(jobs.slice(0, JOB_LIMIT));
    setHasMore(true);
  };

  const openDeleteModal = (job) => {
    setJobToDelete(job);
    setDeleteModalOpen(true);
  };

  const handleDeleteJob = async () => {
    if (!jobToDelete) return;

    try {
      setIsLoading(true);
      
  
      console.log("Deleting job with _id:", jobToDelete._id);
  
      await deletehosterjobApi(jobToDelete._id);
  
      setJobs(prevJobs => prevJobs.filter(job => job._id !== jobToDelete._id));
 
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Failed to delete job:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Confirmation Modal */}
      <ConfirmDeleteModal 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteJob}
        jobTitle={jobToDelete?.title}
      />

      <div className="flex">
        <div className="lg:w-1/4 w-0 fixed left-0 top-0 h-screen">
          <Sidebar />
        </div>
        <div className="w-full lg:ml-76 min-h-screen pt-6 py-12 px-2 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-teal-800 px-6 py-5 flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white">Posted Jobs</h2>
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
                                  <FaLocationDot className="w-5 h-5 text-teal-800" />
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
                                  <BiSolidCategory className="w-5 h-5 text-teal-800" />
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

                            <div className="flex flex-wrap justify-between w-full mt-4 gap-4">
                              <Link
                                href={`/my-jobs/view-applicant/${job._id}`}
                                className="flex-1 min-w-[120px]"
                              >
                                <button className="h-10 w-full border border-teal-700 bg-transparent text-black rounded-lg text-base font-semibold shadow-md hover:text-white hover:bg-teal-700 transition duration-200">
                                  Applicants
                                </button>
                              </Link>
                              <button 
                                onClick={() => openDeleteModal(job)}
                                disabled={isLoading}
                                className="flex-1 min-w-[120px] h-10 w-full border border-red-500 text-black hover:text-white rounded-lg text-base font-semibold shadow-md hover:bg-red-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isLoading ? 'Deleting...' : 'Delete'}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="flex justify-center gap-4 mt-6">
                  {jobs.length > 0 && hasMore && (
                    <button
                      onClick={loadMoreJobs}
                      disabled={isLoading}
                      className="bg-teal-700 text-white px-6 py-2 rounded-lg shadow-md hover:bg-teal-800"
                    >
                      Load More
                    </button>
                  )}
                  {jobs.length > JOB_LIMIT && (
                    <button
                      onClick={showLessJobs}
                      className="bg-gray-400 text-white px-6 py-2 rounded-lg shadow-md hover:bg-gray-500"
                    >
                      Show Less
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HosterJobs;