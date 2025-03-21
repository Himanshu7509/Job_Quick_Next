"use client";
import React, { useEffect, useState } from "react";
import { viewappicantAPI } from "@/components/utils/hosterApi/HosterApi";
import {
  User,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Star,
  Phone,
} from "lucide-react";
import Sidebar from "@/components/jobHoster/common/sidebar/Sidebar";

const ViewApplicants = ({ jobId }) => {
  const [applicant, setApplicants] = useState([]);

  const getApplicants = async () => {
    try {
      const response = await viewappicantAPI(jobId);
      const data = response.data.applicants;
      setApplicants(data);
      console.log(data);
      // console.log(applicant);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getApplicants();
  }, [jobId]);

  return (
    <div className="flex">
      <div className="lg:w-1/4 w-0 fixed left-0 top-0 h-screen">
        <Sidebar />
      </div>

      <div className="w-full lg:ml-76 min-h-screen pt-20 py-12 px-2 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-6 ">
          {applicant?.map((item, index) => (
            <div key={index}>
              <div className="bg-gray-50 h-full rounded-lg p-4 lg:p-6 shadow-md hover:shadow-lg transition">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-full">
                      <User className="text-green-600 w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {item.seekerDetails.fullName || "N/A"}
                      </h3>
                    </div>
                  </div>
                  {/* <div>
                                {applicantDetails.shortListed ? (
                                  <span className="px-3 py-1 bg-green-200 text-green-700 rounded-full text-sm font-semibold">
                                    ✅ Shortlisted
                                  </span>
                                ) : (
                                  <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-semibold">
                                    🔄 Under Review
                                  </span>
                                )}
                              </div> */}
                </div>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                  <div className="flex items-center gap-4">
                    <Phone className="w-5 h-5" />
                    <span>{item.seekerDetails.phoneNumber || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <MapPin className="w-5 h-5" />
                    <span>{item.seekerDetails.city || "N/A"}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <GraduationCap className="w-5 h-5" />
                    <span>{item.seekerDetails.eduDegree || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Briefcase className="w-5 h-5" />
                    <span>{item.seekerDetails.expPosition || "N/A"}</span>
                  </div>

                  <div className="col-span-1 sm:col-span-2 flex items-start gap-4 rounded-lg">
                    <Mail className="w-5 h-5 mt-1" />
                    <p className="text-sm text-gray-500">
                      {item.seekerDetails.email || "N/A"}
                    </p>
                  </div>
                  <div className="col-span-1 sm:col-span-2 flex items-start gap-4 pb-4 rounded-lg">
                    <Star className="w-5 h-5 mt-1" />
                    <div>
                      <p className="text-sm mb-4 font-semibold text-gray-600">
                        Skills
                      </p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {item.seekerDetails?.skills?.length > 0 ? (
                          item.seekerDetails?.skills
                            .flatMap((skill) =>
                              skill.split(",").map((s) => s.trim())
                            ) // Splitting and trimming
                            .map((skill, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 text-sm font-medium bg-green-100 text-green-700 rounded-full"
                              >
                                {skill}
                              </span>
                            ))
                        ) : (
                          <span className="text-gray-500">N/A</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    //  onClick={() => handleViewProfile(item.seekerDetails)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewApplicants;
