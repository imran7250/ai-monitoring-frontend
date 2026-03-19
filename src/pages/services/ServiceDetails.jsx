

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
    anomalies: true, logs: false, incidents: false, alerts: false,
  });

  useEffect(() => {
    loadData();
  }, [serviceId]);

  const loadData = async () => {
    setLoading(true);
    const [metricsRes, logsRes, incidentsRes, alertsRes, anomalyRes] =
      await Promise.allSettled([
        api.get(`/api/metrics/service/${serviceId}`),
        api.get(`/api/services/${serviceId}/logs`),
        api.get(`/api/incidents/service/${serviceId}`),
        api.get(`/api/alerts/service/${serviceId}`),
        api.get(`/api/anomalies/service/${serviceId}`),
      ]);

    if (metricsRes.status === "fulfilled") setMetrics(metricsRes.value.data || []);
    if (logsRes.status === "fulfilled") {
      setLogs(
        (logsRes.value.data || [])
          .sort((a, b) => new Date(b.checkedAt) - new Date(a.checkedAt))
          .slice(0, 20)
      );
    }
    if (incidentsRes.status === "fulfilled") setIncidents(incidentsRes.value.data || []);
    if (alertsRes.status === "fulfilled") setAlerts(alertsRes.value.data || []);
    if (anomalyRes.status === "fulfilled") setAnomalies(anomalyRes.value.data || []);

    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const getStatusBadge = (status) => {
    const styles = {
      UP: { bg: "bg-emerald-500/10", text: "text-emerald-400" },
      DOWN: { bg: "bg-red-500/10", text: "text-red-400" },
      DEGRADED: { bg: "bg-yellow-500/10", text: "text-yellow-400" },
    };
    return styles[status] || styles.UP;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading service details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">

      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate("/services")}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            </button>
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-white">Service #{serviceId}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

        {/* CPU Metrics Chart */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Cpu className="w-5 h-5 text-emerald-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">CPU Usage</h2>
            <span className="text-xs text-slate-500 ml-auto">Last 50 readings</span>
          </div>

          {metrics.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
              No metrics data available
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics}>

                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />

                  <defs>
                    <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <XAxis
                    dataKey="recordedAt"
                    tickFormatter={(v) => (v ? formatTime(v) : "")}
                    stroke="#334155"
                    tick={{ fill: "#64748b", fontSize: 11 }}
                  />

                  <YAxis
                    stroke="#334155"
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    domain={[0, 100]}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#020617",
                      border: "1px solid #334155",
                      borderRadius: "10px",
                      fontSize: "12px",
                    }}
                    formatter={(value) => [`${value}%`, "CPU Usage"]}
                  />

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
                    activeDot={{ r: 5 }}
                  />

                  <ReferenceLine
                    y={80}
                    stroke="#ef4444"
                    strokeDasharray="4 4"
                  />

                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* AI Anomalies — Expandable */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection("anomalies")}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-purple-500/10 rounded-lg">
                <Zap className="w-4 h-4 text-purple-400" />
              </div>
              <span className="font-medium text-white">AI Anomalies</span>
              {anomalies.length > 0 && (
                <span className="px-2 py-0.5 bg-purple-500/20 rounded-full text-xs text-purple-400">
                  {anomalies.length}
                </span>
              )}
            </div>
            {expandedSections.anomalies ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>    

          {expandedSections.anomalies && (
            <div className="px-6 pb-6">
              {anomalies.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-slate-400 text-sm">
                  <CheckCircle className="w-4 h-4 mr-2 text-emerald-400" />
                  No anomalies detected
                </div>
              ) : (
                <div className="space-y-3">
                  {anomalies.slice(0, 5).map((a, idx) => (
                    <div key={idx} className="bg-slate-800/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white">{a.metricName}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${a.deviationScore > 5 ? "bg-red-500/20 text-red-400" : "bg-purple-500/20 text-purple-400"}`}>
                          σ {a.deviationScore?.toFixed(2)}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div><span className="text-slate-500">Expected</span><p className="text-white">{a.expectedValue?.toFixed(2)}</p></div>
                        <div><span className="text-slate-500">Actual</span><p className="text-white">{a.actualValue?.toFixed(2)}</p></div>
                        <div><span className="text-slate-500">Time</span><p className="text-white">{formatTime(a.detectedAt)}</p></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Recent Logs — Expandable */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection("logs")}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-blue-500/10 rounded-lg">
                <FileText className="w-4 h-4 text-blue-400" />
              </div>
              <span className="font-medium text-white">Recent Logs</span>
              <span className="text-xs text-slate-500">Latest 20</span>
            </div>
            {expandedSections.logs ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {expandedSections.logs && (
            <div className="px-6 pb-6">
              {logs.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm">No logs available</div>
              ) : (
                <div className="space-y-2">
                  {logs.map((log, idx) => {
                    const badge = getStatusBadge(log.status);
                    return (
                      <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                        <div className="flex items-center gap-3">
                          <span className={`text-sm ${badge.text}`}>{log.status}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs">
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

        {/* Incidents + Alerts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Incidents */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("incidents")}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-red-500/10 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                </div>
                <span className="font-medium text-white">Incidents</span>
                {incidents.length > 0 && (
                  <span className="px-2 py-0.5 bg-red-500/20 rounded-full text-xs text-red-400">{incidents.length}</span>
                )}
              </div>
              {expandedSections.incidents ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {expandedSections.incidents && (
              <div className="px-6 pb-6">
                {incidents.length === 0 ? (
                  <div className="flex items-center justify-center py-4 text-slate-400 text-sm">
                    <CheckCircle className="w-4 h-4 mr-2 text-emerald-400" />
                    No incidents
                  </div>
                ) : (
                  <div className="space-y-3">
                    {incidents.map((inc) => (
                      <div key={inc.id} className="bg-slate-800/30 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 bg-red-500/20 rounded-full text-xs text-red-400">{inc.status}</span>
                        </div>
                        <p className="text-sm text-slate-300">{inc.reason}</p>
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
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-yellow-500/10 rounded-lg">
                  <Bell className="w-4 h-4 text-yellow-400" />
                </div>
                <span className="font-medium text-white">Alert Rules</span>
                {alerts.length > 0 && (
                  <span className="px-2 py-0.5 bg-yellow-500/20 rounded-full text-xs text-yellow-400">{alerts.length}</span>
                )}
              </div>
              {expandedSections.alerts ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {expandedSections.alerts && (
              <div className="px-6 pb-6">
                {alerts.length === 0 ? (
                  <div className="text-center py-4 text-slate-400 text-sm">No alerts configured</div>
                ) : (
                  <div className="space-y-2">
                    {alerts.map((alert) => (
                      <div key={alert.id} className="flex items-center justify-between py-2 px-3 bg-slate-800/30 rounded-lg">
                        <span className="text-sm text-white">{alert.name}</span>
                        <span className="px-2 py-0.5 bg-yellow-500/20 rounded-full text-xs text-yellow-400">
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
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Active</span>
          </div>
          <span>Updated {formatTime(new Date())}</span>
        </div>

      </div>
    </div>
  );
}

   