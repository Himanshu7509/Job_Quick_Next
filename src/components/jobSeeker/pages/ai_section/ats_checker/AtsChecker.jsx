"use client";
import React, { useEffect, useState, useTransition } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import Header from "@/components/jobSeeker/common/header/Header";
import Footer from "@/components/jobSeeker/common/footer/Footer";
import {
  ArrowUpCircle,
  FileText,
  CheckCircle,
  Star,
  Clock,
  AlertCircle,
  ChevronRight,
  Target,
  Award,
} from "lucide-react";
import Cookies from 'js-cookie'; 
import Loader from "@/components/Loader";

const AtsChecker = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
 const [isPending, startTransition] = useTransition();
 

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
    },
  });

  useEffect(() => {
      startTransition(() => {
        handleUpload();
      });
    }, []);

  const handleUpload = async () => {
    if (!file) return alert("Please upload a resume!");
  
    const formData = new FormData();
    formData.append("resume", file);
  
    try {
      // Get the token from cookies instead of localStorage
      const authToken = Cookies.get("authToken");
      console.log("Token found:", authToken);
  
      if (!authToken) {
        alert("You are not logged in. Please login first.");
        
        return;
      }
  
      const response = await axios.post(
        "https://next-jobquick.onrender.com/api/v1/ats/check",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`,
          }
        }
      );
  
      let feedbackArray = response.data.feedback;
      if (typeof feedbackArray === "string") {
        feedbackArray = feedbackArray
          .split("\n")
          .map((item) => item.trim())
          .filter((item) => item.length > 0);
      } else if (!Array.isArray(feedbackArray)) {
        feedbackArray = [feedbackArray];
      }
  
      setResult({
        ...response.data,
        feedback: feedbackArray,
      });
    } catch (error) {
      alert("Error analyzing resume!");
      console.error(error?.response?.data || error.message);
    }
  
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Optimize Your <span className="text-teal-600">Resume</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get instant feedback on your resume's ATS compatibility and expert
              suggestions to improve your chances of landing your dream job.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-teal-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-teal-100 rounded-xl">
                  <Target className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">AI Analysis</h3>
                  <p className="text-sm text-gray-500">Advanced resume scanning</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-teal-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-teal-100 rounded-xl">
                  <Award className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Expert Insights</h3>
                  <p className="text-sm text-gray-500">Professional recommendations</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-teal-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-teal-100 rounded-xl">
                  <Clock className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Quick Results</h3>
                  <p className="text-sm text-gray-500">Instant feedback</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <section className="bg-white rounded-3xl p-8 shadow-xl border border-teal-100 hover:shadow-2xl transition-all duration-300 h-[600px] flex flex-col">
              <div className="bg-gradient-to-br from-teal-600 to-teal-700 -mt-12 -mx-8 mb-8 p-6 rounded-t-3xl">
                <h2 className="text-2xl font-bold text-white text-center">
                  Upload Your Resume
                </h2>
              </div>
              <div
                {...getRootProps()}
                className="flex-1 mt-4 border-3 border-dashed border-teal-200 rounded-2xl p-8 text-center hover:border-teal-400 transition-all duration-300 cursor-pointer bg-gradient-to-b from-white to-teal-50/30 flex flex-col items-center justify-center"
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center space-y-4">
                  {file ? (
                    <>
                      <div className="p-4 bg-teal-100 rounded-full animate-pulse">
                        <FileText className="w-12 h-12 text-teal-600" />
                      </div>
                      <p className="text-lg font-medium text-gray-700">
                        {file.name}
                      </p>
                      <div className="flex items-center text-teal-600">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        <p className="text-sm">File ready for analysis</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-4 bg-teal-100 rounded-full">
                        <ArrowUpCircle className="w-12 h-12 text-teal-600 animate-bounce" />
                      </div>
                      <p className="text-lg font-medium text-gray-700">
                        Drop your resume here
                      </p>
                      <div className="flex items-center text-teal-600">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        <p className="text-sm">PDF format, max 5MB</p>
                      </div>
                    </>
                  )}
                  <button className="mt-6 px-8 py-3 bg-teal-600 text-white rounded-xl shadow-lg hover:bg-teal-700 transition-all duration-300 font-medium flex items-center">
                    Select File
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
              <button
                onClick={handleUpload}
                className="mt-6 w-full px-6 py-4 bg-teal-600 text-white rounded-xl shadow-lg hover:bg-teal-700 transition-all duration-300 font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
               
              >
                { (
                  <span className="flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Start Analysis
                  </span>
                )}
              </button>
            </section>

            {/* Results Section */}
            <section className="bg-white rounded-3xl p-8 shadow-xl border border-teal-100 hover:shadow-2xl transition-all duration-300 h-[600px] flex flex-col">
              {result !== null ? (
                <div className="flex flex-col h-full">
                  <div className="bg-gradient-to-br from-teal-600 to-teal-700 -mt-12 -mx-8 p-8 rounded-t-3xl text-center shadow-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)] pointer-events-none"></div>
                    <div className="z-10">
                      <div className="flex items-center justify-center mb-2">
                        <div className="p-2 bg-white/20 rounded-full">
                          <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <p className="text-6xl font-bold text-white mb-1">
                        {result.score}
                      </p>
                      <p className="text-teal-50 font-medium text-lg">
                        {result.score >= 80
                          ? "Outstanding Resume!"
                          : "Room for Improvement"}
                      </p>
                    </div>
                  </div>

                  {result.feedback.length > 0 && (
                    <div className="flex-1 mt-6 overflow-hidden flex flex-col">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <Star className="w-5 h-5 text-teal-600 mr-2" />
                        Key Suggestions
                      </h3>
                      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        <div className="bg-teal-50/50 rounded-lg p-6">
                          <ul className="list-disc pl-6 space-y-3 text-gray-700">
                            {result.feedback.map((suggestion, index) => (
                              <li key={index} className="leading-relaxed">
                                <span dangerouslySetInnerHTML={{
                                  __html: suggestion.replace(/(?:\*\*)(.*?)(?:\*\*)/g, "<strong>$1</strong>")
                                }}></span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="p-4 bg-teal-100 rounded-full mb-4">
                    <Target className="w-12 h-12 text-teal-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Ready for Analysis
                  </h3>
                  <p className="text-gray-600 max-w-md">
                    Upload your resume to receive a detailed analysis and
                    personalized recommendations to improve your chances of success.
                  </p>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AtsChecker;