import React, { useState } from "react";
import { Star, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle, Users, Zap, Shield, AlertCircle } from "lucide-react";

const API_BASE = "http://localhost:5000/api/auth";

const Signin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setIsLoading(true);

    // Client-side validation
    if (!email.trim()) {
      setError("Please enter your email address");
      setIsLoading(false);
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store token and user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to dashboard
      window.location.href = "/dashboard";

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl"></div>

      {/* Left Side - Enhanced Gradient with Interactive Elements */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center text-white p-12 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #2a003f, #3b0a77, #001f3f, #4c1d95)"
        }}
      >
        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full backdrop-blur-sm animate-pulse"></div>
        <div className="absolute top-1/2 right-10 w-16 h-16 bg-pink-400/20 rounded-full backdrop-blur-sm animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-blue-400/20 rounded-full backdrop-blur-sm animate-pulse delay-2000"></div>

        {/* Main Content */}
        <div className="relative z-10 text-center max-w-md">
          <div className="mb-8">
            <div className="flex items-center justify-center mb-4">
              <Star className="text-yellow-300 animate-pulse" size={24} />
              <span className="ml-2 text-lg font-medium">Welcome Back!</span>
            </div>
            <h2 className="text-5xl font-black mb-6 leading-tight">
              Continue Your{" "}
              <span className="bg-gradient-to-r from-pink-300 to-blue-300 bg-clip-text text-transparent">
                Interview
              </span>{" "}
              Journey
            </h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Pick up right where you left off and keep improving your interview skills with AI-powered practice.
            </p>
          </div>

          {/* Stats/Benefits */}
          <div className="grid grid-cols-1 gap-4 mt-12">
            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                <Users size={18} className="text-green-300" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-white">Track Your Progress</div>
                <div className="text-sm text-white/70">See your improvement over time</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                <Zap size={18} className="text-purple-300" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-white">Personalized Feedback</div>
                <div className="text-sm text-white/70">Tailored to your responses</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Shield size={18} className="text-blue-300" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-white">Secure & Private</div>
                <div className="text-sm text-white/70">Your data is safe with us</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Enhanced Signin Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4 lg:hidden">
              <div className="text-3xl font-bold text-gray-900">
                Mock<span className="text-purple-600">Mate</span>
              </div>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Welcome Back</h2>
            <p className="text-lg text-gray-600">Sign in to continue your practice</p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20">
              {/* Email Field */}
              <div className="space-y-2 mb-6">
                <label className="block text-gray-700 font-semibold text-sm">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-300"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center">
                  <label className="block text-gray-700 font-semibold text-sm">Password</label>
                  <a href="/forgot-password" className="text-sm text-purple-600 hover:text-purple-700 transition-colors">
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full py-4 text-white rounded-xl font-bold text-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-lg relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed mt-6"
                style={{
                  background: "linear-gradient(45deg, #ff66c4, #8a2be2, #00bfff)"
                }}
              >
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              </button>

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                  <AlertCircle size={18} className="text-red-600 flex-shrink-0" />
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Sign Up Link */}
              <p className="text-center text-sm mt-6 text-gray-600">
                Don't have an account?{" "}
                <a href="/signup" className="text-purple-600 font-semibold hover:text-purple-700 transition-colors">
                  Sign Up
                </a>
              </p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 flex items-center justify-center space-x-2 text-xs text-gray-500">
            <Shield size={14} />
            <span>Your connection is secure and encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;