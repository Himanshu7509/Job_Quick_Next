"use client";

import React, { useState, useEffect } from "react";

const TestQuestions = ({ mcq }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60 * 30); // 30 minutes in seconds
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("mcq prop received:", mcq);
    if (mcq && Array.isArray(mcq) && mcq.length > 0) {
      setQuestions(mcq);
      // Initialize selected answers
      const initialAnswers = {};
      mcq.forEach((_, index) => {
        initialAnswers[index] = null;
      });
      setSelectedAnswers(initialAnswers);
    } else {
      console.warn("Invalid mcq data received:", mcq);
    }
    setIsLoading(false);
  }, [mcq]);

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0 || isSubmitted || isLoading) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted, isLoading]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionIndex, option) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: option
    });
  };

  const goToNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goToPrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    // Calculate results
    setIsSubmitted(true);
    // Here you would typically send the answers to your backend
    console.log("Submitted answers:", selectedAnswers);
  };

  if (isLoading) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">Loading questions...</p>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center p-8">
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-md">
          <h3 className="font-bold">No Questions Available</h3>
          <p className="mt-2">There are no questions available for this test. Please try selecting a different category.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="test-questions">
      {/* Timer and Progress */}
      <div className="flex justify-between items-center mb-6">
        <div className="bg-teal-100 text-teal-800 px-4 py-2 rounded-lg font-medium">
          Question {currentQuestion + 1} of {questions.length}
        </div>
        <div className={`px-4 py-2 rounded-lg font-medium ${timeLeft < 300 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
          Time Remaining: {formatTime(timeLeft)}
        </div>
      </div>

      {/* Question Navigation */}
      <div className="mb-6 flex flex-wrap gap-2">
        {questions.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentQuestion(index)}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm 
              ${currentQuestion === index ? 'bg-teal-600 text-white' : 
                selectedAnswers[index] !== null ? 'bg-teal-100 text-teal-800' : 'bg-gray-200 text-gray-700'} 
              hover:bg-teal-500 hover:text-white transition-colors`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Current Question */}
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h3 className="text-xl font-semibold mb-4">
          {questions[currentQuestion].question}
        </h3>
        
        {questions[currentQuestion].options && Array.isArray(questions[currentQuestion].options) ? (
          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, idx) => (
              <div 
                key={idx}
                className={`p-3 rounded-lg cursor-pointer border transition-all
                  ${selectedAnswers[currentQuestion] === option 
                    ? 'border-teal-500 bg-teal-50' 
                    : 'border-gray-300 hover:border-teal-300 hover:bg-teal-50'}`}
                onClick={() => handleAnswerSelect(currentQuestion, option)}
              >
                <label className="flex items-start cursor-pointer">
                  <input 
                    type="radio" 
                    name={`q${currentQuestion}`} 
                    value={option}
                    checked={selectedAnswers[currentQuestion] === option}
                    onChange={() => {}} // Required to avoid React warning
                    className="mt-1 mr-3"
                  />
                  <span>{option}</span>
                </label>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3 rounded-lg border border-red-200 bg-red-50">
            <p className="text-red-600">No options available for this question.</p>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={goToPrevQuestion}
          disabled={currentQuestion === 0}
          className={`px-5 py-2 rounded-md ${
            currentQuestion === 0
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Previous
        </button>

        {currentQuestion < questions.length - 1 ? (
          <button
            onClick={goToNextQuestion}
            className="px-5 py-2 rounded-md bg-teal-600 text-white hover:bg-teal-700"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitted}
            className={`px-5 py-2 rounded-md ${
              isSubmitted
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            } text-white`}
          >
            Submit Test
          </button>
        )}
      </div>

      {isSubmitted && (
        <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-xl font-bold text-green-800 mb-4">Test Submitted!</h3>
          <p className="text-green-700">
            Your answers have been recorded. You'll receive your results shortly.
          </p>
        </div>
      )}
    </div>
  );
};

export default TestQuestions;