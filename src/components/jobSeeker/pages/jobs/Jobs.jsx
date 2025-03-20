"use client";
import React, { useEffect, useState, useCallback } from "react";
import { JobsAPi, getCategoriesApi } from "@/components/utils/userApi/UserApi";
import JobCard from "@/components/jobSeeker/pages/jobs/job_components/JobCard";
import JobFilters from "@/components/jobSeeker/pages/jobs/job_components/JobFilters";
import Footer from "../../common/footer/Footer";
import Header from "../../common/header/Header";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    experience: "",
    jobType: "",
    workType: "",
    category: "",
    subcategory: "",
  });

  // Add a new state for pending filters
  const [pendingFilters, setPendingFilters] = useState({
    search: "",
    experience: "",
    jobType: "",
    workType: "",
    category: "",
    subcategory: "",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false); // State for filter toggle

  const fetchJobs = useCallback(async () => {
    setError(null);
    try {
      const response = await JobsAPi(filters); // Use the actual filters (not pendingFilters)
      setJobs(response.data.jobs);
      console.log("Fetched jobs:", response.data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Failed to load jobs.");
    }
  }, [filters]);

  // Function to fetch categories
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
    fetchJobs();
    fetchCategories();
  }, [fetchJobs, fetchCategories]);

  // Handler for filter changes
  const handleFilterChange = (filterName, value) => {
    setPendingFilters((prevFilters) => ({ ...prevFilters, [filterName]: value }));
    console.log("Filter Changed:", filterName, value);
  };

  // Handler for category change
  const handleCategoryChange = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    setSelectedCategory(category || null);
    setSelectedSubcategory(""); // Reset subcategory when category changes

    // Update pendingFilters instead of filters
    setPendingFilters((prevFilters) => ({
      ...prevFilters,
      category: category ? category.title : "",
      subcategory: "", // Clear subcategory filter when category changes
    }));

    console.log(
      "Category Changed:",
      categoryId,
      category ? category.title : ""
    );
  };

  // Handler for subcategory change
  const handleSubcategoryChange = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setPendingFilters((prevFilters) => ({ ...prevFilters, subcategory: subcategory }));
    console.log("Subcategory Changed:", subcategory);
  };

  // Handler for applying filters
  const handleApplyFilters = () => {
    setFilters(pendingFilters); // Update actual filters with pending filters
    console.log("Applying filters:", pendingFilters);
    fetchJobs(); // Re-fetch jobs with the current filters
  };

  const toggleFilterVisibility = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  if (error) {
    return <div>Error: {error}</div>;
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
            filters={pendingFilters}  // Use pendingFilters instead of filters
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
          {jobs.length > 0 ? (
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