import React, { useState } from "react";
import { Star, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle, Users, Zap, Shield, User } from "lucide-react";

const API_BASE = "http://localhost:5000/api/auth";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    console.log("🔄 Starting signup process...");

    // Client-side validation
    if (!name.trim()) {
      setError("Please enter your full name");
      setIsLoading(false);
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    console.log("✅ Validation passed, sending request...");

    try {
      const requestData = { name, email, password };
      console.log("📤 Request data:", { name, email, password: "****" });

      const res = await fetch(`${API_BASE}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
      });

      console.log("📥 Response status:", res.status);

      const data = await res.json();
      console.log("📥 Response data:", data);

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Store token and user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      console.log("✅ Signup successful!");
      setSuccess("Account created successfully! Redirecting...");
      
      // Redirect to dashboard after 1.5 seconds
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);

    } catch (err) {
      console.error("❌ Signup error:", err);
      setError(err.message || "Something went wrong. Please try again.");
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
              <span className="ml-2 text-lg font-medium">AI-Powered</span>
            </div>
            <h2 className="text-5xl font-black mb-6 leading-tight">
              Master your next{" "}
              <span className="bg-gradient-to-r from-pink-300 to-blue-300 bg-clip-text text-transparent">
                interview
              </span>{" "}
              with AI
            </h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Get personalized feedback and practice questions tailored to your resume and career goals.
            </p>
          </div>

          {/* Stats/Benefits */}
          <div className="grid grid-cols-1 gap-4 mt-12">
            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                <Users size={18} className="text-green-300" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-white">50,000+ Users</div>
                <div className="text-sm text-white/70">Already practicing with us</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                <Zap size={18} className="text-purple-300" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-white">AI-Generated Questions</div>
                <div className="text-sm text-white/70">Unique every time</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Shield size={18} className="text-blue-300" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-white">100% Secure</div>
                <div className="text-sm text-white/70">Your data is protected</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Enhanced Signup Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4 lg:hidden">
              <div className="text-3xl font-bold text-gray-900">
                Mock<span className="text-purple-600">Mate</span>
              </div>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Create Account</h2>
            <p className="text-lg text-gray-600">Start your interview practice journey</p>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              <CheckCircle size={16} />
              <span>Free to start</span>
            </div>
            <div className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              <Shield size={16} />
              <span>No credit card</span>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20">
              {/* Name Field */}
              <div className="space-y-2 mb-6">
                <label className="block text-gray-700 font-semibold text-sm">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-300"
                    required
                  />
                </div>
              </div>

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
              <div className="space-y-2 mb-6">
                <label className="block text-gray-700 font-semibold text-sm">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
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
                <p className="text-xs text-gray-500 mt-1">
                  Must be at least 8 characters long
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full py-4 text-white rounded-xl font-bold text-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-lg relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(45deg, #ff66c4, #8a2be2, #00bfff)"
                }}
              >
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              </button>

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
                  <CheckCircle size={18} className="text-green-600" />
                  <p className="text-green-600 text-sm font-medium">{success}</p>
                </div>
              )}

              {/* Sign In Link */}
              <p className="text-center text-sm mt-6 text-gray-600">
                Already have an account?{" "}
                <a href="/signin" className="text-purple-600 font-semibold hover:text-purple-700 transition-colors">
                  Sign In
                </a>
              </p>
            </div>
          </div>

          {/* Terms */}
          <p className="text-center text-xs text-gray-500 mt-6">
            By creating an account, you agree to our{" "}
            <a href="#" className="text-purple-600 hover:underline">Terms of Service</a>{" "}
            and{" "}
            <a href="#" className="text-purple-600 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;