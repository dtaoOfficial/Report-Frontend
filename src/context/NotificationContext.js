// 🌐 NotificationContext.js
// Real-time notifications via WebSocket (works in HTTPS + localhost)

import React, { createContext, useContext, useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useAuth } from "./AuthContext";

export const NotificationContext = createContext();
let globalNotifClient = null; // 🧠 Prevent duplicate connections

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!user || !user.roles?.length) return;

    const userRole = user.roles[0].replace("ROLE_", "").toLowerCase();

    // 🌍 Smart WebSocket URL detection
    let WS_BASE_URL = process.env.REACT_APP_WS_BASE_URL || "http://localhost:8080/ws";

    // ⚙️ Auto-fix protocol mismatch (avoids HTTPS SecurityError)
    if (window.location.protocol === "https:" && WS_BASE_URL.startsWith("http://")) {
      WS_BASE_URL = WS_BASE_URL.replace("http://", "https://");
    } else if (window.location.protocol === "http:" && WS_BASE_URL.startsWith("https://")) {
      WS_BASE_URL = WS_BASE_URL.replace("https://", "http://");
    }

    // ⚙️ Fix for React dev mode (localhost:3000 → backend:8080)
    if (window.location.hostname === "localhost" && window.location.port === "3000") {
      WS_BASE_URL = "http://localhost:8080/ws";
    }

    console.log("🌐 Connecting Notification WebSocket →", WS_BASE_URL);

    // 🧩 Avoid duplicate connections
    if (globalNotifClient?.active) {
      console.log("⚙️ Notification WS already active, skipping reconnect.");
      return;
    }

    // Clean any ghost connection
    if (globalNotifClient) {
      try {
        globalNotifClient.deactivate();
      } catch (e) {
        console.warn("⚠️ Failed to cleanup old WS client:", e);
      }
    }

    // 🧠 Initialize WebSocket client
    const socket = new SockJS(WS_BASE_URL, null, {
      transports: ["websocket", "xhr-streaming", "xhr-polling"],
    });

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: (msg) => console.log("[Notification WS]", msg),
    });

    // ✅ On connect
    client.onConnect = () => {
      const topic = `/topic/notifications/${userRole}`;
      console.log(`✅ Connected & subscribed to: ${topic}`);
      setConnected(true);

      client.subscribe(topic, (message) => {
        if (message.body) {
          try {
            const parsed = JSON.parse(message.body);
            console.log("🔔 New notification:", parsed);
            setNotifications((prev) => [parsed, ...prev]);
            setUnreadCount((c) => c + 1);
          } catch (err) {
            console.error("❌ Error parsing notification message:", err);
          }
        }
      });
    };

    // ⚠️ Handle close or errors
    client.onWebSocketClose = () => {
      console.warn("⚠️ Notification WS closed. Will reconnect...");
      setConnected(false);
    };

    client.onStompError = (frame) => {
      console.error("❌ STOMP protocol error:", frame.headers["message"]);
      setConnected(false);
    };

    // 🚀 Activate
    client.activate();
    globalNotifClient = client;

    // 🧹 Cleanup on unmount or user switch
    return () => {
      console.log("🧹 Cleaning up Notification WebSocket...");
      try {
        client.deactivate();
      } catch (e) {
        console.error("⚠️ WS cleanup failed:", e);
      }
      globalNotifClient = null;
      setConnected(false);
    };
  }, [user]);

  // 🧽 Utility — Clear notifications
  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, clearNotifications, connected }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
