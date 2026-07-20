

// // D:\Ai_Monitoring_Platform\ai-monitoring-ui\src\layout\Header.jsx

// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// export default function Header() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const logout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");  
//   };

//   const getPageTitle = () => {
//     const path = location.pathname;
//     if (path.startsWith("/dashboard")) return "Dashboard";
//     if (path.startsWith("/projects")) {
//       if (path.includes("/projects/")) return "Project Details";
//       return "Projects";
//     }
//     if (path.startsWith("/services")) {
//       if (path.includes("/services/")) return "Service Details";
//       return "Services";
//     }
//     if (path.startsWith("/incidents")) {
//       if (path.includes("/incidents/")) return "Incident Details";
//       return "Incidents";
//     }
//     if (path.startsWith("/alerts")) return "Alerts";
//     if (path.startsWith("/notifications")) return "Notifications";
//     if (path.startsWith("/anomalies")) return "Anomalies";
//     if (path.startsWith("/users")) return "Users";
//     if (path.startsWith("/profile")) return "Profile";
//     return "AI Monitoring";
//   };

//   return (
//     <header className="h-14 sm:h-16 border-b border-slate-800 bg-slate-950/70 backdrop-blur flex items-center justify-between px-4 sm:px-6 md:px-8 text-white sticky top-0 z-30">
//       {/* Left side - Title */}
//       <div className="flex items-center gap-2 sm:gap-4 min-w-0">
//         <h1 className="text-base sm:text-lg font-semibold tracking-tight truncate">
//           {getPageTitle()}
//         </h1>
//         <span className="text-xs text-slate-500 hidden md:inline whitespace-nowrap">
//           Real-time monitoring
//         </span>
//       </div>

//       {/* Right side */}
//       <div className="flex items-center gap-3 sm:gap-4 md:gap-6 flex-shrink-0">
//         {/* Status indicator */}
//         <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-green-400">
//           <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse" />
//           <span className="hidden xs:inline">Live</span>
//         </div>

//         {/* Logout button - responsive text */}
//         <button
//           onClick={logout}
//           className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition whitespace-nowrap"
//         >
//           <span className="hidden xs:inline">Logout</span>
//           <span className="xs:hidden">✕</span>
//         </button>
//       </div>
//     </header>
//   );
// }

// D:\Ai_Monitoring_Platform\ai-monitoring-ui\src\layout\Header.jsx

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith("/dashboard")) return "Dashboard";
    if (path.startsWith("/projects")) {
      if (path.includes("/projects/")) return "Project Details";
      return "Projects";
    }
    if (path.startsWith("/services")) {
      if (path.includes("/services/")) return "Service Details";
      return "Services";
    }
    if (path.startsWith("/incidents")) {
      if (path.includes("/incidents/")) return "Incident Details";
      return "Incidents";
    }
    if (path.startsWith("/alerts")) return "Alerts";
    if (path.startsWith("/notifications")) return "Notifications";
    if (path.startsWith("/anomalies")) return "Anomalies";
    if (path.startsWith("/users")) return "Users";
    if (path.startsWith("/profile")) return "Profile";
    return "AI Monitoring";
  };

  return (
    <header className="h-14 sm:h-16 border-b border-gray-200 bg-white/95 backdrop-blur-sm flex items-center justify-between px-4 sm:px-6 md:px-8 text-gray-900 sticky top-0 z-30 shadow-sm">
      
      {/* Left side - Title */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <h1 className="text-base sm:text-lg font-semibold tracking-tight truncate">
          {getPageTitle()}
        </h1>
        <span className="text-xs text-gray-400 hidden md:inline whitespace-nowrap">
          Real-time monitoring
        </span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 sm:gap-4 md:gap-6 flex-shrink-0">
        {/* Status indicator */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-emerald-600">
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="hidden xs:inline">Live</span>
        </div>

        {/* Logout button */}
        <button
          onClick={logout}
          className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 transition whitespace-nowrap"
        >
          <span className="hidden xs:inline">Logout</span>
          <span className="xs:hidden">✕</span>
        </button>
      </div>
    </header>
  );
}
