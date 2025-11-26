import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import { toast } from 'react-toastify';
import AddUserForm from '../../components/AddUserForm';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
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

  if (loading) {
    return <div className="text-center mt-10 text-gray-600">Loading users...</div>;
  }

  return (
    <div className="p-6 mt-20">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-alien-500">Manage Users</h1>
        <button
          onClick={() => { setEditUser(null); setShowAddForm(true); }}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Add User
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        {users.length === 0 ? (
          <div className="text-center py-6 text-gray-500">No users found.</div>
        ) : (
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Gender</th>
                <th className="p-3 text-left">Department</th> {/* 🏫 Added */}
                <th className="p-3 text-left">Verified</th>
                <th className="p-3 text-left">Created</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-800">{u.fullName}</td>
                  <td className="p-3 text-gray-600">{u.email}</td>
                  <td className="p-3 text-gray-700">
                    {Array.from(u.roles || []).join(', ').replace(/ROLE_/g, '')}
                  </td>
                  <td className="p-3 text-gray-700">{u.gender}</td>
                  <td className="p-3 text-gray-700">{u.department || 'General'}</td> {/* ✅ Show department */}
                  <td className="p-3">{u.verified ? '✅' : '❌'}</td>
                  <td className="p-3">
                    {u.createdAt ? new Date(u.createdAt).toLocaleString() : '-'}
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(u)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => deleteUser(u.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showAddForm && (
        <AddUserForm
          userToEdit={editUser}
          onClose={() => setShowAddForm(false)}
          onUserAdded={fetchUsers}
        />
      )}
    </div>
  );
};

export default ManageUsers;
