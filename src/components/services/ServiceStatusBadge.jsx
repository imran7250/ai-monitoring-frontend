export default function ServiceStatusBadge({ status }) {
  const styles = {
    UP: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    DOWN: "bg-red-500/10 text-red-400 border-red-500/30",
    DEGRADED: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  };
  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${styles[status] || "bg-slate-500/10 text-slate-400"}`}>
      {status || "UNKNOWN"}
    </span>
  );
}
