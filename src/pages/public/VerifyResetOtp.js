import React, { useState, useEffect } from "react";
import axios from "../../api/axiosConfig";
import { toast } from "react-toastify";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";

function VerifyResetOtp() {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(300); // 5 minutes = 300 seconds
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  // 🕒 Countdown Timer
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // ⏳ Format Timer as MM:SS
  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" + sec : sec}`;
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    if (timer <= 0) {
      toast.error("OTP expired! Please request a new one.");
      return;
    }

    try {
      const res = await axios.post(`/auth/verify-reset-otp?email=${email}&otp=${otp}`);
      toast.success(res.data.message || "OTP verified successfully!");
      setTimeout(() => {
        navigate("/reset-password", { state: { email } });
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP!");
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
        {/* 🪐 Logo */}
        <motion.img
          src={process.env.PUBLIC_URL + "/assets/companyLogo.webp"}
          alt="Company Logo"
          className="w-24 h-24 mx-auto mb-4 object-contain"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        />

        <h2 className="text-2xl font-bold text-[#16a34a] mb-2">Verify OTP</h2>
        <p className="text-gray-600 mb-4">
          Enter the OTP sent to your registered email address.
        </p>

        {/* ⏱️ Timer */}
        <div className="text-sm text-gray-500 mb-4">
          {timer > 0 ? (
            <>
              OTP expires in{" "}
              <span className="font-semibold text-[#16a34a]">
                {formatTime(timer)}
              </span>
            </>
          ) : (
            <span className="text-red-500 font-semibold">OTP Expired!</span>
          )}
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-[#22c55e] outline-none text-center tracking-widest"
            required
          />

          <button
            type="submit"
            disabled={timer <= 0}
            className={`w-full text-white py-2 rounded-md font-medium transition-all ${
              timer <= 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#16a34a] hover:bg-[#14532d]"
            }`}
          >
            Verify OTP
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

export default VerifyResetOtp;
