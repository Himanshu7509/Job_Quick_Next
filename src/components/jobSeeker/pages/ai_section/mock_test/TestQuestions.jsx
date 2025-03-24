"use client";
import React, { useEffect, useState, useTransition } from "react";
import {
  RefreshCcw,
  Clock,
  ArrowLeft,
  CheckCircle,
  XCircle,
  HelpCircle,
  Loader,
} from "lucide-react";
import { postMockApi } from "@/components/utils/userApi/UserApi";
import Link from "next/link";
import Header from "@/components/jobSeeker/common/header/Header";
import Footer from "@/components/jobSeeker/common/footer/Footer";

const Progress = ({ value, className = "" }) => (
  <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
    <div
      className="bg-teal-500 h-full rounded-full transition-all duration-300"
      style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
    />
  </div>
);

const TestQuestions = ({ category, subcategory }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      fetchQuestions();
    });
  }, [category, subcategory]);

  useEffect(() => {
    let timer;
    if (isTimerRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsTimerRunning(false);
            handleTestComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimeTaken = () => {
    if (!startTime || !endTime) return "00:00";
    const timeDiff = Math.floor((endTime - startTime) / 1000);
    return formatTime(timeDiff);
  };

  const startTest = () => {
    setIsLoading(true);
    setShowInstructions(false);
    // Start the timer only when questions are loaded
    if (questions.length > 0) {
      setIsTimerRunning(true);
      setStartTime(new Date());
      setIsLoading(false);
    } else {
      // If questions aren't loaded yet, fetch them and then start the timer
      fetchQuestions().then(() => {
        setIsTimerRunning(true);
        setStartTime(new Date());
        setIsLoading(false);
      });
    }
  };

  const resetQuiz = async () => {
    setCurrentIndex(0);
    setAnswers({});
    setScore(null);
    setShowResults(false);
    setTimeLeft(120);
    setIsTimerRunning(false);
    setShowInstructions(true);
    setStartTime(null);
    setEndTime(null);
    setIsLoading(true);
    await fetchQuestions();
    setIsLoading(false);
  };

  const handleTestComplete = () => {
    setEndTime(new Date());
    calculateScore();
  };

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const response = await postMockApi({ category, subcategory });
      if (response.status === 200 || response.status === 201) {
        processQuestionsData(response.data.questions);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const processQuestionsData = (rawQuestions) => {
    try {
      const processed = [];
      let currentQuestion = null;
      let options = [];

      rawQuestions.forEach((item) => {
        if (item.startsWith("**")) return;
        if (item.startsWith("Q:")) {
          if (currentQuestion && options.length > 0)
            processed.push(currentQuestion);
          currentQuestion = {
            question: item.substring(2).trim(),
            options: [],
            correctAnswer: "",
          };
          options = [];
        } else if (item.match(/^[A-D]\)/)) {
          const letter = item[0].toLowerCase();
          const text = item.substring(2).trim();
          options.push({ letter, text });
          if (currentQuestion) currentQuestion.options = options;
        } else if (item.startsWith("Correct:")) {
          if (currentQuestion)
            currentQuestion.correctAnswer = item
              .split(":")[1]
              .trim()
              .toLowerCase();
        }
      });

      if (currentQuestion && options.length > 0)
        processed.push(currentQuestion);
      setQuestions(processed);
    } catch (error) {
      console.error("Error processing questions:", error);
    }
  };

  const handleAnswerSelection = (answer) => {
    setAnswers((prev) => ({ ...prev, [currentIndex]: answer }));
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) correct++;
    });
    const percentage = (correct / questions.length) * 100;
    setScore(percentage.toFixed(2));
    setShowResults(true);
  };

  const currentQuestion = questions[currentIndex];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md mx-auto text-center">
          <Loader className="animate-spin h-12 w-12 text-teal-500 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-800 mb-2">
            Loading Questions
          </h3>
          <p className="text-gray-600">
            Please wait while we prepare your test...
          </p>
        </div>
      </div>
    );
  }

  if (showInstructions) {
    return (
      <div className="min-h-screen lg:mt-20 sm:mt-10 p-4">
        <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Test Instructions
          </h2>
          <div className="space-y-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Time Limit</h3>
              <p>You have {formatTime(timeLeft)} to complete this test.</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Test Format</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Total questions: {questions.length}</li>
                <li>Each question has 4 options</li>
                <li>You can navigate between questions</li>
                <li>
                  You can review and change your answers before submission
                </li>
              </ul>
            </div>
          </div>
          <button
            onClick={startTest}
            className="w-full py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium"
          >
            Start Test
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <>
        <Header />
        {isPending ? (
          <Loader />
        ) : (
          <>
            <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
              <div className="bg-white shadow-xl rounded-lg p-4 sm:p-8 w-full max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                  <Link href="/mock-test">
                    <button className="flex items-center gap-2 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base w-full sm:w-auto">
                      <ArrowLeft size={16} />
                      Go Back
                    </button>
                  </Link>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center">
                    Test Results
                  </h2>
                  <button
                    onClick={resetQuiz}
                    className="flex items-center gap-2 px-3 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors text-sm sm:text-base w-full sm:w-auto"
                  >
                    <RefreshCcw size={16} />
                    Reset Quiz
                  </button>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-6">
                  <div className="text-center mb-4">
                    <div className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
                      {score}%
                    </div>
                    <div className="text-sm sm:text-base text-gray-600">
                      Time Taken: {getTimeTaken()}
                    </div>
                  </div>
                  <Progress value={parseFloat(score)} />
                </div>

                <div className="space-y-4">
                  {questions.map((q, i) => (
                    <div
                      key={i}
                      className="bg-gray-50 rounded-lg p-4 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1 flex-shrink-0">
                          {answers[i] === q.correctAnswer ? (
                            <CheckCircle className="text-green-500" size={20} />
                          ) : (
                            <XCircle className="text-red-500" size={20} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-medium text-gray-800 mb-3">
                            {i + 1}. {q.question}
                          </p>
                          <div className="space-y-2">
                            {q.options.map((opt) => (
                              <div
                                key={opt.letter}
                                className={`p-2 rounded-lg transition-colors text-sm ${
                                  opt.letter === q.correctAnswer
                                    ? "bg-green-100 border-2 border-green-500"
                                    : opt.letter === answers[i]
                                    ? "bg-red-100 border-2 border-red-500"
                                    : "bg-white border-2 border-gray-200"
                                }`}
                              >
                                {opt.letter.toUpperCase()}) {opt.text}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <Footer />
          </>
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen p-2 sm:p-4 lg:mt-20 sm:mt-10">
      <div className="bg-white shadow-xl rounded-lg p-4 sm:p-8 w-full max-w-3xl mx-auto">
        {currentQuestion && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="w-full sm:w-auto space-y-2">
                <h2 className="text-xl font-bold text-gray-800">
                  Question {currentIndex + 1}
                </h2>
                <Progress
                  value={((currentIndex + 1) / questions.length) * 100}
                  className="w-full sm:w-32"
                />
              </div>

              <div className="flex items-center gap-4">
                <div
                  className={`flex items-center gap-2 font-medium ${
                    timeLeft < 10 ? "text-red-500" : "text-gray-600"
                  }`}
                >
                  <Clock size={20} />
                  {formatTime(timeLeft)}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {answers[currentIndex] ? (
                  <CheckCircle size={18} className="text-green-500" />
                ) : (
                  <HelpCircle size={18} className="text-gray-400" />
                )}
                <span className="text-sm text-gray-600">
                  {answers[currentIndex] ? "Answered" : "Not answered"}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-base font-medium text-gray-800">
                {currentQuestion.question}
              </p>
            </div>

            <div className="space-y-3">
              {currentQuestion.options.map((opt) => (
                <label
                  key={opt.letter}
                  className={`block p-3 rounded-lg cursor-pointer transition-all ${
                    answers[currentIndex] === opt.letter
                      ? "bg-teal-50 border-2 border-teal-500"
                      : "bg-white border-2 border-gray-200 hover:border-teal-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name={`question-${currentIndex}`}
                      value={opt.letter}
                      checked={answers[currentIndex] === opt.letter}
                      onChange={() => handleAnswerSelection(opt.letter)}
                      className="w-4 h-4 text-teal-500"
                    />
                    <span className="text-sm text-gray-800">
                      {opt.letter.toUpperCase()}) {opt.text}
                    </span>
                  </div>
                </label>
              ))}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between">
              <button
                onClick={() => setCurrentIndex((prev) => prev - 1)}
                disabled={currentIndex === 0}
                className={`w-full sm:w-auto px-4 py-2.5 rounded-lg transition-colors text-sm ${
                  currentIndex === 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-teal-500 hover:bg-teal-600 text-white"
                }`}
              >
                Previous
              </button>

              {currentIndex === questions.length - 1 ? (
                <button
                  onClick={handleTestComplete}
                  className="w-full sm:w-auto px-4 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                >
                  Submit Test
                </button>
              ) : (
                <button
                  onClick={() => setCurrentIndex((prev) => prev + 1)}
                  className="w-full sm:w-auto px-4 py-2.5 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors text-sm"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestQuestions;
