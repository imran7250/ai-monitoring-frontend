// D:\Ai_Monitoring_Platform\ai-monitoring-ui\src\pages\dashboard\Dashboard.jsx

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
  AlertCircle,
  RefreshCw,
  TrendingUp,
  Zap,
  BarChart3,
} from "lucide-react";
import { formatDate } from "../../utils/dateUtils";
import PageHeader from "../../components/ui/PageHeader";

export default function Dashboard() {
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [aiSummary, setAiSummary] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [liveTime, setLiveTime] = useState(new Date());

  useEffect(() => {
    loadAll();
    const timer = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadAll = async () => {
    const [dashResult, aiResult] = await Promise.allSettled([
      loadDashboard(),
      loadAIInsights(),
    ]);
    if (dashResult.status === "rejected")
      console.error("Dashboard load failed:", dashResult.reason);
    if (aiResult.status === "rejected")
      console.error("AI insights load failed:", aiResult.reason);
  };

  const loadDashboard = async () => {
    const [summaryData, incidentData, notificationData] = await Promise.all([
      getDashboardSummary(),
      getRecentIncidents(),
      getRecentNotifications(),
    ]);
    setSummary(summaryData);
    setIncidents(incidentData);
    setNotifications(notificationData);
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
    <div className="min-h-screen bg-white">
      {/* ✅ No grid lines - pure white background */}

      <PageHeader title="Dashboard" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">System Overview</h1>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <p className="text-sm text-gray-500">All systems operational</p>
                <span className="text-gray-300 hidden xs:inline">•</span>
                <span className="text-xs text-gray-400 font-mono hidden xs:inline">
                  {liveTime.toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs text-emerald-700 font-medium">Live</span>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-gray-500 ${isRefreshing ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* KPI Strip */}
        <KPIBar summary={summary} aiSummary={aiSummary} incidents={incidents} />

        {/* Quick Stats Grid */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">Total Services</span>
                <Server size={16} className="text-gray-700" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">{summary.totalServices}</p>
              <div className="flex items-center gap-3 mt-2 text-[10px] sm:text-xs">
                <span className="flex items-center gap-1 text-emerald-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {summary.upServices}
                </span>
                <span className="flex items-center gap-1 text-yellow-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                  {summary.degradedServices}
                </span>
                <span className="flex items-center gap-1 text-red-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  {summary.downServices}
                </span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">Health Score</span>
                <Activity size={16} className="text-emerald-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
                {summary.totalServices > 0
                  ? Math.round((summary.upServices / summary.totalServices) * 100)
                  : 100}%
              </p>
              <div className="mt-2 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-gray-700 rounded-full transition-all duration-500"
                  style={{
                    width: `${summary.totalServices > 0
                      ? Math.round((summary.upServices / summary.totalServices) * 100)
                      : 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">AI Anomalies</span>
                <Zap size={16} className="text-purple-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">{aiSummary?.totalAnomalies || 0}</p>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-2">Last 24 hours</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">Active Incidents</span>
                <AlertTriangle size={16} className="text-red-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">{incidents.length}</p>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-2">
                {incidents.length === 0 ? "All clear" : `${incidents.length} requiring attention`}
              </p>
            </div>
          </div>
        )}

        {/* AI Insights Panel */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="p-2.5 sm:p-3 bg-purple-50 rounded-xl border border-purple-200">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                AI Intelligence
                <span className="px-2 py-0.5 bg-purple-100 border border-purple-300 rounded-full text-[8px] sm:text-[10px] text-purple-700 font-medium tracking-wider uppercase">
                  Live
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">Anomaly detection & predictive insights</p>
            </div>
          </div>

          {!aiSummary ? (
            <div className="flex items-center justify-center py-8 sm:py-12">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 border-3 border-gray-300 border-t-purple-600 rounded-full animate-spin" />
                <span className="text-xs sm:text-sm text-gray-500">Loading AI insights...</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div
                onClick={() => navigate("/anomalies")}
                className="bg-purple-50 border border-purple-200 rounded-xl p-4 sm:p-5 hover:border-purple-400 hover:bg-purple-100 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs text-purple-700 uppercase tracking-wider">Services Affected</span>
                  <div className="p-1 bg-purple-200 rounded-lg group-hover:scale-110 transition-transform">
                    <Zap size={12} className="text-purple-600" />
                  </div>
                </div>
                <p className="text-xl sm:text-3xl font-bold text-gray-900 mt-2">{aiSummary.servicesAffected}</p>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-1">with anomalies detected</p>
              </div>

              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs text-indigo-700 uppercase tracking-wider">Total Anomalies</span>
                  <BarChart3 size={16} className="text-indigo-600" />
                </div>
                <p className="text-xl sm:text-3xl font-bold text-gray-900 mt-2">{aiSummary.totalAnomalies}</p>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-1">in the last 24 hours</p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs text-red-700 uppercase tracking-wider">Highest Deviation</span>
                  <TrendingUp size={16} className="text-red-600" />
                </div>
                <p className="text-xl sm:text-3xl font-bold text-gray-900 mt-2">
                  {aiSummary.highestDeviation?.toFixed(1)}σ
                </p>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-1">standard deviations</p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs text-yellow-700 uppercase tracking-wider">Most Unstable</span>
                  <AlertCircle size={16} className="text-yellow-600" />
                </div>
                <p className="text-base sm:text-xl font-bold text-gray-900 mt-2 truncate">
                  {aiSummary.mostUnstableService || "None"}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-1">requires immediate attention</p>
              </div>
            </div>
          )}
        </div>

        {/* Incidents + Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

          {/* Incidents */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-1.5 sm:p-2 bg-red-50 rounded-xl border border-red-200">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-semibold text-gray-900">Incidents</h2>
                  <p className="text-[10px] sm:text-xs text-gray-500">
                    {incidents.length} active incident{incidents.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              {incidents.length > 0 && (
                <button
                  onClick={() => navigate("/incidents")}
                  className="text-[10px] sm:text-xs text-gray-600 hover:text-gray-900 font-medium"
                >
                  View all →
                </button>
              )}
            </div>

            <div className="p-4 sm:p-5">
              {incidents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 sm:py-8 text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                    <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />
                  </div>
                  <p className="text-sm sm:text-base text-gray-500 font-medium">No active incidents</p>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">All systems are running smoothly</p>
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  {incidents.slice(0, 3).map((incident, index) => (
                    <div
                      key={incident.incidentId || index}
                      className="flex items-center justify-between p-2.5 sm:p-3 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors cursor-pointer"
                      onClick={() => navigate(`/incidents/${incident.incidentId}`)}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full animate-pulse" />
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-gray-900">{incident.serviceName}</p>
                          <p className="text-[10px] sm:text-xs text-gray-500">{incident.reason?.slice(0, 40)}...</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-red-200 rounded-lg text-[10px] sm:text-xs text-red-700 font-medium">
                        {incident.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-1.5 sm:p-2 bg-blue-50 rounded-xl border border-blue-200">
                  <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-semibold text-gray-900">Notifications</h2>
                  <p className="text-[10px] sm:text-xs text-gray-500">
                    {notifications.length} new notification{notifications.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              {notifications.length > 0 && (
                <button
                  onClick={() => navigate("/notifications")}
                  className="text-[10px] sm:text-xs text-gray-600 hover:text-gray-900 font-medium"
                >
                  View all →
                </button>
              )}
            </div>

            <div className="p-4 sm:p-5">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 sm:py-8 text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                    <Bell className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                  </div>
                  <p className="text-sm sm:text-base text-gray-500 font-medium">No notifications</p>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">You're all caught up</p>
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  {notifications.slice(0, 3).map((notification, index) => (
                    <div
                      key={notification.id || index}
                      className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="p-1 bg-blue-100 rounded-lg flex-shrink-0">
                        <Bell size={12} className="text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm text-gray-700 truncate">{notification.message}</p>
                        <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">
                          {notification.sentAt ? formatDate(notification.sentAt) : "Unknown time"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-3 sm:pt-4 border-t border-gray-200 text-[10px] sm:text-xs text-gray-500">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              <span>{(summary?.downServices ?? 0) === 0 ? "All systems operational" : `${summary.downServices} service(s) down`}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
              <span>AI Engine {aiSummary ? "Active" : "Loading"}</span>
            </span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <span>Last updated: {liveTime.toLocaleTimeString()}</span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-400">Real-time updates</span>
          </div>
        </div>

      </div>
    </div>
  );
}