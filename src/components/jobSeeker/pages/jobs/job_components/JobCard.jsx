"use client"
import React from "react";
import { TbCategory } from "react-icons/tb";
import { GrUserWorker } from "react-icons/gr";
import { BsPersonWorkspace } from "react-icons/bs";
import { IoLocationOutline } from "react-icons/io5";
import { FaUserClock } from "react-icons/fa";
import { GiWallet } from "react-icons/gi";
import Link from "next/link";

const JobCard = ({ jobs }) => {
    if (!jobs) {
        return <div>No job details available.</div>; // Or a placeholder UI
    }

    return (
        <div className="p-4 sm:p-6 max-w-xl w-full bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            {/* Header with logo and company info */}
            <div className="flex w-full mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0">
                    <img
                        src="https://www.pngkey.com/png/full/191-1911374_company-building-png-office-building-png.png"
                        alt={`${jobs.companyName} logo`}
                        className="w-full h-full rounded-lg object-cover shadow-sm"
                    />
                </div>

                <div className="flex-1 ml-3 sm:ml-4">
                    <h3 className="font-semibold text-base sm:text-lg text-gray-800 mb-1 line-clamp-2">
                        {jobs.title}
                    </h3>
                    <p className="text-teal-600 font-semibold text-sm sm:text-base mb-1">
                        {jobs.companyName}
                    </p>
                    <span className="text-xs sm:text-sm text-gray-500">
                        Posted on {new Date(jobs.dateCreated).toLocaleDateString()}
                    </span>
                </div>
            </div>

            {/* Job details */}
            <div className="mt-4 space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                    <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center">
                            <TbCategory className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500 mr-2" />
                            <span className="text-sm sm:text-base text-gray-700 font-medium sm:font-semibold truncate">
                                {jobs.category?.title || "Uncategorized"}
                            </span>
                        </div>

                        <div className="flex items-center">
                            <FaUserClock className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500 mr-2" />
                            <span className="text-sm sm:text-base text-gray-700 font-medium sm:font-semibold truncate">
                                {jobs.jobType}
                            </span>
                        </div>

                        <div className="flex items-center">
                            <GiWallet className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500 mr-2" />
                            <span className="text-sm sm:text-base text-gray-700 font-medium sm:font-semibold truncate">
                                {jobs.minPackage} - {jobs.maxPackage}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center">
                            <IoLocationOutline className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500 mr-2" />
                            <span className="text-sm sm:text-base text-gray-700 font-medium sm:font-semibold truncate">
                                {jobs.location}
                            </span>
                        </div>

                        <div className="flex items-center">
                            <GrUserWorker className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500 mr-2" />
                            <span className="text-sm sm:text-base text-gray-700 font-medium sm:font-semibold truncate">
                                {jobs.experience}
                            </span>
                        </div>

                        <div className="flex items-center">
                            <BsPersonWorkspace className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500 mr-2" />
                            <span className="text-sm sm:text-base text-gray-700 font-medium sm:font-semibold truncate">
                                {jobs.workType}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Button */}
            <div className="mt-4 sm:mt-6">
                <Link href={`/jobs/${jobs._id}`} className="block w-full">
                    <button className="w-full h-10 bg-teal-600 text-white rounded-lg text-sm sm:text-base font-semibold shadow-md hover:scale-105 hover:shadow-lg transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-teal-400">
                        View Job Details
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default JobCard;