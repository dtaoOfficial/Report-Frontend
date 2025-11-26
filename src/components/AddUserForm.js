import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { toast } from 'react-toastify';

const AddUserForm = ({ onClose, onUserAdded, userToEdit }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    gender: 'MALE',
    animalName: '',
    role: 'ROLE_USER',
    department: '', // 🏫 Added department field
  });

  // 🧠 Load user data if editing
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

  const roles = [
    'ROLE_USER',
    'ROLE_ADMIN',
    'ROLE_SYSTEM',
    'ROLE_PRINCIPAL',
    'ROLE_DEAN',
    'ROLE_RESOURCES',
  ];

  const genders = ['MALE', 'FEMALE', 'GOD', 'ALIEN', 'ANIMAL'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle submit (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        roles: [formData.role],
      };

      // 🚫 If not ROLE_USER, remove department before sending
      if (formData.role !== 'ROLE_USER') {
        delete payload.department;
      }

      if (userToEdit) {
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

  const isEditMode = !!userToEdit;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
          {isEditMode ? 'Update User' : 'Add New User'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="fullName"
            value={formData.fullName}
            placeholder="Full Name"
            className="w-full p-3 border rounded"
            required
            onChange={handleChange}
          />

          <input
            name="email"
            value={formData.email}
            placeholder="Email"
            className="w-full p-3 border rounded"
            required
            onChange={handleChange}
            disabled={isEditMode}
          />

          <input
            name="phoneNumber"
            value={formData.phoneNumber}
            placeholder="Phone Number (optional)"
            className="w-full p-3 border rounded"
            onChange={handleChange}
          />

          {/* 🏫 Show Department only if Role = ROLE_USER */}
          {formData.role === 'ROLE_USER' && (
            <input
              name="department"
              value={formData.department}
              placeholder="Department (e.g. CSE, ECE, MECH)"
              className="w-full p-3 border rounded"
              required
              onChange={handleChange}
            />
          )}

          <input
            name="password"
            value={formData.password}
            placeholder={isEditMode ? 'New Password ' : 'Password'}
            type="password"
            className="w-full p-3 border rounded"
            onChange={handleChange}
          />

          <select
            name="role"
            value={formData.role}
            className="w-full p-3 border rounded"
            onChange={handleChange}
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r.replace('ROLE_', '')}
              </option>
            ))}
          </select>

          <select
            name="gender"
            value={formData.gender}
            className="w-full p-3 border rounded"
            onChange={handleChange}
          >
            {genders.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          {formData.gender === 'ANIMAL' && (
            <input
              name="animalName"
              value={formData.animalName}
              placeholder="Animal Name"
              className="w-full p-3 border rounded"
              onChange={handleChange}
            />
          )}

          <div className="flex justify-between mt-4">
            <button
              type="submit"
              className={`${
                isEditMode
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-green-600 hover:bg-green-700'
              } text-white px-4 py-2 rounded`}
            >
              {isEditMode ? 'Update' : 'Save'}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserForm;
