import React from "react";
import { Clock, User } from "lucide-react";

const NotificationList = ({ notifications = [] }) => {
  if (!notifications || notifications.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 text-sm">
        No new notifications
      </div>
    );
  }

  return (
    <ul className="max-h-64 overflow-y-auto divide-y divide-gray-100">
      {notifications.map((notif, i) => (
        <li
          key={i}
          className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition"
        >
          <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full">
            <User className="w-4 h-4 text-blue-600" />
          </div>

          <div className="flex-1">
            <p className="text-sm text-gray-800">{notif.message}</p>
            {notif.sender && (
              <p className="text-xs text-gray-500 mt-1">
                From: {notif.sender}
              </p>
            )}
            <div className="flex items-center text-xs text-gray-400 mt-1">
              <Clock className="w-3 h-3 mr-1" />
              {notif.timestamp
                ? new Date(notif.timestamp).toLocaleTimeString()
                : "Just now"}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default NotificationList;
