import { Activity, AlertTriangle, Server, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function KPIBar({ summary, aiSummary, incidents }) {

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

  return (
  <div className="bg-gradient-to-br from-slate-900/80 to-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">

    {/* SECTION HEADER */}
    <div className="flex items-center justify-between">
    <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
      <Activity className="w-6 h-6 text-blue-400" />
      System Health Overview
    </h2>
      <span className="text-xs text-slate-400">
        live operational status
      </span>
    </div>

    {/* KPI GRID */}
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

      {/* SYSTEM HEALTH */}
      <div
        onClick={() => navigate("/services")}
        className="bg-slate-900 border border-slate-800 p-5 rounded-xl cursor-pointer"
      >
        <p className="text-xs text-slate-400">System Health</p>
        <h3 className={`text-3xl font-bold mt-2 ${healthColor}`}>
          {healthPercent}%
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          {healthy} of {total} services operational
        </p>
      </div>

      {/* INCIDENT STATUS */}
      <div
        onClick={() => navigate("/incidents")}
        className="bg-slate-900 border border-slate-800 p-5 rounded-xl cursor-pointer"
      >
        <p className="text-xs text-slate-400">Active Incidents</p>
        <h3 className="text-3xl font-bold mt-2 text-red-400">
          {incidents.length}
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Services currently disrupted
        </p>
      </div>

      {/* AI ANOMALIES */}
      <div
        // onClick={() => navigate("/services?anomaly=true")}
        // onClick={() => navigate("/anomalies")}
         onClick={() => navigate("/anomalies")}
        className="bg-slate-900 border border-slate-800 p-5 rounded-xl cursor-pointer"
      >
        <p className="text-xs text-slate-400">AI Anomalies (24h)</p>
        <h3 className="text-3xl font-bold mt-2 text-purple-400">
          {aiSummary?.totalAnomalies || 0}
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Intelligent anomaly detections
        </p>
      </div>

      {/* DEGRADED SERVICES */}
      <div
        onClick={() => navigate("/services?status=DEGRADED")}
        className="bg-slate-900 border border-slate-800 p-5 rounded-xl cursor-pointer"
      >
        <p className="text-xs text-slate-400">Degraded Services</p>
        <h3 className="text-3xl font-bold mt-2 text-yellow-400">
          {degraded}
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Experiencing performance issues
        </p>
      </div>

    </div>

  </div>
);
}