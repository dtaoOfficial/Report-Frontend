import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom'; // ✅ Added useLocation
import { AnimatePresence } from 'framer-motion'; // ✅ Added AnimatePresence
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Common Pages
import { SystemProfile, PrincipalProfile, DeanProfile, ResourceProfile } from './pages/common/RoleProfile';

// Components
import SEOHelmet from './components/SEOHelmet';
import ScrollToTop from './components/ScrollToTop';
import Footer from './components/Footer';
import IntroScreen from './components/IntroScreen';
import NotificationBell from './components/NotificationBell';
import PageTransition from './components/PageTransition'; // ✅ Import Transition Wrapper
import useHealthPing from './hooks/useHealthPing'; 

// Assets
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
const DeanDashboard = lazy(() => import('./pages/dean/DeanDashboard'));
const ResourceDashboard = lazy(() => import('./pages/resources/ResourceDashboard'));

// Reports
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
  const location = useLocation(); // ✅ Get current route location

  return (
    <div className="flex flex-col min-h-screen">
      {isAuthenticated && (
        <div className="fixed top-4 right-4 z-50">
          <NotificationBell />
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-grow relative flex flex-col">
        {/* ✅ AnimatePresence makes the exit animation work */}
        <AnimatePresence mode="wait">
          {/* ✅ Pass location to Routes so it knows when to swap */}
          <Routes location={location} key={location.pathname}>
            
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
            <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
            <Route path="/verify-reset-otp" element={<PageTransition><VerifyResetOtp /></PageTransition>} />
            <Route path="/reset-password" element={<PageTransition><ResetPassword /></PageTransition>} />

            {/* PROTECTED ROUTES - Wrapped individually for smooth transitions */}
            
            {/* USER & ADMIN */}
            <Route element={<ProtectedRoute allowedRoles={['USER', 'ADMIN']} />}>
              <Route path="/user/dashboard" element={<PageTransition><UserDashboard /></PageTransition>} />
              <Route path="/user/profile" element={<PageTransition><UserProfile /></PageTransition>} />
              <Route path="/user/reports" element={<PageTransition><UserReports /></PageTransition>} />
            </Route>

            {/* ADMIN ONLY */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/admin/dashboard" element={<PageTransition><AdminDashboard /></PageTransition>} />
              <Route path="/admin/profile" element={<PageTransition><AdminProfile /></PageTransition>} />
              <Route path="/admin/manage-users" element={<PageTransition><ManageUsers /></PageTransition>} />
            </Route>

            {/* SYSTEM */}
            <Route element={<ProtectedRoute allowedRoles={['SYSTEM']} />}>
              <Route path="/system/dashboard" element={<PageTransition><SystemDashboard /></PageTransition>} />
              <Route path="/system/reports" element={<PageTransition><SystemReports /></PageTransition>} />
              <Route path="/system/profile" element={<PageTransition><SystemProfile /></PageTransition>} />
            </Route>

            {/* PRINCIPAL */}
            <Route element={<ProtectedRoute allowedRoles={['PRINCIPAL']} />}>
              <Route path="/principal/dashboard" element={<PageTransition><PrincipalDashboard /></PageTransition>} />
              <Route path="/principal/reports" element={<PageTransition><PrincipalReports /></PageTransition>} />
              <Route path="/principal/profile" element={<PageTransition><PrincipalProfile /></PageTransition>} /> 
            </Route>

            {/* DEAN */}
            <Route element={<ProtectedRoute allowedRoles={['DEAN']} />}>
              <Route path="/dean/dashboard" element={<PageTransition><DeanDashboard /></PageTransition>} />
              <Route path="/dean/reports" element={<PageTransition><DeanReports /></PageTransition>} />
              <Route path="/dean/profile" element={<PageTransition><DeanProfile /></PageTransition>} /> 
            </Route>

            {/* RESOURCES */}
            <Route element={<ProtectedRoute allowedRoles={['RESOURCES']} />}>
              <Route path="/resources/dashboard" element={<PageTransition><ResourceDashboard /></PageTransition>} />
              <Route path="/resources/reports" element={<PageTransition><ResourceReports /></PageTransition>} />
              <Route path="/resources/profile" element={<PageTransition><ResourceProfile /></PageTransition>} />
            </Route>

            {/* 404 Page */}
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
  useHealthPing(3000); // 🩺 Keep backend alive
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