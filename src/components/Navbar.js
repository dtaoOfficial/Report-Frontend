import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaSignOutAlt, FaBars, FaTimes,
  FaCog, FaUsers, FaClipboardList, FaChartPie, FaCheckCircle
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/companyLogo.webp';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // 🧠 Helper paths
  const getDashboardPath = () => {
    if (user?.roles?.includes('ROLE_ADMIN')) return '/admin/dashboard';
    if (user?.roles?.includes('ROLE_SYSTEM')) return '/system/dashboard';
    if (user?.roles?.includes('ROLE_PRINCIPAL')) return '/principal/dashboard';
    if (user?.roles?.includes('ROLE_DEAN')) return '/dean/dashboard';
    if (user?.roles?.includes('ROLE_RESOURCES')) return '/resources/dashboard';
    return '/user/dashboard';
  };

  const getProfilePath = () => {
    if (user?.roles?.includes('ROLE_ADMIN')) return '/admin/profile';
    if (user?.roles?.includes('ROLE_SYSTEM')) return '/system/profile';
    if (user?.roles?.includes('ROLE_PRINCIPAL')) return '/principal/profile';
    if (user?.roles?.includes('ROLE_DEAN')) return '/dean/profile';
    if (user?.roles?.includes('ROLE_RESOURCES')) return '/resources/profile';
    return '/user/profile';
  };

  const getReportPath = () => {
    if (user?.roles?.includes('ROLE_USER')) return '/user/reports';
    if (user?.roles?.includes('ROLE_SYSTEM')) return '/system/reports';
    if (user?.roles?.includes('ROLE_PRINCIPAL')) return '/principal/reports';
    if (user?.roles?.includes('ROLE_DEAN')) return '/dean/reports';
    if (user?.roles?.includes('ROLE_RESOURCES')) return '/resources/reports';
    return null;
  };

  // ✅ Completed Reports Path (for System role)
  const getCompletedPath = () => {
    if (user?.roles?.includes('ROLE_SYSTEM')) return '/system/completed';
    return null;
  };

  const closeMenu = () => setIsMobileMenuOpen(false);
  const dashboardPath = getDashboardPath();
  const profilePath = getProfilePath();
  const reportPath = getReportPath();
  const completedPath = getCompletedPath();

  // 🎨 Active Link Logic
  const isActive = (path) => location.pathname === path;

  // 🧱 Styles
  const navLinkBase = "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200";
  const navLinkActive = "bg-[#16a34a]/10 text-[#16a34a]";
  const navLinkInactive = "text-gray-500 hover:bg-gray-50 hover:text-gray-900";
  const mobileLinkClass = "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors";

  return (
    <motion.nav
      className="bg-white/80 backdrop-blur-md border-b border-gray-200 fixed w-full z-50 top-0"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* 🪐 LOGO */}
          <Link to={dashboardPath} className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-[#16a34a]/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <img src={logo} alt="Company Logo" className="w-10 h-10 object-contain relative z-10" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-900 leading-none">
                DTAO <span className="text-[#16a34a]">BASE</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mt-0.5">
                System's & Network
              </span>
            </div>
          </Link>

          {/* 💻 DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-2">
            {user && (
              <>
                <Link
                  to={dashboardPath}
                  className={`${navLinkBase} ${isActive(dashboardPath) ? navLinkActive : navLinkInactive}`}
                >
                  <FaChartPie size={16} />
                  Dashboard
                </Link>

                {reportPath && (
                  <Link
                    to={reportPath}
                    className={`${navLinkBase} ${isActive(reportPath) ? navLinkActive : navLinkInactive}`}
                  >
                    <FaClipboardList size={16} />
                    Reports
                  </Link>
                )}

                {/* ✅ Completed Reports (Only for SYSTEM role) */}
                {user.roles.includes('ROLE_SYSTEM') && (
                  <Link
                    to={completedPath}
                    className={`${navLinkBase} ${isActive(completedPath) ? navLinkActive : navLinkInactive}`}
                  >
                    <FaCheckCircle size={16} />
                    Completed Reports
                  </Link>
                )}

                {user.roles.includes('ROLE_ADMIN') && (
                  <Link
                    to="/admin/manage-users"
                    className={`${navLinkBase} ${location.pathname.includes('manage-users') ? navLinkActive : navLinkInactive}`}
                  >
                    <FaUsers size={16} />
                    Users
                  </Link>
                )}

                {/* Divider */}
                <div className="h-6 w-px bg-gray-200 mx-2"></div>

                {/* Notifications */}
                <div className="mr-2">
                  <NotificationBell />
                </div>

                {/* Profile */}
                <Link
                  to={profilePath}
                  className={`flex items-center gap-3 pl-1 pr-4 py-1 rounded-full border transition-all ${
                    isActive(profilePath)
                      ? 'bg-gray-50 border-[#16a34a] ring-1 ring-[#16a34a]/20'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#16a34a] to-[#4ade80] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-bold text-gray-700 leading-tight max-w-[100px] truncate">
                      {user.fullName}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium leading-none">
                      Profile
                    </span>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors ml-1"
                  title="Logout"
                >
                  <FaSignOutAlt size={18} />
                </button>
              </>
            )}
          </div>

          {/* 📱 MOBILE MENU BUTTON */}
          <div className="md:hidden flex items-center gap-4">
            {user && <NotificationBell />}
            {user && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-[#16a34a] p-2 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none"
              >
                {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 📲 MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && user && (
          <motion.div
            className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 absolute w-full left-0 shadow-2xl"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="p-4 space-y-1">
              {/* User Info */}
              <div className="flex items-center gap-3 px-4 py-4 mb-2 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-[#16a34a] flex items-center justify-center text-white font-bold">
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">{user.fullName}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>

              <Link
                to={dashboardPath}
                className={`${mobileLinkClass} ${isActive(dashboardPath) ? 'bg-[#16a34a]/10 text-[#16a34a]' : 'text-gray-600'}`}
                onClick={closeMenu}
              >
                <FaChartPie className="text-lg" /> Dashboard
              </Link>

              {reportPath && (
                <Link
                  to={reportPath}
                  className={`${mobileLinkClass} ${isActive(reportPath) ? 'bg-[#16a34a]/10 text-[#16a34a]' : 'text-gray-600'}`}
                  onClick={closeMenu}
                >
                  <FaClipboardList className="text-lg" /> Reports
                </Link>
              )}

              {/* ✅ Completed Reports Mobile */}
              {user.roles.includes('ROLE_SYSTEM') && (
                <Link
                  to={completedPath}
                  className={`${mobileLinkClass} ${isActive(completedPath) ? 'bg-[#16a34a]/10 text-[#16a34a]' : 'text-gray-600'}`}
                  onClick={closeMenu}
                >
                  <FaCheckCircle className="text-lg" /> Completed Reports
                </Link>
              )}

              <Link
                to={profilePath}
                className={`${mobileLinkClass} ${isActive(profilePath) ? 'bg-[#16a34a]/10 text-[#16a34a]' : 'text-gray-600'}`}
                onClick={closeMenu}
              >
                <FaCog className="text-lg" /> Profile Settings
              </Link>

              <div className="h-px bg-gray-100 my-2 mx-4"></div>

              <button
                onClick={() => {
                  handleLogout();
                  closeMenu();
                }}
                className={`${mobileLinkClass} w-full text-red-600 hover:bg-red-50`}
              >
                <FaSignOutAlt className="text-lg" /> Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
