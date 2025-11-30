import { useEffect } from "react";
import axios from "axios";

export default function useHealthPing(interval = 3000) {
  // ✅ Build URL safely from .env
  const baseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";
  const healthUrl = `${baseUrl.replace(/\/$/, "")}/health`;

  useEffect(() => {
    const pingServer = async () => {
      try {
        console.log("🌐 Pinging:", healthUrl);
        const res = await axios.get(healthUrl, { timeout: 3000 });
        console.log("✅ Health Response:", res.data);
      } catch (err) {
        console.warn("⚠️ Health check failed:", err.message);
      }
    };

    pingServer(); // first ping
    const timer = setInterval(pingServer, interval);
    return () => clearInterval(timer);
  }, [interval, healthUrl]);
}
