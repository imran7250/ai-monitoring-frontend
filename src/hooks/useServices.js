import { useState, useEffect } from "react";
import { api } from "../api/client";
export function useServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get("/api/services")
      .then(res => setServices(res.data || []))
      .catch(err => console.error("Failed loading services", err))
      .finally(() => setLoading(false));
  }, []);
  return { services, loading };
}
