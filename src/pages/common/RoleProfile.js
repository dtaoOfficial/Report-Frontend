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
      <div className="pt-24 text-center text-gray-600 text-lg font-medium">
        Loading {role} profile...
      </div>
    );
  }

  return (
    <div className="pt-24 px-4 max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col items-center mb-10 text-center">
        <img
          src={logo}
          alt="Company Logo"
          className="w-24 h-24 mb-4 object-contain drop-shadow-md"
        />
        <h1 className="text-4xl font-bold text-gray-800">{role} Profile</h1>
        <p className="text-gray-500 text-base mt-2">
          View your account information and details
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <p className="text-gray-500 text-sm uppercase tracking-wide">
              Full Name
            </p>
            <p className="font-semibold text-gray-900 text-lg mt-1">
              {profile.fullName || 'N/A'}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm uppercase tracking-wide">
              Email
            </p>
            <p className="font-semibold text-gray-900 text-lg mt-1">
              {profile.email || 'N/A'}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm uppercase tracking-wide">
              Phone Number
            </p>
            <p className="font-semibold text-gray-900 text-lg mt-1">
              {profile.phoneNumber || 'N/A'}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm uppercase tracking-wide">
              Gender
            </p>
            <p className="font-semibold text-gray-900 text-lg mt-1">
              {profile.gender || 'N/A'}
            </p>
          </div>

          {profile.gender === 'ANIMAL' && (
            <div>
              <p className="text-gray-500 text-sm uppercase tracking-wide">
                Animal Type/Name
              </p>
              <p className="font-semibold text-gray-900 text-lg mt-1">
                {profile.animalName || 'N/A'}
              </p>
            </div>
          )}

          <div>
            <p className="text-gray-500 text-sm uppercase tracking-wide">
              Role
            </p>
            <p className="font-semibold text-gray-900 text-lg mt-1">
              {(profile.roles || [])
                .join(', ')
                .replace(/ROLE_/g, '')
                .toUpperCase()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ✅ Role-based exports
export const SystemProfile = () => <RoleProfile role="System" />;
export const PrincipalProfile = () => <RoleProfile role="Principal" />;
export const DeanProfile = () => <RoleProfile role="Dean" />;
export const ResourceProfile = () => <RoleProfile role="Resource" />;

export default RoleProfile;
