import React, { useState, useEffect } from "react";
import { 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Award,
  Loader,
  ArrowLeft,
  Target,
  Briefcase,
  Hash,
  Zap
} from "lucide-react";

const API_BASE = "http://localhost:5000/api";

// Circular Score Component
const CircularScore = ({ score, label, size = "large" }) => {
  const radius = size === "large" ? 70 : 45;
  const strokeWidth = size === "large" ? 12 : 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  let color = '#ef4444'; // red
  let bgColor = '#fee2e2';
  
  if (score >= 80) {
    color = '#22c55e'; // green
    bgColor = '#dcfce7';
  } else if (score >= 60) {
    color = '#f59e0b'; // orange
    bgColor = '#fef3c7';
  }
  
  const viewBoxSize = (radius + strokeWidth) * 2;
  const center = radius + strokeWidth;
  
  return (
    <div className="flex flex-col items-center">
      <div className={`relative ${size === "large" ? "w-48 h-48" : "w-32 h-32"}`}>
        <svg 
          className="transform -rotate-90" 
          width="100%" 
          height="100%" 
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        >
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke={bgColor}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
        </svg>
        
        {/* Score text in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`${size === "large" ? "text-5xl" : "text-3xl"} font-bold`} style={{ color }}>
            {score}
          </span>
          <span className="text-sm text-gray-500 mt-1">{label}</span>
        </div>
      </div>
    </div>
  );
};

// Progress Step Component
const ProgressStep = ({ icon: Icon, label, status }) => {
  const getStatusColor = () => {
    if (status === 'complete') return 'bg-green-500';
    if (status === 'active') return 'bg-blue-500 animate-pulse';
    return 'bg-gray-300';
  };

  return (
    <div className="flex items-center space-x-3">
      <div className={`w-10 h-10 rounded-full ${getStatusColor()} flex items-center justify-center transition-all duration-300`}>
        {status === 'complete' ? (
          <CheckCircle className="text-white" size={20} />
        ) : (
          <Icon className="text-white" size={20} />
        )}
      </div>
      <span className={`text-sm font-medium ${status === 'complete' ? 'text-gray-700' : 'text-gray-500'}`}>
        {label}
      </span>
    </div>
  );
};

const ResumeAnalysis = ({ resumeId: propResumeId, onBack }) => {
  const [userName, setUserName] = useState("User");
  
  // Analysis states
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");
  
  // Progress steps
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    { icon: FileText, label: "Parsing your resume", duration: 2000 },
    { icon: Briefcase, label: "Analyzing your experience", duration: 3000 },
    { icon: Zap, label: "Extracting your skills", duration: 2000 },
    { icon: Target, label: "Generating recommendations", duration: 3000 }
  ];

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setUserName(user.name || "User");
    
    if (propResumeId) {
      analyzeResume();
    }
  }, [propResumeId]);

  // Simulate progress steps
  useEffect(() => {
    if (isAnalyzing && currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, steps[currentStep]?.duration || 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isAnalyzing, currentStep]);

  const analyzeResume = async () => {
    try {
      setIsAnalyzing(true);
      setError("");
      setCurrentStep(0);
      
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/resumes/analyze/${propResumeId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Analysis failed");
      }

      // Wait for all steps to complete
      await new Promise(resolve => {
        const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0);
        setTimeout(resolve, Math.max(0, totalDuration - (currentStep * 2000)));
      });

      setAnalysis(data.analysis);
      setIsAnalyzing(false);

    } catch (err) {
      console.error("Analysis error:", err);
      setError(err.message);
      setIsAnalyzing(false);
    }
  };

  if (error) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-800 mb-2">Analysis Failed</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button 
            onClick={onBack}
            className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-12">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-3">
              Analyzing Your Resume
            </h1>
            <p className="text-gray-600">
              Our AI is carefully reviewing your resume...
            </p>
          </div>

          {/* Progress Steps */}
          <div className="space-y-6">
            {steps.map((step, index) => (
              <ProgressStep
                key={index}
                icon={step.icon}
                label={step.label}
                status={
                  index < currentStep ? 'complete' :
                  index === currentStep ? 'active' :
                  'pending'
                }
              />
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mt-8">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 text-center mt-2">
              {Math.round((currentStep / steps.length) * 100)}% Complete
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={onBack}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Dashboard
        </button>
        <h1 className="text-4xl font-bold text-gray-800">Resume Analysis</h1>
        <p className="text-gray-600 mt-2">Detailed insights and recommendations for your resume</p>
      </div>

      {/* Scores Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* ATS Score */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Award className="mr-2 text-purple-600" size={24} />
            ATS Compatibility Score
          </h2>
          <div className="flex justify-center">
            <CircularScore score={analysis.atsScore} label="ATS Score" />
          </div>
          <p className="text-center text-gray-600 mt-4">
            {analysis.atsScore >= 80 
              ? "Excellent! Your resume is highly ATS-friendly" 
              : analysis.atsScore >= 60 
              ? "Good score, with room for improvement" 
              : "Needs improvement to pass ATS systems"}
          </p>
        </div>

        {/* Overall Score */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <TrendingUp className="mr-2 text-blue-600" size={24} />
            Overall Quality Score
          </h2>
          <div className="flex justify-center">
            <CircularScore score={analysis.overallScore} label="Quality Score" />
          </div>
          <p className="text-center text-gray-600 mt-4">
            Based on content quality, structure, and relevance
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-lg p-8 mb-8 border border-blue-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Overall Assessment</h2>
        <p className="text-gray-700 leading-relaxed text-lg">
          {analysis.summary}
        </p>
      </div>

      {/* Experience Assessment */}
      {analysis.experience && (
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Briefcase className="mr-2 text-green-600" size={24} />
            Experience Level
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Estimated Years</p>
              <p className="text-xl font-bold text-green-700">{analysis.experience.yearsEstimate}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Level</p>
              <p className="text-xl font-bold text-blue-700">{analysis.experience.level}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg col-span-full md:col-span-1">
              <p className="text-sm text-gray-600">Assessment</p>
              <p className="text-sm text-gray-700 mt-1">{analysis.experience.assessment}</p>
            </div>
          </div>
        </div>
      )}

      {/* Skills Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Skills Found */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <CheckCircle className="mr-2 text-green-600" size={24} />
            Skills Found
          </h2>
          <div className="flex flex-wrap gap-2">
            {analysis.skillsFound.map((skill, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <AlertCircle className="mr-2 text-orange-600" size={24} />
            Skills to Add
          </h2>
          <div className="flex flex-wrap gap-2">
            {analysis.missingSkills.map((skill, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Keywords */}
      {analysis.keywords && (
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Hash className="mr-2 text-blue-600" size={24} />
              Keywords Present
            </h2>
            <div className="flex flex-wrap gap-2">
              {analysis.keywords.present.map((keyword, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Hash className="mr-2 text-red-600" size={24} />
              Missing Keywords
            </h2>
            <div className="flex flex-wrap gap-2">
              {analysis.keywords.missing.map((keyword, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Strengths & Weaknesses */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Strengths */}
        <div className="bg-green-50 rounded-2xl shadow-lg p-8 border border-green-200">
          <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center">
            <CheckCircle className="mr-2" size={24} />
            Strengths
          </h2>
          <ul className="space-y-3">
            {analysis.strengths.map((strength, index) => (
              <li key={index} className="flex items-start space-x-3">
                <span className="text-green-600 mt-1">✓</span>
                <span className="text-gray-700">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="bg-red-50 rounded-2xl shadow-lg p-8 border border-red-200">
          <h2 className="text-xl font-bold text-red-800 mb-4 flex items-center">
            <AlertCircle className="mr-2" size={24} />
            Areas to Improve
          </h2>
          <ul className="space-y-3">
            {analysis.weaknesses.map((weakness, index) => (
              <li key={index} className="flex items-start space-x-3">
                <span className="text-red-600 mt-1">!</span>
                <span className="text-gray-700">{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Target className="mr-2 text-purple-600" size={28} />
          Actionable Recommendations
        </h2>
        <div className="space-y-4">
          {analysis.recommendations.map((rec, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg border border-purple-100">
              <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                {index + 1}
              </div>
              <p className="text-gray-700 pt-1">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Formatting Score */}
      {analysis.formatting && (
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Formatting Analysis</h2>
          <div className="flex items-center space-x-4 mb-4">
            <CircularScore score={analysis.formatting.score} label="Format Score" size="small" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-700 mb-2">Formatting Issues:</h3>
              <ul className="space-y-2">
                {analysis.formatting.issues.map((issue, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start">
                    <span className="mr-2">•</span>
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={analyzeResume}
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all"
        >
          Re-analyze Resume
        </button>
        <button 
          onClick={onBack}
          className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ResumeAnalysis;