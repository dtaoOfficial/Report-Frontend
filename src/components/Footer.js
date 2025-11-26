import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTelegramPlane, FaInstagram, FaWhatsapp, FaShieldAlt, FaEnvelope, FaMapMarkerAlt, FaTimes, FaLock, FaCookieBite, FaFileContract, FaBug, FaQuestionCircle } from 'react-icons/fa';
import logo from '../assets/companyLogo.webp';

// 📜 CONTENT DATA (Real details about your project)
const MODAL_CONTENT = {
  SECURITY: {
    title: "Security Architecture",
    icon: <FaLock className="text-[#16a34a]" />,
    text: (
      <div className="space-y-4 text-sm text-gray-600">
        <p><strong>Authentication:</strong> We use <strong>JSON Web Tokens (JWT)</strong> for stateless, secure authentication. Every request is verified on the server-side using Spring Security.</p>
        <p><strong>Role-Based Access Control (RBAC):</strong> Access is strictly limited based on your role (Student, System, Dean, Principal). API endpoints are protected to ensure users cannot access unauthorized data.</p>
        <p><strong>Data Protection:</strong> All passwords are hashed using <strong>BCrypt</strong> before storage. Data in transit is encrypted via HTTPS.</p>
      </div>
    )
  },
  COOKIES: {
    title: "Cookie & Session Policy",
    icon: <FaCookieBite className="text-orange-500" />,
    text: (
      <div className="space-y-4 text-sm text-gray-600">
        <p><strong>Strictly Necessary Only:</strong> We do not use 3rd-party tracking or ad cookies.</p>
        <p><strong>Session Storage:</strong> Your JWT authentication token is stored in your browser's <strong>SessionStorage</strong>. This ensures that when you close the specific tab, your session is cleared automatically for security.</p>
        <p><strong>Usage:</strong> This storage is used solely to keep you logged in while you navigate between reports and dashboards.</p>
      </div>
    )
  },
  PRIVACY: {
    title: "Privacy Policy",
    icon: <FaShieldAlt className="text-blue-600" />,
    text: (
      <div className="space-y-4 text-sm text-gray-600">
        <p><strong>Data Collection:</strong> We only collect minimal data required for the reporting workflow: Name, Email, and Department Role.</p>
        <p><strong>Data Visibility:</strong> Your reports are visible only to the specific authorities in the approval chain (e.g., System Admin - Principal - Dean).</p>
        <p><strong>No Sharing:</strong> Your data is internal to the NHCE system and is never shared with external advertisers.</p>
      </div>
    )
  },
  TERMS: {
    title: "Terms of Service",
    icon: <FaFileContract className="text-gray-600" />,
    text: (
      <div className="space-y-4 text-sm text-gray-600">
        <p>By accessing DTAO BASE, you agree to use the platform strictly for official academic reporting purposes.</p>
        <p><strong>Prohibited:</strong> Spamming false reports, attempting to bypass role restrictions, or sharing credentials.</p>
        <p>Violation of these terms may result in account suspension by the System Administrator.</p>
      </div>
    )
  },
  HELP: {
    title: "Help Center",
    icon: <FaQuestionCircle className="text-purple-500" />,
    text: (
      <div className="space-y-4 text-sm text-gray-600">
        <p><strong>How to File a Report:</strong> Go to the "Reports" tab and click "Create New". Fill in the location and issue details.</p>
        <p><strong>Tracking Status:</strong> You can see the live status (Pending, Approved, Completed) on your dashboard.</p>
        <p><strong>Wrong Role?</strong> If you see the wrong dashboard, please contact the System Admin to update your profile.</p>
      </div>
    )
  },
  BUG: {
    title: "Report a Bug",
    icon: <FaBug className="text-red-500" />,
    text: (
      <div className="space-y-4 text-sm text-gray-600">
        <p>Found a glitch? We appreciate your help in making DTAO BASE better.</p>
        <p>Please email us at <strong>support@dtaobase.in</strong> with:</p>
        <ul className="list-disc pl-5">
          <li>Screenshots of the error</li>
          <li>Steps to reproduce the issue</li>
          <li>Your browser version</li>
        </ul>
      </div>
    )
  }
};

