import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

const LiveUpdateContext = createContext();
let globalClient = null; // 🧠 Global guard against multiple connections

export const LiveUpdateProvider = ({ children }) => {
  const { user } = useAuth();
  const [connected, setConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const toastCooldown = useRef(new Set());

  useEffect(() => {
    if (!user || !user.roles?.length) return;

    const userRole = user.roles[0].replace("ROLE_", "").toLowerCase();
    const WS_BASE_URL =
      process.env.REACT_APP_WS_BASE_URL || "http://localhost:8080/ws";

    // 🧩 If a client already exists, don’t reconnect
    if (globalClient?.active) {
      console.log("⚙️ Existing WebSocket active. Skipping reconnect.");
      return;
    }

    console.log("🌐 Connecting LiveUpdate WebSocket for:", userRole);
    console.log("🔗 WS URL:", WS_BASE_URL);

    // Cleanup any ghost client before creating new
    if (globalClient) {
      try {
        globalClient.deactivate();
      } catch (e) {}
    }

    const socket = new SockJS(WS_BASE_URL);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: (msg) => console.log("[LiveUpdate WS]", msg),
    });

    // 🔥 Handle incoming messages
    const handleIncoming = (message, topicType) => {
      try {
        const report = JSON.parse(message.body);
        const uniqueKey = `${report.id}_${topicType}`;

        // 🧊 Avoid duplicates (same event in short time)
        if (toastCooldown.current.has(uniqueKey)) {
          console.log("🧩 Skipping duplicate event:", uniqueKey);
          return;
        }

        toastCooldown.current.add(uniqueKey);
        setTimeout(() => toastCooldown.current.delete(uniqueKey), 2500); // cool down period

        console.log(`📡 ${topicType} update:`, report);
        setLastUpdate({ type: topicType, data: report });

        toast.info(`📢 "${report.title}" updated in real-time`, {
          position: "bottom-right",
          autoClose: 2000,
          theme: "colored",
        });
      } catch (err) {
        console.error("❌ Error parsing WS message:", err);
      }
    };

    client.onConnect = () => {
      console.log("✅ WebSocket connected for:", userRole);
      setConnected(true);

      // 🌍 Subscribe to global + role-specific topics
      client.subscribe("/topic/reports/all", (msg) => handleIncoming(msg, "ALL"));
      client.subscribe(`/topic/reports/${userRole}`, (msg) =>
        handleIncoming(msg, userRole)
      );
    };

    client.onWebSocketClose = () => {
      console.warn("⚠️ WebSocket closed. Will auto-reconnect...");
      setConnected(false);
    };

    client.onDisconnect = () => {
      console.warn("⚠️ WebSocket disconnected.");
      setConnected(false);
    };

    client.activate();
    globalClient = client; // ✅ Set as global active client

    return () => {
      console.log("🧹 Cleaning up LiveUpdate WebSocket...");
      try {
        client.deactivate();
      } catch (e) {
        console.error("⚠️ WS cleanup failed", e);
      }
      globalClient = null;
      setConnected(false);
    };
  }, [user]);

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
