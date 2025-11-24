import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const UserProfile = () => {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    gender: 'MALE',
    animalName: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Load user info from context
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        phoneNumber: user.phoneNumber || '',
        gender: user.gender || 'MALE',
        animalName: user.animalName || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/user/update', formData);
      if (res.data.success) {
        toast.success("Profile Updated Successfully!");
        await refreshUser();
      }
    } catch (err) {
      toast.error("Update Failed: " + (err.response?.data?.message || "Unknown Error"));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (passwordData.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }

    setPwLoading(true);
    try {
      const res = await api.put(
        `/user/change-password?currentPassword=${passwordData.currentPassword}&newPassword=${passwordData.newPassword}`
      );
      if (res.data.success) {
        toast.success("Password changed successfully!");
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error changing password");
    } finally {
      setPwLoading(false);
    }
  };

  const inputClass = "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#22c55e] outline-none transition";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="pt-24 px-4 max-w-4xl mx-auto space-y-10">
      {/* --- Profile Section --- */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">My Profile</h1>
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Full Name</label>
                <input name="fullName" value={formData.fullName} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Phone Number</label>
                <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className={inputClass} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Email (Cannot Change)</label>
                <input
                  value={user?.email || ''}
                  disabled
                  className="w-full p-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label className={labelClass}>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className={inputClass}>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="ALIEN">Alien</option>
                  <option value="GOD">God</option>
                  <option value="ANIMAL">Animal</option>
                </select>
              </div>
            </div>

            {formData.gender === 'ANIMAL' && (
              <div>
                <label className={labelClass}>Animal Type/Name</label>
                <input
                  name="animalName"
                  value={formData.animalName}
                  onChange={handleChange}
                  className={`${inputClass} bg-yellow-50 border-yellow-200`}
                  placeholder="e.g. Tiger"
                  required
                />
              </div>
            )}

            <div className="flex justify-end pt-4">
              <button
                disabled={loading}
                className="bg-[#16a34a] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#14532d] transition shadow-lg hover:shadow-xl disabled:opacity-70"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* --- Password Section --- */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Change Password</h2>
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div>
              <label className={labelClass}>Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className={inputClass}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                disabled={pwLoading}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg hover:shadow-xl disabled:opacity-70"
              >
                {pwLoading ? 'Changing...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
