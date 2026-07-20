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

// import { Activity, AlertTriangle, Server, TrendingUp } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// export default function KPIBar({ summary, aiSummary, incidents, isLoading = false }) {
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

//   const kpiItems = [
//     {
//       label: "System Health",
//       value: `${healthPercent}%`,
//       sub: `${healthy} of ${total} services operational`,
//       color: healthColor,
//       path: "/services",
//       icon: Activity,
//       iconColor: "text-blue-400",
//     },
//     {
//       label: "Active Incidents",
//       value: incidents?.length || 0,
//       sub: "Services currently disrupted",
//       color: "text-red-400",
//       path: "/incidents",
//       icon: AlertTriangle,
//       iconColor: "text-red-400",
//     },
//     {
//       label: "AI Anomalies (24h)",
//       value: aiSummary?.totalAnomalies ?? 0,
//       sub: "Intelligent anomaly detections",
//       color: "text-purple-400",
//       path: "/anomalies",
//       icon: Server,
//       iconColor: "text-purple-400",
//     },
//     {
//       label: "Degraded Services",
//       value: degraded,
//       sub: "Experiencing performance issues",
//       color: "text-yellow-400",
//       path: "/services?status=DEGRADED",
//       icon: TrendingUp,
//       iconColor: "text-yellow-400",
//     },
//   ];

//   // ✅ Loading State
//   if (isLoading) {
//     return (
//       <div className="bg-gradient-to-br from-slate-900/80 to-slate-900 border border-slate-800 p-4 sm:p-5 md:p-6 rounded-2xl shadow-xl">
//         <div className="animate-pulse">
//           <div className="h-7 sm:h-8 bg-slate-800 rounded w-48 mb-4 sm:mb-6" />
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
//             {[1, 2, 3, 4].map((i) => (
//               <div key={i} className="bg-slate-800/50 rounded-xl p-3 sm:p-4 h-20 sm:h-24" />
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gradient-to-br from-slate-900/80 to-slate-900 border border-slate-800 p-4 sm:p-5 md:p-6 rounded-2xl shadow-xl space-y-4 sm:space-y-5 md:space-y-6">

//       {/* SECTION HEADER */}
//       <div className="flex items-center justify-between">
//         <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white flex items-center gap-2">
//           <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
//           System Health Overview
//         </h2>
//         <span className="text-[10px] sm:text-xs text-slate-400 hidden sm:inline">
//           live operational status
//         </span>
//       </div>

//       {/* KPI GRID - Responsive */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">

//         {kpiItems.map((item, index) => (
//           <div
//             key={index}
//             onClick={() => navigate(item.path)}
//             role="button"
//             tabIndex={0}
//             aria-label={`View ${item.label}: ${item.value}`}
//             className="bg-slate-900 border border-slate-800 p-3 sm:p-4 md:p-5 rounded-xl cursor-pointer hover:border-slate-700 hover:bg-slate-800/50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
//             onKeyDown={(e) => {
//               if (e.key === "Enter" || e.key === " ") {
//                 e.preventDefault();
//                 navigate(item.path);
//               }
//             }}
//           >
//             <div className="flex items-center gap-1.5 sm:gap-2">
//               <item.icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${item.iconColor}`} />
//               <p className="text-[10px] sm:text-xs text-slate-400 truncate">{item.label}</p>
//             </div>
//             <h3 className={`text-xl sm:text-2xl md:text-3xl font-bold mt-1 sm:mt-2 ${item.color}`}>
//               {item.value}
//             </h3>
//             <p className="text-[9px] sm:text-[10px] md:text-xs text-slate-500 mt-0.5 sm:mt-1 truncate">
//               {item.sub}
//             </p>
//           </div>
//         ))}

//       </div>

//     </div>
//   );
// }

// D:\Ai_Monitoring_Platform\ai-monitoring-ui\src\components\dashboard\KPIBar.jsx

