"use client";
import React, { useEffect, useState, useTransition } from "react";
import { viewappicantAPI } from "@/components/utils/hosterApi/HosterApi";
import {
  User,
  MapPin,
  Briefcase,
  GraduationCap,
  Star,
  Phone,
} from "lucide-react";
import Sidebar from "@/components/jobHoster/common/sidebar/Sidebar";
import Link from "next/link";
import Loader from "@/components/Loader";

const ViewApplicants = ({ jobId }) => {
  const [applicants, setApplicants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [shortListedParam, setShortListedParam] = useState(undefined);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [filter, setFilter] = useState("all");
  const APPLICANT_LIMIT = 6;

  const getApplicants = async (page, resetList = false) => {
    try {
      const response = await viewappicantAPI(
        jobId,
        APPLICANT_LIMIT,
        page,
        shortListedParam
      );

      setPagination(response.data.pagination);

      if (resetList) {
        setApplicants(response.data.applicants);
        console.log(response.data.applicants);
      } else {
        setApplicants((prevApplicants) => {
          const newApplicants = [
            ...prevApplicants,
            ...response.data.applicants,
          ];
          const uniqueApplicants = Array.from(
            new Map(
              newApplicants.map((applicant) => [
                applicant.seekerApplicant,
                applicant,
              ])
            ).values()
          );
          return uniqueApplicants;
        });
      }
    } catch (error) {
      console.error("Error fetching applicants:", error);
    }
  };

  useEffect(() => {
    startTransition(() => {
      getApplicants(1, true);
    });
  }, [jobId, shortListedParam]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);

    if (newFilter === "shortlisted") {
      setShortListedParam("true");
    } else if (newFilter === "all") {
      setShortListedParam(undefined);
    }
  };

  const handleLoadMore = () => {
    if (pagination.hasNextPage) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      getApplicants(nextPage, false);
    }
  };

  return (
    <div className="flex">
      <div className="lg:w-1/4 w-0 fixed left-0 top-0 h-screen">
        <Sidebar />
      </div>
      {isPending ? (
        <Loader />
      ) : (
        <>
          <div className="w-full lg:ml-76 min-h-screen pt-6 py-12 px-2 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-4 lg:p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between pb-5 border-b border-teal-800">
                <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                  <Briefcase className="w-7 h-7 text-teal-600" /> Job
                  Applications
                </h2>
              </div>
              <div className="flex flex-wrap justify-center sm:justify-start gap-4 pt-4">
                <button
                  onClick={() => handleFilterChange("all")}
                  className={`px-4 md:px-6 py-2 text-md md:text-lg font-semibold rounded-lg transition-all shadow-sm ${
                    filter === "all"
                      ? "bg-teal-600 text-white shadow-md"
                      : "text-gray-600 bg-gray-200"
                  }`}
                >
                  All Applicants
                </button>
                <button
                  onClick={() => handleFilterChange("shortlisted")}
                  className={`px-4 md:px-6 py-2 text-md md:text-lg font-semibold rounded-lg transition-all shadow-sm ${
                    filter === "shortlisted"
                      ? "bg-teal-600 text-white shadow-md"
                      : "text-gray-600 bg-gray-200"
                  }`}
                >
                  Shortlisted
                </button>
              </div>
              <div className="mt-6">
                {applicants.length === 0 ? (
                  <div className="text-center text-gray-600 text-lg font-semibold py-8">
                    {filter === "shortlisted"
                      ? "No shortlisted candidates found"
                      : "No applicants available"}
                  </div>
                ) : (
                  <>
                    <div className="grid md:grid-cols-2 gap-6">
                      {applicants.map((item, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 h-full rounded-lg p-4 lg:p-6 shadow-md hover:shadow-lg transition"
                        >
                          <div className="flex flex-col items-start gap-4">
                            <div className="flex items-center gap-4">
                              <div className="p-3 bg-teal-100 rounded-full">
                                <User className="text-teal-600 w-9 h-9" />
                              </div>
                              <div>
                                <div>
                                  <h3 className="text-xl mb-4 font-bold text-gray-800">
                                    {item.seekerDetails.fullName || "N/A"}
                                  </h3>
                                </div>
                                <div>
                                  {item.shortListed ? (
                                    <span className="px-3 py-1 bg-green-200 text-green-700 rounded-full text-sm font-semibold">
                                      ✅ Shortlisted
                                    </span>
                                  ) : (
                                    <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-semibold">
                                      🔄 Under Review
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                            <div className="flex items-center gap-4">
                              <Phone className="w-5 h-5" />
                              <span>
                                {item.seekerDetails.phoneNumber || "N/A"}
                              </span>
                            </div>
                            <div className="flex items-center gap-4">
                              <MapPin className="w-5 h-5" />
                              <span>{item.seekerDetails.city || "N/A"}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <GraduationCap className="w-5 h-5" />
                              <span>
                                {item.seekerDetails.eduDegree || "N/A"}
                              </span>
                            </div>
                            <div className="flex items-center gap-4">
                              <Briefcase className="w-5 h-5" />
                              <span>
                                {item.seekerDetails.expPosition || "N/A"}
                              </span>
                            </div>
                            <div className="col-span-1 sm:col-span-2 flex items-start gap-4 pb-4 rounded-lg">
                              <Star className="w-5 h-5 mt-1" />
                              <div>
                                <p className="text-sm mb-4 font-semibold text-gray-600">
                                  Project URL
                                </p>
                                <Link
                                  href={item.seekerDetails.projectUrl}
                                  className="text-blue-600 hover:underline"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {item.seekerDetails.projectUrl || "N/A"}
                                </Link>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4">
                            <Link
                              href={`/my-jobs/view-applicant/applicant-details/${item.seekerApplicant}`}
                            >
                              <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition">
                                View Profile
                              </button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>

                    {pagination.hasNextPage && (
                      <div className="flex justify-center mt-8">
                        <button
                          onClick={handleLoadMore}
                          className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition flex items-center gap-2 disabled:opacity-50"
                        >
                          {"Load More"}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ViewApplicants;
