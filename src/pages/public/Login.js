import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axiosConfig";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import companyLogo from "../../assets/companyLogo.webp";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    captchaAnswer: "",
    captchaId: "",
  });
  const [captchaImage, setCaptchaImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const fetchCaptcha = async () => {
    try {
      const res = await api.get("/auth/get-captcha");
      setFormData((prev) => ({
        ...prev,
        captchaId: res.data.data.captchaId,
      }));
      setCaptchaImage(res.data.data.captchaImage);
    } catch (err) {
      console.error("⚠️ Captcha fetch failed:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(formData);

      if (!res?.success) {
        toast.error("Invalid login response");
        setLoading(false);
        return;
      }

      toast.success("Login Successful!");

      let role = res.role || "";
      role = role.replace("ROLE_", "").toUpperCase();

      switch (role) {
        case "ADMIN": navigate("/admin/dashboard"); break;
        case "SYSTEM": navigate("/system/dashboard"); break;
        case "PRINCIPAL": navigate("/principal/dashboard"); break;
        case "DEAN": navigate("/dean/dashboard"); break;
        case "RESOURCES": navigate("/resources/dashboard"); break;
        default: navigate("/user/dashboard"); break;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login Failed");
      fetchCaptcha();
    } finally {
      setLoading(false);
    }
  };

  // 🧱 Clean & Professional Styles
  const inputClasses =
    "w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent outline-none bg-white placeholder-gray-400 text-sm transition-all";
  
  const buttonClasses =
    "w-full bg-[#3b82f6] text-white p-3.5 rounded-xl font-bold hover:bg-[#2563eb] transition-all shadow-lg shadow-blue-900/20 active:scale-95 text-sm uppercase tracking-wide";

  return (
    <div className="min-h-screen flex w-full bg-white font-sans overflow-hidden">
      
      {/* ================= LEFT SIDE: BRANDING (Light Cool Blue) ================= */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe] relative items-center justify-center p-12 overflow-hidden border-r border-blue-50">
        
        {/* Abstract "Cool" Shapes (Subtle) */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-100 rounded-full blur-[100px] opacity-60"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-100 rounded-full blur-[80px] opacity-60"></div>
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]"></div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center"
        >
          {/* Logo now sits on a LIGHT background, so it will pop nicely */}
          <img
            src={companyLogo}
            alt="Company Logo"
            className="w-48 h-auto object-contain mx-auto drop-shadow-md mb-8"
          />
          
          {/* Text is Dark Slate/Blue for readability */}
          <h1 className="text-4xl font-extrabold mb-4 tracking-tight text-[#1e3a8a]">
            System's & Network
          </h1>
          <p className="text-lg text-[#475569] max-w-md mx-auto leading-relaxed font-medium">
            Secure access to the NHCE Reporting Portal.
            <br />
            Manage workflows with efficiency.
          </p>
        </motion.div>
      </div>

      {/* ================= RIGHT SIDE: LOGIN FORM ================= */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white">
        <motion.div
          className="w-full max-w-[420px]"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <img src={companyLogo} alt="Logo" className="w-24 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-[#1e3a8a]">System's & Network</h2>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-[#1e293b]">Welcome To IT Portal</h2>
            <p className="text-gray-500 mt-2 text-sm">Enter your credentials to access the account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 📧 Email */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5 ml-1 uppercase tracking-wide">Email Address</label>
              <input
                type="email"
                placeholder="name@nhce.edu"
                required
                value={formData.email}
                className={inputClasses}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            {/* 🔑 Password */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5 ml-1 uppercase tracking-wide">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  className={inputClasses}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 cursor-pointer hover:text-[#3b82f6] transition-colors"
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </span>
              </div>
            </div>

            {/* 🔗 Forgot Password */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-xs text-[#3b82f6] font-semibold hover:text-[#1d4ed8] transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {/* 🔢 Captcha Section */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
               <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Security Check</span>
                  <button
                    type="button"
                    onClick={fetchCaptcha}
                    className="text-xs text-[#3b82f6] font-bold hover:underline"
                  >
                    Refresh
                  </button>
               </div>
               <div className="flex gap-3">
                  <div className="flex-1 bg-white border border-gray-200 rounded-lg flex items-center justify-center h-10 overflow-hidden shadow-sm">
                     <span className="font-mono text-lg font-bold tracking-widest text-[#1e293b] select-none">
                        {captchaImage}
                     </span>
                  </div>
                  <input
                    placeholder="Enter code"
                    required
                    value={formData.captchaAnswer}
                    className="w-1/2 p-2 text-center border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3b82f6] outline-none bg-white text-sm font-medium"
                    onChange={(e) =>
                      setFormData({ ...formData, captchaAnswer: e.target.value })
                    }
                  />
               </div>
            </div>

            {/* 🚪 Login Button (Cool Blue) */}
            <motion.button
              disabled={loading}
              className={buttonClasses}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? "Verifying..." : "Sign In"}
            </motion.button>
          </form>

          {/* 🧍 Register Link */}
          <p className="text-center mt-8 text-gray-500 text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-[#3b82f6] font-bold hover:underline"
            >
              Create Account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;