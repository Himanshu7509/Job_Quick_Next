"use client"
import React from "react";
import PropTypes from 'prop-types';

const JobFilters = ({
    filters,
    onFilterChange,
    onApplyFilters,
    categories,
    selectedCategory,
    selectedSubcategory,
    handleCategoryChange,
    handleSubcategoryChange,
}) => {
   
    return (
        <div className="w-full rounded-lg p-4 shadow-lg">
            <div className="mb-6">
                <label className="block text-xl font-bold text-gray-800 mb-2">
                    Search Jobs
                </label>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Job title or company"
                        className="w-full p-2 border-2 border-gray-200 rounded-lg text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
                        value={filters.search || ""}
                        onChange={(e) => onFilterChange("search", e.target.value)}
                    />
                </div>
            </div>

            <div className="mb-6">
    <label className="block text-lg font-medium text-gray-800 mb-2">
        Categories
    </label>
    <select
        value={selectedCategory ? selectedCategory._id : ""} // Use _id instead of title
        onChange={(e) => handleCategoryChange(e.target.value)}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900"
    >
        <option value="">All Categories</option>
        {categories &&
            categories.map((category) => (
                <option key={category._id} value={category._id}>
                    {category.title}
                </option>
            ))}
    </select>
</div>

            {selectedCategory &&
                selectedCategory.subcategories &&
                selectedCategory.subcategories.length > 0 && (
                    <div className="mb-6">
                        <label className="text-lg font-medium text-gray-800 mb-2">
                            Subcategories
                        </label>
                        <select
                            value={selectedSubcategory || ""}
                            onChange={(e) => handleSubcategoryChange(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                        >
                            <option value="">All Subcategories</option>
                            {selectedCategory.subcategories.map((subcategory, index) => (
                                <option key={index} value={subcategory.title}>
                                    {subcategory.title}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

            <div className="mb-6">
                <label className="text-lg font-medium text-gray-800 mb-2">
                    Experience Level
                </label>
                <select
                    value={filters.experience || ""}
                    onChange={(e) => onFilterChange("experience", e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                >
                    <option value="">All Experience Levels</option>
                    <option value="Fresher">Fresher</option>
                    <option value="1-2 years">1-2 years</option>
                    <option value="2-5 years">2-5 years</option>
                    <option value="5+ years">5+ years</option>
                </select>
            </div>

            <div className="mb-6">
                <label className="text-lg font-medium text-gray-800 mb-2">
                    Job Type
                </label>
                <div className="mt-1 space-y-2">
                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name="jobType"
                            value=""
                            checked={!filters.jobType}
                            onChange={(e) => onFilterChange("jobType", "")}
                            className="form-radio text-teal-500"
                        />
                        <span>All Types</span>
                    </label>
                    {["Full-Time", "Part-Time"].map((type) => (
                        <label key={type} className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="jobType"
                                value={type}
                                checked={filters.jobType === type}
                                onChange={(e) => onFilterChange("jobType", e.target.value)}
                                className="form-radio text-teal-500"
                            />
                            <span>{type}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="mb-6">
                <label className="text-lg font-medium text-gray-800 mb-2">
                    Work Type
                </label>
                <div className="mt-1 space-y-2">
                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name="workType"
                            value=""
                            checked={!filters.workType}
                            onChange={(e) => onFilterChange("workType", "")}
                            className="form-radio text-teal-500"
                        />
                        <span>All Work Types</span>
                    </label>
                    {["Remote", "On-Site", "Hybrid"].map((type) => (
                        <label key={type} className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="workType"
                                value={type}
                                checked={filters.workType === type}
                                onChange={(e) => onFilterChange("workType", e.target.value)}
                                className="form-radio text-teal-500"
                            />
                            <span>{type}</span>
                        </label>
                    ))}
                </div>
            </div>

            <button
                onClick={onApplyFilters}
                className="w-full h-10 bg-teal-600 text-white rounded-md font-medium hover:bg-teal-700 transition-colors disabled:bg-teal-300 disabled:cursor-not-allowed"
            >
                {"Apply Filters"}
            </button>
        </div>
    );
};

JobFilters.propTypes = {
    filters: PropTypes.object.isRequired,
    onFilterChange: PropTypes.func.isRequired,
    onApplyFilters: PropTypes.func.isRequired,
    categories: PropTypes.array.isRequired,
    selectedCategory: PropTypes.object, // Can be null
    selectedSubcategory: PropTypes.string, // Can be empty string
    handleCategoryChange: PropTypes.func.isRequired,
    handleSubcategoryChange: PropTypes.func.isRequired,
};

export default JobFilters;