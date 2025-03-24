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
  const isEditMode = true; // Always in edit mode for form input

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

    setError(null);

    const authToken = Cookies.get("authToken");

    if (!authToken) {
      setError("Authentication error. Please log in again.");
      return;
    }

    try {
      // Send the request using the postJob API function
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

  const handleNext = () => setStep((prev) => prev + 1);
  const handlePrevious = () => setStep((prev) => prev - 1);

  // Reusable input field renderer
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
        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50 transition-shadow duration-200"
      />
    </div>
  );

  // Reusable select field renderer
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
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );

  // Reusable textarea renderer
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
        rows={rows}
        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50 transition-shadow duration-200"
      ></textarea>
    </div>
  );

  // Render skills input and display
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
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
          placeholder="Type a skill and comma to add it"
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
  );

  const renderCompanyForm = () => (
    <>
      <div>
        {error && <p className="mt-1 text-sm text-teal-600">{error}</p>}
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
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
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
