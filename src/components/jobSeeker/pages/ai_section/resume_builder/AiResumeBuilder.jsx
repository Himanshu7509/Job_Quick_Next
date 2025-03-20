"use client";
import React, { useState } from "react";
import { jsPDF } from "jspdf";

import {
  User,
  BookOpen,
  Briefcase,
  Code,
  ChevronRight,
  ChevronLeft,
  FileDown,
  Star,
  Clock,
  CheckCircle2,
  Trophy,
} from "lucide-react";
import Footer from "@/components/jobSeeker/common/footer/Footer";
import Header from "@/components/jobSeeker/common/header/Header";

const AiResume = () => {
  const [step, setStep] = useState(1);
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
  });

  const [education, setEducation] = useState([]);
  const [workExperience, setWorkExperience] = useState([]);
  const [skills, setSkills] = useState([]);

  const [currentEducation, setCurrentEducation] = useState({
    school: "",
    degree: "",
    major: "",
    graduationYear: "",
  });

  const [currentWork, setCurrentWork] = useState({
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const [currentSkill, setCurrentSkill] = useState("");

  const generatePDF = () => {
    if (!personalInfo.fullName) {
      alert("Please enter your full name before generating the resume.");
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Color Palette
    const colors = {
      primary: [41, 73, 128],
      accent: [52, 152, 219],
      text: {
        dark: [44, 62, 80],
        light: [255, 255, 255],
      },
      background: {
        main: [236, 240, 241],
        section: [248, 249, 250],
      },
    };

    let yPos = 20;

    // Page Background
    const drawPageBackground = () => {
      doc.setFillColor(...colors.background.main);
      doc.rect(0, 0, pageWidth, pageHeight, "F");

      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.1);
      for (let i = 0; i < pageWidth; i += 5) {
        for (let j = 0; j < pageHeight; j += 5) {
          if (Math.random() > 0.9) {
            doc.line(i, j, i + 1, j + 1);
          }
        }
      }
    };

    const drawHeader = () => {
      doc.setFillColor(...colors.primary);
      doc.rect(0, 0, pageWidth, 50, "F");

      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.2);
      doc.line(0, 50, pageWidth, 50);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(...colors.text.light);
      doc.text(personalInfo.fullName.toUpperCase(), pageWidth / 2, 30, {
        align: "center",
      });

      doc.setFontSize(10);
      doc.text(
        `${personalInfo.email || ""} | ${personalInfo.phone || ""} | ${
          personalInfo.location || ""
        }`,
        pageWidth / 2,
        40,
        { align: "center" }
      );

      yPos = 60;
    };

    // Section Titles
    const drawSectionTitle = (title) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(...colors.primary);
      doc.text(title.toUpperCase(), 20, yPos);
      doc.setDrawColor(...colors.primary);
      doc.setLineWidth(0.7);
      doc.line(20, yPos + 3, 120, yPos + 3);
      yPos += 15;
    };

    // Professional Section Renderer
    const drawProfessionalSection = (title, items, formatter) => {
      drawSectionTitle(title);

      items.forEach((item, index) => {
        doc.setFillColor(
          ...(index % 2 === 0 ? colors.background.section : [255, 255, 255])
        );
        doc.rect(20, yPos - 2, pageWidth - 40, 12, "F");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(...colors.text.dark);

        doc.text("•", 22, yPos + 6);
        doc.text(formatter(item), 35, yPos + 6);

        yPos += 12;
      });

      yPos += 10;
    };

    // Skills Section
    const renderSkills = () => {
      drawSectionTitle("Skills");

      const skillsPerLine = 4;
      skills.forEach((skill, index) => {
        if (index % skillsPerLine === 0) {
          yPos += index > 0 ? 12 : 0;
        }

        const xPosition = 20 + (index % skillsPerLine) * 45;

        doc.setFillColor(...colors.accent);
        doc.setTextColor(...colors.text.light);
        doc.roundedRect(xPosition, yPos, 40, 8, 2, 2, "F");

        doc.setFontSize(9);
        doc.text(skill, xPosition + 20, yPos + 6, { align: "center" });
      });

      yPos += 20;
    };

    // Execute PDF Generation
    drawPageBackground();
    drawHeader();

    // Draw Sections
    drawSectionTitle("Professional Summary");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...colors.text.dark);
    doc.text(
      doc.splitTextToSize(
        personalInfo.summary || "No summary provided",
        pageWidth - 40
      ),
      20,
      yPos
    );

    yPos += 30;

    drawProfessionalSection(
      "Education",
      education,
      (edu) =>
        `${edu.school} - ${edu.degree} in ${edu.major} (${edu.graduationYear})`
    );

    drawProfessionalSection(
      "Work Experience",
      workExperience,
      (work) =>
        `${work.company} | ${work.position} (${work.startDate} - ${work.endDate})`
    );

    renderSkills();

    // Footer
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Professional Resume | Generated on ${new Date().toLocaleDateString()}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );

    doc.save(`${personalInfo.fullName}_Professional_Resume.pdf`);
  };

  const addEducation = () => {
    if (
      currentEducation.school ||
      currentEducation.degree ||
      currentEducation.major ||
      currentEducation.graduationYear
    ) {
      setEducation([...education, currentEducation]);
      setCurrentEducation({
        school: "",
        degree: "",
        major: "",
        graduationYear: "",
      });
    } else {
      alert("Please enter at least one education detail.");
    }
  };

  const addWorkExperience = () => {
    if (
      currentWork.company ||
      currentWork.position ||
      currentWork.startDate ||
      currentWork.endDate ||
      currentWork.description
    ) {
      setWorkExperience([...workExperience, currentWork]);
      setCurrentWork({
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
      });
    } else {
      alert("Please enter at least one work experience detail.");
    }
  };

  const addSkill = () => {
    if (currentSkill.trim()) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill("");
    } else {
      alert("Please enter a skill.");
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const renderStepIndicator = () => {
    return (
      <div className="flex justify-center items-center gap-4 mb-12">
        {[1, 2, 3, 4].map((number) => (
          <div
            key={number}
            className={`flex items-center ${
              number !== 4 ? "w-32 sm:w-48" : ""
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                step >= number
                  ? "bg-teal-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {number === 1 && <User className="w-6 h-6" />}
              {number === 2 && <BookOpen className="w-6 h-6" />}
              {number === 3 && <Briefcase className="w-6 h-6" />}
              {number === 4 && <Code className="w-6 h-6" />}
            </div>
            {number !== 4 && (
              <div
                className={`h-1 w-full ${
                  step > number ? "bg-teal-600" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
            <div className="w-full lg:w-1/3 space-y-4 lg:space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-6 space-y-4 lg:space-y-6">
                <div className="flex items-center gap-3 lg:gap-4">
                  <div className="bg-teal-100 p-2 lg:p-3 rounded-xl">
                    <User className="w-6 h-6 lg:w-8 lg:h-8 text-teal-600" />
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-800">
                    Personal Details
                  </h2>
                </div>
                <p className="text-base lg:text-lg text-gray-700 leading-relaxed">
                  Start your professional journey by providing your key details.
                </p>
                <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-4 lg:p-5 rounded-xl border-l-4 border-teal-600">
                  <h3 className="font-semibold text-teal-800 text-base lg:text-lg mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4 lg:w-5 lg:h-5 text-teal-600" />
                    Smart Tips
                  </h3>
                  <ul className="space-y-2 text-gray-800 text-xs lg:text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 mt-1 flex-shrink-0" />
                      Use a professional email address
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 mt-1 flex-shrink-0" />
                      Keep your summary concise and impactful
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 mt-1 flex-shrink-0" />
                      Use your full name as it appears on official documents{" "}
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 mt-1 flex-shrink-0" />
                      Include your current email adress
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-2/3">
              <div className="bg-white rounded-xl shadow-lg p-4 lg:p-8">
                <div className="space-y-4 lg:space-y-6">
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., John Smith"
                      value={personalInfo.fullName}
                      onChange={(e) =>
                        setPersonalInfo({
                          ...personalInfo,
                          fullName: e.target.value,
                        })
                      }
                      className="w-full outline-none p-2 lg:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm lg:text-base"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="e.g., john.smith@example.com"
                      value={personalInfo.email}
                      onChange={(e) =>
                        setPersonalInfo({
                          ...personalInfo,
                          email: e.target.value,
                        })
                      }
                      className="w-full p-2 outline-none lg:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm lg:text-base"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., +1 (555) 123-4567"
                        value={personalInfo.phone}
                        onChange={(e) =>
                          setPersonalInfo({
                            ...personalInfo,
                            phone: e.target.value,
                          })
                        }
                        className="w-full outline-none p-2 lg:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm lg:text-base"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., New York, NY"
                        value={personalInfo.location}
                        onChange={(e) =>
                          setPersonalInfo({
                            ...personalInfo,
                            location: e.target.value,
                          })
                        }
                        className="w-full outline-none p-2 lg:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm lg:text-base"
                      />
                    </div>
                  </div>
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Professional Summary
                    </label>
                    <textarea
                      placeholder="Write a compelling summary of your professional background..."
                      value={personalInfo.summary}
                      onChange={(e) =>
                        setPersonalInfo({
                          ...personalInfo,
                          summary: e.target.value,
                        })
                      }
                      className="w-full outline-none p-2 lg:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 h-24 lg:h-32 text-sm lg:text-base"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
            <div className="w-full lg:w-1/3 space-y-4 lg:space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-6 space-y-4 lg:space-y-6">
                <div className="flex items-center gap-3 lg:gap-4">
                  <div className="bg-teal-100 p-2 lg:p-3 rounded-xl">
                    <User className="w-6 h-6 lg:w-8 lg:h-8 text-teal-600" />
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-800">
                    Education
                  </h2>
                </div>
                <p className="text-base lg:text-lg text-gray-700 leading-relaxed">
                  Add your educational background to showcase your academic
                  achievements.
                </p>
                <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-4 lg:p-5 rounded-xl border-l-4 border-teal-600">
                  <h3 className="font-semibold text-teal-800 text-base lg:text-lg mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4 lg:w-5 lg:h-5 text-teal-600" />
                    Smart Tips
                  </h3>
                  <ul className="space-y-2 text-gray-800 text-xs lg:text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 mt-1 flex-shrink-0" />
                      List your most recent education first
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 mt-1 flex-shrink-0" />
                      Include relevant coursework and achievements
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 mt-1 flex-shrink-0" />
                      Be specific about your degree and major
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-2/3">
              <div className="bg-white rounded-xl shadow-lg p-4 lg:p-8">
                <div className="space-y-4 lg:space-y-6">
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      School
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Harvard University"
                      value={currentEducation.school}
                      onChange={(e) =>
                        setCurrentEducation({
                          ...currentEducation,
                          school: e.target.value,
                        })
                      }
                      className="w-full outline-none p-2 lg:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm lg:text-base"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Degree
                    </label>

                    <input
                      type="text"
                      placeholder="e.g., Bachelor of Science"
                      value={currentEducation.degree}
                      onChange={(e) =>
                        setCurrentEducation({
                          ...currentEducation,
                          degree: e.target.value,
                        })
                      }
                      className="w-full outline-none p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Major
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Computer Science"
                      value={currentEducation.major}
                      onChange={(e) =>
                        setCurrentEducation({
                          ...currentEducation,
                          major: e.target.value,
                        })
                      }
                      className="w-full outline-none p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Graduation Year
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 2024"
                      value={currentEducation.graduationYear}
                      onChange={(e) =>
                        setCurrentEducation({
                          ...currentEducation,
                          graduationYear: e.target.value,
                        })
                      }
                      className="w-full outline-none p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <button
                    onClick={addEducation}
                    className="bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    Add Education
                  </button>

                  {education.length > 0 && (
                    <div className="mt-8">
                      <h3 className="font-bold text-lg mb-4">
                        Added Education:
                      </h3>
                      <div className="space-y-3">
                        {education.map((edu, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 p-4 rounded-lg shadow-sm"
                          >
                            <p className="font-medium">
                              {edu.school} - {edu.degree} in {edu.major}
                            </p>
                            <p className="text-gray-600 text-sm">
                              Graduated: {edu.graduationYear}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
            <div className="w-full lg:w-1/3 space-y-4 lg:space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-6 space-y-4 lg:space-y-6">
                <div className="flex items-center gap-3 lg:gap-4">
                  <div className="bg-teal-100 p-2 lg:p-3 rounded-xl">
                    <User className="w-6 h-6 lg:w-8 lg:h-8 text-teal-600" />
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-800">
                    Work Experience
                  </h2>
                </div>
                <p className="text-base lg:text-lg text-gray-700 leading-relaxed">
                  Highlight your professional experience and achievements.
                </p>
                <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-4 lg:p-5 rounded-xl border-l-4 border-teal-600">
                  <h3 className="font-semibold text-teal-800 text-base lg:text-lg mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4 lg:w-5 lg:h-5 text-teal-600" />
                    Smart Tips
                  </h3>
                  <ul className="space-y-2 text-gray-800 text-xs lg:text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 mt-1 flex-shrink-0" />
                      Use action verbs to describe achievements
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 mt-1 flex-shrink-0" />
                      Include quantifiable results
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 mt-1 flex-shrink-0" />
                      List your most recent experience first
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-2/3">
              <div className="bg-white rounded-xl shadow-lg p-4 lg:p-8">
                <div className="space-y-4 lg:space-y-6">
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Google"
                      value={currentWork.company}
                      onChange={(e) =>
                        setCurrentWork({
                          ...currentWork,
                          company: e.target.value,
                        })
                      }
                      className="w-full outline-none p-2 lg:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm lg:text-base"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Position
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Senior Software Engineer"
                      value={currentWork.position}
                      onChange={(e) =>
                        setCurrentWork({
                          ...currentWork,
                          position: e.target.value,
                        })
                      }
                      className="w-full outline-none p-2 lg:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm lg:text-base"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Jan 2020"
                        value={currentWork.startDate}
                        onChange={(e) =>
                          setCurrentWork({
                            ...currentWork,
                            startDate: e.target.value,
                          })
                        }
                        className="w-full outline-none p-2 lg:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm lg:text-base"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Present"
                        value={currentWork.endDate}
                        onChange={(e) =>
                          setCurrentWork({
                            ...currentWork,
                            endDate: e.target.value,
                          })
                        }
                        className="w-full outline-none p-2 lg:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm lg:text-base"
                      />
                    </div>
                  </div>
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      placeholder="Describe your responsibilities and achievements..."
                      value={currentWork.description}
                      onChange={(e) =>
                        setCurrentWork({
                          ...currentWork,
                          description: e.target.value,
                        })
                      }
                      className="w-full p-2 outline-none lg:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 h-24 lg:h-32 text-sm lg:text-base"
                    />
                  </div>
                  <button
                    onClick={addWorkExperience}
                    className="bg-teal-600 text-white py-2 lg:py-3 px-4 lg:px-6 rounded-lg hover:bg-teal-700 transition-colors text-sm lg:text-base"
                  >
                    Add Work Experience
                  </button>

                  {workExperience.length > 0 && (
                    <div className="mt-6 lg:mt-8">
                      <h3 className="font-bold text-lg mb-3 lg:mb-4">
                        Added Work Experience:
                      </h3>
                      <div className="space-y-4">
                        {workExperience.map((work, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 p-3 lg:p-4 rounded-lg shadow-sm"
                          >
                            <p className="font-medium text-sm lg:text-base">
                              {work.company} - {work.position}
                            </p>
                            <p className="text-gray-600 text-xs lg:text-sm mt-1">
                              {work.startDate} - {work.endDate}
                            </p>
                            <p className="mt-2 text-gray-700 text-sm lg:text-base">
                              {work.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
            <div className="w-full lg:w-1/3 space-y-4 lg:space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-6 space-y-4 lg:space-y-6">
                <div className="flex items-center gap-3 lg:gap-4">
                  <div className="bg-teal-100 p-2 lg:p-3 rounded-xl">
                    <User className="w-6 h-6 lg:w-8 lg:h-8 text-teal-600" />
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-800">
                    Skills
                  </h2>
                </div>
                <p className="text-base lg:text-lg text-gray-700 leading-relaxed">
                  Showcase your professional skills and expertise.
                </p>
                <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-4 lg:p-5 rounded-xl border-l-4 border-teal-600">
                  <h3 className="font-semibold text-teal-800 text-base lg:text-lg mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4 lg:w-5 lg:h-5 text-teal-600" />
                    Smart Tips
                  </h3>
                  <ul className="space-y-2 text-gray-800 text-xs lg:text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 mt-1 flex-shrink-0" />
                      Include both technical and soft skills
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 mt-1 flex-shrink-0" />
                      Be specific about your expertise level
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 mt-1 flex-shrink-0" />
                      Focus on relevant skills for your target role
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-2/3">
              <div className="bg-white rounded-xl shadow-lg p-4 lg:p-8">
                <div className="space-y-4 lg:space-y-6">
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Add Your Skills
                    </label>
                    <div className="flex gap-4">
                      <input
                        type="text"
                        placeholder="e.g., JavaScript"
                        value={currentSkill}
                        onChange={(e) => setCurrentSkill(e.target.value)}
                        className="flex-1 outline-none p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                      />
                      <button
                        onClick={addSkill}
                        className="bg-teal-600 text-white py-2 px-6 rounded-lg hover:bg-teal-700 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {skills.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-bold text-lg mb-4">Your Skills:</h3>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderNavigationButtons = () => {
    return (
      <div className="mt-8 flex justify-end items-center gap-4">
        {step > 1 && (
          <button
            onClick={prevStep}
            className="flex items-center gap-2 bg-white text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-gray-200 shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous Step
          </button>
        )}

        {step < 4 ? (
          <button
            onClick={nextStep}
            className="flex items-center gap-2 bg-teal-600 text-white py-3 px-6 rounded-lg hover:bg-teal-700 transition-all duration-200 shadow-lg"
          >
            Continue
            <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={generatePDF}
            className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-teal-700 text-white py-3 px-6 rounded-lg hover:from-teal-700 hover:to-teal-800 transition-all duration-200 shadow-lg"
          >
            Generate Resume
            <FileDown className="w-5 h-5" />
          </button>
        )}
      </div>
    );
  };

  return (
    <>
    <Header/>
    <div className="min-h-screen bg-gray-50">
     
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12">
          <div className="text-center space-y-6">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
              Create Your Professional Resume
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Build a stunning resume in minutes with our intelligent resume
              builder. Stand out from the crowd and land your dream job.
            </p>
            <div className="flex flex-wrap justify-center gap-6 md:gap-8 mt-6">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="text-sm md:text-base">
                  Professional Templates
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-400" />
                <span className="text-sm md:text-base">Quick & Easy</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-yellow-400" />
                <span className="text-sm md:text-base">ATS-Friendly</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {renderStepIndicator()}
        {renderStepContent()}
        {renderNavigationButtons()}
      </main>

    </div>
    <Footer/>
    </>
  );
};

export default AiResume;