import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { LiveUpdateProvider } from './context/LiveUpdateContext'; // ✅ NEW
import { useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Common Pages
import { SystemProfile, PrincipalProfile } from './pages/common/RoleProfile';

// Components
import SEOHelmet from './components/SEOHelmet';
import ScrollToTop from './components/ScrollToTop';
import Footer from './components/Footer';
import IntroScreen from './components/IntroScreen';
import NotificationBell from './components/NotificationBell';
import PageTransition from './components/PageTransition';
import useHealthPing from './hooks/useHealthPing';

const companyLoader = process.env.PUBLIC_URL + '/assets/companyLoader.webm';

// Lazy Load Pages
const NotFound = lazy(() => import('./pages/public/NotFound'));
const LandingPage = lazy(() => import('./components/LandingPage'));
const Login = lazy(() => import('./pages/public/Login'));
const Register = lazy(() => import('./pages/public/Register'));
const ForgotPassword = lazy(() => import('./pages/public/ForgotPassword'));
const VerifyResetOtp = lazy(() => import('./pages/public/VerifyResetOtp'));
const ResetPassword = lazy(() => import('./pages/public/ResetPassword'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));

// Dashboards
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const UserDashboard = lazy(() => import('./pages/user/UserDashboard'));
const UserProfile = lazy(() => import('./pages/user/UserProfile'));
const AdminProfile = lazy(() => import('./pages/admin/AdminProfile'));
const ManageUsers = lazy(() => import('./pages/admin/ManageUsers'));
const SystemDashboard = lazy(() => import('./pages/system/SystemDashboard'));
const PrincipalDashboard = lazy(() => import('./pages/principal/PrincipalDashboard'));

// Reports
const UserReports = lazy(() => import('./pages/user/UserReports'));
const SystemReports = lazy(() => import('./pages/system/SystemReports'));
const SystemCompletedReports = lazy(() => import('./pages/system/SystemCompletedReports'));
const PrincipalReports = lazy(() => import('./pages/principal/PrincipalReports'));

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
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      {isAuthenticated && (
        <div className="fixed top-4 right-4 z-50">
          <NotificationBell />
        </div>
      )}

      <main className="flex-grow relative flex flex-col">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* 🌐 Public Routes */}
            <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
            <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
            <Route path="/verify-reset-otp" element={<PageTransition><VerifyResetOtp /></PageTransition>} />
            <Route path="/reset-password" element={<PageTransition><ResetPassword /></PageTransition>} />

            {/* 👤 User */}
            <Route element={<ProtectedRoute allowedRoles={['USER', 'ADMIN']} />}>
              <Route path="/user/dashboard" element={<PageTransition><UserDashboard /></PageTransition>} />
              <Route path="/user/profile" element={<PageTransition><UserProfile /></PageTransition>} />
              <Route path="/user/reports" element={<PageTransition><UserReports /></PageTransition>} />
            </Route>

            {/* 🛠️ Admin */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/admin/dashboard" element={<PageTransition><AdminDashboard /></PageTransition>} />
              <Route path="/admin/profile" element={<PageTransition><AdminProfile /></PageTransition>} />
              <Route path="/admin/manage-users" element={<PageTransition><ManageUsers /></PageTransition>} />
            </Route>

            {/* 💻 System Department */}
            <Route element={<ProtectedRoute allowedRoles={['SYSTEM']} />}>
              <Route path="/system/dashboard" element={<PageTransition><SystemDashboard /></PageTransition>} />
              <Route path="/system/reports" element={<PageTransition><SystemReports /></PageTransition>} />
              <Route path="/system/completed" element={<PageTransition><SystemCompletedReports /></PageTransition>} />
              <Route path="/system/profile" element={<PageTransition><SystemProfile /></PageTransition>} />
            </Route>

            {/* 🧑‍💼 Principal */}
            <Route element={<ProtectedRoute allowedRoles={['PRINCIPAL']} />}>
              <Route path="/principal/dashboard" element={<PageTransition><PrincipalDashboard /></PageTransition>} />
              <Route path="/principal/reports" element={<PageTransition><PrincipalReports /></PageTransition>} />
              <Route path="/principal/profile" element={<PageTransition><PrincipalProfile /></PageTransition>} />
            </Route>

            {/* 🚫 404 Page */}
            <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>

      <Footer />
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
    </div>
  );
}

function App() {
  useHealthPing(3000);
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
        <LiveUpdateProvider> {/* ✅ Real-time provider */}
          <ScrollToTop />
          <SEOHelmet
            title="DTAO BASE | Report Management System"
            description="Streamlined workflow automation for System and Principal roles in DTAO BASE."
            keywords="DTAO, Report System, Workflow, Principal, System Department"
          />
          <Suspense fallback={<Loader />}>
            <AppContent />
          </Suspense>
        </LiveUpdateProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
