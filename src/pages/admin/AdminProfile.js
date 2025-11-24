import React from 'react';
import UserProfile from '../user/UserProfile'; // Reusing the robust User form

const AdminProfile = () => {
  return (
    <div>
       {/* You can add extra Admin-only headers here if needed */}
       <div className="pt-24 px-4 max-w-4xl mx-auto mb-[-80px]">
          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Admin Mode</span>
       </div>
       <UserProfile />
    </div>
  );
};

export default AdminProfile;