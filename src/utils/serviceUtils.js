// ✅ FIX #4 — Shared service utilities
// Before: colorMap, getStatusInfo, getTypeIcon were copy-pasted
// identically into Services.jsx AND ProjectDetails.jsx
// After: one file used in both components

import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity,
  Cpu,
  Globe,
  Server,
} from "lucide-react";

/**
 * Color class map for Tailwind — maps color name to bg/border/text classes
 */
export const colorMap = {
  emerald: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
  },
  red: {
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    text: "text-red-400",
  },
  yellow: {
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    text: "text-yellow-400",
  },
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-400",
  },
  purple: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    text: "text-purple-400",
  },
  slate: {
    bg: "bg-slate-500/10",
    border: "border-slate-500/20",
    text: "text-slate-400",
  },
};

/**
 * Returns icon and color for a service status
 * @param {string} status - UP | DOWN | DEGRADED | UNKNOWN
 */
export const getStatusInfo = (status) => {
  switch (status) {
    case "UP":
      return { icon: CheckCircle, color: "emerald", label: "Operational" };
    case "DOWN":
      return { icon: XCircle, color: "red", label: "Down" };
    case "DEGRADED":
      return { icon: AlertCircle, color: "yellow", label: "Degraded" };
    default:
      return { icon: Activity, color: "slate", label: "Unknown" };
  }
};

/**
 * Returns icon and color for a service type
 * @param {string} type - API | WEBSITE | MICROSERVICE | SERVER | DATABASE
 */
export const getTypeIcon = (type) => {
  switch (type?.toUpperCase()) {
    case "API":
      return { icon: Cpu, color: "blue", label: "API" };
    case "WEBSITE":
      return { icon: Globe, color: "purple", label: "Website" };
    case "MICROSERVICE":
      return { icon: Server, color: "emerald", label: "Microservice" };
    default:
      return { icon: Server, color: "slate", label: "Service" };
  }
};

/**
 * Truncate an ID for display
 * @param {number|string} id
 * @param {number} length - chars to show
 */
export const shortId = (id, length = 8) => {
  if (!id) return "N/A";
  return String(id).slice(0, length);
};