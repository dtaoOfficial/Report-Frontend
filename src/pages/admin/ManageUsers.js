import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axiosConfig';
import { toast } from 'react-toastify';
import AddUserForm from '../../components/AddUserForm';
import { 
  FaSearch, 
  FaUserPlus, 
  FaEdit, 
  FaTrashAlt, 
  FaUserShield, 
  FaCheckCircle, 
  FaTimesCircle,
  FaBuilding
} from 'react-icons/fa';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // 🔄 Fetch Users
  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Search Filter
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = users.filter(u => 
        u.fullName?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term) ||
        u.department?.toLowerCase().includes(term)
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  // 🗑️ Delete User
  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('User deleted successfully!');
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete user');
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setShowAddForm(true);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🎨 Role Badge Helper
  const getRoleBadge = (roles) => {
    const role = Array.from(roles || [])[0]?.replace('ROLE_', '');
    switch(role) {
      case 'ADMIN': return 'bg-red-100 text-red-700 border-red-200';
      case 'PRINCIPAL': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'DEAN': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'SYSTEM': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F8F4]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-[#16a34a] rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading User Directory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 px-4 sm:px-8 pb-12 bg-[#F9F8F4] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* 🧠 Header & Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#0A3F2F]">User Management</h1>
            <p className="text-gray-500 text-sm mt-1">Manage accounts, roles, and permissions.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Search Bar */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by name or email..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none w-full sm:w-64 text-sm shadow-sm"
              />
            </div>

            {/* Add User Button */}
            <button
              onClick={() => { setEditUser(null); setShowAddForm(true); }}
              className="flex items-center justify-center gap-2 bg-[#16a34a] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#15803d] shadow-lg shadow-green-900/20 transition-transform active:scale-95"
            >
              <FaUserPlus /> Add User
            </button>
          </div>
        </div>

        {/* 📋 User Table */}
        <div className="bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <FaUserShield size={48} className="mx-auto mb-4 opacity-20" />
              <p>No users found matching your search.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">User Profile</th>
                    <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Joined</th>
                    <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <AnimatePresence>
                    {filteredUsers.map((u) => (
                      <motion.tr 
                        key={u.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        whileHover={{ backgroundColor: "#f8fafc" }}
                        className="group transition-colors"
                      >
                        {/* 👤 User Info */}
                        <td className="p-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-sm border border-gray-200">
                              {u.fullName ? u.fullName.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                              <p className="font-bold text-gray-800 text-sm">{u.fullName}</p>
                              <p className="text-xs text-gray-500">{u.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* 🏫 Department */}
                        <td className="p-5">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FaBuilding className="text-gray-400" />
                            {u.department || 'General'}
                          </div>
                        </td>

                        {/* 🛡️ Role */}
                        <td className="p-5">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-bold border uppercase ${getRoleBadge(u.roles)}`}>
                            {Array.from(u.roles || []).join(', ').replace(/ROLE_/g, '')}
                          </span>
                        </td>

                        {/* ✅ Status */}
                        <td className="p-5">
                          {u.verified ? (
                            <span className="inline-flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">
                              <FaCheckCircle /> Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-gray-400 text-xs font-bold bg-gray-50 px-2 py-1 rounded-full">
                              <FaTimesCircle /> Unverified
                            </span>
                          )}
                        </td>

                        {/* 📅 Date */}
                        <td className="p-5 text-sm text-gray-500 font-mono">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}
                        </td>

                        {/* ⚡ Actions */}
                        <td className="p-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(u)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit User"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => deleteUser(u.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete User"
                            >
                              <FaTrashAlt />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ➕ Add User Form Modal */}
        {showAddForm && (
          <AddUserForm
            userToEdit={editUser}
            onClose={() => setShowAddForm(false)}
            onUserAdded={fetchUsers}
          />
        )}
      </div>
    </div>
  );
};

export default ManageUsers;