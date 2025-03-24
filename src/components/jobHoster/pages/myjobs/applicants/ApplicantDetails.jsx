"use client";

import Sidebar from "@/components/jobHoster/common/sidebar/Sidebar";
import {
  appicantAPI,
  shortlistedApi,
} from "@/components/utils/hosterApi/HosterApi";
import React, { useState, useEffect } from "react";

const ApplicantDetails = ({ jobId }) => {
  const [email, setEmail] = useState([]);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shortlisted, setShortlisted] = useState(false); // Initialize with a boolean value
  const [shortlistLoading, setShortlistLoading] = useState(false);
  const [shortlistError, setShortlistError] = useState(null);

  // Function to get applicant details from API
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

      // Create the payload with the new desired shortlist status (opposite of current)
      const newShortlistStatus = !shortlisted;
      const payload = {
        shortListed: newShortlistStatus,
      };

      console.log("Sending payload:", payload);

      // Send the payload to the API
      const response = await shortlistedApi(jobId, payload);
      console.log("API response:", response);

      if (response.status === 200) {
        // Update the local state to match what we sent to the server
        setShortlisted(newShortlistStatus);
        console.log("Updated shortlisted status to:", newShortlistStatus);
      }
    } catch (error) {
      console.error("Error updating shortlist status:", error);
      // Show more specific error message if available
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
      <div className="w-full lg:ml-76 min-h-screen pt-16   lg:pt-6 py-2 px-2 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex">
            <div className="rounded-2xl bg-gradient-to-r from-teal-800 to-teal-500 px-6 py-5 w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="lg:text-3xl text-lg font-bold text-white">
                Applicant Details
              </h2>
              <div>
                <button
                  onClick={toggleShortlisted}
                  className={` overflow-hidden group py-2 px-6 rounded-full font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 
                  ${
                    shortlisted
                      ? "bg-gradient-to-r from-green-300 to-green-500 text-green-900 hover:shadow-lg shadow-md border-2 border-green-200"
                      : "bg-gradient-to-r from-amber-300 to-amber-500 text-amber-900 hover:shadow-lg shadow-md border-2 border-amber-200"
                  }`}
                >
                  <span className=" flex items-center justify-center">
                    {shortlisted ? (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Remove from Shortlist
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                        </svg>
                        Shortlist Candidate
                      </>
                    )}
                  </span>
                  <span className=" bottom-0 left-0 w-full h-0 transition-all duration-300 bg-amber-600 group-hover:h-full group-active:bg-amber-700 opacity-20"></span>
                </button>
              </div>
            </div>
          </div>

          <div className=" p-2">
            <div className="bg-white rounded-2xl shadow-lg lg:p-6 p-2">
              {/* Personal Information */}
              <div className="mb-8 bg-blue-50 p-6 rounded-xl">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Personal Information
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <p className="text-gray-600">Full Name</p>
                    <p className="font-semibold">{data.fullName || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Email</p>
                    <p className="font-semibold">{email.email || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Phone</p>
                    <p className="font-semibold">{data.phoneNumber || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Shortlist Status</p>
                    <p className="font-semibold">
                      {shortlisted ? "Shortlisted" : "Not Shortlisted"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Gender</p>
                    <p className="font-semibold">{data.gender || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Date of Birth</p>
                    <p className="font-semibold">
                      {data.dateOfBirth
                        ? new Date(data.dateOfBirth).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* About & Skills Section - Improved */}
              <div className="mb-8">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* About Section */}
                  <div className="bg-blue-50 p-6 rounded-xl h-full">
                    <div className="flex items-center mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-teal-600 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <h3 className="text-2xl font-bold text-gray-800">
                        About
                      </h3>
                    </div>
                    <div className="bg-white p-5 rounded-lg shadow-sm border border-blue-100">
                      <p className="text-gray-700 leading-relaxed">
                        {data.summary || "No summary provided"}
                      </p>
                    </div>
                  </div>

                  {/* Skills Section */}
                  <div className="bg-blue-50 p-6 rounded-xl h-full">
                    <div className="flex items-center mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-teal-600 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                      <h3 className="text-2xl font-bold text-gray-800">
                        Skills
                      </h3>
                    </div>

                    {/* ✅ Fixed Skills Display */}
                    {data.skills &&
                    Array.isArray(data.skills) &&
                    data.skills.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                        {data.skills[0]
                          .split(",") // Split the single string
                          .map((skill) => skill.trim()) // Trim spaces
                          .filter(Boolean) // Remove empty values
                          .map((skill, index) => (
                            <div
                              key={index}
                              className="p-4 bg-indigo-100 text-teal-800 rounded-xl font-medium text-center shadow-md"
                            >
                              {skill}
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100 w-full">
                        <p className="text-gray-500 italic">No skills listed</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-8 bg-blue-50 p-6 rounded-xl">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Location
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <p className="text-gray-600">Address</p>
                    <p className="font-semibold">{data.address || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">City</p>
                    <p className="font-semibold">{data.city || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">State</p>
                    <p className="font-semibold">{data.state || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Country</p>
                    <p className="font-semibold">{data.country || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Pincode</p>
                    <p className="font-semibold">{data.pincode || "N/A"}</p>
                  </div>
                </div>
              </div>

              <div className="mb-8 bg-blue-50 p-6 rounded-xl">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Education
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <p className="text-gray-600">Degree</p>
                    <p className="font-semibold">{data.eduDegree || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Institution</p>
                    <p className="font-semibold">
                      {data.eduInstitution || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Specialisation</p>
                    <p className="font-semibold">
                      {data.eduSpecialisation || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Start Year</p>
                    <p className="font-semibold">
                      {data.eduStartYear || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">End Year</p>
                    <p className="font-semibold">{data.eduEndYear || "N/A"}</p>
                  </div>
                </div>
              </div>

              <div className="mb-8 bg-blue-50 p-6 rounded-xl">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Work Experience
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <p className="text-gray-600">Company Name</p>
                    <p className="font-semibold">{data.expCompany || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Position</p>
                    <p className="font-semibold">{data.expPosition || "N/A"}</p>
                  </div>

                  <div>
                    <p className="text-gray-600">Start Year</p>
                    <p className="font-semibold">
                      {data.expStartYear || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">End Year</p>
                    <p className="font-semibold">{data.expEndYear || "N/A"}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  onClick={toggleShortlisted}
                  disabled={shortlistLoading}
                  className={` overflow-hidden group py-3 px-8 rounded-full font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 
                  ${
                    shortlisted
                      ? "bg-gradient-to-r from-green-300 to-green-500 text-green-900 hover:shadow-lg shadow-md border-2 border-green-200"
                      : "bg-gradient-to-r from-amber-300 to-amber-500 text-amber-900 hover:shadow-lg shadow-md border-2 border-amber-200"
                  }`}
                >
                  <span className=" flex items-center justify-center">
                    {shortlisted ? (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Remove from Shortlist
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                        </svg>
                        Shortlist This Candidate
                      </>
                    )}
                  </span>
                  <span className=" bottom-0 left-0 w-full h-0 transition-all duration-300 bg-amber-600 group-hover:h-full group-active:bg-amber-700 opacity-20 z-0"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDetails;
