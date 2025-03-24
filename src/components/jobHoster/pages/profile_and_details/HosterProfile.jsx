"use client";

import React, { useEffect, useState, useTransition } from "react";
import Cookies from "js-cookie";
import {
  postHosterProfileApi,
  patchHosterProfileApi,
  getHosterProfileApi,
} from "@/components/utils/hosterApi/HosterApi";
import Sidebar from "../../common/sidebar/Sidebar";
import Loader from "@/components/Loader";

const HosterProfile = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    comapanytURL: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [profileId, setProfileId] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchProfileData = async () => {
      const userId = Cookies.get("userId");
      if (!userId) return;

      try {
        const response = await getHosterProfileApi(userId);
        console.log("Profile data response:", response);

        if (response && response.data && response.data._id) {
          const profileData = response.data;

          setFormData({
            fullName: profileData.fullName || "",
            phoneNumber: profileData.phoneNumber || "",
            gender: profileData.gender || "",
            address: profileData.address || "",
            city: profileData.city || "",
            state: profileData.state || "",
            country: profileData.country || "",
            pincode: profileData.pincode || "",
            companyURL: profileData.companyURL || "",
          });

          setProfileId(profileData._id);
          setIsEditing(true);
          console.log("Profile found, ID:", profileData._id);
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

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage("");

    const userId = Cookies.get("userId");
    if (!userId) {
      console.error("Error: userId is missing in cookies");
      setStatusMessage("Error: User ID is missing. Please log in again.");
      setStatusType("error");
      return;
    }

    const updatedFormData = { ...formData };
    if (!isEditing) updatedFormData._id = userId;

    console.log("Submitting Data:", updatedFormData);

    try {
      let response;
      if (isEditing && profileId) {
        response = await patchHosterProfileApi(profileId, updatedFormData);
        console.log("Profile updated successfully!");
      } else {
        response = await postHosterProfileApi(updatedFormData);
        console.log("Profile created successfully!");

        if (response?.data?._id) {
          setProfileId(response.data._id);
          setIsEditing(true);
        } else if (response?.data?.seekerDetails?._id) {
          setProfileId(response.data.seekerDetails._id);
          setIsEditing(true);
        }
      }

      if (response.status === 200 || response.status === 201) {
        setStatusMessage(
          isEditing
            ? "Profile updated successfully!"
            : "Profile created successfully!"
        );
        setStatusType("success");
        setIsEditMode(false);
      }
    } catch (error) {
      console.error("Server Error:", error);
      setStatusMessage("Error saving profile. Please try again.");
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

  return (
    <>
      <div className="flex flex-col lg:flex-row min-h-screen">
        <div className="lg:w-1/4 w-0 fixed left-0 top-0 h-screen">
          <Sidebar />
        </div>
        {isPending ? (
          <>
            {" "}
            <Loader />
          </>
        ) : (
          <>
            <div className="w-full lg:ml-72  min-h-screen py-8 px-4">
              <div className="max-w-5xl  rounded-2xl mx-auto">
                <div className="bg-teal-800 rounded-t-2xl px-6 py-5 flex justify-between items-center">
                  <h2 className="text-3xl font-bold text-white">Profile</h2>
                </div>

                <div className="bg-white rounded-xl my-6 shadow-lg p-6 sm:p-8 hover:shadow-xl transition duration-300">
                  <div className="flex flex-col md:flex-row  items-center md:items-start text-center md:text-left">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full shadow-lg bg-gray-100 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-14 w-14 sm:h-16 sm:w-16 text-gray-400"
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

                    <div className="mt-4 md:mt-0 md:ml-4 flex flex-col items-center md:items-start">
                      <h1 className="text-xl md:text-3xl font-bold text-gray-900">
                        {formData.fullName || "Profile"}
                      </h1>

                      <button
                        onClick={toggleEditMode}
                        className="mt-4 flex items-center gap-2  text-blue-600 hover:text-blue-900 transition duration-200"
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
                    </div>

                    <button className="md:ml-auto mt-4 flex items-center gap-2 px-2 sm:px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition duration-200">
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
                  </div>
                </div>

                {statusMessage && (
                  <div
                    className={`mb-6 p-4 rounded-xl shadow-md ${
                      statusType === "success"
                        ? "bg-green-50 text-green-700 border border-green-100"
                        : "bg-red-50 text-red-700 border border-red-100"
                    }`}
                  >
                    {statusMessage}
                  </div>
                )}

                <form
                  id="profileForm"
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition duration-300">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                      Personal Details
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                      {renderInput("fullName", "Full Name")}
                      {renderInput("phoneNumber", "Phone Number")}
                      {renderSelect("gender", "Gender", [
                        "Male",
                        "Female",
                        "Other",
                      ])}
                      {renderInput("companyURL", "Company URL")}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition duration-300">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                      Location
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                      <div className="sm:col-span-2">
                        {renderInput("address", "Address")}
                      </div>
                      {renderInput("city", "City")}
                      {renderInput("state", "State")}
                      {renderInput("country", "Country")}
                      {renderInput("pincode", "Pincode")}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default HosterProfile;
