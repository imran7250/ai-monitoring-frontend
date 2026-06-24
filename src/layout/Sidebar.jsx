// import { useAuth } from "../context/AuthContext";
// import React from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import {
//   LayoutDashboard, Folder, Server, AlertTriangle,
//   Bell, BellRing, Shield, ChevronRight, Activity,
//   LogOut, Zap,
// } from "lucide-react";
// import { useState, useEffect } from "react";
// import toast from "react-hot-toast";
// import { motion } from "framer-motion";

// export default function Sidebar() {
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [showMenu, setShowMenu] = useState(false);
//   const navigate = useNavigate();

//   const { user, isAdmin, logout: contextLogout } = useAuth();

//   const handleLogout = () => {
//     contextLogout();
//     toast.success("Logged out successfully");
//     navigate("/login");
//   };

//   // ✅ Added: Close menu with ESC key
//   useEffect(() => {
//     const handleEsc = (e) => {
//       if (e.key === "Escape") {
//         setShowMenu(false);
//       }
//     };

//     window.addEventListener("keydown", handleEsc);
//     return () => window.removeEventListener("keydown", handleEsc);
//   }, []);

//   const navItem = ({ isActive }) => `
//     group relative flex items-center gap-3
//     px-4 py-3 rounded-xl transition-all duration-300 border-l-4
//     ${isActive
//       ? "bg-gradient-to-r from-blue-600/20 to-transparent text-white border-blue-500 shadow-lg shadow-blue-500/10"
//       : "text-slate-400 border-transparent hover:bg-slate-800/50 hover:text-white hover:border-l-blue-500/50"
//     }
//   `;

//   const iconClass = (isActive) => `
//     transition-all duration-300
//     ${isActive ? "text-blue-400 scale-110" : "text-slate-500 group-hover:text-slate-300"}
//   `;

//   const navLinks = [
//     { to: "/dashboard",     icon: LayoutDashboard, label: "Dashboard" },
//     { to: "/projects",      icon: Folder,          label: "Projects" },
//     { to: "/services",      icon: Server,          label: "Services" },
//     { to: "/incidents",     icon: AlertTriangle,   label: "Incidents" },
//     { to: "/alerts",        icon: Bell,            label: "Alerts" },
//     { to: "/notifications", icon: BellRing,        label: "Notifications" },
//     { to: "/anomalies",     icon: Zap,             label: "Anomalies" },
//   ];

//   return (
//     <div className={`
//       ${isCollapsed ? "w-20" : "w-72"}
//       h-screen sticky top-0
//       bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950
//       border-r border-slate-800/50 text-white flex flex-col
//       transition-all duration-300 relative
//     `}>

//       <button
//         onClick={() => setIsCollapsed(!isCollapsed)}
//         aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
//         className="absolute -right-3 top-20 z-10 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
//       >
//         <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isCollapsed ? "" : "rotate-180"}`} />
//       </button>

//       <div className="relative px-6 py-6 border-b border-slate-800/50">
//         <div className="flex items-center gap-3">
//           <div className="p-2.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg shadow-blue-500/20">
//             <Activity className="w-5 h-5 text-white" />
//           </div>
//           <div className={`transition-opacity duration-300 ${isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}>
//             <h2 className="text-xl font-bold text-white"></h2>
//           </div>
//         </div>
//       </div>

//       <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
//         {/* <div className={`px-3 mb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider transition-opacity ${isCollapsed ? "opacity-0" : "opacity-100"}`}>
//           Main Menu
//         </div> */}

//         {navLinks.map(({ to, icon: Icon, label }) => (
//           <NavLink key={to} to={to} className={navItem}>
//             {({ isActive }) => (
//               <>
//                 <Icon size={20} className={iconClass(isActive)} />
//                 <span className={`transition-all duration-300 ${isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}>
//                   {label}
//                 </span>
//                 {isActive && !isCollapsed && (
//                   <ChevronRight className="absolute right-3 w-4 h-4 text-blue-400" />
//                 )}
//               </>
//             )}
//           </NavLink>
//         ))}

//         {isAdmin && (
//           <NavLink to="/users" className={navItem}>
//             {({ isActive }) => (
//               <>
//                 <Shield size={20} className={iconClass(isActive)} />
//                 <span className={`transition-all duration-300 ${isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}>
//                   Users
//                 </span>
//                 {isActive && !isCollapsed && (
//                   <ChevronRight className="absolute right-3 w-4 h-4 text-blue-400" />
//                 )}
//               </>
//             )}
//           </NavLink>
//         )}
//       </nav>

