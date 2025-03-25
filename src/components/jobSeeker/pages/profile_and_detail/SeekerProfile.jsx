"use client";

import React, { useEffect, useState, useTransition } from "react";
import Cookies from "js-cookie";
import {
  postProfileApi,
  patchProfileApi,
  getProfileApi,
  deleteUserApi
} from "@/components/utils/userApi/UserApi";
import { useRouter } from "next/navigation";
import Footer from "../../common/footer/Footer";
import Header from "../../common/header/Header";
import Loader from "@/components/Loader";
import ShowJobs from "./ShowJobs";

const SeekerProfile = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    skills: "",
    projectUrl: "",
    summary: "",
    eduDegree: "",
    eduInstitution: "",
    eduSpecialisation: "",
    eduStartYear: "",
    eduEndYear: "",
    expCompany: "",
    expPosition: "",
    expStartYear: "",
    expEndYear: "",
  });
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [profileId, setProfileId] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("");
  const [isPending, startTransition] = useTransition();
  const [email, setemail] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      const userId = Cookies.get("userId");
      if (!userId) return;

      try {
        const response = await getProfileApi(userId);
        console.log("Profile data response:", response);

        if (response && response.data && response.data._id) {
          const profileData = response.data;
          const skillsValue = Array.isArray(profileData.skills)
            ? profileData.skills.join(", ")
            : profileData.skills || "";

          setFormData({
            fullName: profileData.fullName || "",
            phoneNumber: profileData.phoneNumber || "",
            dateOfBirth: profileData.dateOfBirth || "",
            gender: profileData.gender || "",
            address: profileData.address || "",
            city: profileData.city || "",
            state: profileData.state || "",
            country: profileData.country || "",
            pincode: profileData.pincode || "",
            skills: skillsValue,
            projectUrl: profileData.projectUrl || "",
            summary: profileData.summary || "",
            eduDegree: profileData.eduDegree || "",
            eduInstitution: profileData.eduInstitution || "",
            eduSpecialisation: profileData.eduSpecialisation || "",
            eduStartYear: profileData.eduStartYear || "",
            eduEndYear: profileData.eduEndYear || "",
            expCompany: profileData.expCompany || "",
            expPosition: profileData.expPosition || "",
            expStartYear: profileData.expStartYear || "",
            expEndYear: profileData.expEndYear || "",
          });

          setProfileId(profileData._id);
          setIsEditing(true);
          console.log("Profile found, ID:", profileData._id);
          setemail(profileData._id.email);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log("No profile found for this user, showing empty form");
          setIsEditMode(true);
        } else {
          console.error("Error fetching profile:", error);
        }
      }
    };

    startTransition(() => {
      fetchProfileData();
    });
  }, []);

  const handleDeleteAccount = async () => {
      const userId = Cookies.get("userId");
      if (!userId) {
        setStatusMessage("Authentication failed. Please log in again.");
        setStatusType("error");
        return;
      }
  
      try {
        await deleteUserApi(userId);
  
        // Clear all cookies
        Cookies.remove("authToken");
        Cookies.remove("userId");
  
        // Redirect to login or home page
        router.push("/user-login");
      } catch (error) {
        console.error("Delete Account Error:", error);
  
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Failed to delete account. Please try again.";
  
        setStatusMessage(errorMessage);
        setStatusType("error");
        setIsDeleteModalOpen(false);
      }
    };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage("");

    const userId = Cookies.get("userId");
    if (!userId) {
      console.error("Critical Error: No user ID found in cookies");
      setStatusMessage("Authentication failed. Please log in again.");
      setStatusType("error");
      return;
    }

    try {
      const actualProfileId =
        typeof profileId === "object" && profileId._id
          ? profileId._id
          : profileId || userId;

      console.log("Actual Profile ID for Update:", actualProfileId);

      const cleanFormData = {
        ...formData,
        userId: userId,
        skills: formData.skills
          ? formData.skills
              .split(",")
              .map((skill) => skill.trim())
              .filter(Boolean)
          : [],
      };

      delete cleanFormData._id;

      let response;
      if (isEditing && actualProfileId) {
        console.log("Updating profile with:", {
          profileId: actualProfileId,
          data: cleanFormData,
        });

        response = await patchProfileApi(actualProfileId, cleanFormData);
      } else {
        response = await postProfileApi({
          ...cleanFormData,
          _id: userId,
        });
      }

      console.log("Full API Submission Response:", response);

      const profileIdentifier =
        response?.data?._id ||
        response?.data?.seekerDetails?._id ||
        response?.data?.userId ||
        actualProfileId ||
        userId;

      if (profileIdentifier) {
        setProfileId(profileIdentifier);
        setIsEditing(true);
        setStatusMessage("Profile saved successfully!");
        setStatusType("success");
        setIsEditMode(false);
      } else {
        throw new Error("Could not retrieve or generate profile identifier");
      }
    } catch (error) {
      console.error("Comprehensive Profile Submission Error:", {
        errorResponse: error.response?.data,
        errorMessage: error.message,
        errorStatus: error.response?.status,
        fullError: error,
      });

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to save profile. Please check your information.";

      setStatusMessage(errorMessage);
      setStatusType("error");
    }
  };

  const toggleEditMode = () => {
    if (isEditMode) {
      document.getElementById("profileForm").requestSubmit();
    } else {
      setIsEditMode(true);
    }
  };

  const renderInput = (id, label, type = "text") => (
    <div>
      <label
        className="block text-gray-600 font-medium mb-2 text-sm"
        htmlFor={id}
      >
        {label}
      </label>
      {isEditMode ? (
        <input
          type={type}
          id={id}
          name={id}
          value={formData[id]}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50 transition-shadow duration-200"
        />
      ) : (
        <div className="w-full px-4 py-2 bg-gray-50 rounded-lg border border-gray-100 text-gray-900 font-medium">
          {formData[id] || "Not specified"}
        </div>
      )}
    </div>
  );

  const renderSelect = (id, label, options) => (
    <div>
      <label
        className="block text-gray-600 font-medium mb-2 text-sm"
        htmlFor={id}
      >
        {label}
      </label>
      {isEditMode ? (
        <select
          id={id}
          name={id}
          value={formData[id]}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50 transition-shadow duration-200"
        >
          <option value="" disabled>
            Select {label}
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <div className="w-full px-4 py-2 bg-gray-50 rounded-lg border border-gray-100 text-gray-900 font-medium">
          {formData[id] || "Not specified"}
        </div>
      )}
    </div>
  );

  const renderTextarea = (id, label, rows = 4) => (
    <div>
      <label
        className="block text-gray-600 font-medium mb-2 text-sm"
        htmlFor={id}
      >
        {label}
      </label>
      {isEditMode ? (
        <textarea
          id={id}
          name={id}
          value={formData[id]}
          onChange={handleChange}
          rows={rows}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50 transition-shadow duration-200"
        ></textarea>
      ) : (
        <div className="w-full px-4 py-2 bg-gray-50 rounded-lg border border-gray-100 text-gray-900 font-medium min-h-[100px]">
          {formData[id] || "Not specified"}
        </div>
      )}
    </div>
  );

  const renderSkills = () => {
    if (!formData.skills) return null;
    const skillsList = formData.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    return (
      <div className="flex flex-wrap gap-2 mt-4">
        {skillsList.map((skill, index) => (
          <span
            key={index}
            className="px-4 py-2 bg-indigo-50 text-teal-600 rounded-lg font-medium"
          >
            {skill}
          </span>
        ))}
      </div>
    );
  };

  return (
    <>
      <Header />
      {isPending ? (
        <Loader />
      ) : (
        <>
          <div className="min-h-screen py-10">
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
              <div className="bg-white rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 hover:shadow-3xl">
                <div className="bg-teal-700 p-6 text-white">
                  <h1 className="text-4xl md:text-5xl text-center font-extrabold mb-2">
                    Profile
                  </h1>
                  <p className="text-center text-gray-100">
                    Your Professional Journey
                  </p>
                  <div className="flex flex-col md:flex-row items-center justify-center gap-2 mt-4">
                    <button
                      onClick={toggleEditMode}
                      className={`flex cursor-pointer items-center gap-2 px-6 py-2 rounded-lg transition-colors duration-200 ${
                        isEditMode
                          ? "bg-indigo-50 text-teal-600 hover:bg-indigo-100"
                          : "bg-indigo-50 text-teal-600 hover:bg-indigo-100"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        {isEditMode ? (
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        ) : (
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        )}
                      </svg>
                      <span>
                        {isEditMode ? "Save Profile" : "Edit Profile"}
                      </span>
                    </button>
                    
                      <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition duration-200"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Delete Account</span>
                      </button>
                    

                    {/* Delete Confirmation Modal */}
                    {isDeleteModalOpen && (
                      <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full">
                          <h2 className="text-xl font-bold text-red-600 mb-4">
                            Delete Account
                          </h2>
                          <p className="text-gray-600 mb-6">
                            Are you sure you want to delete your account? This
                            action cannot be undone and will permanently remove
                            all your data.
                          </p>
                          <div className="flex justify-end space-x-4">
                            <button
                              onClick={() => setIsDeleteModalOpen(false)}
                              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleDeleteAccount}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                            >
                              Delete Account
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {statusMessage && (
                  <div
                    className={`mb-6 mt-4 p-4 mx-4 rounded-xl shadow-md ${
                      statusType === "success"
                        ? "bg-green-50 text-green-700 border border-green-100"
                        : "bg-red-50 text-red-700 border border-red-100"
                    }`}
                  >
                    {statusMessage}
                  </div>
                )}

                <form id="profileForm" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-10 gap-8 p-4 md:p-6">
                    <div className="md:col-span-3 space-y-8">
                      <div className="bg-white rounded-2xl p-2 md:p-6 shadow-lg border border-gray-100 transform transition-all duration-300 hover:shadow-xl">
                        <div className="flex flex-col items-center">
                          <div className="relative border-2 border-gray-200 rounded-full p-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-20 w-20 text-gray-400"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div className="text-center mt-6 space-y-2">
                            <div className="text-2xl font-bold text-gray-800">
                              {" "}
                              {renderInput("fullName")}
                            </div>
                            <div className="text-gray-600 my-4">{email}</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-2xl p-2 md:p-6 shadow-lg border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                          <span className="w-2 h-6 bg-teal-500 rounded-full"></span>
                          Personal Details
                        </h2>
                        <div className="grid grid-cols-1 gap-4">
                          {renderSelect("gender", "Gender", [
                            "Male",
                            "Female",
                            "Other",
                          ])}
                          {renderInput("dateOfBirth", "Date of Birth", "date")}
                          {renderInput("phoneNumber", "Phone Number", "tel")}
                          {renderInput("projectUrl", "Github Profile", "url")}
                        </div>
                      </div>

                      <div className="bg-white rounded-2xl p-2 md:p-6 shadow-lg border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <span className="w-2 h-6 bg-teal-500 rounded-full"></span>
                          Summary
                        </h2>
                        <div className="text-gray-600 leading-relaxed">
                          {" "}
                          {renderTextarea("summary", "Summary")}
                        </div>
                      </div>

                      <div className="bg-white rounded-2xl p-2 md:p-6 shadow-lg border border-gray-100">
                        {renderInput("skills", "Skills")}
                        {!isEditMode && formData.skills && (
                          <div className="md:col-span-2 mt-4">
                            <h3 className="text-md font-medium text-gray-700 mb-2">
                              My Skills
                            </h3>
                            {renderSkills()}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="md:col-span-7 space-y-8">
                      <div className="bg-white rounded-2xl p-2 md:p-6 shadow-lg border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                          <span className="w-2 h-6 bg-teal-500 rounded-full"></span>
                          Location
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="md:col-span-2">
                            {renderInput("address", "Address")}
                          </div>
                          {renderInput("city", "City")}
                          {renderInput("state", "State")}
                          {renderInput("country", "Country")}
                          {renderInput("pincode", "Pincode")}
                        </div>
                      </div>

                      <div className="bg-white rounded-2xl p-2 md:p-6 shadow-lg border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                          <span className="w-2 h-6 bg-teal-500 rounded-full"></span>
                          Educational Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="col-span-1 md:col-span-2">
                            {renderInput("eduInstitution", "Institution")}
                          </div>
                          {renderInput("eduDegree", "Degree")}
                          {renderInput("eduSpecialisation", "Specialisation")}
                          {renderInput("eduStartYear", "Start Year")}
                          {renderInput("eduEndYear", "End Year")}
                        </div>
                      </div>

                      <div className="bg-white rounded-2xl p-2 md:p-6 shadow-lg border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                          <span className="w-2 h-6 bg-teal-500 rounded-full"></span>
                          Experience
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {renderInput("expCompany", "Company")}
                          {renderInput("expPosition", "Position")}
                          {renderInput("expStartYear", "Start Year")}
                          {renderInput("expEndYear", "End Year")}
                        </div>
                      </div>

                      <ShowJobs />
                    </div>
                  </div>
                  <button type="submit" className="hidden"></button>
                </form>
              </div>
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
};

export default SeekerProfile;
