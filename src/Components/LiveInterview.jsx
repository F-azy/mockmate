import React, { useState } from "react";
import DashboardNavbar from "./DashboardNavbar";
import { Link } from "react-router-dom";
import { Video, Play, Activity, Clock } from "lucide-react";

const LiveInterview = () => {
  const [jobRole, setJobRole] = useState("");
  const [interviewStarted, setInterviewStarted] = useState(false);

  const startInterview = () => {
    if (!jobRole.trim()) {
      alert("Please enter the job role before starting.");
      return;
    }
    setInterviewStarted(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <DashboardNavbar userName="John" />

      {/* Content */}
      <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Live Interview</h1>
            <p className="text-sm text-gray-600">
              AI-powered, real-time interview simulation.
            </p>
          </div>
          <Link
            to="/dashboard"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Setup Card */}
        <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
          <h3 className="text-sm font-semibold text-purple-500 mb-2">
            Live Interview Setup
          </h3>
          <div className="grid md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="text-sm text-gray-700 font-medium">
                What job are you preparing for?
              </label>
              <input
                placeholder='e.g. "Software Engineer, Data Scientist, Product Manager"'
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={startInterview}
                className="px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-medium hover:opacity-95 flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Start Live Interview
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-3">
            A 5–8 minute AI interview session with live video, dynamic questions,
            and performance feedback.
          </p>
        </div>

        {/* Interview Console */}
        <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-3">
            Interview Console
          </h2>
          {!interviewStarted ? (
            <div className="border border-dashed border-gray-300 rounded-lg p-10 text-center text-gray-500">
              🎥 Your live AI interviewer will appear here once you start.
            </div>
          ) : (
            <div className="border border-dashed border-gray-300 rounded-lg p-10 text-center">
              <Video className="w-10 h-10 mx-auto text-purple-500 mb-3" />
              <p className="text-gray-600">
                Live interview stream running for role:{" "}
                <span className="font-semibold text-gray-800">{jobRole}</span>
              </p>
            </div>
          )}
        </div>

        {/* Live Metrics */}
        {interviewStarted && (
          <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Real-Time Analysis
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg flex items-center gap-3">
                <Activity className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Emotion Detection</p>
                  <p className="text-xs text-gray-500">Analysing expressions...</p>
                </div>
              </div>
              <div className="p-4 border rounded-lg flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Confidence Meter</p>
                  <p className="text-xs text-gray-500">Voice & tone monitoring...</p>
                </div>
              </div>
              <div className="p-4 border rounded-lg flex items-center gap-3">
                <Activity className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Fraudulence Check</p>
                  <p className="text-xs text-gray-500">Verifying candidate identity...</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="text-sm text-gray-600">
          <p className="mb-2">
            Tips: Maintain eye contact, speak clearly, and structure answers
            logically.
          </p>
          <p className="text-gray-500">
            Note: This is a simulation. In final version, AI interviewer will ask
            questions dynamically based on your resume & responses.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LiveInterview;
