import React, { useState, useRef, useEffect } from "react";
import { Mic, StopCircle, Loader, CheckCircle, RefreshCw, ArrowRight, BookOpen } from "lucide-react";
import DashboardNavbar from "./DashboardNavbar";
import { Link } from "react-router-dom";

const API_BASE = "http://localhost:5000/api";

const QuickPractice = () => {
  // User info
  const [userName, setUserName] = useState("User");
  
  // Setup phase
  const [jobRole, setJobRole] = useState("");
  const [setupComplete, setSetupComplete] = useState(false);
  
  // Questions
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentQuestion = questions[currentIndex];
  
  // Recording states
  const [recording, setRecording] = useState(false);
  const [recTime, setRecTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  
  // Processing & AI states
  const [processing, setProcessing] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [aiFeedback, setAiFeedback] = useState("");
  
  // Refs
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setUserName(user.name || "User");
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);
const generateQuestions = async () => {
  if (!jobRole.trim()) return;
  
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${API_BASE}/questions/interview?jobRole=${encodeURIComponent(jobRole)}&count=6`,
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
    } else {
      alert(data.message || "Failed to generate questions");
    }
  } catch (error) {
    console.error("Error generating questions:", error);
    alert("Failed to generate questions. Please try again.");
  }
};

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioURL(url);
        
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(t => t.stop());
        }
      };
      
      mediaRecorder.start();
      setRecording(true);
      setRecTime(0);
      
      timerRef.current = setInterval(() => {
        setRecTime(t => t + 1);
      }, 1000);
      
    } catch (err) {
      console.error("Recording error:", err);
      alert("Could not access microphone. Please allow microphone permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };
// Process audio with backend
const processAudio = async () => {
  if (!audioBlob) return;
  
  setProcessing(true);
  setTranscription("");
  setAiFeedback("");
  
  try {
    const formData = new FormData();
    formData.append("audio", audioBlob, "answer.webm");
    formData.append("questionText", currentQuestion.text);
    
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE}/answers/submit-audio`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: formData
    });
    
    const data = await response.json();
    
    if (response.ok) {
      setTranscription(data.transcription);
      setAiFeedback(data.feedback);
    } else {
      alert(data.message || "Failed to process audio");
    }
  } catch (error) {
    console.error("Processing error:", error);
    alert("Failed to process audio. Please try again.");
  } finally {
    setProcessing(false);
  }
};

  const recordAgain = () => {
    setAudioBlob(null);
    setAudioURL(null);
    setTranscription("");
    setAiFeedback("");
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      recordAgain();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Setup Screen
  if (!setupComplete) {
    return (
      <div className="min-h-screen bg-gray-100">
        <DashboardNavbar userName={userName} />

        <div className="p-8 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">Quick Practice</h1>
            <p className="text-lg text-gray-600">Record your answers and get instant AI feedback</p>
          </div>

          {/* Setup Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                What job role are you preparing for?
              </label>
              <input
                type="text"
                placeholder='e.g., "Software Engineer", "Data Scientist", "Product Manager"'
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                onKeyPress={(e) => e.key === 'Enter' && jobRole.trim() && generateQuestions()}
              />
            </div>

            <button
              onClick={generateQuestions}
              disabled={!jobRole.trim()}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold text-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <span>Start Interview Practice</span>
              <ArrowRight size={20} />
            </button>
          </div>

          {/* MCQ Aptitude Option */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg p-8 text-white">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <BookOpen size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">Aptitude Preparation</h3>
                <p className="text-white/90 mb-4">
                  Practice MCQ-based aptitude questions tailored to your target role. Perfect for quick warm-ups and testing your knowledge.
                </p>
                <Link to="/aptitude-practice">
                  <button className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    Practice Aptitude Questions →
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Interview Screen
  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardNavbar userName={userName} />

      <div className="p-8 max-w-5xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <button
              onClick={() => setSetupComplete(false)}
              className="text-sm text-blue-600 hover:underline font-medium"
            >
              Change Role
            </button>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {jobRole}
            </span>
            <span className="text-sm text-gray-500">Question {currentIndex + 1}/{questions.length}</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {currentQuestion?.text}
          </h2>

          <p className="text-gray-600 mb-6">
            Take a moment to think about your answer and click the button below to start recording.
          </p>

          {/* Recording Controls */}
          <div className="space-y-4">
            {!audioBlob && !recording && (
              <button
                onClick={startRecording}
                className="w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-lg flex items-center justify-center space-x-3 transition-colors"
              >
                <Mic size={24} />
                <span>Start Recording</span>
              </button>
            )}

            {recording && (
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-4 py-6 bg-red-50 rounded-xl">
                  <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-2xl font-bold text-red-600">
                    {formatTime(recTime)}
                  </span>
                  <span className="text-gray-600">Recording...</span>
                </div>
                
                <button
                  onClick={stopRecording}
                  className="w-full py-4 bg-gray-800 hover:bg-gray-900 text-white rounded-xl font-bold text-lg flex items-center justify-center space-x-3 transition-colors"
                >
                  <StopCircle size={24} />
                  <span>Stop Recording</span>
                </button>
              </div>
            )}

            {audioBlob && !processing && !transcription && (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center space-x-3 mb-3">
                    <CheckCircle className="text-green-600" size={24} />
                    <span className="font-semibold text-green-800">Recording Complete</span>
                  </div>
                  {audioURL && (
                    <audio controls src={audioURL} className="w-full" />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={recordAgain}
                    className="py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 flex items-center justify-center space-x-2"
                  >
                    <RefreshCw size={20} />
                    <span>Record Again</span>
                  </button>
                  
                  <button
                    onClick={processAudio}
                    className="py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center justify-center space-x-2"
                  >
                    <span>Process & Get Feedback</span>
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {processing && (
              <div className="py-12 bg-blue-50 rounded-xl flex flex-col items-center justify-center space-y-4">
                <Loader className="w-12 h-12 text-blue-600 animate-spin" />
                <p className="text-lg font-semibold text-blue-800">Processing your response...</p>
                <p className="text-sm text-gray-600">Transcribing audio and generating AI feedback</p>
              </div>
            )}
          </div>
        </div>

        {/* Response & Feedback */}
        {transcription && (
          <div className="space-y-6">
            {/* Your Response */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Your Response</span>
              </h3>
              <p className="text-gray-700 leading-relaxed">{transcription}</p>
            </div>

            {/* AI Feedback */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow-lg p-8 border border-green-200">
              <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center space-x-2">
                <CheckCircle className="text-green-600" size={24} />
                <span>AI Feedback</span>
              </h3>
              <p className="text-gray-800 leading-relaxed">{aiFeedback}</p>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={recordAgain}
                className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 flex items-center space-x-2"
              >
                <RefreshCw size={20} />
                <span>Try Again</span>
              </button>

              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={nextQuestion}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center space-x-2"
                >
                  <span>Next Question</span>
                  <ArrowRight size={20} />
                </button>
              ) : (
                <Link to="/dashboard">
                  <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold">
                    Complete Practice →
                  </button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickPractice;