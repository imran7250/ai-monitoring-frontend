// ✅ FIX #4 — Shared date utilities
// Before: formatDate() and getDuration() were copy-pasted
// into Incidents.jsx, IncidentDetails.jsx, AlertCenter.jsx,
// Notifications.jsx, and more — 5+ duplicates
// After: one file, used everywhere

/**
 * Format a date string to a human-readable locale string
 * Example output: "Mar 14, 02:30 PM"
 */
export const formatDate = (dateString) => {
  if (!dateString) return "Unknown";
  try {
    return new Date(dateString).toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
};

/**
 * Format a date as relative time
 * Example output: "2m ago", "Yesterday", "3 days ago"
 */
export const formatRelativeTime = (dateString) => {
  if (!dateString) return "Unknown";
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  } catch {
    return dateString;
  }
};

/**
 * Calculate duration between two timestamps
 * Example output: "2h 30m", "45m 12s", "30s"
 */
export const getDuration = (startedAt, resolvedAt = null) => {
  if (!startedAt) return "-";
  try {
    const start = new Date(startedAt);
    const end = resolvedAt ? new Date(resolvedAt) : new Date();
    const diff = Math.max(0, Math.floor((end - start) / 1000));

    const hours = Math.floor(diff / 3600);
    const mins = Math.floor((diff % 3600) / 60);
    const secs = diff % 60;

    if (hours > 0) return `${hours}h ${mins}m`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  } catch {
    return "-";
  }
};

/**
 * Format time only — "02:30 PM"
 */
export const formatTime = (dateString) => {
  if (!dateString) return "";
  try {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
}; 