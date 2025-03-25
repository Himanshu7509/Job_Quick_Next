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
    return (
      <div className="p-4 bg-white rounded-xl shadow-md text-center">
        No job details available.
      </div>
    );
  }

  const {
    _id,
    title = "Title Not Available",
    companyName = "Company Name Not Available",
    dateCreated,
    category,
    jobType = "Job Type Not Available",
    minPackage = "N/A",
    maxPackage = "N/A",
    location = "Location Not Available",
    experience = "Experience Not Available",
    workType = "Work Type Not Available",
  } = jobs;

  const formattedDate = dateCreated
    ? new Date(dateCreated).toLocaleDateString()
    : "Date Not Available";

  const formatSalary = () => {
    if (minPackage === "N/A" && maxPackage === "N/A")
      return "Salary not disclosed";
    if (minPackage === "N/A") return `Up to ${maxPackage}`;
    if (maxPackage === "N/A") return `From ${minPackage}`;
    return `${minPackage} - ${maxPackage}`;
  };

  return (
    <div className="h-full p-4 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
   
      <div className="flex items-start mb-4">
        <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
          <img
            src="https://www.pngkey.com/png/full/191-1911374_company-building-png-office-building-png.png"
            alt={`${companyName} logo`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/48?text=Co";
            }}
          />
        </div>

        <div className="flex-1 ml-3">
          <h3 className="font-semibold text-base text-gray-800 mb-1 line-clamp-2">
            {title}
          </h3>
          <p className="text-teal-600 font-medium text-sm mb-1">{companyName}</p>
          <span className="text-xs text-gray-500">Posted on {formattedDate}</span>
        </div>
      </div>

  
      <div className="flex-grow">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-2">
            <div className="flex items-center">
              <TbCategory className="w-4 h-4 text-teal-500 mr-2 flex-shrink-0" />
              <span className="text-sm text-gray-700 truncate">
                {category?.title || "Uncategorized"}
              </span>
            </div>

            <div className="flex items-center">
              <FaUserClock className="w-4 h-4 text-teal-500 mr-2 flex-shrink-0" />
              <span className="text-sm text-gray-700 truncate">{jobType}</span>
            </div>

            <div className="flex items-center">
              <GiWallet className="w-4 h-4 text-teal-500 mr-2 flex-shrink-0" />
              <span className="text-sm text-gray-700 truncate">{formatSalary()}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <IoLocationOutline className="w-4 h-4 text-teal-500 mr-2 flex-shrink-0" />
              <span className="text-sm text-gray-700 truncate">{location}</span>
            </div>

            <div className="flex items-center">
              <GrUserWorker className="w-4 h-4 text-teal-500 mr-2 flex-shrink-0" />
              <span className="text-sm text-gray-700 truncate">{experience}</span>
            </div>

            <div className="flex items-center">
              <BsPersonWorkspace className="w-4 h-4 text-teal-500 mr-2 flex-shrink-0" />
              <span className="text-sm text-gray-700 truncate">{workType}</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-4">
        <Link href={`/jobs/${_id}`} className="block w-full">
          <button className="w-full py-2 bg-teal-600 text-white rounded-lg text-sm font-medium shadow-sm hover:bg-teal-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50">
            View Job Details
          </button>
        </Link>
      </div>
    </div>
  );
};

export default JobCard;