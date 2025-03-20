"use client";

import React, { useEffect, useState } from 'react';
import TestQuestions from '@/components/jobSeeker/pages/ai_section/mock_test/TestQuestions';
import Header from '@/components/jobSeeker/common/header/Header';
import Footer from '@/components/jobSeeker/common/footer/Footer';

const TestPage = ({ params }) => {
  // Unwrap params with React.use()
  const unwrappedParams = React.use(params);
  
  const [mcqData, setMcqData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // For debugging
        console.log("Received params:", unwrappedParams);
        
        if (!unwrappedParams || !unwrappedParams.mcq) {
          throw new Error('No question data provided');
        }
        
        // Get the mcq parameter from the URL
        const mcqParam = unwrappedParams.mcq;
        console.log("MCQ parameter:", mcqParam);
        
        // Try to parse it as JSON
        try {
          const decoded = decodeURIComponent(mcqParam);
          console.log("Decoded parameter:", decoded);
          
          const parsedData = JSON.parse(decoded);
          console.log("Parsed data:", parsedData);
          
          // Create sample data for debugging if needed
          const cloudQuestions = [
            {
              question: "What does IaaS stand for in cloud computing?",
              options: [
                "Infrastructure as a Service",
                "Internet as a Service",
                "Information as a Service",
                "Integration as a Service"
              ],
              correctAnswer: "Infrastructure as a Service"
            },
            {
              question: "Which of the following is NOT a major cloud provider?",
              options: [
                "Amazon Web Services (AWS)",
                "Microsoft Azure",
                "Google Cloud Platform (GCP)",
                "Apple iCloud (for personal use only)"
              ],
              correctAnswer: "Apple iCloud (for personal use only)"
            },
            {
              question: "A virtual machine (VM) in cloud computing is:",
              options: [
                "A physical computer",
                "A software-based computer",
                "A type of network cable",
                "A programming language"
              ],
              correctAnswer: "A software-based computer"
            }
          ];
          
          if (Array.isArray(parsedData) && parsedData.length > 0) {
            setMcqData(parsedData);
          } else if (parsedData && typeof parsedData === 'object' && Array.isArray(parsedData.questions)) {
            setMcqData(parsedData.questions);
          } else {
            console.warn("Invalid question data format, using fallback data");
            setMcqData(cloudQuestions);
          }
        } catch (parseError) {
          console.error("Error parsing question data:", parseError);
          
          // If it's not JSON, try to fetch questions using the mcqParam as an ID
          try {
            const response = await fetch(`/api/questions/${mcqParam}`);
            if (!response.ok) {
              throw new Error(`Failed to fetch questions: ${response.status}`);
            }
            
            const result = await response.json();
            if (Array.isArray(result) && result.length > 0) {
              setMcqData(result);
            } else if (result && typeof result === 'object' && Array.isArray(result.questions)) {
              setMcqData(result.questions);
            } else {
              throw new Error("Invalid response format from API");
            }
          } catch (fetchError) {
            console.error("Error fetching questions from API:", fetchError);
            // Load sample questions for demonstration
            setMcqData([
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
            ]);
          }
        }
      } catch (err) {
        console.error("General error:", err);
        setError(err.message || "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [unwrappedParams]);

  // For debugging
  useEffect(() => {
    console.log("mcqData state updated:", mcqData);
  }, [mcqData]);

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-teal-800 mb-6">AI Mock Test</h1>
          
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 text-red-700 p-4 rounded-md">
              <h3 className="font-bold">Error</h3>
              <p>{error}</p>
            </div>
          ) : (
            <TestQuestions mcq={mcqData} />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TestPage;