// D:\Ai_Monitoring_Platform\ai-monitoring-ui\src\pages\logs\Logs.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../api/client";
import { RefreshCw, Clock, Server, Activity, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { formatTime } from "../../utils/dateUtils";
import PageHeader from "../../components/ui/PageHeader";

export default function Logs() {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadLogs();
  }, [serviceId]);

  const loadLogs = async () => {
    try {
      const res = await api.get(`/api/services/${serviceId}/logs`);
      setLogs(
        (res.data || [])
          .sort((a, b) => new Date(b.checkedAt) - new Date(a.checkedAt))
          .slice(0, 20)
      );
    } catch (e) {
      console.error("Failed loading logs", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadLogs();
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "UP":
        return { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", border: "border-emerald-200" };
      case "DOWN":
        return { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500", border: "border-red-200" };
      case "DEGRADED":
        return { bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-500", border: "border-yellow-200" };
      default:
        return { bg: "bg-gray-50", text: "text-gray-600", dot: "bg-gray-400", border: "border-gray-200" };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-700 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">

      {/* ✅ PageHeader with Back Button to Service Details */}
      <PageHeader title="Service Logs" backTo={`/services/${serviceId}`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* Header with refresh button */}
        <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-500">Service #{serviceId}</span>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs sm:text-sm text-gray-700 hover:text-gray-900 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${refreshing ? "animate-spin" : ""}`} />
            <span className="hidden xs:inline">{refreshing ? "Refreshing..." : "Refresh"}</span>
            <span className="xs:hidden">{refreshing ? "..." : "⟳"}</span>
          </button>
        </div>

        {/* Stats Summary */}
        <div className="max-w-7xl mx-auto mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 sm:p-4">
              <p className="text-[10px] sm:text-xs text-gray-500">Total Logs</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{logs.length}</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 sm:p-4">
              <p className="text-[10px] sm:text-xs text-emerald-600">UP</p>
              <p className="text-lg sm:text-2xl font-bold text-emerald-700">
                {logs.filter(l => l.status === "UP").length}
              </p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 sm:p-4">
              <p className="text-[10px] sm:text-xs text-yellow-600">DEGRADED</p>
              <p className="text-lg sm:text-2xl font-bold text-yellow-700">
                {logs.filter(l => l.status === "DEGRADED").length}
              </p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4">
              <p className="text-[10px] sm:text-xs text-red-600">DOWN</p>
              <p className="text-lg sm:text-2xl font-bold text-red-700">
                {logs.filter(l => l.status === "DOWN").length}
              </p>
            </div>
          </div>
        </div>

        {/* Logs List */}
        <div className="max-w-7xl mx-auto">
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center bg-gray-50 border border-gray-200 rounded-xl">
              <Activity className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1">No logs found</h3>
              <p className="text-xs sm:text-sm text-gray-500">No logs available for this service</p>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {logs.map((log) => {
                const statusStyles = getStatusStyles(log.status);
                return (
                  <div
                    key={log.id}
                    className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div className={`w-2 h-2 rounded-full ${statusStyles.dot} flex-shrink-0`} />
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                            <span className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                              {log.serviceName || `Service ${serviceId}`}
                            </span>
                            <span className={`px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium rounded-full border ${statusStyles.bg} ${statusStyles.text} ${statusStyles.border}`}>
                              {log.status || "UNKNOWN"}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-0.5 text-[10px] sm:text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              {formatTime(log.checkedAt)}
                            </span>
                            <span className="text-gray-300 hidden xs:inline">•</span>
                            <span>Response: {log.responseTimeMs}ms</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 self-start sm:self-auto">
                        <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full ${statusStyles.bg} ${statusStyles.text} border ${statusStyles.border}`}>
                          {log.status}
                        </span>
                      </div>
                    </div>

                    {log.errorMessage && (
                      <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-200">
                        <div className="flex items-start gap-1.5 sm:gap-2 text-xs sm:text-sm text-red-600 bg-red-50 p-2 sm:p-3 rounded-lg border border-red-200">
                          <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5" />
                          <span className="break-words">{log.errorMessage}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="max-w-7xl mx-auto mt-6 sm:mt-8 pt-3 sm:pt-4 border-t border-gray-200">
          <div className="flex flex-col xs:flex-row items-center justify-between gap-2 text-[10px] sm:text-xs text-gray-400">
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {logs.filter(l => l.status === "UP").length} Up
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                {logs.filter(l => l.status === "DEGRADED").length} Degraded
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {logs.filter(l => l.status === "DOWN").length} Down
              </span>
            </div>
            <span>Showing latest {logs.length} logs</span>
          </div>
        </div>

      </div>
    </div>
  );
}