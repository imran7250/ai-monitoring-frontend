// // D:\Ai_Monitoring_Platform\ai-monitoring-ui\src\pages\services\ServiceDetails.jsx

// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { api } from "../../api/client";
// import {
//   LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
//   CartesianGrid, Area, ReferenceLine
// } from "recharts";
// import {
//   Activity, AlertTriangle, Bell, Server, Cpu, Zap,
//   ArrowLeft, RefreshCw, CheckCircle, XCircle, AlertCircle,
//   FileText, ChevronDown, ChevronUp,
// } from "lucide-react";
// import { formatTime } from "../../utils/dateUtils";

// export default function ServiceDetails() {
//   const { serviceId } = useParams();
//   const navigate = useNavigate();

//   const [metrics, setMetrics] = useState([]);
//   const [logs, setLogs] = useState([]);
//   const [incidents, setIncidents] = useState([]);
//   const [alerts, setAlerts] = useState([]);
//   const [anomalies, setAnomalies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [expandedSections, setExpandedSections] = useState({
//     anomalies: true,
//     logs: false,
//     incidents: false,
//     alerts: false,
//   });

//   useEffect(() => {
//     loadData();
//   }, [serviceId]);

//   const loadData = async () => {
//     setLoading(true);
//     try {
//       const [metricsRes, logsRes, incidentsRes, alertsRes, anomalyRes] =
//         await Promise.allSettled([
//           api.get(`/api/metrics/service/${serviceId}`),
//           api.get(`/api/services/${serviceId}/logs`),
//           api.get(`/api/incidents/service/${serviceId}`),
//           api.get(`/api/alerts/service/${serviceId}`),
//           api.get(`/api/anomalies/service/${serviceId}`),
//         ]);

//       if (metricsRes.status === "fulfilled") {
//         const rawData = metricsRes.value.data || [];
//         const formattedData = rawData
//           .filter(item => item.cpuUsage !== null && item.cpuUsage !== undefined)
//           .map(item => ({
//             ...item,
//             cpuUsage: typeof item.cpuUsage === 'string' ? parseFloat(item.cpuUsage) : Number(item.cpuUsage),
//             recordedAt: item.recordedAt || item.timestamp || item.time || new Date().toISOString(),
//           }))
//           .sort((a, b) => new Date(a.recordedAt) - new Date(b.recordedAt));

//         setMetrics(formattedData);
//       }

//       if (logsRes.status === "fulfilled") {
//         const logsData = logsRes.value.data || [];
//         setLogs(
//           logsData
//             .sort((a, b) => new Date(b.checkedAt) - new Date(a.checkedAt))
//             .slice(0, 20)
//         );
//       }

//       if (incidentsRes.status === "fulfilled") {
//         setIncidents(incidentsRes.value.data || []);
//       }

//       if (alertsRes.status === "fulfilled") {
//         setAlerts(alertsRes.value.data || []);
//       }

//       if (anomalyRes.status === "fulfilled") {
//         setAnomalies(anomalyRes.value.data || []);
//       }

//     } catch (error) {
//       console.error("Error loading service data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await loadData();
//     setRefreshing(false);
//   };

//   const toggleSection = (section) => {
//     setExpandedSections((prev) => ({
//       ...prev,
//       [section]: !prev[section],
//     }));
//   };

//   const getStatusBadge = (status) => {
//     const styles = {
//       UP: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", border: "border-emerald-200" },
//       DOWN: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500", border: "border-red-200" },
//       DEGRADED: { bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-500", border: "border-yellow-200" },
//     };
//     return styles[status] || styles.UP;
//   };

//   const CustomTooltip = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
//           <p className="text-xs text-gray-500">{formatTime(label)}</p>
//           <p className="text-sm font-semibold text-gray-900">
//             CPU: {payload[0]?.value ?? 0}%
//           </p>
//         </div>
//       );
//     }
//     return null;
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-gray-200 border-t-gray-700 rounded-full animate-spin mx-auto mb-3 sm:mb-4" />
//           <p className="text-gray-500 text-sm sm:text-base">Loading service details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!metrics.length && !logs.length && !incidents.length && !alerts.length && !anomalies.length) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="text-center max-w-md px-4">
//           <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <Server className="w-10 h-10 text-gray-400" />
//           </div>
//           <h2 className="text-xl font-semibold text-gray-900 mb-2">No Data Available</h2>
//           <p className="text-gray-500 text-sm">
//             No metrics or logs found for this service. The service may not have been checked yet.
//           </p>
//           <button
//             onClick={handleRefresh}
//             className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white text-sm transition-colors"
//           >
//             Refresh
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white">