//       <div className="relative px-4 py-5 border-t border-slate-800/50">
//         <div
//           className="flex items-center gap-3 cursor-pointer"
//           onClick={() => setShowMenu(!showMenu)}
//         >
//           <div className="relative">
//             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg shadow-lg">
//               {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
//             </div>
//             <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full" />
//           </div>

//           <div className={`transition-all duration-300 ${isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 flex-1"}`}>
//             <div className="text-sm font-semibold text-white truncate max-w-[120px]">
//               {user?.name || "User"}
//             </div>
//             <div className="text-xs text-slate-400 truncate max-w-[120px]">
//               {user?.email || "No email"}
//             </div>
//             <div className="mt-1.5 flex items-center gap-2">
//               <span className="px-2 py-0.5 text-[10px] font-medium bg-slate-800 rounded-full text-slate-300 border border-slate-700">
//                 {user?.role ? user.role.replace("ROLE_", "") : "USER"}
//               </span>
//             </div>
//           </div>
//         </div>

//         {showMenu && !isCollapsed && (
//           <>
//             <div
//               className="fixed inset-0 z-40"
//               onClick={() => setShowMenu(false)}
//             />

//             <motion.div
//               initial={{ opacity: 0, y: 10, scale: 0.95 }}
//               animate={{ opacity: 1, y: 0, scale: 1 }}
//               exit={{ opacity: 0, y: 10, scale: 0.95 }}
//               transition={{ duration: 0.15 }}
//               className="absolute bottom-24 left-4 right-4 bg-slate-800 border border-slate-700 rounded-xl shadow-xl p-4 z-50"
//             >

//               <button
//                 onClick={() => { setShowMenu(false); navigate("/profile"); }}
//                 className="block w-full text-left text-sm py-2 text-slate-300 hover:text-blue-400 transition-colors"
//               >
//                 View Profile
//               </button>

//               <button
//                 onClick={handleLogout}
//                 className="flex items-center gap-2 w-full text-left text-sm py-2 text-red-400 hover:text-red-300 transition-colors mt-2 border-t border-slate-700 pt-3"
//               >
//                 <LogOut size={14} />
//                 Logout
//               </button>

//             </motion.div>
//           </>
//         )}

//         {/* {!isCollapsed && (
//           <div className="mt-4 pt-4 border-t border-slate-800/50">
//             <div className="flex items-center justify-between text-xs">
//               <span className="text-slate-500">System Status</span>
//               <span className="text-emerald-400 flex items-center gap-1">
//                 <span className="inline-block w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
//                 Operational
//               </span>
//             </div>
//           </div>
//         )} */}
//       </div>
//     </div>      
//   );  
// }

// D:\Ai_Monitoring_Platform\ai-monitoring-ui\src\layout\Sidebar.jsx

