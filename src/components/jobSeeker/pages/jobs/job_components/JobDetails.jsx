"use client";
import { jobdetailsApi } from "@/components/utils/userApi/UserApi";
import React, { useEffect, useState } from "react";
import Footer from "@/components/jobSeeker/common/footer/Footer";
import Link from "next/link";
import { getProfileApi } from "@/components/utils/userApi/UserApi";
import { jobApplyApi } from "@/components/utils/userApi/UserApi";
import { checkApplyApi } from "@/components/utils/userApi/UserApi";
import Cookies from "js-cookie";
import Header from "@/components/jobSeeker/common/header/Header";

const JobDetails = ({ jobId }) => {
  const [data, setData] = useState([]);
  const [skills, setSkills] = useState([]);
  const [category, setCategory] = useState([]);
  const [subcategory, setSubcategory] = useState([]);
  const [hasApplied, setHasApplied] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [showmodal, setshowmodal] = useState(false);
  const [showprofilemodal, setshowprofilemodal] = useState(false);

  const userId = Cookies.get("userId");

  const fetchJob = async () => {
    try {
      const appliedResponse = await checkApplyApi(jobId, userId);
      setHasApplied(appliedResponse.data.applied);

      const response = await jobdetailsApi(jobId);
      const data = response.data;

      setData(data);
      setSkills(data.skills);
      setCategory(data.category.title);
      setSubcategory(data.subcategories);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProfile = async () => {
    try {
      if (!userId) {
        console.error("userId is not defined");
        setIsProfileComplete(false);
        return;
      }
      const profileResponse = await getProfileApi(userId);

      if (!profileResponse || !profileResponse.data) {
        console.error("Invalid profile response", profileResponse);
        setIsProfileComplete(false);
        return;
      }

      const { fullName, gender, city, phoneNumber } = profileResponse.data;

      console.log("Profile data:", profileResponse.data);

      if (fullName && gender && city && phoneNumber) {
        setIsProfileComplete(true);
      } else {
        setIsProfileComplete(false);
        console.log("Incomplete profile fields:", {
          fullName: !!fullName,
          gender: !!gender,
          city: !!city,
          phoneNumber: !!phoneNumber,
        });
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setIsProfileComplete(false);
    }
  };

  const handleApply = async () => {
    try {
      if (!userId || !jobId) {
        alert("User ID or Job ID is missing. Please try again.");
        return;
      }

      if (!isProfileComplete) {
        setshowprofilemodal(true);
        return;
      }

      const response = await jobApplyApi({ jobId, applicantId: userId });

      console.log("Application Response:", response.data);
      setshowmodal(true);

      setHasApplied(true);
    } catch (error) {
      console.error(
        "Apply Job Error:",
        error.response ? error.response.data : error.message
      );
      alert(
        `Failed to apply: ${
          error.response?.data?.message || "Something went wrong!"
        }`
      );
    }
  };

  useEffect(() => {
    fetchJob();
    fetchProfile();
  }, []);

  return (
    <>
      <Header/>
      <div className="min-h-screen py-8">
       
          <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="relative">
                  <div className="h-32 bg-teal-900" />
                  <div className="px-4 sm:px-6 lg:px-8 pb-6">
                    <div className="relative -mt-16 flex flex-col items-center sm:flex-row sm:items-end sm:space-x-8">
                      <img
                        src="https://www.pngkey.com/png/full/191-1911374_company-building-png-office-building-png.png"
                        alt="Company Profile"
                        className="w-32 h-32 rounded-2xl border-4 border-white shadow-xl bg-white"
                      />
                      <div className="mt-6 md:mt-20 text-center sm:text-left flex-1">
                        <h1 className="text-4xl font-bold text-teal-800">
                          {data.title}
                        </h1>
                        <p className="text-xl text-gray-700 mt-1">
                          {data.companyName}
                        </p>
                      </div>
                      <div className="mt-6 sm:mt-0">
                        <button
                          onClick={handleApply}
                          className={`px-8 py-3 rounded-xl font-semibold shadow-lg ${
                            hasApplied
                              ? "bg-gray-500 cursor-not-allowed"
                              : "bg-teal-700 text-white cursor-pointer"
                          }`}
                          disabled={hasApplied}
                        >
                          {hasApplied ? "Applied" : "Apply Now"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-4 sm:px-6 lg:px-8 py-8">
                  <div className="space-y-8">
                    <section>
                      <h2 className="text-3xl font-bold text-teal-700 mb-6">
                        Company Details
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-gray-100 rounded-xl p-4">
                          <p className="text-gray-600 text-sm">Job Provider</p>
                          <p className="font-semibold text-gray-900 mt-1">
                            {data.fullName}
                          </p>
                        </div>
                        <div className="bg-gray-100 rounded-xl p-4">
                          <p className="text-gray-600 text-sm">Phone Number</p>
                          <p className="font-semibold text-gray-900 mt-1">
                            {data.phoneNo}
                          </p>
                        </div>
                        <div className="bg-gray-100 rounded-xl p-4">
                          <p className="text-gray-600 text-sm">Company Size</p>
                          <p className="font-semibold text-gray-900 mt-1">
                            {data.numOfEmployee}
                          </p>
                        </div>
                        <div className="bg-gray-100 rounded-xl p-4">
                          <p className="text-gray-600 text-sm">Company Email</p>
                          <p className="font-semibold text-gray-900 mt-1">
                            {data.companyEmail}
                          </p>
                        </div>
                        <div className="bg-gray-100 rounded-xl p-4">
                          <p className="text-gray-600 text-sm">Company URL</p>
                          <p className="font-semibold text-gray-900 mt-1">
                            {data.companyURL}
                          </p>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h2 className="text-3xl font-bold text-teal-700 mb-6">
                        Required Skills
                      </h2>
                      <div className="flex flex-wrap gap-3">
                        {skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-4 py-3 lg:py-2 bg-teal-100 rounded-lg text-md font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </section>

                    <section>
                      <h2 className="text-3xl font-bold text-teal-700 mb-6">
                        Job Details
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-gray-100 rounded-xl p-4">
                          <p className="text-gray-600 text-sm">Job Type</p>
                          <p className="font-semibold text-gray-900 mt-1">
                            {data.jobType}
                          </p>
                        </div>
                        <div className="bg-gray-100 rounded-xl p-4">
                          <p className="text-gray-600 text-sm">Work Type</p>
                          <p className="font-semibold text-gray-900 mt-1">
                            {data.workType}
                          </p>
                        </div>
                        <div className="bg-gray-100 rounded-xl p-4">
                          <p className="text-gray-600 text-sm">
                            Interview Type
                          </p>
                          <p className="font-semibold text-gray-900 mt-1">
                            {data.interviewType}
                          </p>
                        </div>
                        <div className="bg-gray-100 rounded-xl p-4">
                          <p className="text-gray-600 text-sm">Category</p>
                          <p className="font-semibold text-gray-900 mt-1">
                            {category}
                          </p>
                        </div>
                        <div className="bg-gray-100 rounded-xl p-4">
                          <p className="text-gray-600 text-sm">Sub-Category</p>
                          <p className="font-semibold text-gray-900 mt-1">
                            {subcategory.map((subcategories, index) => (
                              <span key={index}>{subcategories}</span>
                            ))}
                          </p>
                        </div>
                        <div className="bg-gray-100 rounded-xl p-4">
                          <p className="text-gray-600 text-sm">Location</p>
                          <p className="font-semibold text-gray-900 mt-1">
                            {data.location}
                          </p>
                        </div>
                        <div className="bg-gray-100 rounded-xl p-4">
                          <p className="text-gray-600 text-sm">Min Education</p>
                          <p className="font-semibold text-gray-900 mt-1">
                            {data.minEducation}
                          </p>
                        </div>
                        <div className="bg-gray-100 rounded-xl p-4">
                          <p className="text-gray-600 text-sm">Experience</p>
                          <p className="font-semibold text-gray-900 mt-1">
                            {data.experience}
                          </p>
                        </div>
                        <div className="bg-gray-100 rounded-xl p-4">
                          <p className="text-gray-600 text-sm">Openings</p>
                          <p className="font-semibold text-gray-900 mt-1">
                            {data.noOfOpening}
                          </p>
                        </div>
                        <div className="bg-gray-100 rounded-xl p-4">
                          <p className="text-gray-600 text-sm">Min Package</p>
                          <p className="font-semibold text-gray-900 mt-1">
                            {data.minPackage}
                          </p>
                        </div>
                        <div className="bg-gray-100 rounded-xl p-4">
                          <p className="text-gray-600 text-sm">Max Package</p>
                          <p className="font-semibold text-gray-900 mt-1">
                            {data.maxPackage}
                          </p>
                        </div>
                        <div className="bg-gray-100 rounded-xl p-4">
                          <p className="text-gray-600 text-sm">Posted Date</p>
                          <p className="font-semibold text-gray-900 mt-1">
                            {new Date(data.dateCreated).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h2 className="text-3xl font-bold text-teal-700 mb-6">
                        Description
                      </h2>
                      <div className="space-y-6">
                        <div className="bg-gray-100 rounded-xl p-6">
                          <h3 className="font-bold text-gray-900 mb-3">
                            About Company
                          </h3>
                          <p className="text-gray-700 leading-relaxed">
                            {data.companyDescription}
                          </p>
                        </div>
                        <div className="bg-gray-100 rounded-xl p-6">
                          <h3 className="font-bold text-gray-900 mb-3">
                            Job Description
                          </h3>
                          <p className="text-gray-700 leading-relaxed">
                            {data.jobDescription}
                          </p>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
                <div className="px-4 sm:px-6 lg:px-8 py-6">
                  <Link href="/jobs">
                    <button className="px-8 py-3 mb-4 bg-teal-700 cursor-pointer  text-white rounded-xl font-semibold shadow-lg hover:shadow-xl">
                      Go Back
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        
      </div>
      {showprofilemodal && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xs">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-xs md:max-w-md">
            <h2 className="text-xl font-bold mb-4 text-red-600">
              Incomplete Profile
            </h2>
            <p className="text-gray-700">
              Please complete your profile to apply for this job
            </p>
            <div className="mt-6 flex justify-between">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                onClick={() => setshowprofilemodal(false)}
              >
                Close
              </button>
              <Link
                href="/user-profile"
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-800"
              >
                Complete Profile
              </Link>
            </div>
          </div>
        </div>
      )}

      {showmodal && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xs">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-xs md:max-w-md">
            <h2 className="text-xl font-bold mb-4">
              Application submitted successfully!
            </h2>
            <p>
              Thank you for applying for this job. We will review your
              application and get back to you soon.
            </p>
            <button
              className="mt-4 px-6 py-2 bg-teal-700 text-white rounded-lg"
              onClick={() => setshowmodal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default JobDetails;
