import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import KPIBar from "../../components/dashboard/KPIBar";
import {
  getDashboardSummary,
  getRecentIncidents,
  getRecentNotifications,
  getAnomalySummary,
} from "../../api/dashboard.api";
import {
  Activity,
  AlertTriangle,
  Bell,
  Server,
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { formatDate } from "../../utils/dateUtils";

// ✅ FIX #6 — Background style moved outside component (not recreated every render)
const BG_GRID_STYLE = {
  backgroundImage: `
    linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
  `,
  backgroundSize: "50px 50px",
};

export default function Dashboard() {
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [aiSummary, setAiSummary] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAll();
  }, []);

  // ✅ FIX #6 — Promise.allSettled loads both simultaneously
  // Each failure is handled independently — one failing doesn't block the other
  const loadAll = async () => {
    setError(null);
    const [dashResult, aiResult] = await Promise.allSettled([
      loadDashboard(),
      loadAIInsights(),
    ]);
    if (dashResult.status === "rejected")
      console.error("Dashboard load failed:", dashResult.reason);
    if (aiResult.status === "rejected")
      console.error("AI insights load failed:", aiResult.reason);
  };

  // const loadDashboard = async () => {
  //   const [summaryData, incidentData, notificationData] = await Promise.all([
  //     getDashboardSummary(),
  //     getRecentIncidents(),
  //     getRecentNotifications(),
  //   ]);
  //   setSummary(summaryData);
  //   setIncidents(incidentData);
  //   setNotifications(notificationData);
  // };

  const loadDashboard = async () => {
  // ✅ FIX — allSettled means one failing API won't blank the entire dashboard
  const [summaryRes, incidentRes, notifRes] = await Promise.allSettled([
    getDashboardSummary(),
    getRecentIncidents(),
    getRecentNotifications(),
  ]);

  if (summaryRes.status === "fulfilled") setSummary(summaryRes.value);
  else console.error("Dashboard summary failed:", summaryRes.reason);

  if (incidentRes.status === "fulfilled") setIncidents(incidentRes.value);
  else console.error("Incidents failed:", incidentRes.reason);

  if (notifRes.status === "fulfilled") setNotifications(notifRes.value);
  else console.error("Notifications failed:", notifRes.reason);
};


  const loadAIInsights = async () => {
    const data = await getAnomalySummary();
    setAiSummary(data);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadAll();
    setIsRefreshing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">

      {/* Background pattern — style defined outside component */}
      <div className="fixed inset-0 pointer-events-none" style={{ ...BG_GRID_STYLE, opacity: 0.02 }} />

      <div className="relative max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">System Overview</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-sm text-slate-400">
                  Real-time health and activity across all monitored services
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-3 bg-slate-800/50 border border-slate-700 rounded-xl hover:bg-slate-700/50 transition-all"
          >
            <RefreshCw className={`w-5 h-5 text-slate-400 ${isRefreshing ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* KPI Strip */}
        <KPIBar summary={summary} aiSummary={aiSummary} incidents={incidents} />

        {/* AI Insights Panel */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-indigo-500/20 rounded-xl">
              <Shield className="w-7 h-7 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                AI Insights
                <span className="px-2 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-xs text-indigo-300">
                  LIVE
                </span>
              </h2>
              <p className="text-sm text-slate-400">Anomaly intelligence engine</p>
            </div>
          </div>

          {!aiSummary ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-16 h-16 border-4 border-slate-700 border-t-indigo-500 rounded-full animate-spin" />
              <span className="ml-4 text-slate-400">Loading AI insights...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div
                onClick={() => navigate("/services?anomaly=true")}
                className="bg-indigo-950/30 border border-indigo-500/20 rounded-xl p-6 hover:border-indigo-500/40 transition-all cursor-pointer"
              >
                <p className="text-indigo-300 text-sm mb-2">Services with anomalies</p>
                <p className="text-4xl font-bold text-white">{aiSummary.servicesAffected}</p>
                <p className="text-xs text-slate-500 mt-2">Last 24 hours</p>
              </div>

              <div className="bg-purple-950/30 border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-all">
                <p className="text-purple-300 text-sm mb-2">Total anomalies (24h)</p>
                <p className="text-4xl font-bold text-white">{aiSummary.totalAnomalies}</p>
                <p className="text-xs text-slate-500 mt-2">Detected issues</p>
              </div>

              <div className="bg-red-950/30 border border-red-500/20 rounded-xl p-6 hover:border-red-500/40 transition-all">
                <p className="text-red-300 text-sm mb-2">Highest deviation</p>
                <p className="text-4xl font-bold text-white">
                  {aiSummary.highestDeviation?.toFixed(2)}σ
                </p>
                <p className="text-xs text-slate-500 mt-2">Standard deviation</p>
              </div>

              <div className="bg-yellow-950/30 border border-yellow-500/20 rounded-xl p-6 hover:border-yellow-500/40 transition-all">
                <p className="text-yellow-300 text-sm mb-2">Most unstable service</p>
                <p className="text-xl font-semibold text-white truncate">
                  {aiSummary.mostUnstableService}
                </p>
                <p className="text-xs text-slate-500 mt-2">Requires attention</p>
              </div>
            </div>
          )}
        </div>

        {/* Service Status Overview */}
        {summary && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-blue-500/20 rounded-xl">
                <Server className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Service Status Overview</h2>
                <p className="text-sm text-slate-400">
                  Total: {summary.totalServices} services
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                onClick={() => navigate("/services?status=UP")}
                className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-6 hover:border-emerald-500/40 transition-all cursor-pointer"
              >
                <CheckCircle className="w-5 h-5 text-emerald-400 mb-4" />
                <p className="text-emerald-400 text-sm mb-1">Running Normally</p>
                <p className="text-4xl font-bold text-white mb-2">{summary.upServices}</p>
                <p className="text-xs text-slate-400">Services working without issues</p>
              </div>

              <div
                onClick={() => navigate("/services?status=DEGRADED")}
                className="bg-yellow-950/30 border border-yellow-500/20 rounded-xl p-6 hover:border-yellow-500/40 transition-all cursor-pointer"
              >
                <AlertCircle className="w-5 h-5 text-yellow-400 mb-4" />
                <p className="text-yellow-400 text-sm mb-1">Performance Issues</p>
                <p className="text-4xl font-bold text-white mb-2">{summary.degradedServices}</p>
                <p className="text-xs text-slate-400">Slower or unstable performance</p>
              </div>

              <div
                onClick={() => navigate("/services?status=DOWN")}
                className="bg-red-950/30 border border-red-500/20 rounded-xl p-6 hover:border-red-500/40 transition-all cursor-pointer"
              >
                <XCircle className="w-5 h-5 text-red-400 mb-4" />
                <p className="text-red-400 text-sm mb-1">Services Down</p>
                <p className="text-4xl font-bold text-white mb-2">{summary.downServices}</p>
                <p className="text-xs text-slate-400">Currently unavailable</p>
              </div>
            </div>
          </div>
        )}

        {/* Incidents + Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Incidents */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex items-center gap-3">
              <div className="p-2.5 bg-red-500/10 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Recent Incidents</h2>
                <p className="text-xs text-slate-400">
                  {incidents.length} active incident{incidents.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="p-6">
              {incidents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-10 h-10 text-emerald-400" />
                  </div>
                  <p className="text-slate-400 font-medium">No active incidents</p>
                  <p className="text-sm text-slate-500 mt-1">All systems are running smoothly</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {incidents.map((incident, index) => (
                    <div
                      key={incident.incidentId || index}
                      className="bg-red-500/5 border border-red-500/20 rounded-xl p-5"
                    >
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-semibold text-red-300">{incident.serviceName}</h3>
                        <span className="px-2 py-1 bg-red-500/20 rounded-full text-xs text-red-300">
                          {incident.status}
                        </span>
                      </div>
                      <div className="mt-2">
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-red-500/20 rounded-full w-fit">
                          <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                          <span className="text-xs text-red-300 font-medium">ACTIVE</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-500/10 rounded-lg">
                  <Bell className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Notifications</h2>
                  <p className="text-xs text-slate-400">
                    {notifications.length} new
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-xs text-slate-400">Live</span>
              </div>
            </div>

            <div className="p-6">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <Bell className="w-10 h-10 text-slate-600" />
                  </div>
                  <p className="text-slate-400 font-medium">No notifications</p>
                  <p className="text-sm text-slate-500 mt-1">You're all caught up</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notification, index) => (
                    <div
                      key={notification.id || index}
                      className="bg-slate-800/30 border border-slate-700 rounded-xl p-5"
                    >
                      <p className="text-slate-200">{notification.message}</p>
                      <p className="text-xs text-slate-500 mt-2">
                        {notification.sentAt
                          ? formatDate(notification.sentAt)
                          : "Unknown time"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ✅ FIX #7 — Footer: ?? 0 prevents "undefined service(s) down" */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
              <span>
                {(summary?.downServices ?? 0) === 0
                  ? "All systems operational"
                  : `${summary.downServices} service(s) down`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-400" />
              <span>AI Engine {aiSummary ? "Active" : "Loading"}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
            <span>•</span>
            <span>Real-time updates</span>
          </div>
        </div>

      </div>
    </div>
  );
}


