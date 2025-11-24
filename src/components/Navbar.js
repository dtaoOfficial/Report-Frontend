import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaUserCircle, FaSignOutAlt, FaBars, FaTimes,
  FaCog, FaUsers, FaClipboardList
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

  const closeMenu = () => setIsMobileMenuOpen(false);
  const dashboardPath = getDashboardPath();
  const profilePath = getProfilePath();
  const reportPath = getReportPath();

  const navLinkClass =
    'text-gray-600 hover:text-[#16a34a] font-medium transition-colors cursor-pointer';
  const mobileLinkClass =
    'block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#16a34a] hover:bg-gray-50';

  const linkVariants = {
    hidden: { opacity: 0, y: -6 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.nav
      className="bg-white/90 backdrop-blur-md border-b border-gray-200 fixed w-full z-50 top-0 shadow-sm"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      role="navigation"
      aria-label="Main Navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* 🪐 LOGO */}
          <Link
            to={dashboardPath}
            className="flex items-center gap-2 text-2xl font-bold text-[#16a34a]"
            aria-label="Go to Dashboard"
          >
            <motion.img
              src={logo}
              alt="Company Logo"
              className="w-8 h-8 object-contain"
              initial={{ rotate: -90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, type: 'spring' }}
            />
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-800"
            >
              DTAO&nbsp;BASE
            </motion.span>
          </Link>

          {/* 💻 Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {user && (
              <motion.div
                className="flex items-center gap-6"
                variants={linkVariants}
                initial="hidden"
                animate="visible"
                transition={{ staggerChildren: 0.08 }}
              >
                <span className="text-gray-900 font-semibold flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm">
                  <FaUserCircle className="text-gray-400 text-lg" />
                  {user.fullName || 'Unknown User'}
                </span>

                {/* ✅ Show bell only after login */}
                <NotificationBell />

                <Link
                  to={dashboardPath}
                  className={`${navLinkClass} ${location.pathname === dashboardPath ? 'text-[#16a34a]' : ''}`}
                >
                  Dashboard
                </Link>

                {reportPath && (
                  <Link
                    to={reportPath}
                    className={`${navLinkClass} flex items-center gap-1 ${location.pathname === reportPath ? 'text-[#16a34a]' : ''}`}
                  >
                    <FaClipboardList size={14} />
                    Reports
                  </Link>
                )}

                {user.roles.includes('ROLE_ADMIN') && (
                  <Link
                    to="/admin/manage-users"
                    className={`${navLinkClass} flex items-center gap-1 ${location.pathname.includes('manage-users') ? 'text-[#16a34a]' : ''}`}
                  >
                    <FaUsers className="inline mr-1" />
                    Manage Users
                  </Link>
                )}

                <Link
                  to={profilePath}
                  className={`${navLinkClass} flex items-center gap-1 ${location.pathname === profilePath ? 'text-[#16a34a]' : ''}`}
                >
                  <FaCog size={15} />
                  Profile
                </Link>

                <motion.button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="Logout"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaSignOutAlt size={20} />
                </motion.button>
              </motion.div>
            )}
          </div>

          {/* 📱 Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            {user && (
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-[#16a34a] focus:outline-none p-2"
                aria-label="Toggle Menu"
                whileTap={{ scale: 0.9 }}
              >
                {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* 📲 Mobile Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && user && (
          <motion.div
            className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full left-0 origin-top"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 pt-4 pb-6 space-y-2">
              <div className="px-3 py-3 text-gray-900 font-bold bg-gray-50 rounded-lg mb-4 flex items-center gap-3">
                <FaUserCircle className="text-[#16a34a] text-xl" />
                <div>
                  <p className="text-sm text-gray-500 font-normal">Signed in as</p>
                  <p>{user.fullName}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {user.roles.join(', ').replace(/ROLE_/g, '')}
                  </p>
                </div>
              </div>

              <Link to={dashboardPath} className={mobileLinkClass} onClick={closeMenu}>
                Dashboard
              </Link>

              {reportPath && (
                <Link to={reportPath} className={mobileLinkClass} onClick={closeMenu}>
                  Reports
                </Link>
              )}

              {user.roles.includes('ROLE_ADMIN') && (
                <Link to="/admin/manage-users" className={mobileLinkClass} onClick={closeMenu}>
                  Manage Users
                </Link>
              )}

              <Link to={profilePath} className={mobileLinkClass} onClick={closeMenu}>
                Profile
              </Link>

              <button
                onClick={() => {
                  handleLogout();
                  closeMenu();
                }}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
