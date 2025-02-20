import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem("token"); // Check if the user is logged in

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />; // Redirect to login if not authenticated
};

export default ProtectedRoute;