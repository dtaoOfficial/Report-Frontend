import React, { useState } from "react";
import { Bell } from "lucide-react";
import { useNotification } from "../hooks/useNotification";
import NotificationList from "./NotificationList";

const NotificationBell = () => {
  const { notifications, unreadCount, clearNotifications } = useNotification();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) clearNotifications();
  };

  return (
    <div className="relative inline-block text-left">
      {/* 🔔 Bell Icon */}
      <button
        onClick={toggleDropdown}
        className="relative p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
        title="Notifications"
      >
        <Bell className="w-6 h-6 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* 📋 Dropdown List */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
          <div className="p-3 border-b flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-800">Notifications</h3>
            <button
              onClick={clearNotifications}
              className="text-xs text-blue-600 hover:underline"
            >
              Clear
            </button>
          </div>
          <NotificationList notifications={notifications} />
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
