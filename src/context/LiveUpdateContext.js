// ⚡ LiveUpdateContext.js — WebSocket for Real-time Updates
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

const LiveUpdateContext = createContext();
let globalClient = null; // 🧠 Prevent duplicate WS connections

export const LiveUpdateProvider = ({ children }) => {
  const { user } = useAuth();
  const [connected, setConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const toastCooldown = useRef(new Set());

  useEffect(() => {
    if (!user || !user.roles?.length) return;

    const userRole = user.roles[0].replace("ROLE_", "").toLowerCase();

    // 🌐 Smart WS URL detection (works in localhost + https deploy)
    let WS_BASE_URL = process.env.REACT_APP_WS_BASE_URL || "http://localhost:8080/ws";

    // ⚙️ Auto-fix protocol mismatch (prevents SecurityError on HTTPS)
    if (window.location.protocol === "https:" && WS_BASE_URL.startsWith("http://")) {
      WS_BASE_URL = WS_BASE_URL.replace("http://", "https://");
    } else if (window.location.protocol === "http:" && WS_BASE_URL.startsWith("https://")) {
      WS_BASE_URL = WS_BASE_URL.replace("https://", "http://");
    }

    // ⚙️ Fix localhost auto-port switching (React dev:3000 → Spring:8080)
    if (window.location.hostname === "localhost" && window.location.port === "3000") {
      WS_BASE_URL = "http://localhost:8080/ws";
    }

    console.log("🌍 Connecting WebSocket for role:", userRole);
    console.log("🔗 Using WS URL:", WS_BASE_URL);

    // 🛑 Prevent reconnect if already active
    if (globalClient?.active) {
      console.log("⚙️ WebSocket already active. Skipping reconnect.");
      return;
    }

    // Clean any old ghost connection
    if (globalClient) {
      try {
        globalClient.deactivate();
      } catch (e) {
        console.warn("⚠️ Cleanup of previous WS client failed:", e);
      }
    }

    // 🧠 Build client
    const socket = new SockJS(WS_BASE_URL);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: (msg) => console.log("[LiveUpdate WS]", msg),
    });

    // 🎯 Incoming handler
    const handleIncoming = (message, topicType) => {
      try {
        const report = JSON.parse(message.body);
        const uniqueKey = `${report.id}_${topicType}`;

        // Avoid duplicate toasts within short time
        if (toastCooldown.current.has(uniqueKey)) return;
        toastCooldown.current.add(uniqueKey);
        setTimeout(() => toastCooldown.current.delete(uniqueKey), 2500);

        console.log(`📡 ${topicType.toUpperCase()} update:`, report);
        setLastUpdate({ type: topicType, data: report });

        toast.info(`📢 "${report.title}" updated in real-time`, {
          position: "bottom-right",
          autoClose: 2000,
          theme: "colored",
        });
      } catch (err) {
        console.error("❌ Failed to parse WS message:", err);
      }
    };

    // 🧩 On connect
    client.onConnect = () => {
      console.log("✅ WebSocket connected for:", userRole);
      setConnected(true);

      // Global + Role-specific subscriptions
      client.subscribe("/topic/reports/all", (msg) =>
        handleIncoming(msg, "ALL")
      );
      client.subscribe(`/topic/reports/${userRole}`, (msg) =>
        handleIncoming(msg, userRole)
      );
    };

    // 🧩 On disconnect
    client.onWebSocketClose = () => {
      console.warn("⚠️ WebSocket closed. Attempting reconnect...");
      setConnected(false);
    };

    client.onDisconnect = () => {
      console.warn("⚠️ WebSocket manually disconnected.");
      setConnected(false);
    };

    // 🚀 Activate connection
    client.activate();
    globalClient = client;

    // 🧹 Cleanup
    return () => {
      console.log("🧹 Cleaning up WebSocket connection...");
      try {
        client.deactivate();
      } catch (e) {
        console.error("⚠️ WS cleanup failed", e);
      }
      globalClient = null;
      setConnected(false);
    };
  }, [user]);

  // Manual refresh trigger
  const triggerManualRefresh = (data = null) => {
    setLastUpdate({ type: "MANUAL", data });
  };

  return (
    <LiveUpdateContext.Provider
      value={{ connected, lastUpdate, triggerManualRefresh }}
    >
      {children}
    </LiveUpdateContext.Provider>
  );
};

export const useLiveUpdate = () => useContext(LiveUpdateContext);
