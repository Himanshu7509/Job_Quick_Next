"use client";
import React, { useEffect, useState, useTransition } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import Sidebar from "@/components/jobHoster/common/sidebar/Sidebar";
import { postJob, getCategory } from "@/components/utils/hosterApi/HosterApi";

const PostJob = () => {
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState([]);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
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
    skills: [],
  });
  const router = useRouter();
  const isEditMode = true;

  useEffect(() => {
    startTransition(() => {
      const createdBy = Cookies.get("userId");
      if (createdBy) {
        setFormData((prev) => ({ ...prev, createdBy }));
      }
    });
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
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
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again later.");
      }
    };

    startTransition(() => {
      fetchCategories();
    });
  }, []);

  // Prevent form submission on Enter key
  const preventDefaultSubmit = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  // Validate form fields
  const validateForm = () => {
    const errors = {};
    
    // Step 1 Validation (Company Information)
    if (step === 1) {
      if (!formData.companyName) errors.companyName = "Company Name is required";
      if (!formData.fullName) errors.fullName = "Provider Name is required";
      if (!formData.companyEmail) errors.companyEmail = "Company Email is required";
      if (!formData.phoneNo) errors.phoneNo = "Phone Number is required";
      if (!formData.companyDescription) errors.companyDescription = "Company Description is required";
    }

    // Step 2 Validation (Job Details)
    if (step === 2) {
      if (!formData.title) errors.title = "Job Title is required";
      if (!formData.noOfOpening) errors.noOfOpening = "Number of Openings is required";
      if (!formData.categoryTitle) errors.categoryTitle = "Category is required";
      if (!formData.subcategories.length) errors.subcategory = "Subcategory is required";
      if (!formData.jobType) errors.jobType = "Job Type is required";
      if (!formData.location) errors.location = "Location is required";
    }

    // Step 3 Validation (Requirements)
    if (step === 3) {
      if (!formData.minPackage) errors.minPackage = "Minimum Package is required";
      if (!formData.maxPackage) errors.maxPackage = "Maximum Package is required";
      if (!formData.interviewType) errors.interviewType = "Interview Type is required";
      if (!formData.experience) errors.experience = "Experience Level is required";
      if (!formData.workType) errors.workType = "Work Type is required";
      if (!formData.minEducation) errors.minEducation = "Minimum Education is required";
      if (formData.skills.length === 0) errors.skills = "At least one skill is required";
      if (!formData.jobDescription) errors.jobDescription = "Job Description is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const addSkill = (skill) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !formData.skills.includes(trimmedSkill)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, trimmedSkill],
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (name === "skills") {
      setSkillInput(value);
    } else if (name === "categoryTitle") {
      // Find the selected category
      const selectedCategory = categories.find((cat) => cat.title === value);
      const subcategories = selectedCategory?.subcategories || [];

      setAvailableSubcategories(subcategories);
      setError(
        subcategories.length === 0
          ? "No subcategories available for this category"
          : null
      );

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
    if ((e.key === ",") && skillInput.trim()) {
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

  // Modified handleNext to include validation
  const handleNext = () => {
    if (validateForm()) {
      setStep((prev) => prev + 1);
      setValidationErrors({}); // Clear validation errors when moving to next step
    }
  };

  // Modified handlePrevious to reset errors
  const handlePrevious = () => {
    setStep((prev) => prev - 1);
    setValidationErrors({});
  };

  // Modified handleSubmit to include validation
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset previous errors
    setError(null);
    
    // Validate all steps
    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    const authToken = Cookies.get("authToken");

    if (!authToken) {
      setError("Authentication error. Please log in again.");
      return;
    }

    try {
      const response = await postJob(formData);
      console.log("Job posted successfully:", response);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error posting job:", error);
      setError(
        error.response?.data?.message || "Failed to post job. Please try again."
      );
    }
  };

  // Reusable input field renderer with validation
  const renderInput = (id, label, type = "text") => (
    <div>
      <label
        className="block text-gray-600 font-medium mb-2 text-sm"
        htmlFor={id}
      >
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        value={formData[id]}
        onChange={handleChange}
        onKeyDown={preventDefaultSubmit}
        className={`w-full px-4 py-2 border ${
          validationErrors[id] 
            ? 'border-red-500 bg-red-50' 
            : 'border-gray-200 bg-gray-50'
        } rounded-lg focus:outline-none focus:ring-2 ${
          validationErrors[id] 
            ? 'focus:ring-red-500' 
            : 'focus:ring-teal-500'
        } transition-shadow duration-200`}
      />
      {validationErrors[id] && (
        <p className="mt-1 text-xs text-red-500">{validationErrors[id]}</p>
      )}
    </div>
  );

  // Reusable select field renderer with validation
  const renderSelect = (id, label, options) => (
    <div>
      <label
        className="block text-gray-600 font-medium mb-2 text-sm"
        htmlFor={id}
      >
        {label}
      </label>
      <select
        id={id}
        name={id}
        value={formData[id]}
        onChange={handleChange}
        onKeyDown={preventDefaultSubmit}
        className={`mt-1 block w-full border ${
          validationErrors[id] 
            ? 'border-red-500 bg-red-50' 
            : 'border-gray-300'
        } rounded-md shadow-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {validationErrors[id] && (
        <p className="mt-1 text-xs text-red-500">{validationErrors[id]}</p>
      )}
    </div>
  );

  // Reusable textarea renderer with validation
  const renderTextarea = (id, label, rows = 4) => (
    <div>
      <label
        className="block text-gray-600 font-medium mb-2 text-sm"
        htmlFor={id}
      >
        {label}
      </label>
      <textarea
        id={id}
        name={id}
        value={formData[id]}
        onChange={handleChange}
        onKeyDown={preventDefaultSubmit}
        rows={rows}
        className={`w-full px-4 py-2 border ${
          validationErrors[id] 
            ? 'border-red-500 bg-red-50' 
            : 'border-gray-200 bg-gray-50'
        } rounded-lg focus:outline-none focus:ring-2 ${
          validationErrors[id] 
            ? 'focus:ring-red-500' 
            : 'focus:ring-teal-500'
        } transition-shadow duration-200`}
      ></textarea>
      {validationErrors[id] && (
        <p className="mt-1 text-xs text-red-500">{validationErrors[id]}</p>
      )}
    </div>
  );

  // Render skills input with validation
  const renderSkillsInput = () => (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Required Skills
      </label>
      <div>
        <input
          type="text"
          name="skills"
          value={skillInput}
          onChange={handleChange}
          onKeyDown={handleSkillInputKeyDown}
          onKeyPress={preventDefaultSubmit}
          className={`mt-1 block w-full border ${
            validationErrors.skills 
              ? 'border-red-500 bg-red-50' 
              : 'border-gray-300'
          } rounded-md shadow-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
          placeholder="Type a skill and comma to add it"
        />
        <div className="mt-2 text-xs text-gray-500">
          Press Enter or comma (,) to add a skill
        </div>
        {validationErrors.skills && (
          <p className="mt-1 text-xs text-red-500">{validationErrors.skills}</p>
        )}
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
  );

  // Render Company Form (Step 1)
  const renderCompanyForm = () => (
    <>
      <div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {renderInput("companyName", "Company Name")}
        {renderInput("fullName", "Provider Name")}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {renderInput("companyEmail", "Company Email", "email")}
        {renderInput("phoneNo", "Phone Number")}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {renderInput("companyURL", "Company URL", "url")}
        {renderInput("numOfEmployee", "Number of Employees", "number")}
      </div>

      {renderTextarea("companyDescription", "Company Description", 5)}

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

  // Render Job Details Form (Step 2)
  const renderJobDetailsForm = () => (
    <>
      <div className="flex-1">{renderInput("title", "Job Title")}</div>

      <div className="flex-1">
        {renderInput("noOfOpening", "Number of Openings", "number")}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            name="categoryTitle"
            value={formData.categoryTitle}
            onChange={handleChange}
            onKeyDown={preventDefaultSubmit}
            className={`mt-1 block w-full border ${
              validationErrors.categoryTitle 
                ? 'border-red-500 bg-red-50' 
                : 'border-gray-300'
            } rounded-md shadow-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
          >
            <option value="">Select Category</option>
            {categories.length === 0 ? (
              <option disabled>No Categories Found</option>
            ) : (
              categories.map((category, index) => (
                <option key={index} value={category.title}>
                  {category.title}
                </option>
              ))
            )}
          </select>
          {validationErrors.categoryTitle && (
            <p className="mt-1 text-xs text-red-500">{validationErrors.categoryTitle}</p>
          )}
        </div>

        {formData.categoryTitle && availableSubcategories.length > 0 && (
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Subcategory
            </label>
            <select
              name="subcategory"
              value={formData.subcategories[0] || ""}
              onChange={handleChange}
              onKeyDown={preventDefaultSubmit}
              className={`mt-1 block w-full border ${
                validationErrors.subcategory 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-300'
              } rounded-md shadow-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
            >
              <option value="">Select Subcategory</option>
              {availableSubcategories.map((subcat, index) => (
                <option key={index} value={subcat.title}>
                  {subcat.title}
                </option>
              ))}
            </select>
            {validationErrors.subcategory && (
              <p className="mt-1 text-xs text-red-500">{validationErrors.subcategory}</p>
            )}
          </div>
        )}
      </div>

      <div className="flex-1">
        {renderSelect("jobType", "Job Type", ["Full-Time", "Part-Time"])}
      </div>

      <div className="flex-1">{renderInput("location", "Location")}</div>

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

  // Render Requirements Form (Step 3)
  const renderRequirementsForm = () => (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {renderInput("minPackage", "Minimum Package")}
        {renderInput("maxPackage", "Maximum Package")}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {renderSelect("interviewType", "Interview Type", [
          "Virtual",
          "In-Person",
          "Phone",
        ])}
        {renderSelect("experience", "Experience Level", [
          "Fresher",
          "1-2 years",
          "2-5 years",
          "5+ years",
        ])}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {renderSelect("workType", "Work Type", ["Remote", "On-Site", "Hybrid"])}
        {renderInput("minEducation", "Minimum Education")}
      </div>

      {renderSkillsInput()}
      {renderTextarea("jobDescription", "Job Description", 5)}

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

      {isPending ? (
        <>
          <Loader />
        </>
      ) : (
        <>
          {/* Main Content */}
          <div className="lg:ml-80 flex-1 flex justify-center items-center xl:ml-[22%] min-h-screen p-4 sm:p-6 md:p-8">
            <div className="w-full md:max-w-[85%] xl:max-w-[900px] rounded-xl shadow-lg p-4 sm:p-6 md:p-8 lg:p-10">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 text-center bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent">
                Post Job
              </h2>

              {/* Form Content */}
              <div className="max-w-full mx-auto">
                <form
                  className="space-y-6 sm:space-y-8"
                  onSubmit={handleSubmit}
                >
                  {step === 1 && renderCompanyForm()}
                  {step === 2 && renderJobDetailsForm()}
                  {step === 3 && renderRequirementsForm()}
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PostJob;