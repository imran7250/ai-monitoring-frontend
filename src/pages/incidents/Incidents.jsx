// D:\Ai_Monitoring_Platform\ai-monitoring-ui\src\pages\incidents\Incidents.jsx

import { useEffect, useState } from "react";
import { api } from "../../api/client";
import { useNavigate } from "react-router-dom";
import { getDuration, formatDate } from "../../utils/dateUtils";
import {
  AlertTriangle, Clock, CheckCircle, XCircle,
  AlertCircle, Activity, ArrowRight, RefreshCw
} from "lucide-react";

export default function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const loadIncidents = async () => {
      try {
        const res = await api.get("/api/incidents/open");
        if (isMounted) setIncidents(res.data || []);
      } catch (e) {
        console.error("Failed loading incidents", e);
      } finally {
        if (isMounted) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    };

    loadIncidents();
    const interval = setInterval(loadIncidents, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
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

  const getSeverity = (status) => {
    if (status === "DOWN") return "CRITICAL";
    if (status === "DEGRADED") return "HIGH";
    return "LOW";
  };

  const getSeverityConfig = (severity) => {
    const configs = {
      CRITICAL: { 
        bg: "bg-red-500/10", 
        border: "border-red-500/30", 
        text: "text-red-400", 
        icon: XCircle, 
        label: "Critical" 
      },
      HIGH: { 
        bg: "bg-orange-500/10", 
        border: "border-orange-500/30", 
        text: "text-orange-400", 
        icon: AlertCircle, 
        label: "High" 
      },
      LOW: { 
        bg: "bg-blue-500/10", 
        border: "border-blue-500/30", 
        text: "text-blue-400", 
        icon: Activity, 
        label: "Low" 
      },
    };
    return configs[severity] || configs.LOW;
  };

  // ✅ Responsive loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-3 sm:mb-4" />
          <p className="text-slate-400 text-xs sm:text-sm">Loading incidents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">

      {/* ✅ Responsive Header */}
      <div className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 px-3 sm:px-4 md:px-6 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="p-1.5 sm:p-2 bg-red-500/10 rounded-lg flex-shrink-0">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg md:text-xl font-semibold text-white truncate">
                Active Incidents
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-400 truncate">
                Auto-refresh 5s • {incidents.length} active
              </p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-1.5 sm:p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all flex-shrink-0"
            aria-label="Refresh incidents"
          >
            <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${refreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* ✅ Responsive Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        
        {/* Empty State - Responsive */}
        {incidents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-3 sm:mb-4">
              <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-1 sm:mb-2">
              No Active Incidents
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              All services are operating normally.
            </p>
          </div>
        ) : (
          /* ✅ Incident Cards - Responsive */
          <div className="space-y-3 sm:space-y-4">
            {incidents.map((incident) => {
              const severity = getSeverity(incident.status);
              const config = getSeverityConfig(severity);
              const SeverityIcon = config.icon;

              return (
                <div
                  key={incident.incidentId}
                  className="group relative bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all"
                >
                  <div className="p-4 sm:p-5 md:p-6">
                    
                    {/* ✅ Header - Responsive */}
                    <div className="flex flex-col xs:flex-row xs:items-start justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div className={`p-1.5 sm:p-2 rounded-lg ${config.bg} flex-shrink-0`}>
                          <SeverityIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${config.text}`} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                            <span className="text-sm sm:text-base font-semibold text-white truncate max-w-[120px] xs:max-w-[180px] sm:max-w-[250px] md:max-w-[350px]">
                              {incident.serviceName || `Service #${incident.serviceId}`}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 mt-0.5 text-[10px] sm:text-xs text-slate-500">
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

                    {/* ✅ Details Grid - Responsive */}
                    <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <div className="bg-slate-800/30 rounded-lg p-2 sm:p-3">
                        <p className="text-[10px] sm:text-xs text-slate-500 mb-0.5 sm:mb-1">Duration</p>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
                          <span className="text-xs sm:text-sm font-medium text-white">
                            {getDuration(incident.startedAt)}
                          </span>
                        </div>
                      </div>
                      <div className="bg-slate-800/30 rounded-lg p-2 sm:p-3 xs:col-span-2">
                        <p className="text-[10px] sm:text-xs text-slate-500 mb-0.5 sm:mb-1">Root Cause</p>
                        <p className="text-xs sm:text-sm text-slate-300 line-clamp-1 sm:line-clamp-2">
                          {incident.reason || "No reason provided"}
                        </p>
                      </div>
                    </div>

                    {/* ✅ Actions - Responsive */}
                    <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-2 sm:gap-3 pt-2 sm:pt-3 border-t border-slate-800">
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
                              ? "bg-slate-700 cursor-not-allowed opacity-50"
                              : "bg-emerald-600 hover:bg-emerald-700"}`}
                        >
                          <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span>Resolve</span>
                        </button>
                      </div>
                      
                      <button
                        onClick={() => navigate(`/incidents/${incident.incidentId}`)}
                        className="flex items-center justify-center gap-1 text-[10px] sm:text-sm text-slate-400 hover:text-white transition-colors py-1.5 sm:py-2 px-2 sm:px-3 hover:bg-slate-800/50 rounded-lg"
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