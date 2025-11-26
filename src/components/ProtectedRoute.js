import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  // 🕒 Wait until AuthContext finishes checking user
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-alien-500">
        Checking authentication...
      </div>
    );
  }

  // 🧠 If user is not loaded yet, do NOT redirect — this prevents flash to home
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🧩 Normalize roles like ["ROLE_SYSTEM"] → ["SYSTEM"]
  const userRoles = (user.roles || []).map((r) => r.replace('ROLE_', ''));

  // 🛡️ Check if user has any allowed role for this route
  const hasPermission = allowedRoles.some((role) =>
    userRoles.includes(role)
  );

  if (!hasPermission) {
    return <Navigate to="/" replace />;
  }

  // ✅ Render Navbar + Protected Page Content
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default ProtectedRoute;
