import { useAuth } from "../context/AuthContext";
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Folder, Server, AlertTriangle,
  Bell, BellRing, Shield, ChevronRight, Activity,
  LogOut, Zap,
} from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const { user, isAdmin, logout: contextLogout } = useAuth();

  const handleLogout = () => {
    contextLogout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // ✅ Added: Close menu with ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setShowMenu(false);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const navItem = ({ isActive }) => `
    group relative flex items-center gap-3
    px-4 py-3 rounded-xl transition-all duration-300 border-l-4
    ${isActive
      ? "bg-gradient-to-r from-blue-600/20 to-transparent text-white border-blue-500 shadow-lg shadow-blue-500/10"
      : "text-slate-400 border-transparent hover:bg-slate-800/50 hover:text-white hover:border-l-blue-500/50"
    }
  `;

  const iconClass = (isActive) => `
    transition-all duration-300
    ${isActive ? "text-blue-400 scale-110" : "text-slate-500 group-hover:text-slate-300"}
  `;

  const navLinks = [
    { to: "/dashboard",     icon: LayoutDashboard, label: "Dashboard" },
    { to: "/projects",      icon: Folder,          label: "Projects" },
    { to: "/services",      icon: Server,          label: "Services" },
    { to: "/incidents",     icon: AlertTriangle,   label: "Incidents" },
    { to: "/alerts",        icon: Bell,            label: "Alerts" },
    { to: "/notifications", icon: BellRing,        label: "Notifications" },
    { to: "/anomalies",     icon: Zap,             label: "Anomalies" },
  ];

  return (
    <div className={`
      ${isCollapsed ? "w-20" : "w-72"}
      h-screen sticky top-0
      bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950
      border-r border-slate-800/50 text-white flex flex-col
      transition-all duration-300 relative
    `}>

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute -right-3 top-20 z-10 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isCollapsed ? "" : "rotate-180"}`} />
      </button>

      <div className="relative px-6 py-6 border-b border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg shadow-blue-500/20">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div className={`transition-opacity duration-300 ${isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}>
            <h2 className="text-xl font-bold text-white"></h2>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {/* <div className={`px-3 mb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider transition-opacity ${isCollapsed ? "opacity-0" : "opacity-100"}`}>
          Main Menu
        </div> */}

        {navLinks.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={navItem}>
            {({ isActive }) => (
              <>
                <Icon size={20} className={iconClass(isActive)} />
                <span className={`transition-all duration-300 ${isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}>
                  {label}
                </span>
                {isActive && !isCollapsed && (
                  <ChevronRight className="absolute right-3 w-4 h-4 text-blue-400" />
                )}
              </>
            )}
          </NavLink>
        ))}

        {isAdmin && (
          <NavLink to="/users" className={navItem}>
            {({ isActive }) => (
              <>
                <Shield size={20} className={iconClass(isActive)} />
                <span className={`transition-all duration-300 ${isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}>
                  Users
                </span>
                {isActive && !isCollapsed && (
                  <ChevronRight className="absolute right-3 w-4 h-4 text-blue-400" />
                )}
              </>
            )}
          </NavLink>
        )}
      </nav>

      <div className="relative px-4 py-5 border-t border-slate-800/50">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setShowMenu(!showMenu)}
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg shadow-lg">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full" />
          </div>

          <div className={`transition-all duration-300 ${isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 flex-1"}`}>
            <div className="text-sm font-semibold text-white truncate max-w-[120px]">
              {user?.name || "User"}
            </div>
            <div className="text-xs text-slate-400 truncate max-w-[120px]">
              {user?.email || "No email"}
            </div>
            <div className="mt-1.5 flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-medium bg-slate-800 rounded-full text-slate-300 border border-slate-700">
                {user?.role ? user.role.replace("ROLE_", "") : "USER"}
              </span>
            </div>
          </div>
        </div>

        {showMenu && !isCollapsed && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowMenu(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-24 left-4 right-4 bg-slate-800 border border-slate-700 rounded-xl shadow-xl p-4 z-50"
            >

              <button
                onClick={() => { setShowMenu(false); navigate("/profile"); }}
                className="block w-full text-left text-sm py-2 text-slate-300 hover:text-blue-400 transition-colors"
              >
                View Profile
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full text-left text-sm py-2 text-red-400 hover:text-red-300 transition-colors mt-2 border-t border-slate-700 pt-3"
              >
                <LogOut size={14} />
                Logout
              </button>

            </motion.div>
          </>
        )}

        {/* {!isCollapsed && (
          <div className="mt-4 pt-4 border-t border-slate-800/50">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">System Status</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                Operational
              </span>
            </div>
          </div>
        )} */}
      </div>
    </div>      
  );  
}
