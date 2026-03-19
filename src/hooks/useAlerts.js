import { useState, useEffect } from "react";
import { api } from "../api/client";
export function useAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get("/api/alerts/all")
      .then(res => setAlerts(res.data || []))
      .catch(err => console.error("Failed loading alerts", err))
      .finally(() => setLoading(false));
  }, []);
  return { alerts, loading };
}
