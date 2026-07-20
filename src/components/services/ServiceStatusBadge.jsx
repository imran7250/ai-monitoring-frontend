// export default function ServiceStatusBadge({ status }) {
//   const styles = {
//     UP: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
//     DOWN: "bg-red-500/10 text-red-400 border-red-500/30",
//     DEGRADED: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
//   };
//   return (
//     <span className={`px-3 py-1 text-xs font-medium rounded-full border ${styles[status] || "bg-slate-500/10 text-slate-400"}`}>
//       {status || "UNKNOWN"}
//     </span>
//   );
// }

// D:\Ai_Monitoring_Platform\ai-monitoring-ui\src\components\services\ServiceStatusBadge.jsx

export default function ServiceStatusBadge({ status }) {
  const styles = {
    UP: "bg-emerald-50 text-emerald-700 border-emerald-200",
    DOWN: "bg-red-50 text-red-700 border-red-200",
    DEGRADED: "bg-yellow-50 text-yellow-700 border-yellow-200",
    UNKNOWN: "bg-gray-50 text-gray-600 border-gray-200",
  };
  
  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${styles[status] || styles.UNKNOWN}`}>
      {status || "UNKNOWN"}
    </span>
  );  
}