"use client"
import { jobdetailsApi } from '@/components/utils/userApi/UserApi'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BriefcaseBusiness,
  Clock,
  Wallet,
  MapPin,
  Calendar,
  Mail,
  Globe,
  PhoneCall,
  Users,
  Building,
} from "lucide-react";
import Header from '@/components/jobSeeker/common/header/Header';
import Footer from '@/components/jobSeeker/common/footer/Footer';

const JobDetails = ({ jobId }) => {
  const[data, setdata] = useState([]);

const fetchJob = async() =>{

try{
  const response = await jobdetailsApi(jobId);
  const data = response.data;
  console.log(data);
  setdata(data);
} catch(err){
  console.error(err);
}


}

useEffect(()=> {
  fetchJob();
},[])

const KeyMetric = ({ icon: Icon, label, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <div className="flex items-center gap-3">
      <Icon className="w-5 h-5 text-teal-600" />
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);





  return (
   <>
   <Header/>
      <div className="min-h-[80vh] bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl sm:max-w-3xl lg:max-w-5xl mx-auto">
          {/* Header Section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 relative">
            <div className="p-6 sm:p-8">
              {/* Apply Button Positioned at Top Right */}
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
                {/* <button
                  onClick={handleApplyNow}
                  disabled={hasApplied || isLoading}
                  className={`py-2 px-4 rounded-lg font-semibold shadow-sm transition-colors duration-200 
                  ${
                    hasApplied
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : isLoading
                      ? "bg-gray-300 cursor-wait text-white"
                      : "bg-teal-600 text-white hover:bg-teal-700"
                  }`}
                >
                  {hasApplied ? "Applied" : isLoading ? "Processing..." : "Apply Now"}
                </button> */}
              </div>

              <div className="flex flex-col sm:flex-row items-start gap-6">
                <img
                  src="https://www.pngkey.com/png/full/191-1911374_company-building-png-office-building-png.png"
                  alt={data?.companyName}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover bg-gray-100"
                />
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {data?.title}
                  </h1>
                  <p className="text-lg sm:text-xl text-teal-600 font-semibold mb-4">
                    {data?.companyName}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                    <KeyMetric
                      icon={Wallet}
                      label="Salary Range"
                      value={
                        data?.minPackage
                          ? `${data.minPackage} - ${data.maxPackage}`
                          : "Not disclosed"
                      }
                    />
                    <KeyMetric
                      icon={MapPin}
                      label="Location"
                      value={data?.location || "Remote"}
                    />
                    <KeyMetric
                      icon={Clock}
                      label="data Type"
                      value={data?.dataType || "Not specified"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* data Description */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                  Job Description
                </h2>
                <p className="text-gray-600 whitespace-pre-line">
                  {data?.jobDescription}
                </p>
              </div>

              {/* Requirements */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                  Requirements
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-md sm:text-lg font-medium text-gray-900 mb-2">
                      Education
                    </h3>
                    <p className="text-gray-600">
                      {data?.minEducation || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-md sm:text-lg font-medium text-gray-900 mb-2">
                      Experience
                    </h3>
                    <p className="text-gray-600">
                      {data?.experience || "Not specified"}
                    </p>
                  </div>
                  {data?.skills && (
                    <div>
                      <h3 className="text-md sm:text-lg font-medium text-gray-900 mb-2">
                        Required Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {data.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-teal-50 text-teal-600 px-3 py-1 rounded text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar with Company Info */}
            <div className="space-y-6">
              {/* Company Info */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Company Details
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-teal-600" />
                    <div>
                      <p className="text-sm text-gray-500">
                        Number of employees
                      </p>
                      <p className="font-medium text-gray-900">
                        {data?.numOfEmployee || "Not specified"} employees
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-teal-600" />
                    <div>
                      <p className="text-sm text-gray-500">Website</p>
                      <a
                        href={data?.companyURL}
                        className="font-medium text-blue-700 hover:text-blue-700 hover:underline"
                      >
                        {data?.companyURL || "Not available"}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-teal-600" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">
                        {data?.companyEmail || "Not available"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <PhoneCall className="w-5 h-5 text-teal-600" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900">
                        {data?.phoneNo || "Not available"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* data Details */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Additional Details
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-teal-600" />
                    <div>
                      <p className="text-sm text-gray-500">
                        Application Date
                      </p>
                      <p className="font-medium text-gray-900">
                      {data?.createdAt ? new Date(data.createdAt).toLocaleDateString("en-GB") : "Not specified"}

                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-teal-600" />
                    <div>
                      <p className="text-sm text-gray-500">
                        Number of Openings
                      </p>
                      <p className="font-medium text-gray-900">
                        {data?.noOfOpening || "Not specified"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <BriefcaseBusiness className="w-5 h-5 text-teal-600" />
                    <div>
                      <p className="text-sm text-gray-500">Work Type</p>
                      <p className="font-medium text-gray-900">
                        {data?.workType || "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    <Footer/>

   </>
  )
}

export default JobDetails