//       {/* Header */}
//       <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-3 sm:px-4 md:px-6 py-3 sm:py-4 shadow-sm">
//         <div className="max-w-7xl mx-auto flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 sm:gap-3">
//           <button
//             onClick={() => navigate("/services")}
//             className="flex items-center gap-1.5 sm:gap-2 text-gray-500 hover:text-gray-900 transition-colors text-xs sm:text-sm"
//           >
//             <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
//             <span className="hidden xs:inline">Back to Services</span>
//             <span className="xs:hidden">Back</span>
//           </button>

//           <div className="flex items-center gap-2 sm:gap-3">
//             <button
//               onClick={handleRefresh}
//               disabled={refreshing}
//               className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all disabled:opacity-50"
//             >
//               <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${refreshing ? "animate-spin" : ""}`} />
//             </button>
//             <div className="flex items-center gap-1.5 sm:gap-2 bg-gray-50 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-gray-200">
//               <Server className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
//               <span className="text-xs sm:text-sm text-gray-700 font-mono">
//                 #{serviceId?.slice(0, 6)}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 space-y-4 sm:space-y-5 md:space-y-6">

//         {/* CPU Metrics Chart */}
//         <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 md:p-6 shadow-sm">
//           <div className="flex flex-col xs:flex-row xs:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
//             <div className="flex items-center gap-2 sm:gap-3">
//               <div className="p-1.5 sm:p-2 bg-emerald-50 rounded-lg border border-emerald-200">
//                 <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
//               </div>
//               <h2 className="text-base sm:text-lg font-semibold text-gray-900">CPU Usage</h2>
//             </div>
//             <span className="text-[10px] sm:text-xs text-gray-500 xs:ml-auto">
//               {metrics.length} readings
//             </span>
//           </div>

//           {metrics.length === 0 ? (
//             <div className="h-48 sm:h-56 md:h-64 flex items-center justify-center text-gray-400 text-xs sm:text-sm">
//               <div className="text-center">
//                 <Activity className="w-8 h-8 sm:w-10 sm:h-10 text-gray-300 mx-auto mb-2" />
//                 <p>No metrics data available</p>
//                 <p className="text-[10px] sm:text-xs text-gray-400 mt-1">Wait for health checks to run</p>
//               </div>
//             </div>
//           ) : (
//             <div className="h-48 sm:h-56 md:h-64 w-full">
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart
//                   data={metrics}
//                   margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
//                 >
//                   <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />

//                   <defs>
//                     <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
//                       <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
//                     </linearGradient>
//                   </defs>

//                   <XAxis
//                     dataKey="recordedAt"
//                     tickFormatter={(v) => v ? formatTime(v) : ""}
//                     stroke="#e2e8f0"
//                     tick={{ fill: "#94a3b8", fontSize: 10 }}
//                     interval="preserveStartEnd"
//                     minTickGap={30}
//                     padding={{ left: 10, right: 10 }}
//                   />

//                   <YAxis
//                     stroke="#e2e8f0"
//                     tick={{ fill: "#94a3b8", fontSize: 10 }}
//                     domain={[0, 100]}
//                     tickFormatter={(value) => `${value}%`}
//                     width={40}
//                   />

//                   <Tooltip content={<CustomTooltip />} />

//                   <Area
//                     type="monotone"
//                     dataKey="cpuUsage"
//                     stroke="none"
//                     fill="url(#cpuGradient)"
//                   />

//                   <Line
//                     type="monotone"
//                     dataKey="cpuUsage"
//                     stroke="#22c55e"
//                     strokeWidth={2.5}
//                     dot={false}
//                     activeDot={{ r: 5, fill: "#22c55e" }}
//                   />

//                   <ReferenceLine
//                     y={80}
//                     stroke="#ef4444"
//                     strokeDasharray="4 4"
//                     label={{
//                       value: "Warning: 80%",
//                       fill: "#ef4444",
//                       fontSize: 9,
//                       position: "right"
//                     }}
//                   />

//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           )}
//         </div>

//         {/* AI Anomalies */}
//         <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
//           <button
//             onClick={() => toggleSection("anomalies")}
//             className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
//           >
//             <div className="flex items-center gap-2 sm:gap-3">
//               <div className="p-1.5 bg-purple-50 rounded-lg border border-purple-200">
//                 <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600" />
//               </div>
//               <span className="text-sm sm:text-base font-medium text-gray-900">AI Anomalies</span>
//               {anomalies.length > 0 && (
//                 <span className="px-1.5 sm:px-2 py-0.5 bg-purple-100 rounded-full text-[10px] sm:text-xs text-purple-700">
//                   {anomalies.length}
//                 </span>
//               )}
//             </div>
//             {expandedSections.anomalies ? (
//               <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
//             ) : (
//               <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
//             )}
//           </button>

