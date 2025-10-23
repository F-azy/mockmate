import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import your pages/components
import Home from "./Components/Home";
import Signin from "./Components/Signin";
import Signup from "./Components/Signup";
import Dashboard from "./Components/Dashboard";
import QuickPractice from "./Components/QuickPractice";
import LiveInterview from "./Components/LiveInterview";

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Home />} />

        {/* Authentication Pages */}
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/dashboard" element={<Dashboard />} />
        
        <Route path="/quick-practice" element={<QuickPractice />} />
        
        <Route path="/live-interview" element={<LiveInterview />} />
      </Routes>
    </Router>
  );
}

export default App;

