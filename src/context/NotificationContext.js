// 🌐 NotificationContext.js
// Handles real-time notifications via WebSocket

import React, { createContext, useContext, useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useAuth } from "./AuthContext";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user || !user.roles?.length) return;

    const WS_BASE_URL =
      process.env.REACT_APP_WS_BASE_URL || "http://localhost:8080/ws";
    const userRole = user.roles[0].replace("ROLE_", "").toLowerCase();

    console.log("🌐 Connecting to Notification WS:", WS_BASE_URL);

    const socket = new SockJS(WS_BASE_URL, null, {
      transports: ["websocket", "xhr-streaming", "xhr-polling"],
    });

    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (msg) => console.log("[Notification WS]", msg),
    });

    stompClient.onConnect = () => {
      const topic = `/topic/notifications/${userRole}`;
      console.log(`✅ Subscribed to: ${topic}`);

      stompClient.subscribe(topic, (message) => {
        if (message.body) {
          try {
            const parsed = JSON.parse(message.body);
            setNotifications((prev) => [parsed, ...prev]);
            setUnreadCount((count) => count + 1);
            
          } catch (err) {
            console.error("❌ Notification parse error:", err);
          }
        }
      });
    };

    stompClient.onStompError = (frame) => {
      console.error("❌ STOMP error:", frame.headers["message"]);
    };

    stompClient.onWebSocketClose = () => {
      console.warn("⚠️ Notification WS closed, reconnecting...");
    };

    stompClient.activate();

    return () => {
      if (stompClient?.active) {
        stompClient.deactivate();
        console.log("❌ Notification WS disconnected");
      }
    };
  }, [user]);

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, clearNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
