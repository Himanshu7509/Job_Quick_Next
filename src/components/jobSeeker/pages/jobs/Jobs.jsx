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
  });


  // Function to fetch jobs based on filters
  const fetchJobs = useCallback(async () => {
   
    setError(null);
    try {
      const response = await JobsAPi(filters);
      setJobs(response.data);
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
      setError("Failed to load categories."); // Or a separate error state for categories
    }
  }, []);

  useEffect(() => {
    fetchJobs();
    fetchCategories();
  }, [fetchJobs, fetchCategories]);

  // Handler for filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [filterName]: value }));
  };

  // Handler for category change
  const handleCategoryChange = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    setSelectedCategory(category || null);
    setSelectedSubcategory(""); // Reset subcategory when category changes
  };

  // Handler for subcategory change
  const handleSubcategoryChange = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setFilters((prevFilters) => ({ ...prevFilters, subcategory: subcategory })); // Update filters when subcategory changes
  };

  // Handler for applying filters
  const handleApplyFilters = () => {
    console.log("Applying filters:", filters);
    fetchJobs(); // Re-fetch jobs with the current filters
  };


  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
    <Header/>
    <div className="flex flex-col md:flex-row">
      {/* Job Filters */}
      <div className="w-full md:w-80 p-4">
        <JobFilters
          filters={filters}
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
          jobs.map((job) => <JobCard key={job._id} jobs={job} />)
        ) : (
          <div>No jobs found matching your criteria.</div>
        )}
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default Jobs;