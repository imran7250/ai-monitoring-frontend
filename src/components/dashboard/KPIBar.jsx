// import { Activity, AlertTriangle, Server, TrendingUp } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// export default function KPIBar({ summary, aiSummary, incidents }) {

//   const navigate = useNavigate();

//   const total = summary?.totalServices || 0;
//   const healthy = summary?.upServices || 0;
//   const degraded = summary?.degradedServices || 0;
//   const down = summary?.downServices || 0;

//   const healthPercent = total > 0
//     ? Math.round((healthy / total) * 100)
//     : 100;
    
//   const healthColor =
//     healthPercent > 80 ? "text-green-400" :
//     healthPercent > 50 ? "text-yellow-400" :
//     "text-red-400";

//   return (
//   <div className="bg-gradient-to-br from-slate-900/80 to-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">

//     {/* SECTION HEADER */}
//     <div className="flex items-center justify-between">
//     <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
//       <Activity className="w-6 h-6 text-blue-400" />
//       System Health Overview
//     </h2>
//       <span className="text-xs text-slate-400">
//         live operational status
//       </span>
//     </div>

//     {/* KPI GRID */}
//     <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

//       {/* SYSTEM HEALTH */}
//       <div
//         onClick={() => navigate("/services")}
//         className="bg-slate-900 border border-slate-800 p-5 rounded-xl cursor-pointer"
//       >
//         <p className="text-xs text-slate-400">System Health</p>
//         <h3 className={`text-3xl font-bold mt-2 ${healthColor}`}>
//           {healthPercent}%
//         </h3>
//         <p className="text-xs text-slate-500 mt-1">
//           {healthy} of {total} services operational
//         </p>
//       </div>

//       {/* INCIDENT STATUS */}
//       <div
//         onClick={() => navigate("/incidents")}
//         className="bg-slate-900 border border-slate-800 p-5 rounded-xl cursor-pointer"
//       >
//         <p className="text-xs text-slate-400">Active Incidents</p>
//         <h3 className="text-3xl font-bold mt-2 text-red-400">
//           {incidents.length}
//         </h3>
//         <p className="text-xs text-slate-500 mt-1">
//           Services currently disrupted
//         </p>
//       </div>

//       {/* AI ANOMALIES */}
//       <div
//         // onClick={() => navigate("/services?anomaly=true")}
//         // onClick={() => navigate("/anomalies")}
//          onClick={() => navigate("/anomalies")}
//         className="bg-slate-900 border border-slate-800 p-5 rounded-xl cursor-pointer"
//       >
//         <p className="text-xs text-slate-400">AI Anomalies (24h)</p>
//         <h3 className="text-3xl font-bold mt-2 text-purple-400">
//           {aiSummary?.totalAnomalies || 0}
//         </h3>
//         <p className="text-xs text-slate-500 mt-1">
//           Intelligent anomaly detections
//         </p>
//       </div>

//       {/* DEGRADED SERVICES */}
//       <div
//         onClick={() => navigate("/services?status=DEGRADED")}
//         className="bg-slate-900 border border-slate-800 p-5 rounded-xl cursor-pointer"
//       >
//         <p className="text-xs text-slate-400">Degraded Services</p>
//         <h3 className="text-3xl font-bold mt-2 text-yellow-400">
//           {degraded}
//         </h3>
//         <p className="text-xs text-slate-500 mt-1">
//           Experiencing performance issues
//         </p>
//       </div>

//     </div>

//   </div>
// );
// }

// D:\Ai_Monitoring_Platform\ai-monitoring-ui\src\components\dashboard\KPIBar.jsx

import { Activity, AlertTriangle, Server, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function KPIBar({ summary, aiSummary, incidents, isLoading = false }) {
  const navigate = useNavigate();

  const total = summary?.totalServices || 0;
  const healthy = summary?.upServices || 0;
  const degraded = summary?.degradedServices || 0;
  const down = summary?.downServices || 0;

  const healthPercent = total > 0
    ? Math.round((healthy / total) * 100)
    : 100;

  const healthColor =
    healthPercent > 80 ? "text-green-400" :
    healthPercent > 50 ? "text-yellow-400" :
    "text-red-400";

  const kpiItems = [
    {
      label: "System Health",
      value: `${healthPercent}%`,
      sub: `${healthy} of ${total} services operational`,
      color: healthColor,
      path: "/services",
      icon: Activity,
      iconColor: "text-blue-400",
    },
    {
      label: "Active Incidents",
      value: incidents?.length || 0,
      sub: "Services currently disrupted",
      color: "text-red-400",
      path: "/incidents",
      icon: AlertTriangle,
      iconColor: "text-red-400",
    },
    {
      label: "AI Anomalies (24h)",
      value: aiSummary?.totalAnomalies ?? 0,
      sub: "Intelligent anomaly detections",
      color: "text-purple-400",
      path: "/anomalies",
      icon: Server,
      iconColor: "text-purple-400",
    },
    {
      label: "Degraded Services",
      value: degraded,
      sub: "Experiencing performance issues",
      color: "text-yellow-400",
      path: "/services?status=DEGRADED",
      icon: TrendingUp,
      iconColor: "text-yellow-400",
    },
  ];

  // ✅ Loading State
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-slate-900/80 to-slate-900 border border-slate-800 p-4 sm:p-5 md:p-6 rounded-2xl shadow-xl">
        <div className="animate-pulse">
          <div className="h-7 sm:h-8 bg-slate-800 rounded w-48 mb-4 sm:mb-6" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-slate-800/50 rounded-xl p-3 sm:p-4 h-20 sm:h-24" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-900/80 to-slate-900 border border-slate-800 p-4 sm:p-5 md:p-6 rounded-2xl shadow-xl space-y-4 sm:space-y-5 md:space-y-6">

      {/* SECTION HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
          System Health Overview
        </h2>
        <span className="text-[10px] sm:text-xs text-slate-400 hidden sm:inline">
          live operational status
        </span>
      </div>

      {/* KPI GRID - Responsive */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">

        {kpiItems.map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(item.path)}
            role="button"
            tabIndex={0}
            aria-label={`View ${item.label}: ${item.value}`}
            className="bg-slate-900 border border-slate-800 p-3 sm:p-4 md:p-5 rounded-xl cursor-pointer hover:border-slate-700 hover:bg-slate-800/50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigate(item.path);
              }
            }}
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <item.icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${item.iconColor}`} />
              <p className="text-[10px] sm:text-xs text-slate-400 truncate">{item.label}</p>
            </div>
            <h3 className={`text-xl sm:text-2xl md:text-3xl font-bold mt-1 sm:mt-2 ${item.color}`}>
              {item.value}
            </h3>
            <p className="text-[9px] sm:text-[10px] md:text-xs text-slate-500 mt-0.5 sm:mt-1 truncate">
              {item.sub}
            </p>
          </div>
        ))}

      </div>

    </div>
  );
}