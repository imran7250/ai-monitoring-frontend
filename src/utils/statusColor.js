export function getStatusColor(status) {
  switch (status) {
    case "UP": return "text-emerald-400";
    case "DOWN": return "text-red-400";
    case "DEGRADED": return "text-yellow-400";
    default: return "text-slate-400";
  }
}