import { Activity, AlertTriangle, Server, Zap, Shield, CheckCircle, Clock, TrendingUp, TrendingDown, Minus, BarChart3, CircleCheck, CircleAlert, CircleX } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function KPIBar({ summary, aiSummary, incidents }) {
  const navigate = useNavigate();

  const total = summary?.totalServices || 0;
  const healthy = summary?.upServices || 0;
  const degraded = summary?.degradedServices || 0;
  const down = summary?.downServices || 0;

  const healthPercent = total > 0 ? Math.round((healthy / total) * 100) : 100;

  const healthColor =
    healthPercent > 80 ? "text-emerald-600" :
    healthPercent > 50 ? "text-yellow-600" :
    "text-red-600";

  const healthBg =
    healthPercent > 80 ? "bg-emerald-50 border-emerald-200" :
    healthPercent > 50 ? "bg-yellow-50 border-yellow-200" :
    "bg-red-50 border-red-200";

  const kpis = [
    {
      id: "health",
      title: "Service Health",
      value: `${healthPercent}%`,
      sub: `${healthy} of ${total} services operational`,
      icon: Activity,
      color: "gray",
      path: "/services",
      badge: healthPercent > 80 ? "Excellent" : healthPercent > 50 ? "Degraded" : "Critical",
      badgeColor: healthPercent > 80 ? "emerald" : healthPercent > 50 ? "yellow" : "red",
      trend: healthPercent > 80 ? "up" : healthPercent > 50 ? "stable" : "down",
      details: [
        { label: "Operational", value: healthy, color: "emerald", icon: CircleCheck },
        { label: "Degraded", value: degraded, color: "yellow", icon: CircleAlert },
        { label: "Down", value: down, color: "red", icon: CircleX },
      ]
    },
    {
      id: "incidents",
      title: "Incident Status",
      value: incidents?.length || 0,
      sub: incidents?.length === 0 ? "No active disruptions" : `${incidents?.length} active incident(s)`,
      icon: AlertTriangle,
      color: "red",
      path: "/incidents",
      badge: incidents?.length === 0 ? "Clear" : `${incidents?.length} active`,
      badgeColor: incidents?.length === 0 ? "emerald" : "red",
      trend: incidents?.length === 0 ? "up" : "down",
    },
    {
      id: "anomalies",
      title: "AI Detection",
      value: aiSummary?.totalAnomalies || 0,
      sub: aiSummary?.totalAnomalies > 0 ? `${aiSummary.totalAnomalies} anomalies found` : "No anomalies detected",
      icon: Zap,
      color: "purple",
      path: "/anomalies",
      badge: aiSummary?.totalAnomalies > 0 ? `${aiSummary.totalAnomalies} found` : "Clear",
      badgeColor: aiSummary?.totalAnomalies > 0 ? "yellow" : "emerald",
      trend: aiSummary?.totalAnomalies > 0 ? "up" : "stable",
    },
    {
      id: "degraded",
      title: "Performance Status",
      value: degraded || 0,
      sub: degraded === 0 ? "All services performing well" : `${degraded} service(s) degraded`,
      icon: Server,
      color: "yellow",
      path: "/services?status=DEGRADED",
      badge: degraded === 0 ? "Healthy" : `${degraded} degraded`,
      badgeColor: degraded === 0 ? "emerald" : "yellow",
      trend: degraded === 0 ? "up" : "down",
    },
  ];

  const getTrendIcon = (trend) => {
    if (trend === "up") return <TrendingUp className="w-3 h-3 text-emerald-500" />;
    if (trend === "down") return <TrendingDown className="w-3 h-3 text-red-500" />;
    return <Minus className="w-3 h-3 text-gray-400" />;
  };

  const getTrendLabel = (trend) => {
    if (trend === "up") return "Improving";
    if (trend === "down") return "Declining";
    return "Stable";
  };

  const colorClasses = {
    gray: "from-gray-50 to-gray-100/50 border-gray-200 hover:border-gray-300",
    red: "from-red-50 to-red-100/50 border-red-200 hover:border-red-300",
    purple: "from-purple-50 to-purple-100/50 border-purple-200 hover:border-purple-300",
    yellow: "from-yellow-50 to-yellow-100/50 border-yellow-200 hover:border-yellow-300",
  };

  const iconColors = {
    gray: "text-gray-700",
    red: "text-red-600",
    purple: "text-purple-600",
    yellow: "text-yellow-600",
  };

  const iconBg = {
    gray: "bg-gray-100 border-gray-200",
    red: "bg-red-100 border-red-200",
    purple: "bg-purple-100 border-purple-200",
    yellow: "bg-yellow-100 border-yellow-200",
  };

  const badgeColors = {
    emerald: "bg-emerald-100 text-emerald-700 border-emerald-200",
    yellow: "bg-yellow-100 text-yellow-700 border-yellow-200",
    red: "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.id}
            onClick={() => navigate(kpi.path)}
            className={`
              group relative overflow-hidden
              bg-gradient-to-br ${colorClasses[kpi.color]}
              border rounded-2xl p-5
              cursor-pointer
              hover:shadow-lg
              transition-all duration-300
              hover:-translate-y-1
            `}
          >
            {/* Decorative glow */}
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-gray-400/5 rounded-full blur-2xl group-hover:bg-gray-400/10 transition-all duration-500" />

            {/* Header with Title */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`
                  p-1.5 rounded-lg
                  bg-white/50 border
                  ${iconBg[kpi.color]}
                  group-hover:scale-110 transition-transform duration-300
                `}>
                  <Icon className={`w-4 h-4 ${iconColors[kpi.color]}`} />
                </div>
                <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  {kpi.title}
                </h3>
              </div>
              <div className="flex items-center gap-1">
                {getTrendIcon(kpi.trend)}
                <span className="text-[10px] text-gray-400 hidden sm:inline">
                  {getTrendLabel(kpi.trend)}
                </span>
              </div>
            </div>

            {/* Main Value */}
            <div className="flex items-end justify-between mb-1">
              <div>
                <p className={`text-3xl font-bold text-gray-900 ${kpi.id === "health" ? healthColor : ""}`}>
                  {kpi.value}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{kpi.sub}</p>
              </div>
              <span className={`
                px-2 py-0.5
                text-[10px] font-medium
                rounded-full border
                ${badgeColors[kpi.badgeColor] || "bg-gray-100 text-gray-600 border-gray-200"}
              `}>
                {kpi.badge}
              </span>
            </div>

            {/* Progress bar for Service Health */}
            {kpi.id === "health" && (
              <div className="mt-3 space-y-2">
                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-gray-700 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${healthPercent}%` }}
                  />
                </div>
                
                {/* Health Details */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-200/50">
                  {kpi.details.map((detail) => {
                    const DetailIcon = detail.icon;
                    return (
                      <div key={detail.label} className="flex items-center gap-1.5">
                        <DetailIcon className={`w-3 h-3 text-${detail.color}-500`} />
                        <span className="text-[10px] text-gray-500">{detail.label}</span>
                        <span className="text-xs font-semibold text-gray-700">{detail.value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quick actions indicator */}
            <div className="mt-3 pt-2 border-t border-gray-200/50 flex items-center justify-between">
              <span className="text-[10px] text-gray-400">View details</span>
              <span className="text-[10px] text-gray-400 group-hover:translate-x-0.5 transition-transform">→</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}