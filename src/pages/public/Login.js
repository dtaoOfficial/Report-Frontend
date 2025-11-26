import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import companyLogo from '../../assets/companyLogo.webp';

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

  // 🧩 Fetch Captcha on Mount
  useEffect(() => {
    fetchCaptcha();
  }, []);

  const fetchCaptcha = async () => {
    try {
      const res = await api.get('/auth/get-captcha');
      setFormData((prev) => ({
        ...prev,
        captchaId: res.data.data.captchaId,
      }));
      setCaptchaImage(res.data.data.captchaImage);
    } catch (err) {
      console.error('⚠️ Captcha fetch failed:', err);
    }
  };

  // 🧠 Handle Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(formData);

      if (!res?.success || !res?.role) {
        toast.error('Invalid login response');
        setLoading(false);
        return;
      }

      toast.success('Login Successful!');

      // 🚀 Navigate based on role
      const role = res.role.toUpperCase();
      switch (role) {
        case 'ADMIN':
          navigate('/admin/dashboard');
          break;
        case 'SYSTEM':
          navigate('/system/dashboard');
          break;
        case 'PRINCIPAL':
          navigate('/principal/dashboard');
          break;
        case 'DEAN':
          navigate('/dean/dashboard');
          break;
        case 'RESOURCES':
          navigate('/resources/dashboard');
          break;
        default:
          navigate('/user/dashboard');
          break;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login Failed');
      fetchCaptcha();
    } finally {
      setLoading(false);
    }
  };

  // 🧱 Styles
  const inputClasses =
    'w-full p-3 border border-[#EAD8C5] rounded-lg focus:ring-2 focus:ring-[#8B5E3C] outline-none bg-[#FFF9F5] placeholder-gray-400 text-sm';
  const buttonClasses =
    'w-full bg-[#8B5E3C] text-white p-2.5 rounded-lg font-semibold hover:bg-[#6B4226] transition focus:ring-2 focus:ring-[#CBB49A] text-sm';

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-[#F5E8DC] to-[#D8BFA8] overflow-hidden pt-10 md:pt-16">
      {/* 🏢 Left Section: Company Logo */}
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

      {/* 🔐 Right Section: Login Form */}
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
          {/* 📧 Email */}
          <input
            type="email"
            placeholder="Email"
            required
            value={formData.email}
            className={inputClasses}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          {/* 🔑 Password */}
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

          {/* 🔗 Forgot Password */}
          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-xs text-[#8B5E3C] hover:underline font-medium"
            >
              Forgot Password?
            </Link>
          </div>

          {/* 🔢 Captcha Section */}
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

          {/* 🚪 Login Button */}
          <motion.button
            disabled={loading}
            className={buttonClasses}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            {loading ? 'Logging In...' : 'Login'}
          </motion.button>
        </form>

        {/* 🧍 Register Link */}
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