import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Folder, Server, AlertTriangle,
  Bell, Shield, ChevronRight, Activity, LogOut,
  Menu, X
} from "lucide-react";
import toast from "react-hot-toast";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  // ✅ Responsive: auto-collapse on mobile, auto-expand on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
        setIsMobileOpen(false);
      } else {
        setIsCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  let user = {};
  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch (e) {
    user = {};
  }

  const isAdmin = user?.role === "ROLE_ADMIN";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const navItem = ({ isActive }) => `
    group relative flex items-center gap-3
    px-4 py-3 rounded-xl transition-all duration-300 border-l-4
    ${isActive
      ? "bg-gradient-to-r from-blue-600/20 to-transparent text-white border-blue-500 shadow-lg shadow-blue-500/10"
      : "text-slate-400 border-transparent hover:bg-slate-800/50 hover:text-white hover:border-l-blue-500/50"
    }
  `;

  const iconClass = (isActive) => `
    transition-all duration-300 flex-shrink-0
    ${isActive ? "text-blue-400 scale-110" : "text-slate-500 group-hover:text-slate-300"}
  `;

  const navLinks = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/projects", icon: Folder, label: "Projects" },
    { to: "/services", icon: Server, label: "Services" },
    { to: "/incidents", icon: AlertTriangle, label: "Incidents" },
    { to: "/alerts", icon: Bell, label: "Alerts" },
    { to: "/notifications", icon: Bell, label: "Notifications" },
  ];

  // ✅ Mobile: overlay sidebar
  if (window.innerWidth < 768) {
    return (
      <>
        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="fixed top-4 left-4 z-50 p-2 bg-slate-900 border border-slate-800 rounded-xl text-white hover:bg-slate-800 transition-colors md:hidden"
          aria-label="Toggle menu"
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Mobile Overlay */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <div
          className={`
            fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950
            border-r border-slate-800/50 text-white flex flex-col
            transition-transform duration-300 z-50
            ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
            md:hidden
          `}
        >
          {renderSidebarContent()}
        </div>

        {/* Desktop Sidebar (visible on md+) */}
        <div className="hidden md:flex md:w-72 flex-shrink-0">
          {renderSidebarContent()}
        </div>
      </>
    );
  }

  // ✅ Desktop: collapsible sidebar
  return (
    <div className={`
      ${isCollapsed ? "w-20" : "w-72"}
      h-screen sticky top-0
      bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950
      border-r border-slate-800/50 text-white flex flex-col
      transition-all duration-300 relative
      hidden md:flex
    `}>
      {renderSidebarContent()}
    </div>
  );

  function renderSidebarContent() {
    const collapsed = window.innerWidth < 768 ? false : isCollapsed;
    const isDesktop = window.innerWidth >= 768;

    return (
      <>
        {/* Collapse toggle - desktop only */}
        {isDesktop && (
          <button
            onClick={() => setIsCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="absolute -right-3 top-20 z-10 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${collapsed ? "" : "rotate-180"}`} />
          </button>
        )}

        {/* Logo */}
        <div className="relative px-4 sm:px-6 py-4 sm:py-6 border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg shadow-blue-500/20 flex-shrink-0">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div className={`transition-opacity duration-300 ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}>
              <h2 className="text-xl font-bold text-white whitespace-nowrap">AI Monitor</h2>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 sm:px-3 py-4 sm:py-6 space-y-1 overflow-y-auto">
          <div className={`px-3 mb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider transition-opacity ${collapsed ? "opacity-0" : "opacity-100"}`}>
            Main Menu
          </div>

          {navLinks.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} className={navItem} onClick={() => setIsMobileOpen(false)}>
              {({ isActive }) => (
                <>
                  <Icon size={20} className={iconClass(isActive)} />
                  <span className={`transition-all duration-300 ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}>
                    {label}
                  </span>
                  {isActive && !collapsed && (
                    <ChevronRight className="absolute right-3 w-4 h-4 text-blue-400" />
                  )}
                </>
              )}
            </NavLink>
          ))}

          {isAdmin && (
            <NavLink to="/users" className={navItem} onClick={() => setIsMobileOpen(false)}>
              {({ isActive }) => (
                <>
                  <Shield size={20} className={iconClass(isActive)} />
                  <span className={`transition-all duration-300 ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}>
                    Users
                  </span>
                  {isActive && !collapsed && (
                    <ChevronRight className="absolute right-3 w-4 h-4 text-blue-400" />
                  )}
                </>
              )}
            </NavLink>
          )}
        </nav>

        {/* User Footer */}
        <div className="relative px-4 py-4 sm:py-5 border-t border-slate-800/50">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setShowMenu(!showMenu)}
          >
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full" />
            </div>

            <div className={`transition-all duration-300 ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 flex-1 min-w-0"}`}>
              <div className="text-sm font-semibold text-white truncate max-w-[100px] sm:max-w-[120px]">
                {user?.name || "User"}
              </div>
              <div className="text-xs text-slate-400 truncate max-w-[100px] sm:max-w-[120px]">
                {user?.email || "No email"}
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-medium bg-slate-800 rounded-full text-slate-300 border border-slate-700 truncate">
                  {user?.role ? user.role.replace("ROLE_", "") : "USER"}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Dropdown - responsive */}
          {showMenu && !collapsed && (
            <div className="absolute bottom-24 left-4 right-4 bg-slate-800 border border-slate-700 rounded-xl shadow-xl p-4 z-50">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-white">Account</span>
                <button
                  onClick={() => setShowMenu(false)}
                  aria-label="Close menu"
                  className="text-slate-400 hover:text-white text-xs p-2"
                >
                  ✕
                </button>
              </div>

              <button
                onClick={() => { setShowMenu(false); navigate("/profile"); }}
                className="block w-full text-left text-sm py-2 text-slate-300 hover:text-blue-400 transition-colors"
              >
                View Profile
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full text-left text-sm py-2 text-red-400 hover:text-red-300 transition-colors mt-1"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          )}

          {/* System Status */}
          {!collapsed && (
            <div className="mt-4 pt-4 border-t border-slate-800/50">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">System Status</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  Operational
                </span>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }
}