import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import companyLogo from '../../assets/companyLogo.webp'; // ✅ ensure this exists

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    captchaAnswer: '',
    captchaId: '',
  });
  const [captchaImage, setCaptchaImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const fetchCaptcha = async () => {
    try {
      const res = await api.get('/auth/get-captcha');
      setFormData((prev) => ({ ...prev, captchaId: res.data.data.captchaId }));
      setCaptchaImage(res.data.data.captchaImage);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(formData);
      toast.success('Login Successful!');
      const roles = res.data.roles || [];
      if (roles.includes('ROLE_ADMIN')) navigate('/admin/dashboard');
      else if (roles.includes('ROLE_SYSTEM')) navigate('/system/dashboard');
      else if (roles.includes('ROLE_PRINCIPAL')) navigate('/principal/dashboard');
      else if (roles.includes('ROLE_DEAN')) navigate('/dean/dashboard');
      else if (roles.includes('ROLE_RESOURCES')) navigate('/resources/dashboard');
      else navigate('/user/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login Failed');
      fetchCaptcha();
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    'w-full p-3 border border-[#EAD8C5] rounded-lg focus:ring-2 focus:ring-[#8B5E3C] outline-none bg-[#FFF9F5] placeholder-gray-400 text-sm';
  const buttonClasses =
    'w-full bg-[#8B5E3C] text-white p-2.5 rounded-lg font-semibold hover:bg-[#6B4226] transition focus:ring-2 focus:ring-[#CBB49A] text-sm';

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-[#F5E8DC] to-[#D8BFA8] overflow-hidden">
      {/* Left Section: Company Logo */}
      <motion.div
        className="flex-1 flex justify-center items-center w-full md:w-1/2 p-6"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <img
          src={companyLogo}
          alt="Company Logo"
          className="w-48 h-auto md:w-64 md:h-auto object-contain drop-shadow-md"
        />
      </motion.div>

      {/* Right Section: Login Form */}
      <motion.div
        className="flex-1 w-full md:w-[420px] bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-[#E7D6C4] mx-4"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-[#4A2C1D] tracking-wide">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            required
            value={formData.email}
            className={inputClasses}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          {/* Password with show/hide */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              required
              value={formData.password}
              className={inputClasses}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-[#8B5E3C] cursor-pointer hover:text-[#6B4226]"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-xs text-[#8B5E3C] hover:underline font-medium"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Captcha Section */}
          <div className="flex items-center justify-between bg-[#F8F2EC] p-2 rounded">
            <span className="font-mono text-base line-through tracking-widest select-none text-[#4A2C1D]">
              {captchaImage}
            </span>
            <button
              type="button"
              onClick={fetchCaptcha}
              className="text-xs text-[#8B5E3C] hover:underline"
            >
              Refresh
            </button>
          </div>

          <input
            placeholder="Enter Captcha"
            required
            value={formData.captchaAnswer}
            className={inputClasses}
            onChange={(e) =>
              setFormData({ ...formData, captchaAnswer: e.target.value })
            }
          />

          <motion.button
            disabled={loading}
            className={buttonClasses}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            {loading ? 'Logging In...' : 'Login'}
          </motion.button>
        </form>

        <p className="text-center mt-5 text-gray-700 text-sm">
          New here?{' '}
          <Link
            to="/register"
            className="text-[#8B5E3C] font-semibold hover:underline"
          >
            Create Account
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
