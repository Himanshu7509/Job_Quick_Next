"use client";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/jobHoster/common/sidebar/Sidebar";
import { postJob, getCategory } from "@/components/utils/hosterApi/HosterApi";

const PostJob = () => {
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [skillInput, setSkillInput] = useState("");
  const [availableSubcategories, setAvailableSubcategories] = useState([]);
  const [formData, setFormData] = useState({
    createdBy: "",
    categoryTitle: "",
    subcategories: [],
    companyName: "",
    companyEmail: "",
    companyURL: "",
    fullName: "",
    phoneNo: "",
    numOfEmployee: "",
    title: "",
    jobType: "",
    location: "",
    workType: "",
    minEducation: "",
    experience: "",
    interviewType: "",
    companyDescription: "",
    jobDescription: "",
    noOfOpening: "",
    minPackage: "",
    maxPackage: "",
    skills: []
  });
  const router = useRouter();

  // Load auth token and user ID once when component mounts
  useEffect(() => {
    // Get user ID from cookies
    const createdBy = Cookies.get("userId");
    if (createdBy) {
      setFormData((prev) => ({ ...prev, createdBy }));
    }
  }, []);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await getCategory();
        
        let processedCategories = [];
        if (response.data?.categories) {
          processedCategories = response.data.categories;
        } else if (Array.isArray(response.data)) {
          processedCategories = response.data;
        } else if (response.data?.data) {
          processedCategories = response.data.data;
        } else if (typeof response.data === "object") {
          processedCategories = Object.values(response.data);
        }
        
        setCategories(processedCategories);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const addSkill = (skill) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !formData.skills.includes(trimmedSkill)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, trimmedSkill],
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

    if (name === "skills") {
      setSkillInput(value);
    } else if (name === "categoryTitle") {
      // Find the selected category
      const selectedCategory = categories.find((cat) => cat.title === value);
      const subcategories = selectedCategory?.subcategories || [];
      
      setAvailableSubcategories(subcategories);
      setError(subcategories.length === 0 ? "No subcategories available for this category" : null);

      // Reset form data for category-related fields
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        subcategories: [], // Reset subcategory selection
      }));
    } else if (name === "subcategory") {
      // Handle subcategory selection - store as array
      setFormData((prev) => ({
        ...prev,
        subcategories: [value], // Store as array with single value
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSkillInputKeyDown = (e) => {
    if ((e.key === " " || e.key === ",") && skillInput.trim()) {
      e.preventDefault(); // Prevent form submission
      addSkill(skillInput);
      setSkillInput(""); // Clear input after adding
    }
  };

  const handleRemoveSkill = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const authToken = Cookies.get("authToken") || localStorage.getItem("token");
    
    if (!authToken) {
      setError("Authentication error. Please log in again.");
      setIsLoading(false);
      return;
    }
    
    try {
      // Send the request using the postJob API function
      const response = await postJob(formData);
      
      console.log("Job posted successfully:", response);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error posting job:", error);
      setError(error.response?.data?.message || "Failed to post job. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => setStep((prev) => prev + 1);
  const handlePrevious = () => setStep((prev) => prev - 1);

  const renderCompanyForm = () => (
    <>
      <div>{error && <p className="mt-1 text-sm text-teal-600">{error}</p>}</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Company Name</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            placeholder="Enter company name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Provider Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            placeholder="Enter your full name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Company Email</label>
          <input
            type="email"
            name="companyEmail"
            value={formData.companyEmail}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            placeholder="Enter company email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="text"
            name="phoneNo"
            value={formData.phoneNo}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            placeholder="Enter phone number"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Company URL</label>
          <input
            type="url"
            name="companyURL"
            value={formData.companyURL}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            placeholder="Enter company website"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Number of Employees</label>
          <input
            type="number"
            name="numOfEmployee"
            value={formData.numOfEmployee}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            placeholder="Enter employee count"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Company Description</label>
        <textarea
          name="companyDescription"
          value={formData.companyDescription}
          onChange={handleInputChange}
          rows="5"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
          placeholder="Describe your company"
        ></textarea>
      </div>

      <div className="w-full flex justify-end">
        <button
          type="button"
          onClick={handleNext}
          className="w-1/3 bg-teal-500 text-white py-3 px-4 rounded-md hover:opacity-90 font-semibold"
        >
          Next
        </button>
      </div>
    </>
  );

  const renderJobDetailsForm = () => (
    <>
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700">Job Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
          placeholder="Enter job title"
        />
      </div>

      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700">Number of Openings</label>
        <input
          type="number"
          name="noOfOpening"
          value={formData.noOfOpening}
          onChange={handleInputChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
          placeholder="Enter number of positions"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            name="categoryTitle"
            value={formData.categoryTitle}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
          >
            <option value="">Select Category</option>
            {isLoading ? (
              <option disabled>Loading...</option>
            ) : categories.length === 0 ? (
              <option disabled>No Categories Found</option> 
            ) : (
              categories.map((category, index) => (
                <option key={index} value={category.title}>
                  {category.title}
                </option>
              ))
            )}
          </select>
        </div>

        {formData.categoryTitle && availableSubcategories.length > 0 && (
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Subcategory</label>
            <select
              name="subcategory"
              value={formData.subcategories[0] || ""}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            >
              <option value="">Select Subcategory</option>
              {availableSubcategories.map((subcat, index) => (
                <option key={index} value={subcat.title}>
                  {subcat.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700">Job Type</label>
        <select
          name="jobType"
          value={formData.jobType}
          onChange={handleInputChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
        >
          <option value="">Select Job Type</option>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
        </select>
      </div>

      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700">Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
          placeholder="Enter job location"
        />
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={handlePrevious}
          className="w-1/3 bg-gradient-to-r from-teal-700 to-teal-700 text-white py-3 px-4 rounded-md hover:opacity-90 font-semibold"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="w-1/2 bg-gradient-to-r from-teal-500 to-teal-500 text-white py-3 px-4 rounded-md hover:opacity-90 font-semibold"
        >
          Next
        </button>
      </div>
    </>
  );

  const renderRequirementsForm = () => (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Minimum Package</label>
          <input
            type="text"
            name="minPackage"
            value={formData.minPackage}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            placeholder="Enter minimum package eg: 60,000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Maximum Package</label>
          <input
            type="text"
            name="maxPackage"
            value={formData.maxPackage}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            placeholder="Enter maximum package eg: 100,000"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Interview Type</label>
          <select
            name="interviewType"
            value={formData.interviewType}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
          >
            <option value="">Select Interview Type</option>
            <option value="Virtual">Virtual</option>
            <option value="In-Person">In-Person</option>
            <option value="Phone">Phone</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Experience Level</label>
          <select
            name="experience"
            value={formData.experience}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
          >
            <option value="">Select experience level</option>
            <option value="Entry-Level">Entry-Level</option>
            <option value="1-2 years">1-2 years</option>
            <option value="2-5 years">2-5 years</option>
            <option value="5+ years">5+ years</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Work Type</label>
          <select
            name="workType"
            value={formData.workType}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
          >
            <option value="">Select Work Type</option>
            <option value="Remote">Remote</option>
            <option value="On-Site">On-Site</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Minimum Education</label>
          <input
            type="text"
            name="minEducation"
            value={formData.minEducation}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            placeholder="Enter minimum education required"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Required Skills</label>
        <div>
          <input
            type="text"
            name="skills"
            value={skillInput}
            onChange={handleInputChange}
            onKeyDown={handleSkillInputKeyDown}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            placeholder="Type a skill and press Enter or comma to add"
          />
          <div className="mt-2 text-xs text-gray-500">
            Press Enter or comma (,) to add a skill
          </div>
        </div>
        {formData.skills.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(index)}
                  className="ml-1 inline-flex items-center p-0.5 rounded-full text-teal-400 hover:bg-teal-200 hover:text-teal-900"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Job Description</label>
        <textarea
          name="jobDescription"
          value={formData.jobDescription}
          onChange={handleInputChange}
          rows="5"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
          placeholder="Describe the job responsibilities and requirements"
        ></textarea>
      </div>

      <div className="flex sm:flex-row justify-between gap-4 mt-4">
        <button
          type="button"
          onClick={handlePrevious}
          className="w-full sm:w-1/3 bg-teal-700 text-white py-3 px-4 rounded-md hover:opacity-90 font-semibold"
        >
          Previous
        </button>
        <button
          type="submit"
          className="w-full sm:w-1/2 bg-teal-500 text-white py-3 px-4 rounded-md hover:opacity-90 font-semibold"
        >
          Submit
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="lg:w-1/4 w-0 fixed left-0 top-0 h-screen">
        <Sidebar />
      </div>
    
      {/* Main Content */}
      <div className="lg:ml-80 flex-1 flex justify-center items-center xl:ml-[22%] min-h-screen p-4 sm:p-6 md:p-8">
        <div className="w-full md:max-w-[85%] xl:max-w-[900px] rounded-xl shadow-lg p-4 sm:p-6 md:p-8 lg:p-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 text-center bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent">
            Post Job
          </h2>
    
          {/* Loading Overlay */}
          {isLoading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          )}
    
          {/* Form Content */}
          <div className="max-w-full mx-auto">
            <form className="space-y-6 sm:space-y-8" onSubmit={handleSubmit}>
              {step === 1 && renderCompanyForm()}
              {step === 2 && renderJobDetailsForm()}
              {step === 3 && renderRequirementsForm()}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJob;