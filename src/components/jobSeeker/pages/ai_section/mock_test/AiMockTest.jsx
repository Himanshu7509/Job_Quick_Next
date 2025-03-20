"use client"

import Footer from '@/components/jobSeeker/common/footer/Footer'
import Header from '@/components/jobSeeker/common/header/Header'
import { getCategoriesApi } from '@/components/utils/userApi/UserApi'
import React, { useState, useEffect } from 'react'
import { postMockApi } from '@/components/utils/userApi/UserApi'
import { useRouter } from 'next/navigation'

const AiMockTest = () => {
  const [data, setData] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedSubCategory, setSelectedSubCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [questions, setQuestions] = useState({
    category: '',
    subcategory: ''
  })
  const [mcq, setmcq] = useState(null);
  
  const router = useRouter();
  const getData = async() => {
    try {
      setLoading(true)
      const response = await getCategoriesApi()
      console.log(response.data)
      setData(response.data)
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  const handleCategorySelect = (category) => {
    console.log("Selected category:", category)
    setSelectedCategory(category)
    setSelectedSubCategory(null)
    // Update questions state with category
    setQuestions(prev => ({
      ...prev,
      category: category.title
    }))
  }

  const handleSubCategorySelect = (subCategory) => {
    console.log("Selected subcategory:", subCategory)
    setSelectedSubCategory(subCategory)
    // Update questions state with subcategory
    setQuestions(prev => ({
      ...prev,
      subcategory: subCategory
    }))
  }
  const startTest = async () => {
    console.log("startTest called");
  
    if (!selectedCategory || !selectedSubCategory) {
      alert("Please select both a category and subcategory");
      return;
    }
  
    const testdata = {
      category: selectedCategory.title,
      subcategory: selectedSubCategory
    };
  
    console.log("Starting test with:", testdata);
  
    try {
      setLoading(true);
      const res = await postMockApi(testdata);
      console.log("Mock test response:", res.data);
      
      let questionsData;
      
      // Check if the response contains questions
      if (res.data && res.data.questions) {
        questionsData = res.data.questions;
      } else if (res.data && Array.isArray(res.data)) {
        questionsData = res.data;
      } else {
        throw new Error("Invalid response format");
      }
      
      // Sample data for testing if the API doesn't return actual questions
      if (!questionsData || !Array.isArray(questionsData) || questionsData.length === 0) {
        console.warn("No questions returned from API, using sample data for testing");
        questionsData = [
          {
            question: "What is the capital of France?",
            options: ["London", "Berlin", "Paris", "Madrid"],
            answer: "Paris"
          },
          {
            question: "Which planet is known as the Red Planet?",
            options: ["Earth", "Mars", "Jupiter", "Venus"],
            answer: "Mars"
          },
          {
            question: "What is 2 + 2?",
            options: ["3", "4", "5", "6"],
            answer: "4"
          }
        ];
      }
      
      // Convert the questions array to a JSON string and encode it properly for URL
      const questionsStr = encodeURIComponent(JSON.stringify(questionsData));
      console.log("Navigating to:", `/questions/${questionsStr}`);
      
      // Navigate to the test page
      router.push(`/questions/${questionsStr}`);
      
    } catch (error) {
      console.error("Error starting mock test:", error);
      alert("Failed to start test. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const mockTest = async (testdata) => {
    try {
      const res = await postMockApi(testdata);
      console.log("Mock test response:", res.data.questions);
      setmcq(res.data.questions)
      return res;
    } catch (error) {
      console.error("Error in mockTest:", error);
      throw error;
    }
  }

  return (
    <>
      <Header/>
      
      {/* Hero Section */}
      <div className="bg-teal-800 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <h1 className="text-4xl font-bold mb-3">Master Your Exams with AI</h1>
            <p className="text-lg mb-5">
              Practice smarter with our AI-powered mock tests. Get instant feedback 
              and detailed analysis to improve your performance.
            </p>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center mr-2">
                  <div className="w-3 h-3 rounded-full bg-teal-800"></div>
                </div>
                <span>Personalized Learning</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center mr-2">
                  <div className="w-3 h-3 rounded-full bg-teal-800"></div>
                </div>
                <span>Real-time Feedback</span>
              </div>
            </div>
          </div>
          <div className="md:w-1/3">
            <svg className="w-40 h-40 md:w-64 md:h-64 text-teal-300" viewBox="0 0 100 100">
              <path fill="currentColor" d="M70,20 C85,30 85,50 70,60 L60,70 C50,85 30,85 20,70 L10,60 C-5,50 -5,30 10,20 L20,10 C30,-5 50,-5 60,10 L70,20 Z"></path>
              <circle cx="30" cy="35" r="10" fill="currentColor" fillOpacity="0.6"></circle>
              <circle cx="60" cy="65" r="10" fill="currentColor" fillOpacity="0.6"></circle>
            </svg>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Panel - Test Start */}
            <div className="md:w-1/2 bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-6">
                <div className="text-teal-600 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold">Start Your Test</h2>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Select Category</label>
                <div className="relative">
                  <select 
                    className="appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow focus:outline-none focus:ring-2 focus:ring-teal-500"
                    onChange={(e) => {
                      const categoryId = e.target.value;
                      if (!categoryId) {
                        setSelectedCategory(null);
                        return;
                      }
                      const category = data.find(c => c._id === categoryId);
                      if (category) {
                        handleCategorySelect(category);
                      }
                    }}
                    value={selectedCategory?._id || ""}
                  >
                    <option key="default-category" value="">Choose a category</option>
                    {data.map(category => (
                      <option key={category._id} value={category._id}>
                        {category.title}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              {selectedCategory && (
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">Select Subcategory</label>
                  <div className="relative">
                    <select 
                      className="appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow focus:outline-none focus:ring-2 focus:ring-teal-500"
                      onChange={(e) => {
                        const subcategoryTitle = e.target.value;
                        if (!subcategoryTitle) {
                          setSelectedSubCategory(null);
                          return;
                        }
                        handleSubCategorySelect(subcategoryTitle);
                      }}
                      value={selectedSubCategory || ""}
                    >
                      <option key="default-subcategory" value="">Choose a subcategory</option>
                      {selectedCategory.subcategories.map((subcategory, index) => (
                        <option key={index} value={subcategory.title}>
                          {subcategory.title}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              )}
              
              <button
                className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                  selectedCategory && selectedSubCategory 
                    ? 'bg-teal-600 hover:bg-teal-700' 
                    : 'bg-gray-400'
                }`}
                onClick={startTest}
              >
                Start Test
              </button>
            </div>
            
            {/* Right Panel - Features */}
            <div className="md:w-1/2 flex flex-col gap-4">
              {/* AI-Powered Learning Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-2">
                  <div className="text-teal-600 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold">AI-Powered Learning</h3>
                </div>
                <p className="text-gray-600 ml-9">Adaptive questions that match your skill level</p>
              </div>
              
              {/* Focused Practice Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-2">
                  <div className="text-teal-600 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold">Focused Practice</h3>
                </div>
                <p className="text-gray-600 ml-9">Targeted preparation for specific exam topics</p>
              </div>
              
              {/* Track Progress Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-2">
                  <div className="text-teal-600 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold">Track Progress</h3>
                </div>
                <p className="text-gray-600 ml-9">Monitor your improvement with detailed analytics</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Why Choose Section */}
      <div className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our AI Mock Tests?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Smart Learning */}
            <div className="text-center">
              <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-teal-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Smart Learning</h3>
              <p className="text-gray-600">Our AI adapts questions to your skill level</p>
            </div>
            
            {/* Focused Practice */}
            <div className="text-center">
              <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-teal-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Focused Practice</h3>
              <p className="text-gray-600">Target specific areas for improvement</p>
            </div>
            
            {/* Track Progress */}
            <div className="text-center">
              <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-teal-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Track Progress</h3>
              <p className="text-gray-600">Monitor your improvement over time</p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer/>
    </>
  )
}

export default AiMockTest