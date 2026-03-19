import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const getPageTitle = () => {
    if (location.pathname.startsWith("/dashboard")) return "Dashboard";
    if (location.pathname.startsWith("/projects")) return "Projects";
    if (location.pathname.startsWith("/services")) return "Services";
    if (location.pathname.startsWith("/incidents")) return "Incidents";
    if (location.pathname.startsWith("/alerts")) return "Alerts";
    if (location.pathname.startsWith("/notifications")) return "Notifications";
    if (location.pathname.startsWith("/anomalies")) return "Anomalies";
    if (location.pathname.startsWith("/users")) return "Users";
    if (location.pathname.startsWith("/profile")) return "Profile";
    return "AI Monitoring";
  };

  return (
    <div className="h-16 border-b border-slate-800 bg-slate-950/70 backdrop-blur flex items-center justify-between px-8 text-white">

      <div className="flex items-center gap-4">
        <div className="text-lg font-semibold tracking-tight">
          {getPageTitle()}
        </div>
        <div className="text-xs text-slate-500 hidden md:block">
          Real-time monitoring system
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-xs text-green-400">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          Live
        </div>
        <button
          onClick={logout}
          className="text-sm px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
        >
          Logout
        </button>
      </div>

    </div>
  );
}
