import React from "react";
import { Star, Zap, Heart, MessageSquare, ArrowRight, CheckCircle, Users, Shield, Clock } from "lucide-react";

// Mock Navbar component
const Navbar = () => {
  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white/5 backdrop-blur-sm border-b border-white/10">
      <div className="text-2xl font-bold text-white">
        Mock<span className="text-purple-300">Mate</span>
      </div>
      <div className="flex items-center space-x-6">
        <a href="#" className="text-white/80 hover:text-white transition-colors">Features</a>
        <a href="#" className="text-white/80 hover:text-white transition-colors">Pricing</a>
        <a href="/signin" className="text-white/80 hover:text-white transition-colors">Login</a>
        <a href="/signup" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors">
          Sign Up
        </a>
      </div>
    </nav>
  );
};

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div
        className="min-h-screen flex flex-col relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #2a003f, #3b0a77, #001f3f, #4c1d95)"
        }}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <Navbar />
        
        <div className="flex flex-col items-center justify-center flex-1 text-center text-white px-6 relative z-10">
          {/* AI powered badge */}
          <div className="mb-8 animate-fade-in">
            <p className="text-lg border border-purple-300/30 px-4 py-2 rounded-full flex items-center space-x-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <Star size={18} className="text-yellow-300 animate-pulse" />
              <span className="font-medium">AI-powered interview practice</span>
            </p>
          </div>

          {/* Main Heading with enhanced styling */}
          <h1 className="text-6xl md:text-7xl font-black mb-6 drop-shadow-2xl leading-tight animate-fade-in-up">
            Ace your{" "}
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
              Dream Job
            </span>{" "}
            Interview
          </h1>

          {/* Enhanced subtext */}
          <p className="max-w-3xl mb-8 text-xl text-white/90 leading-relaxed animate-fade-in-up delay-200">
            Transform your interview anxiety into confidence with AI-generated questions, 
            real-time feedback, and personalized practice sessions.
          </p>

          {/* Enhanced CTA Button */}
          <div className="mb-8 animate-fade-in-up delay-400">
            <a
              href="/signup"
              className="group relative px-8 py-4 rounded-xl text-white font-bold shadow-2xl text-lg transition-all duration-300 hover:scale-105 hover:shadow-3xl flex items-center space-x-2"
              style={{
                background: "linear-gradient(45deg, #ff66c4, #8a2be2, #00bfff, #ff66c4)"
              }}
            >
              <span>Start Practicing Free</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
            </a>
          </div>

          {/* Enhanced trust badges */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-white/90 animate-fade-in-up delay-600">
            <div className="flex items-center space-x-2 border border-purple-300/30 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors">
              <CheckCircle size={16} className="text-green-400" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2 border border-purple-300/30 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors">
              <Shield size={16} className="text-blue-400" />
              <span>100% private & secure</span>
            </div>
            <div className="flex items-center space-x-2 border border-purple-300/30 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors">
              <Clock size={16} className="text-yellow-400" />
              <span>Start in 30 seconds</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interview Anxiety Section */}
      <div className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto text-center">
          {/* Main anxiety statement */}
          <div className="mb-12">
            <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Interview Anxiety is{" "}
              <span className="text-red-500 underline decoration-wavy decoration-red-300">Real</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Over 75% of professionals experience significant anxiety before interviews. 
              The fear of judgment, uncertainty about questions, and lack of practice can 
              sabotage even the most qualified candidates. But it doesn't have to be this way.
            </p>
          </div>

          {/* Three main problem cards */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {/* Lack of Practice Card */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                <Zap className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Lack of Practice</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Without regular practice, even simple questions can feel overwhelming. 
                Most people only practice when they have an upcoming interview, 
                making it feel unnatural and stressful.
              </p>
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center text-red-500 font-semibold">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                  68% feel unprepared
                </div>
              </div>
            </div>

            {/* Social Anxiety Card */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                <Heart className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Social Anxiety</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                The pressure of being evaluated by strangers triggers fight-or-flight responses. 
                Racing heart, sweaty palms, and mental blanks can derail even the most 
                prepared candidates.
              </p>
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center text-orange-500 font-semibold">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  45% experience physical symptoms
                </div>
              </div>
            </div>

            {/* No Feedback Card */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                <MessageSquare className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Feedback</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Traditional practice with friends or family lacks professional insight. 
                Without constructive feedback, you repeat the same mistakes and 
                never know what employers are really looking for.
              </p>
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center text-purple-500 font-semibold">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  82% want professional feedback
                </div>
              </div>
            </div>
          </div>

          {/* Solution teaser */}
          <div className="mt-16 p-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border border-purple-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              MockMate solves all three problems
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              Practice anytime with AI-generated questions, overcome social anxiety in a 
              judgment-free environment, and receive instant, actionable feedback to improve continuously.
            </p>
            <a
              href="/signup"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 hover:scale-105"
            >
              <span>Try MockMate Free</span>
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-6 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Why MockMate Works</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Built by interview experts and powered by advanced AI to give you the most 
              realistic and effective practice experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap size={36} />
              </div>
              <h3 className="text-xl font-bold mb-4">AI-Powered Questions</h3>
              <p className="text-gray-300">
                Dynamic questions tailored to your industry, role, and experience level. 
                Never practice with the same questions twice.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageSquare size={36} />
              </div>
              <h3 className="text-xl font-bold mb-4">Instant Feedback</h3>
              <p className="text-gray-300">
                Detailed analysis of your responses including content quality, 
                delivery, and areas for improvement with actionable suggestions.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users size={36} />
              </div>
              <h3 className="text-xl font-bold mb-4">Progress Tracking</h3>
              <p className="text-gray-300">
                Monitor your improvement over time with detailed analytics and 
                personalized recommendations for continued growth.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;