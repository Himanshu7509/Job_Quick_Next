"use client"
import React from "react";
import { User, Upload, Search, Briefcase } from "lucide-react"; 

const AboutWork = () => {
  return (
    <section className="py-12 px-[10%] text-center">
      <h2 className="text-3xl font-bold mb-4">How it works</h2>
      <div className="text-gray-600">
        <p className="text-lg mb-10">
          With our platform, you can easily navigate through each step of the
          job application process.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            title: "Create Account",
            description:
              "Nunc sed a nisi purus. Nibh dis faucibus proin lacus.",
            icon: <User className="w-8 h-8 text-teal-500 mx-auto" />,
          },
          {
            title: "Upload Resume",
            description: "Felis eu ultrices a sed massa. Commodo fringilla.",
            icon: <Upload className="w-8 h-8 text-teal-500 mx-auto" />,
          },
          {
            title: "Find Jobs",
            description:
              "Commodo fringilla sed tempor risus laoreet ultricies ipsum.",
            icon: <Search className="w-8 h-8 text-teal-500 mx-auto" />,
          },
          {
            title: "Apply Job",
            description: "Sem quis viverra viverra odio mauris nunc.",
            icon: <Briefcase className="w-8 h-8 text-teal-500 mx-auto" />,
          },
        ].map((item, index) => (
          <div key={index} className="p-6 bg-white rounded-lg shadow-lg">
            <div className="mb-4">{item.icon}</div>{" "}
            {/* Render the Lucide icon */}
            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
            <p className="text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutWork;
