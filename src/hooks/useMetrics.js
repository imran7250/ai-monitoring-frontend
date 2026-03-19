import { useState, useEffect } from "react";
import { api } from "../api/client";
export function useMetrics(serviceId) {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!serviceId) return;
    api.get(`/api/metrics/service/${serviceId}`)
      .then(res => setMetrics(res.data || []))
      .catch(err => console.error("Failed loading metrics", err))
      .finally(() => setLoading(false));
  }, [serviceId]);
  return { metrics, loading };
}
