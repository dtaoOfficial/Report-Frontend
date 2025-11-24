import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar'; // Import Navbar here

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-alien-500">Loading...</div>;
  }

  // 1. Not Logged In? Go to Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Logged In but Wrong Role? Go Home (or Unauthorized page)
  // Backend sends roles like ["ROLE_ADMIN"], so we check if the list includes it
  const userRoles = user.roles.map(r => r.replace('ROLE_', '')); // Normalize to ADMIN/USER
  const hasPermission = allowedRoles.some(role => userRoles.includes(role));

  if (!hasPermission) {
    return <Navigate to="/" replace />;
  }

  // 3. Render Navbar + Content (Navbar only shows here!)
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default ProtectedRoute;