//           {expandedSections.anomalies && (
//             <div className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6">
//               {anomalies.length === 0 ? (
//                 <div className="flex items-center justify-center py-6 sm:py-8 text-gray-500 text-xs sm:text-sm">
//                   <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-emerald-500" />
//                   No anomalies detected
//                 </div>
//               ) : (
//                 <div className="space-y-2 sm:space-y-3">
//                   {anomalies.slice(0, 5).map((a, idx) => (
//                     <div key={idx} className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
//                       <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1 sm:gap-2 mb-2">
//                         <span className="text-xs sm:text-sm font-medium text-gray-900">{a.metricName}</span>
//                         <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full w-fit ${
//                           a.deviationScore > 5
//                             ? "bg-red-100 text-red-700"
//                             : "bg-purple-100 text-purple-700"
//                         }`}>
//                           σ {a.deviationScore?.toFixed(2) || "0.00"}
//                         </span>
//                       </div>
//                       <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-[10px] sm:text-xs">
//                         <div>
//                           <span className="text-gray-500">Expected</span>
//                           <p className="text-gray-900 text-xs sm:text-sm">{a.expectedValue?.toFixed(2) || "—"}</p>
//                         </div>
//                         <div>
//                           <span className="text-gray-500">Actual</span>
//                           <p className="text-gray-900 text-xs sm:text-sm">{a.actualValue?.toFixed(2) || "—"}</p>
//                         </div>
//                         <div>
//                           <span className="text-gray-500">Time</span>
//                           <p className="text-gray-900 text-xs sm:text-sm">{formatTime(a.detectedAt)}</p>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Recent Logs */}
//         <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
//           <button
//             onClick={() => toggleSection("logs")}
//             className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
//           >
//             <div className="flex items-center gap-2 sm:gap-3">
//               <div className="p-1.5 bg-blue-50 rounded-lg border border-blue-200">
//                 <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
//               </div>
//               <span className="text-sm sm:text-base font-medium text-gray-900">Recent Logs</span>
//               <span className="text-[10px] sm:text-xs text-gray-500">Latest {logs.length}</span>
//             </div>
//             {expandedSections.logs ? (
//               <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
//             ) : (
//               <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
//             )}
//           </button>

//           {expandedSections.logs && (
//             <div className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6">
//               {logs.length === 0 ? (
//                 <div className="text-center py-6 sm:py-8 text-gray-500 text-xs sm:text-sm">No logs available</div>
//               ) : (
//                 <div className="space-y-1.5 sm:space-y-2">
//                   {logs.map((log, idx) => {
//                     const badge = getStatusBadge(log.status);
//                     return (
//                       <div key={idx} className="flex flex-col xs:flex-row xs:items-center justify-between py-1.5 sm:py-2 border-b border-gray-200 last:border-0 gap-1 sm:gap-2">
//                         <div className="flex items-center gap-2 sm:gap-3">
//                           <span className={`inline-block w-1.5 h-1.5 rounded-full ${badge.dot}`} />
//                           <span className={`text-xs sm:text-sm ${badge.text}`}>{log.status}</span>
//                           <span className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full ${badge.bg} ${badge.border} ${badge.text}`}>
//                             {log.status}
//                           </span>
//                         </div>
//                         <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-xs">
//                           <span className="text-gray-500">{log.responseTimeMs}ms</span>
//                           <span className="text-gray-400">{formatTime(log.checkedAt)}</span>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Incidents + Alerts */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">

//           {/* Incidents */}
//           <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
//             <button
//               onClick={() => toggleSection("incidents")}
//               className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
//             >
//               <div className="flex items-center gap-2 sm:gap-3">
//                 <div className="p-1.5 bg-red-50 rounded-lg border border-red-200">
//                   <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600" />
//                 </div>
//                 <span className="text-sm sm:text-base font-medium text-gray-900">Incidents</span>
//                 {incidents.length > 0 && (
//                   <span className="px-1.5 sm:px-2 py-0.5 bg-red-100 rounded-full text-[10px] sm:text-xs text-red-700">
//                     {incidents.length}
//                   </span>
//                 )}
//               </div>
//               {expandedSections.incidents ? (
//                 <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
//               ) : (
//                 <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
//               )}
//             </button>

