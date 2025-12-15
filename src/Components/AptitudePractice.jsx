import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, ArrowRight, RefreshCw, Award, Clock } from "lucide-react";
import DashboardNavbar from "./DashboardNavbar";
import { Link } from "react-router-dom";

const API_BASE = "http://localhost:5000/api";

const AptitudePractice = () => {
  const [userName, setUserName] = useState("User");
  const [jobRole, setJobRole] = useState("");
  const [setupComplete, setSetupComplete] = useState(false);
  
  // Questions
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds per question
  const [quizComplete, setQuizComplete] = useState(false);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setUserName(user.name || "User");
  }, []);

  // Timer countdown
  useEffect(() => {
    if (setupComplete && !showResult && !quizComplete && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleSubmit(); // Auto-submit when time runs out
    }
  }, [timeLeft, setupComplete, showResult, quizComplete]);

// Generate aptitude questions from backend
const generateQuestions = async () => {
  if (!jobRole.trim()) return;
  
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${API_BASE}/questions/aptitude?jobRole=${encodeURIComponent(jobRole)}&count=10`,
      {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }
    );

    const data = await response.json();
    
    if (response.ok) {
      setQuestions(data.questions);
      setSetupComplete(true);
      setCurrentIndex(0);
      setScore(0);
      setTimeLeft(60);
    } else {
      alert(data.message || "Failed to generate questions");
    }
  } catch (error) {
    console.error("Error generating questions:", error);
    alert("Failed to generate questions. Please try again.");
  }
};
  const handleAnswerSelect = (answerIndex) => {
    if (!showResult) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleSubmit = () => {
    setShowResult(true);
    
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeLeft(60);
    } else {
      setQuizComplete(true);
    }
  };

  const restartQuiz = () => {
    setSetupComplete(false);
    setQuizComplete(false);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setJobRole("");
  };

  // Setup Screen
  if (!setupComplete) {
    return (
      <div className="min-h-screen bg-gray-100">
        <DashboardNavbar userName={userName} />

        <div className="p-8 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">Aptitude Practice</h1>
            <p className="text-lg text-gray-600">Test your knowledge with MCQ-based questions</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                What job role are you preparing for?
              </label>
              <input
                type="text"
                placeholder='e.g., "Software Engineer", "Data Scientist", "Full Stack Developer"'
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
                onKeyPress={(e) => e.key === 'Enter' && jobRole.trim() && generateQuestions()}
              />
            </div>

            <button
              onClick={generateQuestions}
              disabled={!jobRole.trim()}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-bold text-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <span>Start Aptitude Test</span>
              <ArrowRight size={20} />
            </button>

            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">10</p>
                <p className="text-sm text-gray-600">Questions</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">60s</p>
                <p className="text-sm text-gray-600">Per Question</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">MCQ</p>
                <p className="text-sm text-gray-600">Format</p>
              </div>
            </div>
          </div>

          <Link to="/quick-practice">
            <button className="w-full py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50">
              ← Back to Interview Practice
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Quiz Complete Screen
  if (quizComplete) {
    const percentage = (score / questions.length) * 100;
    
    return (
      <div className="min-h-screen bg-gray-100">
        <DashboardNavbar userName={userName} />

        <div className="p-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="w-12 h-12 text-green-600" />
            </div>

            <h1 className="text-4xl font-bold text-gray-800 mb-4">Quiz Complete!</h1>
            <p className="text-xl text-gray-600 mb-8">Here's how you performed</p>

            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="p-6 bg-blue-50 rounded-xl">
                <p className="text-4xl font-bold text-blue-600">{score}</p>
                <p className="text-gray-600">Correct Answers</p>
              </div>
              <div className="p-6 bg-purple-50 rounded-xl">
                <p className="text-4xl font-bold text-purple-600">{questions.length}</p>
                <p className="text-gray-600">Total Questions</p>
              </div>
              <div className="p-6 bg-green-50 rounded-xl">
                <p className="text-4xl font-bold text-green-600">{percentage.toFixed(0)}%</p>
                <p className="text-gray-600">Score</p>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={restartQuiz}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-bold text-lg hover:opacity-90 flex items-center justify-center space-x-2"
              >
                <RefreshCw size={20} />
                <span>Take Another Test</span>
              </button>

              <Link to="/dashboard">
                <button className="w-full py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50">
                  Back to Dashboard
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Question Screen
  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardNavbar userName={userName} />

      <div className="p-8 max-w-4xl mx-auto">
        {/* Progress & Timer */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <div className="flex items-center space-x-2">
              <Clock size={18} className={timeLeft <= 10 ? "text-red-600" : "text-gray-600"} />
              <span className={`text-lg font-bold ${timeLeft <= 10 ? "text-red-600" : "text-gray-800"}`}>
                {timeLeft}s
              </span>
              </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
        {/* Question Card */}
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
      <div className="flex items-center justify-between mb-6">
        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
          {jobRole}
        </span>
        <span className="text-sm text-gray-600">Score: {score}/{currentIndex + (showResult ? 1 : 0)}</span>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-8">
        {currentQuestion?.question}
      </h2>

      {/* Options */}
      <div className="space-y-4 mb-6">
        {currentQuestion?.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === currentQuestion.correctAnswer;
          const showCorrect = showResult && isCorrect;
          const showWrong = showResult && isSelected && !isCorrect;

          return (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={showResult}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                showCorrect
                  ? "border-green-500 bg-green-50"
                  : showWrong
                  ? "border-red-500 bg-red-50"
                  : isSelected
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200 hover:border-purple-300 bg-white"
              } ${showResult ? "cursor-not-allowed" : "cursor-pointer"}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800">{option}</span>
                {showCorrect && <CheckCircle className="text-green-600" size={24} />}
                {showWrong && <XCircle className="text-red-600" size={24} />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanation (shown after submission) */}
      {showResult && (
        <div className={`p-4 rounded-xl ${
          selectedAnswer === currentQuestion.correctAnswer
            ? "bg-green-50 border border-green-200"
            : "bg-blue-50 border border-blue-200"
        }`}>
          <p className="font-semibold text-gray-800 mb-2">Explanation:</p>
          <p className="text-gray-700">{currentQuestion.explanation}</p>
        </div>
      )}
    </div>

    {/* Action Buttons */}
    <div className="flex items-center justify-between">
      <button
        onClick={() => setSetupComplete(false)}
        className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50"
      >
        Exit Quiz
      </button>

      {!showResult ? (
        <button
          onClick={handleSubmit}
          disabled={selectedAnswer === null}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Answer
        </button>
      ) : (
        <button
          onClick={nextQuestion}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold flex items-center space-x-2"
        >
          <span>{currentIndex < questions.length - 1 ? "Next Question" : "View Results"}</span>
          <ArrowRight size={20} />
        </button>
      )}
    </div>
  </div>
</div>
);
};
export default AptitudePractice;