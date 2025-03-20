"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { postHosterProfileApi, patchHosterProfileApi, getHosterProfileApi } from "@/components/utils/hosterApi/HosterApi";

const HosterProfile = () => {
  const [formData, setFormData] = useState({
    fullName: "", phoneNumber: "", gender: "", address: "", city: "", 
    state: "", country: "", pincode: "", comapanytURL: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [profileId, setProfileId] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("");

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
              fullName: profileData.fullName || "", phoneNumber: profileData.phoneNumber || "",
               gender: profileData.gender || "",
              address: profileData.address || "", city: profileData.city || "",
              state: profileData.state || "", country: profileData.country || "",
              pincode: profileData.pincode || "", companyURL: profileData.companyURL || "" 
              
            });
  
            setProfileId(profileData._id);
            setIsEditing(true);
            console.log("Profile found, ID:", profileData._id);
          }
        } catch (error) {
          if (error.response && error.response.status === 404) {
            console.log("No profile found for this user, showing empty form");
            setIsEditMode(true); // If no profile, start in edit mode to create one
          } else {
            console.error("Error fetching profile:", error);
          }
        }
      };
  
      fetchProfileData();
    }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

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
          setStatusMessage(isEditing ? "Profile updated successfully!" : "Profile created successfully!");
          setStatusType("success");
          setIsEditMode(false); // Exit edit mode after successful save
        }
      } catch (error) {
        console.error("Server Error:", error);
        setStatusMessage("Error saving profile. Please try again.");
        setStatusType("error");
      }
    };

  const toggleEditMode = () => {
    if (isEditMode) {
      // If currently in edit mode, submit the form
      document.getElementById("profileForm").requestSubmit();
    } else {
      // Enter edit mode
      setIsEditMode(true);
    }
  };

  const renderInput = (id, label, type = "text") => (
    <div>
      <label className="block text-gray-600 font-medium mb-2 text-sm" htmlFor={id}>{label}</label>
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
      <label className="block text-gray-600 font-medium mb-2 text-sm" htmlFor={id}>{label}</label>
      {isEditMode ? (
        <select 
          id={id} 
          name={id} 
          value={formData[id]} 
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50 transition-shadow duration-200"
        >
          <option value="" disabled>Select {label}</option>
          {options.map(option => (
            <option key={option} value={option}>{option}</option>
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
      <div className="bg-gray-100 min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Enhanced Profile Header */}
        <div className="relative mb-8">
          {/* Header Background */}
          <div className="h-60 bg-teal-600 rounded-t-2xl"></div>

          {/* Profile Content */}
          <div className="relative bg-white rounded-2xl shadow-xl mx-4 -mt-24 p-6">
            <div className="flex flex-col items-center">
              {/* Profile Image with Online Indicator */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-white flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="absolute bottom-2 right-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  <div className="absolute inset-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-ping"></div>
                </div>
              </div>

              {/* User Info */}
              <div className="mt-4 text-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  {formData.fullName || "Profile"}
                </h1>
                <p className="text-gray-600">{formData.phoneNumber || "Add your contact info"}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-6">
                <button 
                  onClick={toggleEditMode}
                  className={`flex cursor-pointer items-center gap-2 px-6 py-2 rounded-lg transition-colors duration-200 ${
                    isEditMode 
                      ? "bg-indigo-50 text-blue-600 hover:bg-indigo-100" 
                      : "bg-indigo-50 text-blue-600 hover:bg-indigo-100"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    {isEditMode ? (
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    ) : (
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    )}
                  </svg>
                  <span>{isEditMode ? "Save Profile" : "Edit Profile"}</span>
                </button>
                <button
                  className="flex items-center cursor-pointer gap-2 px-6 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200"
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
              </div>
            </div>
          </div>
        </div>

        {statusMessage && (
          <div className={`mb-6 p-4 rounded-xl shadow-md ${statusType === "success" ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"}`}>
            {statusMessage}
          </div>
        )}

        {/* Main Form */}
        <form id="profileForm" onSubmit={handleSubmit}>
          {/* Personal Information Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Personal Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderInput("fullName", "Full Name")}
              {renderInput("phoneNumber", "Phone Number")}
              {renderSelect("gender", "Gender", ["Male", "Female", "Other"])}
              {renderInput("companyURL", "Company URL")}
            </div>
          </div>

          {/* Address Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Location</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">{renderInput("address", "Address")}</div>
              {renderInput("city", "City")}
              {renderInput("state", "State")}
              {renderInput("country", "Country")}
              {renderInput("pincode", "Pincode")}
            </div>
          </div>

          

          {/* Hidden submit button for form submission */}
          <button type="submit" className="hidden"></button>
        </form>
      </div>
    </div>
    </>
  )
}

export default HosterProfile