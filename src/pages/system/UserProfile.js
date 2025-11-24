import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import logo from '../../assets/companyLogo.webp';

const RoleProfile = ({ role }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/user/profile`);
        if (response.data.success) {
          setProfile(response.data.data);
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      }
    };
    fetchProfile();
  }, []);

  if (!profile) {
    return (
      <div className="pt-24 text-center text-gray-600">
        Loading {role} profile...
      </div>
    );
  }

  return (
    <div className="pt-24 px-4 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col items-center mb-8">
        <img src={logo} alt="Company Logo" className="w-16 h-16 mb-2" />
        <h1 className="text-3xl font-bold text-gray-800">{role} Profile</h1>
        <p className="text-gray-500">View your account information</p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-500 text-sm">Full Name</p>
            <p className="font-semibold text-gray-800">{profile.fullName || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Email</p>
            <p className="font-semibold text-gray-800">{profile.email || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Phone Number</p>
            <p className="font-semibold text-gray-800">{profile.phoneNumber || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Gender</p>
            <p className="font-semibold text-gray-800">{profile.gender || 'N/A'}</p>
          </div>
          {profile.gender === 'ANIMAL' && (
            <div>
              <p className="text-gray-500 text-sm">Animal Type/Name</p>
              <p className="font-semibold text-gray-800">{profile.animalName || 'N/A'}</p>
            </div>
          )}
          <div>
            <p className="text-gray-500 text-sm">Role</p>
            <p className="font-semibold text-gray-800">{(profile.roles || []).join(', ').replace(/ROLE_/g, '')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SystemProfile = () => <RoleProfile role="System" />;
export const PrincipalProfile = () => <RoleProfile role="Principal" />;
export const DeanProfile = () => <RoleProfile role="Dean" />;
export const ResourceProfile = () => <RoleProfile role="Resource" />;

export default RoleProfile;
