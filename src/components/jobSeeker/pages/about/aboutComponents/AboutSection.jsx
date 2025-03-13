"use client"
import React from "react";

const AboutSection = () => {
  return (
    <>
      <section className="w-auto h-60 bg-gray-900 text-white flex items-center justify-center">
        <h2 className="text-5xl font-bold">About Us</h2>
      </section>

      <section className="py-12 px-[10%]">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
          <div className="mb-8 lg:mb-0">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              About the Job Comprehensive Description
            </h2>
            <p className="text-gray-600 leading-relaxed">
              At Company Name, we are seeking a Job Title who is passionate
              about industry and eager to contribute their skills to a dynamic,
              fast-paced environment. This role is perfect for individuals who
              thrive on key skills, e.g., problem-solving, creativity,
              collaboration and are looking for an opportunity to grow
              professionally.
            </p>
          </div>
          <div>
            <div className="rounded-lg overflow-hidden shadow-lg w-full">
              <img
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="About Us"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutSection;
