import React from "react";
import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DashboardNavbar = ({ userName = "User" }) => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Clear authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Redirect to signin
    navigate("/signin");
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
      {/* Logo / Brand */}
      <div className="text-2xl font-bold text-gray-800">MockMate</div>

      {/* Right Section */}
      <div className="flex items-center space-x-6">
        {/* Profile Info */}
        <div className="flex items-center space-x-2">
          <User className="w-6 h-6 text-gray-600" />
          <div>
            <p className="text-gray-800 font-semibold">{userName}</p>
            <p className="text-xs text-green-500">Active user</p>
          </div>
        </div>

        {/* Sign Out */}
        <button 
          onClick={handleSignOut}
          className="flex items-center text-red-600 hover:text-red-800 font-medium transition-colors"
        >
          <LogOut className="w-5 h-5 mr-1" />
          Sign Out
        </button>
      </div>
    </nav>
  );
};

export default DashboardNavbar;