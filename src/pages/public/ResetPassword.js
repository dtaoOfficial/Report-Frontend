import React, { useState } from "react";
import axios from "../../api/axiosConfig";
import { toast } from "react-toastify";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `/auth/reset-password?email=${email}&newPassword=${newPassword}`
      );
      toast.success(res.data.message || "Password reset successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error resetting password!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center"
      >
        {/* 🪐 Company Logo */}
        <motion.img
          src={process.env.PUBLIC_URL + "/assets/companyLogo.webp"}
          alt="Company Logo"
          className="w-24 h-24 mx-auto mb-4 object-contain"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        />

        <h2 className="text-2xl font-bold text-[#16a34a] mb-2">
          Reset Password
        </h2>
        <p className="text-gray-600 mb-6">
          Create a strong password for your account.
        </p>

        <form onSubmit={handleReset} className="space-y-4 text-left">
          {/* Password Input with Toggle */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-[#22c55e] outline-none pr-10"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-gray-500 cursor-pointer hover:text-[#16a34a] transition"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-[#16a34a] hover:bg-[#14532d] text-white py-2 rounded-md font-medium transition-all"
          >
            Reset Password
          </button>
        </form>

        <div className="mt-6 text-sm text-center">
          <Link
            to="/login"
            className="text-[#16a34a] hover:text-[#14532d] font-medium"
          >
            Back to Login
          </Link>
        </div>
      </motion.div>

      <p className="text-gray-400 text-xs mt-6">
        &copy; {new Date().getFullYear()} DTAO BASE. All rights reserved.
      </p>
    </div>
  );
}

export default ResetPassword;
