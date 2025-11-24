import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * usePageTransition Hook
 * Adds fade transitions when switching routes.
 */
export const usePageTransition = () => {
  const location = useLocation();

  useEffect(() => {
    const page = document.body;
    page.classList.add('fade-in');
    const timeout = setTimeout(() => {
      page.classList.remove('fade-in');
    }, 500);

    return () => clearTimeout(timeout);
  }, [location.pathname]);
};

/**
 * Example usage inside App or Layout:
 * const App = () => {
 *   usePageTransition();
 *   return <YourRoutesHere />;
 * }
 */

// Optional motion wrapper
export const PageMotionWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);
