import React, { createContext, useContext, useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

// ✅ Exported context
export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user || !user.roles || user.roles.length === 0) return;

    // ✅ Use environment variable for WebSocket base URL
    const BASE_URL =
      process.env.REACT_APP_API_BASE_URL;

    const socket = new SockJS(`${BASE_URL}/ws`);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000, // auto-reconnect every 5 seconds
      debug: (msg) => console.log("[WebSocket]", msg),
    });

    stompClient.onConnect = () => {
      const userRole = user.roles[0].replace("ROLE_", "").toLowerCase();
      const topic = `/topic/notifications/${userRole}`;

      console.log(`✅ Subscribed to: ${topic}`);
      stompClient.subscribe(topic, (message) => {
        if (message.body) {
          const parsed = JSON.parse(message.body);
          setNotifications((prev) => [parsed, ...prev]);
          setUnreadCount((count) => count + 1);
          toast.info(`🔔 ${parsed.message}`, { position: "top-right" });
        }
      });
    };

    stompClient.onStompError = (frame) => {
      console.error("❌ STOMP error:", frame.headers["message"]);
    };

    stompClient.activate();

    return () => {
      if (stompClient && stompClient.active) {
        stompClient.deactivate();
      }
    };
  }, [user]);

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// ✅ Custom hook
export const useNotification = () => useContext(NotificationContext);
