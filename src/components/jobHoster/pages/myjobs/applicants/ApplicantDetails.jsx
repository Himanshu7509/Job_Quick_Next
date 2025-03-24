"use client";

import Sidebar from "@/components/jobHoster/common/sidebar/Sidebar";
import {
  appicantAPI,
  shortlistedApi,
} from "@/components/utils/hosterApi/HosterApi";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaBookmark,
  FaCheckCircle,
  FaInfoCircle,
  FaLightbulb,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaBriefcase,
  FaArrowLeft,
} from "react-icons/fa";

const ApplicantDetails = ({ jobId }) => {
  const [email, setEmail] = useState([]);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shortlisted, setShortlisted] = useState(false);
  const [shortlistLoading, setShortlistLoading] = useState(false);
  const [shortlistError, setShortlistError] = useState(null);

  const get = async () => {
    try {
      const response = await appicantAPI(jobId);
      console.log("API Response:", response.data);

      setData(response.data.seekerDetails);
      setEmail(response.data.applicantId);

      setShortlisted(response.data.shortListed === true);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch applicant details");
    }
  };

  useEffect(() => {
    if (jobId) get();
  }, [jobId]);

  const toggleShortlisted = async () => {
    try {
      setShortlistLoading(true);
      setShortlistError(null);

      const newShortlistStatus = !shortlisted;
      const payload = {
        shortListed: newShortlistStatus,
      };

      console.log("Sending payload:", payload);

      const response = await shortlistedApi(jobId, payload);
      console.log("API response:", response);

      if (response.status === 200) {
        setShortlisted(newShortlistStatus);
        console.log("Updated shortlisted status to:", newShortlistStatus);
      }
    } catch (error) {
      console.error("Error updating shortlist status:", error);
      const action = shortlisted ? "remove from shortlist" : "shortlist";
      const errorMessage =
        error.response?.data?.message || `Failed to ${action} applicant`;
      setShortlistError(errorMessage);
    }
  };

  if (!data || !email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-blue-50">
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-xl text-gray-500">No applicant found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <div className="lg:w-1/4 w-0 fixed left-0 top-0 h-screen">
        <Sidebar />
      </div>

      <div className="w-full lg:ml-64 min-h-screen p-3 sm:p-5 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-2xl bg-gradient-to-r from-teal-800 via-teal-600 to-teal-500 shadow-xl mb-6 overflow-hidden">
            <div className="px-5 py-6 sm:px-8 sm:py-7 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center">
                <Link href={`/my-jobs`}>
                  <button className="rounded-lg mr-4 cursor-pointer">
                    <FaArrowLeft className="h-6 w-6 text-white" />
                  </button>
                </Link>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Applicant Details
                </h2>
              </div>

              <button
                onClick={toggleShortlisted}
                className={`overflow-hidden group py-2.5 px-4 rounded-full font-medium
            ${
              shortlisted
                ? "bg-gradient-to-r from-amber-300 to-amber-500 text-amber-900 border-2 border-amber-200"
                : "bg-gradient-to-r from-green-300 to-green-500 text-green-900 border-2 border-green-200"
            }`}
              >
                <span className="flex items-center justify-center">
                  {shortlisted ? (
                    <>
                      <FaBookmark className="h-5 w-5 mr-2" />
                      <span className="whitespace-nowrap">
                        Remove from Shortlist
                      </span>
                    </>
                  ) : (
                    <>
                      <FaCheckCircle className="h-5 w-5 mr-2" />
                      <span className="whitespace-nowrap">Shortlist</span>
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-teal-100 rounded-lg mr-3">
                  <FaUser className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 tracking-tight">
                  Personal Information
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="w-full">
                  <p className="text-gray-500 text-sm font-medium mb-1">
                    Full Name
                  </p>
                  <p className="font-semibold text-gray-800">
                    {data.fullName || "N/A"}
                  </p>
                </div>

                <div className="w-full">
                  <p className="text-gray-500 text-sm font-medium mb-1">
                    Email
                  </p>
                  <p className="font-semibold text-gray-800">
                    {email.email || "N/A"}
                  </p>
                </div>

                <div className="w-full">
                  <p className="text-gray-500 text-sm font-medium mb-1">
                    Phone
                  </p>
                  <p className="font-semibold text-gray-800">
                    {data.phoneNumber || "N/A"}
                  </p>
                </div>

                <div className="w-full">
                  <p className="text-gray-500 text-sm font-medium mb-1">
                    Shortlist Status
                  </p>
                  <p
                    className={`font-semibold ${
                      shortlisted ? "text-green-600" : "text-gray-800"
                    }`}
                  >
                    {shortlisted ? "Shortlisted" : "Not Shortlisted"}
                  </p>
                </div>

                <div className="w-full">
                  <p className="text-gray-500 text-sm font-medium mb-1">
                    Gender
                  </p>
                  <p className="font-semibold text-gray-800">
                    {data.gender || "N/A"}
                  </p>
                </div>

                <div className="w-full">
                  <p className="text-gray-500 text-sm font-medium mb-1">
                    Date of Birth
                  </p>
                  <p className="font-semibold text-gray-800">
                    {data.dateOfBirth
                      ? new Date(data.dateOfBirth).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <FaInfoCircle className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 tracking-tight">
                  About
                </h3>
              </div>

              <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-gray-700 leading-relaxed">
                  {data.summary || "No summary provided"}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                  <FaLightbulb className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 tracking-tight">
                  Skills
                </h3>
              </div>

              {data.skills &&
              Array.isArray(data.skills) &&
              data.skills.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {data.skills[0]
                    .split(",")
                    .map((skill) => skill.trim())
                    .filter(Boolean)
                    .map((skill, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg font-medium text-center shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        {skill}
                      </div>
                    ))}
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-gray-500 italic">No skills listed</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <FaMapMarkerAlt className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 tracking-tight">
                  Location
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="w-full">
                  <p className="text-gray-500 text-sm font-medium mb-1">
                    Address
                  </p>
                  <p className="font-semibold text-gray-800">
                    {data.address || "N/A"}
                  </p>
                </div>

                <div className="w-full">
                  <p className="text-gray-500 text-sm font-medium mb-1">City</p>
                  <p className="font-semibold text-gray-800">
                    {data.city || "N/A"}
                  </p>
                </div>

                <div className="w-full">
                  <p className="text-gray-500 text-sm font-medium mb-1">
                    State
                  </p>
                  <p className="font-semibold text-gray-800">
                    {data.state || "N/A"}
                  </p>
                </div>

                <div className="w-full">
                  <p className="text-gray-500 text-sm font-medium mb-1">
                    Country
                  </p>
                  <p className="font-semibold text-gray-800">
                    {data.country || "N/A"}
                  </p>
                </div>

                <div className="w-full">
                  <p className="text-gray-500 text-sm font-medium mb-1">
                    Pincode
                  </p>
                  <p className="font-semibold text-gray-800">
                    {data.pincode || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                    <FaGraduationCap className="h-6 w-6 text-indigo-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 tracking-tight">
                    Education
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="w-full">
                    <p className="text-gray-500 text-sm font-medium mb-1">
                      Degree
                    </p>
                    <p className="font-semibold text-gray-800">
                      {data.eduDegree || "N/A"}
                    </p>
                  </div>

                  <div className="w-full">
                    <p className="text-gray-500 text-sm font-medium mb-1">
                      Institution
                    </p>
                    <p className="font-semibold text-gray-800">
                      {data.eduInstitution || "N/A"}
                    </p>
                  </div>

                  <div className="w-full">
                    <p className="text-gray-500 text-sm font-medium mb-1">
                      Specialisation
                    </p>
                    <p className="font-semibold text-gray-800">
                      {data.eduSpecialisation || "N/A"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <div className="flex-1">
                      <p className="text-gray-500 text-sm font-medium mb-1">
                        Start Year
                      </p>
                      <p className="font-semibold text-gray-800">
                        {data.eduStartYear || "N/A"}
                      </p>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-500 text-sm font-medium mb-1">
                        End Year
                      </p>
                      <p className="font-semibold text-gray-800">
                        {data.eduEndYear || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-amber-100 rounded-lg mr-3">
                    <FaBriefcase className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 tracking-tight">
                    Work Experience
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="w-full">
                    <p className="text-gray-500 text-sm font-medium mb-1">
                      Company
                    </p>
                    <p className="font-semibold text-gray-800">
                      {data.expCompany || "N/A"}
                    </p>
                  </div>

                  <div className="w-full">
                    <p className="text-gray-500 text-sm font-medium mb-1">
                      Position
                    </p>
                    <p className="font-semibold text-gray-800">
                      {data.expPosition || "N/A"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <div className="flex-1">
                      <p className="text-gray-500 text-sm font-medium mb-1">
                        Start Year
                      </p>
                      <p className="font-semibold text-gray-800">
                        {data.expStartYear || "N/A"}
                      </p>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-500 text-sm font-medium mb-1">
                        End Year
                      </p>
                      <p className="font-semibold text-gray-800">
                        {data.expEndYear || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDetails;
