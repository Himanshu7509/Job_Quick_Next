'use client';

import { useState } from "react";


export default function SalaryHikeCalc() {
  const [company, setCompany] = useState("");
  const [designation, setDesignation] = useState("");
  const [previousCTC, setPreviousCTC] = useState("");
  const [experience, setExperience] = useState("");
  const [expectedSalary, setExpectedSalary] = useState(null);

  const calculateSalary = () => {
    if (company && designation && previousCTC && experience) {
      const ctc = parseFloat(previousCTC);
      const exp = parseInt(experience);
      const multiplier = exp > 5 ? 2 : exp > 2 ? 2 : 1.3;
      const calculatedSalary = (ctc * multiplier).toFixed(2);
      setExpectedSalary(`₹${calculatedSalary}`);
    } else {
      alert("Please fill out all fields to calculate salary.");
    }
  };

  return (
    <>

      {/* Hero Section */}
      <div className="w-full h-40 sm:h-60 bg-gray-900 text-white flex justify-center items-center px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-center">
          Salary Calculator
        </h1>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-8 lg:mb-12">
          {/* Left Column */}
          <div className="order-2 lg:order-1">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
              Calculate Your Potential Salary With Ease
            </h2>
            <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
              Enter your details below to estimate your expected salary based on your
              previous CTC and work experience. Stay informed and prepared!
            </p>

            {expectedSalary && (
              <div className="p-4 sm:p-6 bg-gradient-to-r from-green-400 via-teal-500 to-blue-600 rounded-lg shadow-xl text-center">
                <h3 className="text-xl sm:text-2xl font-semibold text-white">
                  Your Expected Salary
                </h3>
                <p className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-bold text-white">
                  {expectedSalary}
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Input Form */}
          <div className="order-1 lg:order-2 bg-gray-50 rounded-lg shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-lg sm:text-xl font-semibold mb-4">Salary Details</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  placeholder="Enter company name"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Designation
                </label>
                <input
                  type="text"
                  placeholder="Enter designation"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Previous CTC (₹)
                </label>
                <input
                  type="number"
                  placeholder="Enter previous annual CTC"
                  value={previousCTC}
                  onChange={(e) => setPreviousCTC(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience (in years)
                </label>
                <input
                  type="number"
                  placeholder="Enter years of experience"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-sm sm:text-base"
                />
              </div>

              <button
                type="button"
                onClick={calculateSalary}
                className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 text-sm sm:text-base"
              >
                Calculate Expected Salary
              </button>
            </form>
          </div>
        </div>

        {/* Motivational Quote */}
        <p className="text-center text-gray-600 mt-4 sm:mt-6 text-xs sm:text-sm italic px-4">
          "Success comes to those who are too busy to be looking for it." – Henry David Thoreau
        </p>
      </div>

    </>
  );
}