//             {expandedSections.incidents && (
//               <div className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6">
//                 {incidents.length === 0 ? (
//                   <div className="flex items-center justify-center py-4 text-gray-500 text-xs sm:text-sm">
//                     <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-emerald-500" />
//                     No incidents
//                   </div>
//                 ) : (
//                   <div className="space-y-2 sm:space-y-3">
//                     {incidents.map((inc) => (
//                       <div key={inc.id} className="bg-gray-50 rounded-lg p-2.5 sm:p-3 border border-gray-200">
//                         <div className="flex items-center gap-2 mb-0.5 sm:mb-1 flex-wrap">
//                           <span className="px-1.5 sm:px-2 py-0.5 bg-red-100 rounded-full text-[10px] sm:text-xs text-red-700">
//                             {inc.status}
//                           </span>
//                           {inc.severity && (
//                             <span className="px-1.5 sm:px-2 py-0.5 bg-orange-100 rounded-full text-[10px] sm:text-xs text-orange-700">
//                               {inc.severity}
//                             </span>
//                           )}
//                         </div>
//                         <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
//                           {inc.reason || "No reason provided"}
//                         </p>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Alert Rules */}
//           <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
//             <button
//               onClick={() => toggleSection("alerts")}
//               className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
//             >
//               <div className="flex items-center gap-2 sm:gap-3">
//                 <div className="p-1.5 bg-yellow-50 rounded-lg border border-yellow-200">
//                   <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-600" />
//                 </div>
//                 <span className="text-sm sm:text-base font-medium text-gray-900">Alert Rules</span>
//                 {alerts.length > 0 && (
//                   <span className="px-1.5 sm:px-2 py-0.5 bg-yellow-100 rounded-full text-[10px] sm:text-xs text-yellow-700">
//                     {alerts.length}
//                   </span>
//                 )}
//               </div>
//               {expandedSections.alerts ? (
//                 <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
//               ) : (
//                 <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
//               )}
//             </button>

//             {expandedSections.alerts && (
//               <div className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6">
//                 {alerts.length === 0 ? (
//                   <div className="text-center py-4 text-gray-500 text-xs sm:text-sm">
//                     <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
//                     No alerts configured
//                   </div>
//                 ) : (
//                   <div className="space-y-1.5 sm:space-y-2">
//                     {alerts.map((alert) => (
//                       <div key={alert.id} className="flex flex-col xs:flex-row xs:items-center justify-between py-1.5 sm:py-2 px-2.5 sm:px-3 bg-gray-50 rounded-lg border border-gray-200 gap-1 sm:gap-2">
//                         <span className="text-xs sm:text-sm text-gray-900 truncate">{alert.name}</span>
//                         <span className="px-1.5 sm:px-2 py-0.5 bg-yellow-100 rounded-full text-[10px] sm:text-xs text-yellow-700 w-fit">
//                           {alert.triggerStatus}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//         </div>

//         {/* Footer */}
//         <div className="flex flex-col xs:flex-row items-center justify-between gap-2 text-[10px] sm:text-xs text-gray-400 pt-2 border-t border-gray-200">
//           <div className="flex items-center gap-2">
//             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
//             <span>Service Active</span>
//             <span className="hidden xs:inline">•</span>
//             <span className="hidden xs:inline">{metrics.length} metrics</span>
//           </div>
//           <span>Updated {formatTime(new Date())}</span>
//         </div>

//       </div>
//     </div>
//   );
// }  

// D:\Ai_Monitoring_Platform\ai-monitoring-ui\src\pages\services\ServiceDetails.jsx

import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../api/client";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Area, ReferenceLine, Legend, ComposedChart,
  Bar, BarChart
} from "recharts";
import {
  Activity, AlertTriangle, Bell, Server, Cpu, Zap,
  ArrowLeft, RefreshCw, CheckCircle, XCircle, AlertCircle,
  FileText, ChevronDown, ChevronUp, Clock, TrendingUp,
  TrendingDown, Minus, BarChart3, LineChart as LineChartIcon,
  PieChart, Maximize2, Minimize2, Calendar
} from "lucide-react";
import { formatTime } from "../../utils/dateUtils";