const Footer = () => {
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (key) => setActiveModal(MODAL_CONTENT[key]);
  const closeModal = () => setActiveModal(null);

  const socialLinks = [
    { icon: <FaTelegramPlane />, href: 'https://t.me/DTAOOFFICIAL', label: 'Telegram', color: 'hover:text-[#0088cc]' },
    { icon: <FaInstagram />, href: 'https://instagram.com/dtaoofficial', label: 'Instagram', color: 'hover:text-[#E4405F]' },
    { icon: <FaWhatsapp />, href: 'https://whatsapp.com/channel/0029Vb70Pr05kg6x0Lk1XP2E', label: 'WhatsApp', color: 'hover:text-[#25D366]' },
  ];

  return (
    <>
      <footer className="bg-white border-t border-gray-100 pt-16 pb-8 font-sans relative overflow-hidden">
        {/* 🌊 Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#16a34a] via-[#8B5E3C] to-[#16a34a] opacity-80"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            
            {/* 1. BRAND COLUMN */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <img src={logo} alt="DTAO Logo" className="w-10 h-10 object-contain" />
                <span className="text-xl font-bold text-gray-900 tracking-tight">
                  DTAO <span className="text-[#16a34a]">BASE</span>
                </span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                Secure, role-based reporting system for NHCE. Powered by Spring Boot & React architecture.
              </p>
              <div className="flex gap-4 pt-2">
                {socialLinks.map(({ icon, href, label, color }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={`text-gray-400 text-lg transition-colors ${color} transform hover:scale-110`}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* 2. SUPPORT LINKS (Now Functional) */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Support & Legal</h3>
              <ul className="space-y-3">
                <li>
                  <button onClick={() => openModal('HELP')} className="text-gray-500 hover:text-[#16a34a] text-sm transition-colors text-left">
                    Help Center
                  </button>
                </li>
                <li>
                  <button onClick={() => openModal('BUG')} className="text-gray-500 hover:text-[#16a34a] text-sm transition-colors text-left">
                    Report a Bug
                  </button>
                </li>
                <li>
                  <button onClick={() => openModal('PRIVACY')} className="text-gray-500 hover:text-[#16a34a] text-sm transition-colors text-left">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => openModal('TERMS')} className="text-gray-500 hover:text-[#16a34a] text-sm transition-colors text-left">
                    Terms of Service
                  </button>
                </li>
              </ul>
            </div>

            {/* 3. CONTACT INFO */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-[#16a34a] mt-1 shrink-0" />
                  <span className="text-gray-500 text-sm">
                    NHCE Campus, Marathahalli,<br />Bangalore, India
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <FaEnvelope className="text-[#16a34a] shrink-0" />
                  <a href="mailto:support@dtaobase.in" className="text-gray-500 hover:text-[#16a34a] text-sm transition-colors">
                    support@dtaobase.in
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <FaShieldAlt className="text-[#8B5E3C] shrink-0" />
                  <button onClick={() => openModal('SECURITY')} className="text-gray-500 hover:text-[#16a34a] text-sm transition-colors text-left">
                    View Security Policy
                  </button>
                </li>
              </ul>
            </div>

          </div>

          {/* BOTTOM BAR */}
          <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()} <span className="font-semibold text-gray-600">DTAO ALIEN BASE</span>. All rights reserved.
            </p>
            
            <div className="flex gap-6">
               <button onClick={() => openModal('PRIVACY')} className="text-gray-400 hover:text-gray-600 text-xs font-medium transition-colors">Privacy</button>
               <button onClick={() => openModal('COOKIES')} className="text-gray-400 hover:text-gray-600 text-xs font-medium transition-colors">Cookies</button>
               <button onClick={() => openModal('SECURITY')} className="text-gray-400 hover:text-gray-600 text-xs font-medium transition-colors">Security</button>
            </div>
          </div>

        </div>
      </footer>

      {/* 🌟 MODAL COMPONENT (Popup) */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
              {/* Modal Header */}
              <div className="bg-gray-50 p-5 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  {activeModal.icon}
                  {activeModal.title}
                </h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-red-500 transition-colors">
                  <FaTimes />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                {activeModal.text}
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 p-4 text-right">
                <button 
                  onClick={closeModal}
                  className="px-4 py-2 bg-[#16a34a] text-white text-sm font-semibold rounded-lg hover:bg-[#15803d] transition-colors"
                >
                  Understood
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Footer;