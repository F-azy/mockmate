import React from "react";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
      {/* Logo / Brand */}
      <div className="text-2xl font-bold text-gray-800">
        MockMate
      </div>

      {/* Links */}
      <div className="flex items-center space-x-4">
        <a href="/signin" className="text-gray-700 hover:text-gray-900 font-medium">
          Sign In
        </a>
        <a
          href="/signup"
          className="px-4 py-2 rounded-md text-white font-medium"
          style={{
            background: "linear-gradient(90deg, #ff66c4, #8a2be2, #00bfff)"
          }}
        >
          Sign Up
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
