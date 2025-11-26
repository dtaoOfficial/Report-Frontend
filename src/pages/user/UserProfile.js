import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { 
  FaEnvelope, 
  FaPhoneAlt, 
  FaVenusMars, 
  FaIdBadge, 
  FaPaw,
  FaShieldAlt
} from 'react-icons/fa';
import logo from '../../assets/companyLogo.webp';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Fetch latest profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/user/profile');
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

  // 🎨 Helper: Get Initials
  const getInitials = (name) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F8F4]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-[#16a34a] rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm font-medium">Loading Profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="pt-24 px-4 pb-12 bg-[#F9F8F4] min-h-screen font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* 📇 ID Card Container */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          
          {/* 🟢 Header Banner */}
          <div className="h-48 w-full bg-[#0A3F2F] relative overflow-hidden">
             {/* Abstract Shapes */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#16a34a] opacity-20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
             <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#8B5E3C] opacity-20 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>
             
             {/* Watermark Logo */}
             <img src={logo} alt="Watermark" className="absolute right-8 top-8 w-20 opacity-10 invert brightness-0" />
             
             <div className="absolute bottom-4 right-6 text-white/30 text-xs font-bold tracking-widest uppercase">
                Official Member Profile
             </div>
          </div>

          {/* 👤 Profile Info Area */}
          <div className="px-8 pb-10 relative">
            
            {/* Avatar (Overlapping Banner) */}
            <div className="flex justify-center md:justify-start -mt-16 mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center shadow-lg text-4xl font-bold text-gray-400">
                  {getInitials(profile.fullName)}
                </div>
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full" title="Active Status"></div>
              </div>
            </div>

            {/* Name & Role Title */}
            <div className="text-center md:text-left mb-8">
              <h1 className="text-3xl font-bold text-gray-800">{profile.fullName || 'Unknown User'}</h1>
              <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-gray-500 font-medium">
                <FaShieldAlt className="text-[#16a34a]" />
                <span>{(profile.roles || []).join(', ').replace(/ROLE_/g, '')} Account</span>
              </div>
            </div>

            {/* 📋 Read-Only Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 border-t border-gray-100 pt-8">
              
              <DetailField 
                icon={<FaEnvelope className="text-blue-500" />} 
                label="Email Address" 
                value={profile.email} 
              />
              
              <DetailField 
                icon={<FaPhoneAlt className="text-green-500" />} 
                label="Phone Number" 
                value={profile.phoneNumber} 
              />
              
              <DetailField 
                icon={<FaVenusMars className="text-purple-500" />} 
                label="Gender" 
                value={profile.gender} 
              />

              {profile.gender === 'ANIMAL' && (
                <DetailField 
                  icon={<FaPaw className="text-orange-500" />} 
                  label="Animal Name" 
                  value={profile.animalName} 
                />
              )}

              <DetailField 
                icon={<FaIdBadge className="text-gray-500" />} 
                label="User ID" 
                value={profile.id} 
                isMono={true}
              />
              
            </div>

            {/* 🔒 Security Note */}
            <div className="mt-10 bg-blue-50 rounded-xl p-4 flex items-start gap-3 border border-blue-100">
               <FaShieldAlt className="text-blue-600 mt-1 shrink-0" />
               <div>
                  <h4 className="text-blue-800 font-bold text-sm">Profile Locked</h4>
                  <p className="text-blue-600/80 text-xs mt-1 leading-relaxed">
                     To update your personal details or change your password, please contact the System Administrator directly. This restriction ensures data integrity across the institution.
                  </p>
               </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 text-xs mt-6 font-medium">
          Generated by DTAO BASE System • {new Date().toLocaleDateString()}
        </p>

      </div>
    </div>
  );
};

// 🧊 Reusable Field Component
const DetailField = ({ icon, label, value, isMono }) => (
  <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
    <div className="mt-1 p-2 bg-white rounded-lg shadow-sm border border-gray-100 text-lg">
      {icon}
    </div>
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-gray-800 font-semibold text-base ${isMono ? 'font-mono text-sm' : ''}`}>
        {value || 'N/A'}
      </p>
    </div>
  </div>
);

export default UserProfile;