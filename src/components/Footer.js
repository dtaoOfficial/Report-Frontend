import React from 'react';
import { motion } from 'framer-motion';
import { FaTelegramPlane, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  const socialLinks = [
    { icon: <FaTelegramPlane />, href: 'https://t.me/DTAOOFFICIAL', label: 'Telegram' },
    { icon: <FaInstagram />, href: 'https://instagram.com/dtaoofficial', label: 'Instagram' },
    { icon: <FaWhatsapp />, href: 'https://whatsapp.com/channel/0029Vb70Pr05kg6x0Lk1XP2E', label: 'WhatsApp' },
  ];

  return (
    <motion.footer
      className="bg-white border-t border-gray-200 py-10"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      viewport={{ once: true }}
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
        {/* 🌐 Social Icons */}
        <motion.div
          className="flex justify-center space-x-6 mb-5"
          initial="hidden"
          whileInView="visible"
          transition={{ staggerChildren: 0.15 }}
        >
          {socialLinks.map(({ icon, href, label }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              whileHover={{ scale: 1.2, color: '#16a34a' }}
              whileTap={{ scale: 0.9 }}
              className="text-gray-500 hover:text-[#16a34a] text-xl transition-colors"
            >
              {icon}
            </motion.a>
          ))}
        </motion.div>

        {/* 🪐 About Link */}
        <motion.div
          className="text-gray-600 mb-3"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Link to="/about" className="hover:text-[#16a34a] font-medium transition-colors">
            About
          </Link>
        </motion.div>

        {/* ⚡ Copyright */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 text-sm"
        >
          &copy; {new Date().getFullYear()} <span className="font-semibold text-gray-700">DTAO ALIEN BASE</span>. All rights reserved.
        </motion.p>
      </div>
    </motion.footer>
  );
};

export default Footer;
