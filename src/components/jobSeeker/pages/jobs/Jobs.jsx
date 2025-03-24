"use client";
import React, { useEffect, useState, useCallback, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { JobsAPi, getCategoriesApi } from "@/components/utils/userApi/UserApi";
import JobCard from "@/components/jobSeeker/pages/jobs/job_components/JobCard";
import JobFilters from "@/components/jobSeeker/pages/jobs/job_components/JobFilters";
import Loader from '@/components/Loader';
import Footer from "../../common/footer/Footer";
import Header from "../../common/header/Header";

const Jobs = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  // Get search query and category from URL if available
  const initialSearchQuery = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "";

  const [filters, setFilters] = useState({
    search: initialSearchQuery,
    experience: "",
    jobType: "",
    workType: "",
    category: initialCategory,
    subcategory: "",
  });

  const [pendingFilters, setPendingFilters] = useState({
    search: initialSearchQuery,
    experience: "",
    jobType: "",
    workType: "",
    category: initialCategory,
    subcategory: "",
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const fetchJobs = useCallback(async () => {
    setError(null);
    try {
      const response = await JobsAPi(filters);
      setJobs(response.data.jobs);
      console.log("Fetched jobs:", response.data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Failed to load jobs.");

      if (initialCategory) {
        router.push("/categories");
      }
    }
  }, [filters, router, initialCategory]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await getCategoriesApi();
      setCategories(response.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories.");
    }
  }, []);

  useEffect(() => {
    // Use startTransition to mark the data fetching as a non-urgent update
    startTransition(() => {
      fetchJobs();
      fetchCategories();
    });
  }, [fetchJobs, fetchCategories]);

  useEffect(() => {
    const searchQuery = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";

    setPendingFilters((prev) => ({
      ...prev,
      search: searchQuery,
      category: category,
    }));
    setFilters((prev) => ({
      ...prev,
      search: searchQuery,
      category: category,
    }));
  }, [searchParams]);

  const handleFilterChange = (filterName, value) => {
    setPendingFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }));
    console.log("Filter Changed:", filterName, value);
  };

  const handleCategoryChange = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    setSelectedCategory(category || null);
    setSelectedSubcategory("");

    setPendingFilters((prevFilters) => ({
      ...prevFilters,
      category: category ? category.title : "",
      subcategory: "",
    }));

    console.log(
      "Category Changed:",
      categoryId,
      category ? category.title : ""
    );
  };

  const handleSubcategoryChange = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setPendingFilters((prevFilters) => ({
      ...prevFilters,
      subcategory: subcategory,
    }));
    console.log("Subcategory Changed:", subcategory);
  };

  const handleApplyFilters = () => {
    // Use startTransition to mark the filter application as a non-urgent update
    startTransition(() => {
      setFilters(pendingFilters);
      console.log("Applying filters:", pendingFilters);
      fetchJobs();
    });
  };

  const toggleFilterVisibility = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  if (error) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center p-10">Error: {error}</div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="flex flex-col md:flex-row">
        {/* Filter Toggle Button (Mobile/Tablet) */}
        <button
          className="md:hidden bg-teal-600 text-white p-2 rounded-md mb-4"
          onClick={toggleFilterVisibility}
        >
          {isFilterOpen ? "Close Filters" : "Open Filters"}
        </button>

        {/* Job Filters */}
        <div
          className={`w-full md:w-80 p-4 ${
            isFilterOpen ? "" : "hidden md:block"
          }`}
        >
          <JobFilters
            filters={pendingFilters}
            onFilterChange={handleFilterChange}
            onApplyFilters={handleApplyFilters}
            categories={categories}
            selectedCategory={selectedCategory}
            selectedSubcategory={selectedSubcategory}
            handleCategoryChange={handleCategoryChange}
            handleSubcategoryChange={handleSubcategoryChange}
          />
        </div>

        {/* Job Listings */}
        <div className="flex-1 p-4">
          {isPending ? (
            <Loader /> // Show loader only when transition is pending
          ) : jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {jobs.map((job) => (
                <JobCard key={job._id} jobs={job} />
              ))}
            </div>
          ) : (
            <div>No jobs found matching your criteria.</div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Jobs;