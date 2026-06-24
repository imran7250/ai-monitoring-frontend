// D:\Ai_Monitoring_Platform\ai-monitoring-ui\src\pages\services\ServiceDetails.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../api/client";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Area, ReferenceLine
} from "recharts";
import {
  Activity, AlertTriangle, Bell, Server, Cpu, Zap,
  ArrowLeft, RefreshCw, CheckCircle, XCircle, AlertCircle,
  FileText, ChevronDown, ChevronUp,
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

      // ✅ Process metrics data with proper formatting
      if (metricsRes.status === "fulfilled") {
        const rawData = metricsRes.value.data || [];
        
        // ✅ Format and clean data for Recharts
        const formattedData = rawData
          .filter(item => item.cpuUsage !== null && item.cpuUsage !== undefined)
          .map(item => ({
            ...item,
            cpuUsage: typeof item.cpuUsage === 'string' ? parseFloat(item.cpuUsage) : Number(item.cpuUsage),
            recordedAt: item.recordedAt || item.timestamp || item.time || new Date().toISOString(),
          }))
          .sort((a, b) => new Date(a.recordedAt) - new Date(b.recordedAt));

        setMetrics(formattedData);
      }

      // ✅ Process logs
      if (logsRes.status === "fulfilled") {
        const logsData = logsRes.value.data || [];
        setLogs(
          logsData
            .sort((a, b) => new Date(b.checkedAt) - new Date(a.checkedAt))
            .slice(0, 20)
        );
      }

      // ✅ Process incidents
      if (incidentsRes.status === "fulfilled") {
        setIncidents(incidentsRes.value.data || []);
      }

      // ✅ Process alerts
      if (alertsRes.status === "fulfilled") {
        setAlerts(alertsRes.value.data || []);
      }

      // ✅ Process anomalies
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
      UP: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400" },
      DOWN: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400" },
      DEGRADED: { bg: "bg-yellow-500/10", text: "text-yellow-400", dot: "bg-yellow-400" },
    };
    return styles[status] || styles.UP;
  };

  // ✅ Custom Tooltip for Chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 shadow-xl">
          <p className="text-xs text-slate-400">{formatTime(label)}</p>
          <p className="text-sm font-semibold text-white">
            CPU: {payload[0]?.value ?? 0}%
          </p>
        </div>
      );
    }
    return null;
  };

  // ✅ Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-3 sm:mb-4" />
          <p className="text-slate-400 text-sm sm:text-base">Loading service details...</p>
        </div>
      </div>
    );
  }

  // ✅ No Data State
  if (!metrics.length && !logs.length && !incidents.length && !alerts.length && !anomalies.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Server className="w-10 h-10 text-slate-600" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">No Data Available</h2>
          <p className="text-slate-400 text-sm">
            No metrics or logs found for this service. The service may not have been checked yet.
          </p>
          <button
            onClick={handleRefresh}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">

      {/* ✅ Responsive Header */}
      <div className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 px-3 sm:px-4 md:px-6 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 sm:gap-3">
          <button
            onClick={() => navigate("/services")}
            className="flex items-center gap-1.5 sm:gap-2 text-slate-400 hover:text-white transition-colors text-xs sm:text-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Back to Services</span>
            <span className="xs:hidden">Back</span>
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-1.5 sm:p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${refreshing ? "animate-spin" : ""}`} />
            </button>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Server className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
              <span className="text-xs sm:text-sm text-white font-mono">
                #{serviceId?.slice(0, 6)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 space-y-4 sm:space-y-5 md:space-y-6">

        {/* ✅ CPU Metrics Chart - FIXED & RESPONSIVE */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 sm:p-5 md:p-6">
          <div className="flex flex-col xs:flex-row xs:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-emerald-500/10 rounded-lg">
                <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
              </div>
              <h2 className="text-base sm:text-lg font-semibold text-white">CPU Usage</h2>
            </div>
            <span className="text-[10px] sm:text-xs text-slate-500 xs:ml-auto">
              {metrics.length} readings
            </span>
          </div>

          {metrics.length === 0 ? (
            <div className="h-48 sm:h-56 md:h-64 flex items-center justify-center text-slate-400 text-xs sm:text-sm">
              <div className="text-center">
                <Activity className="w-8 h-8 sm:w-10 sm:h-10 text-slate-600 mx-auto mb-2" />
                <p>No metrics data available</p>
                <p className="text-[10px] sm:text-xs text-slate-500 mt-1">Wait for health checks to run</p>
              </div>
            </div>
          ) : (
            <div className="h-48 sm:h-56 md:h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={metrics}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />

                  <defs>
                    <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <XAxis
                    dataKey="recordedAt"
                    tickFormatter={(v) => v ? formatTime(v) : ""}
                    stroke="#334155"
                    tick={{ fill: "#64748b", fontSize: 10 }}
                    interval="preserveStartEnd"
                    minTickGap={30}
                    padding={{ left: 10, right: 10 }}
                  />

                  <YAxis
                    stroke="#334155"
                    tick={{ fill: "#64748b", fontSize: 10 }}
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                    width={40}
                  />

                  <Tooltip content={<CustomTooltip />} />

                  <Area
                    type="monotone"
                    dataKey="cpuUsage"
                    stroke="none"
                    fill="url(#cpuGradient)"
                  />

                  <Line
                    type="monotone"
                    dataKey="cpuUsage"
                    stroke="#22c55e"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5, fill: "#22c55e" }}
                  />

                  <ReferenceLine
                    y={80}
                    stroke="#ef4444"
                    strokeDasharray="4 4"
                    label={{
                      value: "Warning: 80%",
                      fill: "#ef4444",
                      fontSize: 9,
                      position: "right"
                    }}
                  />

                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* ✅ AI Anomalies - Responsive Expandable */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection("anomalies")}
            className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 bg-purple-500/10 rounded-lg">
                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
              </div>
              <span className="text-sm sm:text-base font-medium text-white">AI Anomalies</span>
              {anomalies.length > 0 && (
                <span className="px-1.5 sm:px-2 py-0.5 bg-purple-500/20 rounded-full text-[10px] sm:text-xs text-purple-400">
                  {anomalies.length}
                </span>
              )}
            </div>
            {expandedSections.anomalies ? (
              <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
            )}
          </button>

          {expandedSections.anomalies && (
            <div className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6">
              {anomalies.length === 0 ? (
                <div className="flex items-center justify-center py-6 sm:py-8 text-slate-400 text-xs sm:text-sm">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-emerald-400" />
                  No anomalies detected
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  {anomalies.slice(0, 5).map((a, idx) => (
                    <div key={idx} className="bg-slate-800/30 rounded-lg p-3 sm:p-4">
                      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1 sm:gap-2 mb-2">
                        <span className="text-xs sm:text-sm font-medium text-white">{a.metricName}</span>
                        <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full w-fit ${
                          a.deviationScore > 5
                            ? "bg-red-500/20 text-red-400"
                            : "bg-purple-500/20 text-purple-400"
                        }`}>
                          σ {a.deviationScore?.toFixed(2) || "0.00"}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-[10px] sm:text-xs">
                        <div>
                          <span className="text-slate-500">Expected</span>
                          <p className="text-white text-xs sm:text-sm">{a.expectedValue?.toFixed(2) || "—"}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Actual</span>
                          <p className="text-white text-xs sm:text-sm">{a.actualValue?.toFixed(2) || "—"}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Time</span>
                          <p className="text-white text-xs sm:text-sm">{formatTime(a.detectedAt)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ✅ Recent Logs - Responsive Expandable */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection("logs")}
            className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 bg-blue-500/10 rounded-lg">
                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
              </div>
              <span className="text-sm sm:text-base font-medium text-white">Recent Logs</span>
              <span className="text-[10px] sm:text-xs text-slate-500">Latest {logs.length}</span>
            </div>
            {expandedSections.logs ? (
              <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
            )}
          </button>

          {expandedSections.logs && (
            <div className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6">
              {logs.length === 0 ? (
                <div className="text-center py-6 sm:py-8 text-slate-400 text-xs sm:text-sm">No logs available</div>
              ) : (
                <div className="space-y-1.5 sm:space-y-2">
                  {logs.map((log, idx) => {
                    const badge = getStatusBadge(log.status);
                    return (
                      <div key={idx} className="flex flex-col xs:flex-row xs:items-center justify-between py-1.5 sm:py-2 border-b border-slate-800 last:border-0 gap-1 sm:gap-2">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span className={`inline-block w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                          <span className={`text-xs sm:text-sm ${badge.text}`}>{log.status}</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-xs">
                          <span className="text-slate-400">{log.responseTimeMs}ms</span>
                          <span className="text-slate-500">{formatTime(log.checkedAt)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ✅ Incidents + Alerts - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">

          {/* Incidents */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("incidents")}
              className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 bg-red-500/10 rounded-lg">
                  <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" />
                </div>
                <span className="text-sm sm:text-base font-medium text-white">Incidents</span>
                {incidents.length > 0 && (
                  <span className="px-1.5 sm:px-2 py-0.5 bg-red-500/20 rounded-full text-[10px] sm:text-xs text-red-400">
                    {incidents.length}
                  </span>
                )}
              </div>
              {expandedSections.incidents ? (
                <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
              )}
            </button>

            {expandedSections.incidents && (
              <div className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6">
                {incidents.length === 0 ? (
                  <div className="flex items-center justify-center py-4 text-slate-400 text-xs sm:text-sm">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-emerald-400" />
                    No incidents
                  </div>
                ) : (
                  <div className="space-y-2 sm:space-y-3">
                    {incidents.map((inc) => (
                      <div key={inc.id} className="bg-slate-800/30 rounded-lg p-2.5 sm:p-3">
                        <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
                          <span className="px-1.5 sm:px-2 py-0.5 bg-red-500/20 rounded-full text-[10px] sm:text-xs text-red-400">
                            {inc.status}
                          </span>
                          {inc.severity && (
                            <span className="px-1.5 sm:px-2 py-0.5 bg-orange-500/20 rounded-full text-[10px] sm:text-xs text-orange-400">
                              {inc.severity}
                            </span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-slate-300 line-clamp-2">
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
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("alerts")}
              className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 bg-yellow-500/10 rounded-lg">
                  <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400" />
                </div>
                <span className="text-sm sm:text-base font-medium text-white">Alert Rules</span>
                {alerts.length > 0 && (
                  <span className="px-1.5 sm:px-2 py-0.5 bg-yellow-500/20 rounded-full text-[10px] sm:text-xs text-yellow-400">
                    {alerts.length}
                  </span>
                )}
              </div>
              {expandedSections.alerts ? (
                <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
              )}
            </button>

            {expandedSections.alerts && (
              <div className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6">
                {alerts.length === 0 ? (
                  <div className="text-center py-4 text-slate-400 text-xs sm:text-sm">
                    <Bell className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    No alerts configured
                  </div>
                ) : (
                  <div className="space-y-1.5 sm:space-y-2">
                    {alerts.map((alert) => (
                      <div key={alert.id} className="flex flex-col xs:flex-row xs:items-center justify-between py-1.5 sm:py-2 px-2.5 sm:px-3 bg-slate-800/30 rounded-lg gap-1 sm:gap-2">
                        <span className="text-xs sm:text-sm text-white truncate">{alert.name}</span>
                        <span className="px-1.5 sm:px-2 py-0.5 bg-yellow-500/20 rounded-full text-[10px] sm:text-xs text-yellow-400 w-fit">
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

        {/* ✅ Footer - Responsive */}
        <div className="flex flex-col xs:flex-row items-center justify-between gap-2 text-[10px] sm:text-xs text-slate-500 pt-2 border-t border-slate-800/50">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
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