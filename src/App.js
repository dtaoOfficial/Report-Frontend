import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';
import { SystemProfile, PrincipalProfile, DeanProfile, ResourceProfile } from './pages/common/RoleProfile';

import SEOHelmet from './components/SEOHelmet';
import ScrollToTop from './components/ScrollToTop';
import Footer from './components/Footer';
import IntroScreen from './components/IntroScreen';
import NotificationBell from './components/NotificationBell';
import useHealthPing from './hooks/useHealthPing'; // 🩺 keep Render backend alive

const companyLoader = process.env.PUBLIC_URL + '/assets/companyLoader.webm';
const NotFound = lazy(() => import('./pages/public/NotFound'));
const LandingPage = lazy(() => import('./components/LandingPage'));
const Login = lazy(() => import('./pages/public/Login'));
const Register = lazy(() => import('./pages/public/Register'));
const ForgotPassword = lazy(() => import('./pages/public/ForgotPassword'));
const VerifyResetOtp = lazy(() => import('./pages/public/VerifyResetOtp'));
const ResetPassword = lazy(() => import('./pages/public/ResetPassword'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const UserDashboard = lazy(() => import('./pages/user/UserDashboard'));
const UserProfile = lazy(() => import('./pages/user/UserProfile'));
const AdminProfile = lazy(() => import('./pages/admin/AdminProfile'));
const ManageUsers = lazy(() => import('./pages/admin/ManageUsers'));
const SystemDashboard = lazy(() => import('./pages/system/SystemDashboard'));
const PrincipalDashboard = lazy(() => import('./pages/principal/PrincipalDashboard'));
const DeanDashboard = lazy(() => import('./pages/dean/DeanDashboard'));
const ResourceDashboard = lazy(() => import('./pages/resources/ResourceDashboard'));
const UserReports = lazy(() => import('./pages/user/UserReports'));
const SystemReports = lazy(() => import('./pages/system/SystemReports'));
const PrincipalReports = lazy(() => import('./pages/principal/PrincipalReports'));
const DeanReports = lazy(() => import('./pages/dean/DeanReports'));
const ResourceReports = lazy(() => import('./pages/resources/ResourceReports'));

const Loader = () => (
  <div className="flex items-center justify-center min-h-screen bg-white">
    <video
      src={companyLoader}
      autoPlay
      loop
      muted
      playsInline
      className="w-48 h-48 object-contain"
    />
  </div>
);

function AppContent() {
  const { user } = useAuth();
  const isAuthenticated = user && (user.token || user.role);

  return (
    <motion.div
      className="flex flex-col min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {isAuthenticated && (
        <div className="fixed top-4 right-4 z-50">
          <NotificationBell />
        </div>
      )}

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-reset-otp" element={<VerifyResetOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route element={<ProtectedRoute allowedRoles={['USER', 'ADMIN']} />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/profile" element={<UserProfile />} />
            <Route path="/user/reports" element={<UserReports />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/profile" element={<AdminProfile />} />
            <Route path="/admin/manage-users" element={<ManageUsers />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['SYSTEM']} />}>
            <Route path="/system/dashboard" element={<SystemDashboard />} />
            <Route path="/system/reports" element={<SystemReports />} />
            <Route path="/system/profile" element={<SystemProfile />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['PRINCIPAL']} />}>
            <Route path="/principal/dashboard" element={<PrincipalDashboard />} />
            <Route path="/principal/reports" element={<PrincipalReports />} />
            <Route path="/principal/profile" element={<PrincipalProfile />} /> 
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['DEAN']} />}>
            <Route path="/dean/dashboard" element={<DeanDashboard />} />
            <Route path="/dean/reports" element={<DeanReports />} />
            <Route path="/dean/profile" element={<DeanProfile />} /> 
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['RESOURCES']} />}>
            <Route path="/resources/dashboard" element={<ResourceDashboard />} />
            <Route path="/resources/reports" element={<ResourceReports />} />
            <Route path="/resources/profile" element={<ResourceProfile />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
    </motion.div>
  );
}

function App() {
  useHealthPing(3000); // 🩺 ping backend every 3s to prevent Render sleep
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIntroDone(true), 4000);
    return () => clearTimeout(timeout);
  }, []);

  if (!introDone) {
    return <IntroScreen onFinish={() => setIntroDone(true)} />;
  }

  return (
    <AuthProvider>
      <NotificationProvider>
        <ScrollToTop />
        <SEOHelmet
          title="DTAO BASE | Multi-Department Report Management"
          description="A powerful workflow platform for managing and approving reports across departments in DTAO BASE."
          keywords="DTAO, Report System, Workflow, Admin Dashboard, University Reports"
        />
        <Suspense fallback={<Loader />}>
          <AppContent />
        </Suspense>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
