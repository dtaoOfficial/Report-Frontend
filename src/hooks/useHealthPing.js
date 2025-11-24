import { useEffect } from "react";
import axios from "axios";

// 🧩 Replace this with your actual Render backend URL
const HEALTH_URL = "https://report-backend-1ud9.onrender.com/api/health";

export default function useHealthPing(interval = 3000) { // ping every 3 seconds
  useEffect(() => {
    const pingServer = async () => {
      try {
        await axios.get(HEALTH_URL, { timeout: 2000 });
      } catch (err) {
        // silent fail, ignore if backend sleeping
      }
    };

    // 🌀 initial ping immediately
    pingServer();

    // 🕒 set repeating interval
    const timer = setInterval(pingServer, interval);

    // cleanup on unmount
    return () => clearInterval(timer);
  }, [interval]);
}
