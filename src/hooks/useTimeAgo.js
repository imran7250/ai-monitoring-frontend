import { useEffect, useState } from "react";

// ✅ PHASE 3.3 — Live "Updated X ago" ticker
// Usage: const timeAgo = useTimeAgo(lastRefreshedAt);
// Renders: "just now" → "12s ago" → "2m ago" → "1h ago"
// Updates every second automatically

export function useTimeAgo(date) {
  const [timeAgo, setTimeAgo] = useState("just now");

  useEffect(() => {
    if (!date) return;

    const update = () => {
      const secs = Math.floor((Date.now() - new Date(date)) / 1000);
      if (secs < 5) setTimeAgo("just now");
      else if (secs < 60) setTimeAgo(`${secs}s ago`);
      else if (secs < 3600) setTimeAgo(`${Math.floor(secs / 60)}m ago`);
      else setTimeAgo(`${Math.floor(secs / 3600)}h ago`);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [date]);

  return timeAgo;
}