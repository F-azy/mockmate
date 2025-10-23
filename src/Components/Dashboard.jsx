import React, { useState, useEffect } from "react";
import { Upload, FileText, Video, CheckCircle, TrendingUp, Zap, X, Loader } from "lucide-react";
import DashboardNavbar from "./DashboardNavbar";
import { Link } from "react-router-dom";

const API_BASE = "http://localhost:5000/api";

const Dashboard = () => {
  const [userName, setUserName] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [jobRoles, setJobRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [myResumes, setMyResumes] = useState([]);

  // Get user info from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserName(user.name || "User");
    }
    fetchJobRoles();
    fetchMyResumes();
  }, []);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
      "Authorization": `Bearer ${token}`,
    };
  };

  const fetchJobRoles = async () => {
    try {
      const res = await fetch(`${API_BASE}/job-roles`, {
        headers: getAuthHeader()
      });
      const data = await res.json();
      if (res.ok) {
        setJobRoles(data.roles);
      }
    } catch (err) {
      console.error("Error fetching job roles:", err);
    }
  };

  const fetchMyResumes = async () => {
    try {
      const res = await fetch(`${API_BASE}/resumes/my-resumes`, {
        headers: getAuthHeader()
      });
      const data = await res.json();
      if (res.ok) {
        setMyResumes(data.resumes);
      }
    } catch (err) {
      console.error("Error fetching resumes:", err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (!allowedTypes.includes(file.type)) {
        setUploadError("Only PDF, DOC, and DOCX files are allowed");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("File size must be less than 5MB");
        return;
      }
      setSelectedFile(file);
      setUploadError("");
    }
  };

  const handleUploadResume = async () => {
    if (!selectedFile) {
      setUploadError("Please select a file");
      return;
    }
    if (!selectedRole) {
      setUploadError("Please select a job role");
      return;
    }

    setIsUploading(true);
    setUploadError("");
    setUploadSuccess("");

    try {
      const formData = new FormData();
      formData.append("resume", selectedFile);
      formData.append("roleId", selectedRole);

      const res = await fetch(`${API_BASE}/resumes/upload`, {
        method: "POST",
        headers: getAuthHeader(),
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Upload failed");
      }

      setUploadSuccess("Resume uploaded successfully!");
      
      // Analyze the resume
      const resumeId = data.resume.id;
      await analyzeResume(resumeId);
      
      // Refresh resume list
      await fetchMyResumes();
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setShowUploadModal(false);
        setSelectedFile(null);
        setSelectedRole("");
        setUploadSuccess("");
      }, 2000);

    } catch (err) {
      console.error("Upload error:", err);
      setUploadError(err.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const analyzeResume = async (resumeId) => {
    try {
      const res = await fetch(`${API_BASE}/resumes/analyze/${resumeId}`, {
        method: "POST",
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json"
        }
      });

      const data = await res.json();
      if (res.ok) {
        console.log("Analysis complete:", data.analysis);
      }
    } catch (err) {
      console.error("Analysis error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardNavbar userName={userName} />

      <div className="min-h-screen bg-gray-100 p-8">
        {/* Welcome Message */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Welcome back, {userName}
        </h1>

        {/* Resume Upload */}
        <div className="bg-white p-6 rounded-2xl shadow-md flex items-center mb-8">
          <Upload className="w-8 h-8 text-blue-500 mr-4" />
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-800 mb-1">Upload your Resume</h2>
            <p className="text-gray-600 text-sm">
              {myResumes.length > 0 
                ? `You have ${myResumes.length} resume${myResumes.length > 1 ? 's' : ''} uploaded`
                : "Improve feedback by tailoring practice to your resume"}
            </p>
          </div>
          <button 
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Upload
          </button>
        </div>

        {/* Practice Options */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Quick Practice */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-sm font-semibold text-blue-500 mb-2">Quick Practice</h3>
            <h2 className="text-lg font-bold text-gray-800 mb-3">
              Text-based interview questions with AI feedback
            </h2>
            <ul className="text-gray-600 text-sm space-y-1 mb-4">
              <li>• AI-generated questions</li>
              <li>• Audio recording & transcription</li>
              <li>• Detailed written feedback</li>
              <li>• 5–10 minute sessions</li>
              <li>• Great for introverts & private practice</li>
            </ul>
            <Link to="/quick-practice">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Start Quick Practice
              </button>
            </Link>
          </div>

          {/* Live Interview */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-sm font-semibold text-purple-500 mb-2">Live Interview</h3>
            <h2 className="text-lg font-bold text-gray-800 mb-3">
              Upload your recorded video answers for feedback
            </h2>
            <ul className="text-gray-600 text-sm space-y-1 mb-4">
              <li>• Realistic interview scenarios</li>
              <li>• Dynamic follow-up questions</li>
              <li>• 5–8 minute sessions</li>
              <li>• Instant improvement tips</li>
            </ul>
            <Link to="/live-interview">
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Upload Video
              </button>
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-md flex items-center">
            <FileText className="w-6 h-6 text-blue-500 mr-3" />
            <div>
              <p className="text-gray-600 text-sm">Total Sessions</p>
              <p className="text-xl font-bold text-gray-800">0</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md flex items-center">
            <TrendingUp className="w-6 h-6 text-green-500 mr-3" />
            <div>
              <p className="text-gray-600 text-sm">Completed</p>
              <p className="text-xl font-bold text-gray-800">0</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md flex items-center">
            <Zap className="w-6 h-6 text-yellow-500 mr-3" />
            <div>
              <p className="text-gray-600 text-sm">Resumes Uploaded</p>
              <p className="text-xl font-bold text-gray-800">{myResumes.length}</p>
            </div>
          </div>
        </div>

        {/* Recent Resumes */}
        {myResumes.length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-4">My Resumes</h2>
            <div className="space-y-3">
              {myResumes.map((resume) => (
                <div key={resume.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-800">{resume.filename}</p>
                      <p className="text-xs text-gray-500">
                        {resume.roleName} • {new Date(resume.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    resume.status === 'analyzed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {resume.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Upload Resume</h2>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Job Role Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Target Job Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a job role</option>
                  {jobRoles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name} {role.industry && `(${role.industry})`}
                    </option>
                  ))}
                </select>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Resume File
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    id="resume-upload"
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {selectedFile ? selectedFile.name : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PDF, DOC, DOCX (Max 5MB)
                    </p>
                  </label>
                </div>
              </div>

              {/* Error Message */}
              {uploadError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{uploadError}</p>
                </div>
              )}

              {/* Success Message */}
              {uploadSuccess && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
                  <CheckCircle size={18} className="text-green-600" />
                  <p className="text-green-600 text-sm">{uploadSuccess}</p>
                </div>
              )}

              {/* Upload Button */}
              <button
                onClick={handleUploadResume}
                disabled={isUploading || !selectedFile || !selectedRole}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isUploading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <span>Upload & Analyze</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;