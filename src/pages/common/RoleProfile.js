import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/axiosConfig';
import logo from '../../assets/companyLogo.webp';
import { 
  FaEnvelope, 
  FaPhoneAlt, 
  FaVenusMars, 
  FaIdBadge, 
  FaPaw 
} from 'react-icons/fa';

const RoleProfile = ({ role }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/user/profile`);
        if (response.data.success) {
          setProfile(response.data.data);
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // 🎨 Helper: Get Initials for Avatar
  const getInitials = (name) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  // 🎨 Helper: Get Color based on Role
  const getRoleColor = () => {
    switch(role) {
      case 'System': return 'bg-blue-600';
      case 'Principal': return 'bg-[#8B5E3C]'; // DTAO Brown
      case 'Dean': return 'bg-purple-600';
      case 'Resource': return 'bg-orange-500';
      default: return 'bg-[#16a34a]'; // NHCE Green
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F8F4]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#16a34a] rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium animate-pulse">Loading Identity...</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-[#F9F8F4] pt-24 pb-12 px-4 font-sans">
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        
        {/* 📇 ID Card Container */}
        <div className="bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden border border-gray-100">
          
          {/* 🌆 Banner Background */}
          <div className={`h-40 w-full ${getRoleColor()} relative overflow-hidden`}>
             {/* Abstract Shapes in Banner */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
             <div className="absolute bottom-0 left-0 w-48 h-48 bg-black opacity-10 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>
             
             {/* Company Logo Watermark */}
             <img src={logo} alt="Watermark" className="absolute right-6 top-6 w-16 opacity-20 invert brightness-0" />
          </div>

          {/* 👤 Profile Header (Avatar & Name) */}
          <div className="px-8 pb-8 relative">
            <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 mb-8 gap-6">
              
              {/* Avatar Circle */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center shadow-lg text-4xl font-bold text-gray-400">
                  {getInitials(profile.fullName)}
                </div>
                {/* Online Indicator */}
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full" title="Active"></div>
              </div>

              {/* Name & Role */}
              <div className="flex-1 text-center md:text-left mb-2">
                <h1 className="text-3xl font-bold text-gray-800">{profile.fullName || 'Unknown User'}</h1>
                <p className="text-gray-500 font-medium flex items-center justify-center md:justify-start gap-2 mt-1">
                  <FaIdBadge className="text-[#16a34a]" />
                  {role} Account
                </p>
              </div>
              
              {/* ✅ Button Removed Here */}

            </div>

            {/* 📋 Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 border-t border-gray-100 pt-8">
              
              <ProfileField 
                icon={<FaEnvelope className="text-blue-500" />} 
                label="Email Address" 
                value={profile.email} 
              />
              
              <ProfileField 
                icon={<FaPhoneAlt className="text-green-500" />} 
                label="Phone Number" 
                value={profile.phoneNumber} 
              />
              
              <ProfileField 
                icon={<FaVenusMars className="text-purple-500" />} 
                label="Gender" 
                value={profile.gender} 
              />

              {profile.gender === 'ANIMAL' && (
                <ProfileField 
                  icon={<FaPaw className="text-orange-500" />} 
                  label="Animal Name" 
                  value={profile.animalName} 
                />
              )}

              <ProfileField 
                icon={<FaIdBadge className="text-gray-500" />} 
                label="System Roles" 
                value={(profile.roles || []).join(', ').replace(/ROLE_/g, '')} 
                isBadge={true}
              />
              
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-gray-400 text-sm mt-8">
          User ID: {profile.id || 'Unknown'} • Member since {new Date().getFullYear()}
        </p>

      </motion.div>
    </div>
  );
};

// 🧊 Sub-component for individual fields
const ProfileField = ({ icon, label, value, isBadge }) => (
  <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
    <div className="mt-1 p-2 bg-white rounded-lg shadow-sm border border-gray-100 text-lg">
      {icon}
    </div>
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
      {isBadge ? (
        <div className="flex flex-wrap gap-2">
          {value.split(', ').map((v, i) => (
            <span key={i} className="bg-[#16a34a]/10 text-[#16a34a] px-3 py-1 rounded-md text-sm font-bold">
              {v}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-gray-800 font-semibold text-lg">{value || 'N/A'}</p>
      )}
    </div>
  </div>
);

// ✅ Role-based exports
export const SystemProfile = () => <RoleProfile role="System" />;
export const PrincipalProfile = () => <RoleProfile role="Principal" />;
export const DeanProfile = () => <RoleProfile role="Dean" />;
export const ResourceProfile = () => <RoleProfile role="Resource" />;

export default RoleProfile;