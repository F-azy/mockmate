import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    // Not authenticated, redirect to signin
    return <Navigate to="/signin" replace />;
  }
  
  return children;
};

export default ProtectedRoute;