export default function ServiceDetails() {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState([]);
  const [logs, setLogs] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    anomalies: true,
    logs: false,
    incidents: false,
    alerts: false,
  });

  // Chart state
  const [selectedMetric, setSelectedMetric] = useState("cpu");
  const [timeRange, setTimeRange] = useState("1h");
  const [chartType, setChartType] = useState("line");
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    loadData();
  }, [serviceId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [metricsRes, logsRes, incidentsRes, alertsRes, anomalyRes] =
        await Promise.allSettled([
          api.get(`/api/metrics/service/${serviceId}`),
          api.get(`/api/services/${serviceId}/logs`),
          api.get(`/api/incidents/service/${serviceId}`),
          api.get(`/api/alerts/service/${serviceId}`),
          api.get(`/api/anomalies/service/${serviceId}`),
        ]);

      if (metricsRes.status === "fulfilled") {
        const rawData = metricsRes.value.data || [];
        const formattedData = rawData
          .filter(item => item.cpuUsage !== null && item.cpuUsage !== undefined)
          .map(item => ({
            ...item,
            cpuUsage: typeof item.cpuUsage === 'string' ? parseFloat(item.cpuUsage) : Number(item.cpuUsage),
            memoryUsage: typeof item.memoryUsage === 'string' ? parseFloat(item.memoryUsage) : Number(item.memoryUsage) || 0,
            latencyMs: typeof item.latencyMs === 'string' ? parseFloat(item.latencyMs) : Number(item.latencyMs) || 0,
            errorRate: typeof item.errorRate === 'string' ? parseFloat(item.errorRate) : Number(item.errorRate) || 0,
            recordedAt: item.recordedAt || item.timestamp || item.time || new Date().toISOString(),
          }))
          .sort((a, b) => new Date(a.recordedAt) - new Date(b.recordedAt));

        setMetrics(formattedData);
      }

      if (logsRes.status === "fulfilled") {
        const logsData = logsRes.value.data || [];
        setLogs(
          logsData
            .sort((a, b) => new Date(b.checkedAt) - new Date(a.checkedAt))
            .slice(0, 20)
        );
      }

      if (incidentsRes.status === "fulfilled") {
        setIncidents(incidentsRes.value.data || []);
      }

      if (alertsRes.status === "fulfilled") {
        setAlerts(alertsRes.value.data || []);
      }

      if (anomalyRes.status === "fulfilled") {
        setAnomalies(anomalyRes.value.data || []);
      }

    } catch (error) {
      console.error("Error loading service data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getStatusBadge = (status) => {
    const styles = {
      UP: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", border: "border-emerald-200" },
      DOWN: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500", border: "border-red-200" },
      DEGRADED: { bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-500", border: "border-yellow-200" },
    };
    return styles[status] || styles.UP;
  };

  // ====== PROFESSIONAL CHART CONFIGURATION ======

  const metricConfigs = {
    cpu: { 
      label: "CPU Usage", 
      key: "cpuUsage", 
      unit: "%", 
      color: "#6366f1", 
      gradientColor: "#818cf8",
      domain: [0, 100],
      warning: 80,
      critical: 90
    },
    memory: { 
      label: "Memory Usage", 
      key: "memoryUsage", 
      unit: "%", 
      color: "#f59e0b", 
      gradientColor: "#fbbf24",
      domain: [0, 100],
      warning: 70,
      critical: 85
    },
    latency: { 
      label: "Latency", 
      key: "latencyMs", 
      unit: "ms", 
      color: "#22c55e", 
      gradientColor: "#4ade80",
      domain: [0, 'auto'],
      warning: 150,
      critical: 300
    },
    error: { 
      label: "Error Rate", 
      key: "errorRate", 
      unit: "%", 
      color: "#ef4444", 
      gradientColor: "#f87171",
      domain: [0, 100],
      warning: 5,
      critical: 10
    }
  };

  const currentMetric = metricConfigs[selectedMetric];

  // Filter data by time range
  const filteredData = useMemo(() => {
    if (!metrics.length) return [];
    const now = new Date();
    let cutoff = new Date();
    switch (timeRange) {
      case "1h": cutoff.setHours(now.getHours() - 1); break;
      case "6h": cutoff.setHours(now.getHours() - 6); break;
      case "24h": cutoff.setDate(now.getDate() - 1); break;
      case "7d": cutoff.setDate(now.getDate() - 7); break;
      default: cutoff.setHours(now.getHours() - 1);
    }
    return metrics.filter(m => new Date(m.recordedAt) >= cutoff);
  }, [metrics, timeRange]);

  // Calculate stats
  const stats = useMemo(() => {
    const values = filteredData.map(d => d[currentMetric.key] || 0);
    if (!values.length) return { current: 0, avg: 0, max: 0, min: 0, count: 0 };
    const current = values[values.length - 1] || 0;
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);
    return { current, avg, max, min, count: values.length };
  }, [filteredData, currentMetric]);

  const getStatusColor = (value) => {
    if (value >= currentMetric.critical) return "text-red-600";
    if (value >= currentMetric.warning) return "text-yellow-600";
    return "text-emerald-600";
  };

  const getStatusLabel = (value) => {
    if (value >= currentMetric.critical) return "Critical";
    if (value >= currentMetric.warning) return "Warning";
    return "Normal";
  };

  const getTrendIcon = () => {
    if (filteredData.length < 2) return <Minus className="w-4 h-4 text-gray-400" />;
    const last = filteredData[filteredData.length - 1]?.[currentMetric.key] || 0;
    const prev = filteredData[filteredData.length - 2]?.[currentMetric.key] || 0;
    if (last > prev) return <TrendingUp className="w-4 h-4 text-red-500" />;
    if (last < prev) return <TrendingDown className="w-4 h-4 text-emerald-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getTrendLabel = () => {
    if (filteredData.length < 2) return "Stable";
    const last = filteredData[filteredData.length - 1]?.[currentMetric.key] || 0;
    const prev = filteredData[filteredData.length - 2]?.[currentMetric.key] || 0;
    if (last > prev) return "Increasing";
    if (last < prev) return "Decreasing";
    return "Stable";
  };

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-lg min-w-[160px]">
          <p className="text-xs font-medium text-gray-500 mb-2">{formatTime(label)}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4 py-1">
              <span className="flex items-center gap-2 text-xs text-gray-600">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}{currentMetric.unit}
              </span>
            </div>
          ))}
          <div className="mt-2 pt-2 border-t border-gray-200">
            <span className="text-xs text-gray-400">Time: {formatTime(label)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  // ====== RENDER ======

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-gray-200 border-t-gray-700 rounded-full animate-spin mx-auto mb-3 sm:mb-4" />
          <p className="text-gray-500 text-sm sm:text-base">Loading service details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-3 sm:px-4 md:px-6 py-3 sm:py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 sm:gap-3">
          <button
            onClick={() => navigate("/services")}
            className="flex items-center gap-1.5 sm:gap-2 text-gray-500 hover:text-gray-900 transition-colors text-xs sm:text-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Back to Services</span>
            <span className="xs:hidden">Back</span>
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${refreshing ? "animate-spin" : ""}`} />
            </button>
            <div className="flex items-center gap-1.5 sm:gap-2 bg-gray-50 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-gray-200">
              <Server className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
              <span className="text-xs sm:text-sm text-gray-700 font-mono">
                #{serviceId?.slice(0, 6)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 space-y-4 sm:space-y-5 md:space-y-6">

        {/* ====== PROFESSIONAL CHART SECTION ====== */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          
          {/* Chart Header */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-200">
                <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Performance Metrics</h2>
                <p className="text-xs text-gray-500">{filteredData.length} data points • Last {timeRange}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Metric Selector Tabs */}
          <div className="px-4 sm:px-6 pt-3 sm:pt-4 flex flex-wrap items-center gap-1.5 sm:gap-2">
            {Object.entries(metricConfigs).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setSelectedMetric(key)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  selectedMetric === key
                    ? "bg-gray-900 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {config.label}
              </button>
            ))}
          </div>

          {/* Time Range Selector */}
          <div className="px-4 sm:px-6 py-2 flex flex-wrap items-center gap-1.5 sm:gap-2 border-b border-gray-200">
            <span className="text-xs text-gray-400 mr-1">Range:</span>
            {["1h", "6h", "24h", "7d"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-2.5 sm:px-3 py-1 rounded-lg text-[10px] sm:text-xs font-medium transition-all ${
                  timeRange === range
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {range}
              </button>
            ))}
            <span className="text-xs text-gray-400 ml-auto hidden xs:inline">
              {filteredData.length} samples
            </span>
          </div>

          {/* Stats Row */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 bg-gray-50/50">
            <div className="bg-white rounded-xl p-2.5 sm:p-3 border border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-xs text-gray-500">Current</span>
                {getTrendIcon()}
              </div>
              <p className={`text-lg sm:text-xl font-bold ${getStatusColor(stats.current)}`}>
                {stats.current.toFixed(1)}{currentMetric.unit}
              </p>
              <p className="text-[10px] text-gray-400">{getStatusLabel(stats.current)}</p>
            </div>
            <div className="bg-white rounded-xl p-2.5 sm:p-3 border border-gray-200">
              <span className="text-[10px] sm:text-xs text-gray-500">Average</span>
              <p className="text-lg sm:text-xl font-bold text-gray-900">
                {stats.avg.toFixed(1)}{currentMetric.unit}
              </p>
              <p className="text-[10px] text-gray-400">{getTrendLabel()}</p>
            </div>
            <div className="bg-white rounded-xl p-2.5 sm:p-3 border border-gray-200">
              <span className="text-[10px] sm:text-xs text-gray-500">Peak</span>
              <p className="text-lg sm:text-xl font-bold text-red-600">
                {stats.max.toFixed(1)}{currentMetric.unit}
              </p>
              <p className="text-[10px] text-gray-400">Maximum</p>
            </div>
            <div className="bg-white rounded-xl p-2.5 sm:p-3 border border-gray-200">
              <span className="text-[10px] sm:text-xs text-gray-500">Minimum</span>
              <p className="text-lg sm:text-xl font-bold text-emerald-600">
                {stats.min.toFixed(1)}{currentMetric.unit}
              </p>
              <p className="text-[10px] text-gray-400">Minimum</p>
            </div>
            <div className="bg-white rounded-xl p-2.5 sm:p-3 border border-gray-200 hidden sm:block">
              <span className="text-[10px] sm:text-xs text-gray-500">Samples</span>
              <p className="text-lg sm:text-xl font-bold text-gray-900">
                {stats.count}
              </p>
              <p className="text-[10px] text-gray-400">Data points</p>
            </div>
          </div>

          {/* Chart */}
          <div className={`p-3 sm:p-4 ${isFullscreen ? 'fixed inset-4 z-50 bg-white border border-gray-200 rounded-2xl shadow-2xl' : ''}`}>
            <div className="h-60 sm:h-72 md:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={filteredData}
                  margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                >
                  <defs>
                    <linearGradient id="metricGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={currentMetric.color} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={currentMetric.color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  
                  <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                  
                  <XAxis
                    dataKey="recordedAt"
                    tickFormatter={(v) => v ? formatTime(v) : ""}
                    stroke="#e2e8f0"
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                    interval="preserveStartEnd"
                    minTickGap={40}
                    padding={{ left: 10, right: 10 }}
                  />
                  
                  <YAxis
                    stroke="#e2e8f0"
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                    domain={currentMetric.domain}
                    tickFormatter={(value) => `${value}${currentMetric.unit}`}
                    width={50}
                  />
                  
                  <Tooltip content={<CustomTooltip />} />
                  
                  <Legend
                    verticalAlign="top"
                    height={36}
                    formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
                  />
                  
                  <ReferenceLine
                    y={currentMetric.warning}
                    stroke="#f59e0b"
                    strokeDasharray="6 6"
                    strokeWidth={1.5}
                    label={{
                      value: `Warning: ${currentMetric.warning}${currentMetric.unit}`,
                      fill: '#f59e0b',
                      fontSize: 9,
                      position: 'right'
                    }}
                  />
                  
                  <ReferenceLine
                    y={currentMetric.critical}
                    stroke="#ef4444"
                    strokeDasharray="6 6"
                    strokeWidth={1.5}
                    label={{
                      value: `Critical: ${currentMetric.critical}${currentMetric.unit}`,
                      fill: '#ef4444',
                      fontSize: 9,
                      position: 'right'
                    }}
                  />
                  
                  <Area
                    type="monotone"
                    dataKey={currentMetric.key}
                    stroke="none"
                    fill="url(#metricGradient)"
                  />
                  
                  <Line
                    type="monotone"
                    dataKey={currentMetric.key}
                    stroke={currentMetric.color}
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 6, fill: currentMetric.color, stroke: 'white', strokeWidth: 2 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Chart Footer */}
            <div className="flex flex-col xs:flex-row items-center justify-between gap-2 mt-3 pt-3 border-t border-gray-200 text-[10px] text-gray-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentMetric.color }} />
                  {currentMetric.label}
                </span>
                <span>•</span>
                <span>Avg: {stats.avg.toFixed(1)}{currentMetric.unit}</span>
                <span>•</span>
                <span>Peak: {stats.max.toFixed(1)}{currentMetric.unit}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  Live
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Anomalies */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <button
            onClick={() => toggleSection("anomalies")}
            className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 bg-purple-50 rounded-lg border border-purple-200">
                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600" />
              </div>
              <span className="text-sm sm:text-base font-medium text-gray-900">AI Anomalies</span>
              {anomalies.length > 0 && (
                <span className="px-1.5 sm:px-2 py-0.5 bg-purple-100 rounded-full text-[10px] sm:text-xs text-purple-700">
                  {anomalies.length}
                </span>
              )}
            </div>
            {expandedSections.anomalies ? (
              <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            )}
          </button>

          {expandedSections.anomalies && (
            <div className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6">
              {anomalies.length === 0 ? (
                <div className="flex items-center justify-center py-6 sm:py-8 text-gray-500 text-xs sm:text-sm">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-emerald-500" />
                  No anomalies detected
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  {anomalies.slice(0, 5).map((a, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
                      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1 sm:gap-2 mb-2">
                        <span className="text-xs sm:text-sm font-medium text-gray-900">{a.metricName}</span>
                        <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full w-fit ${
                          a.deviationScore > 5
                            ? "bg-red-100 text-red-700"
                            : "bg-purple-100 text-purple-700"
                        }`}>
                          σ {a.deviationScore?.toFixed(2) || "0.00"}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-[10px] sm:text-xs">
                        <div>
                          <span className="text-gray-500">Expected</span>
                          <p className="text-gray-900 text-xs sm:text-sm">{a.expectedValue?.toFixed(2) || "—"}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Actual</span>
                          <p className="text-gray-900 text-xs sm:text-sm">{a.actualValue?.toFixed(2) || "—"}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Time</span>
                          <p className="text-gray-900 text-xs sm:text-sm">{formatTime(a.detectedAt)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Recent Logs */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <button
            onClick={() => toggleSection("logs")}
            className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 bg-blue-50 rounded-lg border border-blue-200">
                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
              </div>
              <span className="text-sm sm:text-base font-medium text-gray-900">Recent Logs</span>
              <span className="text-[10px] sm:text-xs text-gray-500">Latest {logs.length}</span>
            </div>
            {expandedSections.logs ? (
              <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            )}
          </button>

          {expandedSections.logs && (
            <div className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6">
              {logs.length === 0 ? (
                <div className="text-center py-6 sm:py-8 text-gray-500 text-xs sm:text-sm">No logs available</div>
              ) : (
                <div className="space-y-1.5 sm:space-y-2">
                  {logs.map((log, idx) => {
                    const badge = getStatusBadge(log.status);
                    return (
                      <div key={idx} className="flex flex-col xs:flex-row xs:items-center justify-between py-1.5 sm:py-2 border-b border-gray-200 last:border-0 gap-1 sm:gap-2">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span className={`inline-block w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                          <span className={`text-xs sm:text-sm font-medium ${badge.text}`}>{log.status}</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-xs">
                          <span className="text-gray-500">{log.responseTimeMs}ms</span>
                          <span className="text-gray-400">{formatTime(log.checkedAt)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Incidents + Alerts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">

          {/* Incidents */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <button
              onClick={() => toggleSection("incidents")}
              className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 bg-red-50 rounded-lg border border-red-200">
                  <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600" />
                </div>
                <span className="text-sm sm:text-base font-medium text-gray-900">Incidents</span>
                {incidents.length > 0 && (
                  <span className="px-1.5 sm:px-2 py-0.5 bg-red-100 rounded-full text-[10px] sm:text-xs text-red-700">
                    {incidents.length}
                  </span>
                )}
              </div>
              {expandedSections.incidents ? (
                <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              )}
            </button>

            {expandedSections.incidents && (
              <div className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6">
                {incidents.length === 0 ? (
                  <div className="flex items-center justify-center py-4 text-gray-500 text-xs sm:text-sm">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-emerald-500" />
                    No incidents
                  </div>
                ) : (
                  <div className="space-y-2 sm:space-y-3">
                    {incidents.map((inc) => (
                      <div key={inc.id} className="bg-gray-50 rounded-lg p-2.5 sm:p-3 border border-gray-200">
                        <div className="flex items-center gap-2 mb-0.5 sm:mb-1 flex-wrap">
                          <span className="px-1.5 sm:px-2 py-0.5 bg-red-100 rounded-full text-[10px] sm:text-xs text-red-700">
                            {inc.status}
                          </span>
                          {inc.severity && (
                            <span className="px-1.5 sm:px-2 py-0.5 bg-orange-100 rounded-full text-[10px] sm:text-xs text-orange-700">
                              {inc.severity}
                            </span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                          {inc.reason || "No reason provided"}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Alert Rules */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <button
              onClick={() => toggleSection("alerts")}
              className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 bg-yellow-50 rounded-lg border border-yellow-200">
                  <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-600" />
                </div>
                <span className="text-sm sm:text-base font-medium text-gray-900">Alert Rules</span>
                {alerts.length > 0 && (
                  <span className="px-1.5 sm:px-2 py-0.5 bg-yellow-100 rounded-full text-[10px] sm:text-xs text-yellow-700">
                    {alerts.length}
                  </span>
                )}
              </div>
              {expandedSections.alerts ? (
                <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              )}
            </button>

            {expandedSections.alerts && (
              <div className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6">
                {alerts.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 text-xs sm:text-sm">
                    <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    No alerts configured
                  </div>
                ) : (
                  <div className="space-y-1.5 sm:space-y-2">
                    {alerts.map((alert) => (
                      <div key={alert.id} className="flex flex-col xs:flex-row xs:items-center justify-between py-1.5 sm:py-2 px-2.5 sm:px-3 bg-gray-50 rounded-lg border border-gray-200 gap-1 sm:gap-2">
                        <span className="text-xs sm:text-sm text-gray-900 truncate">{alert.name}</span>
                        <span className="px-1.5 sm:px-2 py-0.5 bg-yellow-100 rounded-full text-[10px] sm:text-xs text-yellow-700 w-fit">
                          {alert.triggerStatus}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="flex flex-col xs:flex-row items-center justify-between gap-2 text-[10px] sm:text-xs text-gray-400 pt-2 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Service Active</span>
            <span className="hidden xs:inline">•</span>
            <span className="hidden xs:inline">{metrics.length} metrics</span>
          </div>
          <span>Updated {formatTime(new Date())}</span>
        </div>

      </div>
    </div>
  );
}