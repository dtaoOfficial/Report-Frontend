import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axiosConfig';
import { toast } from 'react-toastify';
import { 
  FaUserPlus, 
  FaUserEdit, 
  FaTimes, 
  FaBuilding, 
  FaUserTag,
  FaPaw,
  FaSpinner
} from 'react-icons/fa';

const AddUserForm = ({ onClose, onUserAdded, userToEdit }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    gender: 'MALE',
    animalName: '',
    role: 'ROLE_USER',
    department: '',
  });

  const [checkingEmail, setCheckingEmail] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [existingRoles, setExistingRoles] = useState({ system: false, principal: false });
  const isEditMode = !!userToEdit;

  useEffect(() => {
    if (userToEdit) {
      setFormData({
        fullName: userToEdit.fullName || '',
        email: userToEdit.email || '',
        phoneNumber: userToEdit.phoneNumber || '',
        password: '',
        gender: userToEdit.gender || 'MALE',
        animalName: userToEdit.animalName || '',
        role: Array.from(userToEdit.roles || [])[0] || 'ROLE_USER',
        department: userToEdit.department || '',
      });
    }
  }, [userToEdit]);

  // ✅ Allowed Roles only (removed Dean/Resources)
  const roles = [
    { value: 'ROLE_USER', label: 'USER' },
    { value: 'ROLE_ADMIN', label: 'ADMIN' },
    { value: 'ROLE_SYSTEM', label: 'SYSTEM' },
    { value: 'ROLE_PRINCIPAL', label: 'PRINCIPAL' },
  ];

  const genders = ['MALE', 'FEMALE', 'GOD', 'ALIEN', 'ANIMAL'];

  // 🧠 Fetch existing users for uniqueness checks
  useEffect(() => {
    const fetchExistingRoles = async () => {
      try {
        const res = await api.get('/admin/users');
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];

        const hasSystem = data.some(u => Array.from(u.roles).includes('ROLE_SYSTEM'));
        const hasPrincipal = data.some(u => Array.from(u.roles).includes('ROLE_PRINCIPAL'));

        setExistingRoles({ system: hasSystem, principal: hasPrincipal });
      } catch (err) {
        console.error(err);
      }
    };
    fetchExistingRoles();
  }, []);

  // 🔍 Email Availability Check
  const checkEmailExists = async (email) => {
    if (!email || email.trim() === '' || isEditMode) return;
    setCheckingEmail(true);
    try {
      const res = await api.get(`/auth/check-email?email=${email}`);
      setEmailExists(res.data.exists);
    } catch {
      setEmailExists(false);
    } finally {
      setCheckingEmail(false);
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'email') {
      setEmailExists(false);
      clearTimeout(window.emailCheckTimer);
      window.emailCheckTimer = setTimeout(() => checkEmailExists(value), 700);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🚫 Email exists check
    if (emailExists) {
      toast.error('This email is already registered!');
      return;
    }

    // 🚫 Unique Role Restrictions
    if (!isEditMode) {
      if (formData.role === 'ROLE_SYSTEM' && existingRoles.system) {
        toast.error('A System user already exists. Delete it before creating another.');
        return;
      }
      if (formData.role === 'ROLE_PRINCIPAL' && existingRoles.principal) {
        toast.error('A Principal user already exists. Delete it before creating another.');
        return;
      }
    }

    try {
      const payload = { ...formData, roles: [formData.role] };

      if (formData.role !== 'ROLE_USER') delete payload.department;
      if (formData.gender !== 'ANIMAL') delete payload.animalName;

      if (isEditMode) {
        await api.put(`/admin/users/${userToEdit.id}`, payload);
        toast.success('User updated successfully!');
      } else {
        await api.post('/admin/users', payload);
        toast.success('User added successfully!');
      }

      onUserAdded();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const inputGroupClass = "flex flex-col gap-1";
  const labelClass = "text-xs font-bold text-gray-500 uppercase tracking-wide";
  const inputClass = "w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#16a34a] focus:border-transparent outline-none transition-all text-sm bg-gray-50 focus:bg-white";

  return (
    <motion.div 
      className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[70] p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className={`p-6 flex justify-between items-center ${isEditMode ? 'bg-blue-600' : 'bg-[#16a34a]'}`}>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {isEditMode ? <FaUserEdit /> : <FaUserPlus />}
            {isEditMode ? 'Edit User Profile' : 'Create New User'}
          </h2>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto custom-scrollbar">
          
          {/* Full Name + Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={inputGroupClass}>
              <label className={labelClass}>Full Name</label>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className={inputClass}
                required
              />
            </div>

            <div className={inputGroupClass}>
              <label className={labelClass}>Email Address</label>
              <div className="relative">
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className={`${inputClass} ${emailExists ? 'border-red-400' : ''}`}
                  required
                  disabled={isEditMode}
                />
                {checkingEmail && (
                  <FaSpinner className="absolute right-3 top-3.5 text-gray-400 animate-spin" />
                )}
              </div>
              {emailExists && <p className="text-xs text-red-500 mt-1">This email already exists.</p>}
            </div>
          </div>

          {/* Role + Department */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={inputGroupClass}>
              <label className={labelClass}>System Role</label>
              <div className="relative">
                <FaUserTag className="absolute left-3 top-3.5 text-gray-400" />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={`${inputClass} pl-10 appearance-none`}
                >
                  {roles.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {formData.role === 'ROLE_USER' && (
              <div className={inputGroupClass}>
                <label className={labelClass}>Department</label>
                <div className="relative">
                  <FaBuilding className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="CSE, ECE, etc."
                    className={`${inputClass} pl-10`}
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* Phone + Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={inputGroupClass}>
              <label className={labelClass}>Phone (Optional)</label>
              <input
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+91 9876543210"
                className={inputClass}
              />
            </div>
            <div className={inputGroupClass}>
              <label className={labelClass}>{isEditMode ? 'New Password' : 'Password'}</label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={isEditMode ? 'Leave empty to keep current' : 'Secret123!'}
                className={inputClass}
                required={!isEditMode}
              />
            </div>
          </div>

          {/* Gender + Animal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={inputGroupClass}>
              <label className={labelClass}>Gender / Species</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={inputClass}
              >
                {genders.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {formData.gender === 'ANIMAL' && (
              <div className={inputGroupClass}>
                <label className={labelClass}>Animal Name</label>
                <div className="relative">
                  <FaPaw className="absolute left-3 top-3.5 text-orange-400" />
                  <input
                    name="animalName"
                    value={formData.animalName}
                    onChange={handleChange}
                    placeholder="Tiger, Lion..."
                    className={`${inputClass} pl-10 border-orange-200 bg-orange-50 focus:ring-orange-400`}
                    required
                  />
                </div>
              </div>
            )}
          </div>

        </form>

        {/* Footer */}
        <div className="p-6 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
          <button 
            onClick={onClose} 
            className="px-5 py-2.5 rounded-xl text-gray-600 font-bold hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className={`px-6 py-2.5 rounded-xl text-white font-bold shadow-lg transition-transform active:scale-95 ${isEditMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-[#16a34a] hover:bg-[#15803d]'}`}
          >
            {isEditMode ? 'Update User' : 'Create User'}
          </button>
        </div>

      </motion.div>
    </motion.div>
  );
};

export default AddUserForm;
