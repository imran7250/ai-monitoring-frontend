// D:\Ai_Monitoring_Platform\ai-monitoring-ui\src\pages\incidents\Incidents.jsx

import { useEffect, useState } from "react";
import { api } from "../../api/client";
import { useNavigate } from "react-router-dom";
import { getDuration, formatDate } from "../../utils/dateUtils";
import {
  AlertTriangle, Clock, CheckCircle, XCircle,
  AlertCircle, Activity, ArrowRight, RefreshCw
} from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";

export default function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  // Centralized data loading
  const loadIncidents = async () => {
    try {
      const res = await api.get("/api/incidents/open");
      setIncidents(res.data || []);
    } catch (e) {
      console.error("Failed loading incidents", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load & auto-refresh
  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      if (!isMounted) return;
      await loadIncidents();
    };

    load();
    const interval = setInterval(loadIncidents, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Manual refresh
  const handleRefresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    loadIncidents();
  };

  const getSeverity = (status) => {
    if (status === "DOWN") return "CRITICAL";
    if (status === "DEGRADED") return "HIGH";
    return "LOW";
  };

  const getSeverityConfig = (severity) => {
    const configs = {
      CRITICAL: { 
        bg: "bg-red-50", 
        border: "border-red-200", 
        text: "text-red-700", 
        icon: XCircle, 
        label: "Critical",
        dot: "bg-red-500"
      },
      HIGH: { 
        bg: "bg-orange-50", 
        border: "border-orange-200", 
        text: "text-orange-700", 
        icon: AlertCircle, 
        label: "High",
        dot: "bg-orange-500"
      },
      LOW: { 
        bg: "bg-blue-50", 
        border: "border-blue-200", 
        text: "text-blue-700", 
        icon: Activity, 
        label: "Low",
        dot: "bg-blue-500"
      },
    };
    return configs[severity] || configs.LOW;
  };

  const acknowledgeIncident = async (incidentId, e) => {
    e.stopPropagation();
    try {
      await api.put(`/api/incidents/${incidentId}/acknowledge`);
      setIncidents(prev =>
        prev.map(i =>
          i.incidentId === incidentId
            ? { ...i, status: "ACKNOWLEDGED" }
            : i
        )
      );
    } catch (err) {
      console.error("Acknowledge failed", err);
    }
  };

  const resolveIncident = async (incidentId, e) => {
    e.stopPropagation();
    try {
      await api.put(`/api/incidents/${incidentId}/resolve`);
      setIncidents(prev =>
        prev.filter(i => i.incidentId !== incidentId)
      );
    } catch (err) {
      console.error("Resolve failed", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-gray-200 border-t-gray-700 rounded-full animate-spin mx-auto mb-3 sm:mb-4" />
          <p className="text-gray-500 text-xs sm:text-sm">Loading incidents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">

      {/* ✅ PageHeader with Back Button */}
      <PageHeader title="Incidents" />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">

        {/* Header with title, count, and refresh */}
        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg border border-red-200 flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Active Incidents</h1>
              <p className="text-sm text-gray-500">
                {incidents.length} active incident{incidents.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            <span className="hidden xs:inline">{refreshing ? "Refreshing..." : "Refresh"}</span>
            <span className="xs:hidden">{refreshing ? "..." : "⟳"}</span>
          </button>
        </div>

        {/* Empty State */}
        {incidents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-3 sm:mb-4 border border-emerald-200">
              <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
              No Active Incidents
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm">
              All services are operating normally.
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {incidents.map((incident) => {
              const severity = getSeverity(incident.status);
              const config = getSeverityConfig(severity);
              const SeverityIcon = config.icon;

              return (
                <div
                  key={incident.incidentId}
                  className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 hover:shadow-md transition-all"
                >
                  {/* Status bar - colored left border */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${config.dot}`} />

                  <div className="pl-3 sm:pl-4 pr-4 sm:pr-5 md:pr-6 py-4 sm:py-5 md:py-6">
                    
                    {/* Header */}
                    <div className="flex flex-col xs:flex-row xs:items-start justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div className={`p-1.5 sm:p-2 rounded-lg ${config.bg} border ${config.border} flex-shrink-0`}>
                          <SeverityIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${config.text}`} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                            <span className="text-sm sm:text-base font-semibold text-gray-900 truncate max-w-[120px] xs:max-w-[180px] sm:max-w-[250px] md:max-w-[350px]">
                              {incident.serviceName || `Service #${incident.serviceId}`}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 mt-0.5 text-[10px] sm:text-xs text-gray-500">
                            <span>Incident #{incident.incidentId}</span>
                            <span className="hidden xs:inline">•</span>
                            <span className="truncate max-w-[80px] xs:max-w-[150px] sm:max-w-none">
                              {formatDate(incident.startedAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className={`px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium rounded-full border whitespace-nowrap self-start ${config.bg} ${config.border} ${config.text}`}>
                        {incident.status}
                      </span>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <div className="bg-gray-50 rounded-lg p-2 sm:p-3 border border-gray-200">
                        <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">Duration</p>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                          <span className="text-xs sm:text-sm font-medium text-gray-900">
                            {getDuration(incident.startedAt)}
                          </span>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2 sm:p-3 border border-gray-200 xs:col-span-2">
                        <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">Root Cause</p>
                        <p className="text-xs sm:text-sm text-gray-700 line-clamp-1 sm:line-clamp-2">
                          {incident.reason || "No reason provided"}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-2 sm:gap-3 pt-2 sm:pt-3 border-t border-gray-200">
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {incident.status === "OPEN" && (
                          <button
                            onClick={(e) => acknowledgeIncident(incident.incidentId, e)}
                            className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-[10px] sm:text-sm transition-all active:scale-95 flex-1 xs:flex-none"
                          >
                            <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span className="hidden xs:inline">Acknowledge</span>
                            <span className="xs:hidden">Ack</span>
                          </button>
                        )}
                        <button
                          disabled={incident.status !== "ACKNOWLEDGED"}
                          onClick={(e) => resolveIncident(incident.incidentId, e)}
                          className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-sm text-white transition-all active:scale-95 flex-1 xs:flex-none
                            ${incident.status !== "ACKNOWLEDGED"
                              ? "bg-gray-300 cursor-not-allowed text-gray-500"
                              : "bg-emerald-600 hover:bg-emerald-700"}`}
                        >
                          <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span>Resolve</span>
                        </button>
                      </div>
                      
                      <button
                        onClick={() => navigate(`/incidents/${incident.incidentId}`)}
                        className="flex items-center justify-center gap-1 text-[10px] sm:text-sm text-gray-500 hover:text-gray-900 transition-colors py-1.5 sm:py-2 px-2 sm:px-3 hover:bg-gray-100 rounded-lg"
                      >
                        <span className="hidden xs:inline">View Details</span>
                        <span className="xs:hidden">Details</span>
                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );    
}   