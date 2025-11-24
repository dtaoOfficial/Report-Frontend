import React, { useState } from "react";
import axios from "../../api/axiosConfig";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`/auth/forgot-password?email=${email}`);
      toast.success(res.data.message || "OTP sent successfully!");
      setTimeout(() => {
        navigate("/verify-reset-otp", { state: { email } });
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
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
          Forgot Password
        </h2>
        <p className="text-gray-600 mb-6">
          Enter your registered email to receive a one-time password (OTP).
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-[#22c55e] outline-none"
            required
          />
          <button
            type="submit"
            className="w-full bg-[#16a34a] hover:bg-[#14532d] text-white py-2 rounded-md font-medium transition-all"
          >
            Send OTP
          </button>
        </form>

        <div className="mt-6 text-sm">
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

export default ForgotPassword;
