"use client"
import React from "react";
import About1 from '@/components/assets/about2.avif'
import About2 from '@/components/assets/about3.avif'
import About3 from '@/components/assets/about4.avif'
import About4 from '@/components/assets/about6.avif'

const AboutBestSec = () => {
  return (
    <section className="py-12 px-6 sm:px-[5%] lg:px-[10%] bg-gradient-to-r from-gray-100 to-gray-50 flex flex-col lg:flex-row items-center">
      {/* Left Section - Image Grid */}
      <div className="grid grid-cols-2 gap-4 w-full lg:w-1/2">
        {[About1, About2, About3, About4].map(
          (img, index) => (
            
            <div key={index} className="rounded-xl overflow-hidden shadow-lg">
              
              <img
                src={img}
                className="w-full h-32 sm:h-40 md:h-48 object-cover"
                alt="Company culture"
              />
            </div>
          )
        )}
      </div>

      {/* Right Section - Text and Features */}
      <div className="w-full lg:w-1/2 mt-8 lg:mt-0 lg:ml-12 text-center lg:text-left">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-4 sm:mb-6 leading-tight">
          We’re Only{" "}
          <span className="text-teal-500">Working With The Best</span>
        </h2>
        <p className="text-gray-600 mb-4 sm:mb-6 text-lg leading-relaxed">
          We collaborate with top professionals to bring you the best job
          opportunities and career growth. Explore new possibilities and shape
          your future with confidence.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {[
            "Quality Job",
            "Resume Builder",
            "Top Companies",
            "Top Talents",
          ].map((feature, index) => (
            <div key={index} className="flex items-center group">
              <span className="bg-teal-100 text-teal-500 p-3 rounded-full shadow-md group-hover:bg-teal-500 group-hover:text-white transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </span>
              <span className="ml-4 font-medium text-gray-800 text-lg group-hover:text-teal-600 transition-all duration-300">
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutBestSec;
