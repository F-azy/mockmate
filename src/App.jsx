import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import your pages/components
import Home from "./Components/Home";
import Signin from "./Components/Signin";
import Signup from "./Components/Signup";
import Dashboard from "./Components/Dashboard";
import QuickPractice from "./Components/QuickPractice";
import LiveInterview from "./Components/LiveInterview";
import ProtectedRoute from "./Components/ProtectedRoute";
import AptitudePractice from "./Components/AptitudePractice";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/quick-practice" 
          element={
            <ProtectedRoute>
              <QuickPractice />
            </ProtectedRoute>
          } 
        />
           {/* NEW: Aptitude Practice Route */}
        <Route 
          path="/aptitude-practice" 
          element={
            <ProtectedRoute>
              <AptitudePractice />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/live-interview" 
          element={
            <ProtectedRoute>
              <LiveInterview />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;