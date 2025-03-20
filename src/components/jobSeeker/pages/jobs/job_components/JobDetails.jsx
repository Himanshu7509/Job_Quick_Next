"use client"
import { jobdetailsApi } from '@/components/utils/userApi/UserApi'
import React, { useEffect, useState } from 'react';
import Header from '@/components/jobSeeker/common/header/Header';
import Footer from '@/components/jobSeeker/common/footer/Footer';
import Link from 'next/link';
import Loader from "../../../../../app/loading"

const JobDetails = ({ jobId }) => {
  const[data, setdata] = useState([]);
  const [skills, setSkills] = useState([]);
  const[category, setcategory] = useState([]);
  const[subcategory, setsubcategory] = useState([]);
  const [loading, setLoading] = useState(true); // Loader state

const fetchJob = async() =>{

try{
  const response = await jobdetailsApi(jobId);
  const data = response.data;

  console.log(data);
  setdata(data);
  setSkills(data.skills);
  setcategory(data.category.title);
  setsubcategory(data.subcategories);
} catch(err){
  console.error(err);
}finally {
  setLoading(false); 
}

}

useEffect(()=> {
  fetchJob();
},[]);

  return (
   <>
   <Header/>
   {loading && <Loader />}
   <div className='min-h-screen py-8'>
   {!loading && (
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
                    className=" bg-teal-700 text-white cursor-pointer px-8 py-3 rounded-xl font-semibold shadow-lg"
                  >Apply Now
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
                    <p className="font-semibold text-gray-900 mt-1">{data.fullName}</p>
                  </div>
                  <div className="bg-gray-100 rounded-xl p-4">
                    <p className="text-gray-600 text-sm">Phone Number</p>
                    <p className="font-semibold text-gray-900 mt-1">{data.phoneNo}</p>
                  </div>
                  <div className="bg-gray-100 rounded-xl p-4">
                    <p className="text-gray-600 text-sm">Company Size</p>
                    <p className="font-semibold text-gray-900 mt-1">{data.numOfEmployee}</p>
                  </div>
                  <div className="bg-gray-100 rounded-xl p-4">
                    <p className="text-gray-600 text-sm">Company Email</p>
                    <p className="font-semibold text-gray-900 mt-1">{data.companyEmail}</p>
                  </div>
                  <div className="bg-gray-100 rounded-xl p-4">
                    <p className="text-gray-600 text-sm">Company URL</p>
                    <p className="font-semibold text-gray-900 mt-1">{data.companyURL}</p>
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
                    <p className="font-semibold text-gray-900 mt-1">{data.jobType}</p>
                  </div>
                  <div className="bg-gray-100 rounded-xl p-4">
                    <p className="text-gray-600 text-sm">Work Type</p>
                    <p className="font-semibold text-gray-900 mt-1">{data.workType}</p>
                  </div>
                  <div className="bg-gray-100 rounded-xl p-4">
                    <p className="text-gray-600 text-sm">Interview Type</p>
                    <p className="font-semibold text-gray-900 mt-1">{data.interviewType}</p>
                  </div>
                  <div className="bg-gray-100 rounded-xl p-4">
                    <p className="text-gray-600 text-sm">Category</p>
                    <p className="font-semibold text-gray-900 mt-1">{category}</p>
                  </div>
                  <div className="bg-gray-100 rounded-xl p-4">
                    <p className="text-gray-600 text-sm">Sub-Category</p>
                    <p className="font-semibold text-gray-900 mt-1">
                    {subcategory.map((subcategories, index) => (
                  <span
                    key={index}>
                    {subcategories}
                  </span>
                ))}
                    </p>
                  </div>
                  <div className="bg-gray-100 rounded-xl p-4">
                    <p className="text-gray-600 text-sm">Location</p>
                    <p className="font-semibold text-gray-900 mt-1">{data.location}</p>
                  </div>
                  <div className="bg-gray-100 rounded-xl p-4">
                    <p className="text-gray-600 text-sm">Min Education</p>
                    <p className="font-semibold text-gray-900 mt-1">{data.minEducation}</p>
                  </div>
                  <div className="bg-gray-100 rounded-xl p-4">
                    <p className="text-gray-600 text-sm">Experience</p>
                    <p className="font-semibold text-gray-900 mt-1">{data.experience}</p>
                  </div>
                  <div className="bg-gray-100 rounded-xl p-4">
                    <p className="text-gray-600 text-sm">Openings</p>
                    <p className="font-semibold text-gray-900 mt-1">{data.noOfOpening}</p>
                  </div>
                  <div className="bg-gray-100 rounded-xl p-4">
                    <p className="text-gray-600 text-sm">Min Package</p>
                    <p className="font-semibold text-gray-900 mt-1">{data.minPackage}</p>
                  </div>
                  <div className="bg-gray-100 rounded-xl p-4">
                    <p className="text-gray-600 text-sm">Max Package</p>
                    <p className="font-semibold text-gray-900 mt-1">{data.maxPackage}</p>
                  </div>
                  <div className="bg-gray-100 rounded-xl p-4">
                    <p className="text-gray-600 text-sm">Posted Date</p>
                    <p className="font-semibold text-gray-900 mt-1">{new Date(data.dateCreated).toLocaleDateString()}</p>
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
    )}
   </div>
 

    <Footer/>

   </>
  )
}

export default JobDetails