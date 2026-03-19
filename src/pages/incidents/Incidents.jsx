import { useEffect, useState } from "react";
import { api } from "../../api/client";
import { useNavigate } from "react-router-dom";
import { getDuration, formatDate } from "../../utils/dateUtils";
import {
  AlertTriangle, Clock, CheckCircle, XCircle,
  AlertCircle, Activity, ArrowRight, RefreshCw
} from "lucide-react";

// ✅ FIX #8 — Memory leak fixed with isMounted flag
// Before: setInterval kept calling setState after component unmounted
// After:  isMounted flag ensures setState is never called after unmount

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
        // ✅ Only update state if component is still mounted
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

    // ✅ Cleanup: set isMounted false AND clear interval on unmount
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
    // ✅ FIX — update local state immediately, no full reload needed
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
    // ✅ FIX — remove resolved incident from active list
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
      CRITICAL: { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-400", icon: XCircle, label: "Critical" },
      HIGH: { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-400", icon: AlertCircle, label: "High" },
      LOW: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400", icon: Activity, label: "Low" },
    };
    return configs[severity] || configs.LOW;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Loading incidents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">

      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">Active Incidents</h1>
              <p className="text-xs text-slate-400">
                Auto-refresh every 5s • {incidents.length} active
              </p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {incidents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-emerald-400" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">No Active Incidents</h2>
            <p className="text-slate-400 text-sm">All services are operating normally.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {incidents.map((incident) => {
              const severity = getSeverity(incident.status);
              const config = getSeverityConfig(severity);
              const SeverityIcon = config.icon;

              return (
                <div
                  key={incident.incidentId}
                  className="group relative bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all"
                >
                  <div className="p-6">

                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${config.bg}`}>
                          <SeverityIcon className={`w-5 h-5 ${config.text}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-white">
                              {incident.serviceName || `Service #${incident.serviceId}`}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                            <span>Incident #{incident.incidentId}</span>
                            <span>•</span>
                            <span>{formatDate(incident.startedAt)}</span>
                          </div>
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full border ${config.bg} ${config.border} ${config.text}`}>
                        {incident.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                      <div className="bg-slate-800/30 rounded-lg p-3">
                        <p className="text-xs text-slate-500 mb-1">Duration</p>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span className="text-sm font-medium text-white">
                            {getDuration(incident.startedAt)}
                          </span>
                        </div>
                      </div>
                      <div className="bg-slate-800/30 rounded-lg p-3 md:col-span-2">
                        <p className="text-xs text-slate-500 mb-1">Root Cause</p>
                        <p className="text-sm text-slate-300 line-clamp-1">{incident.reason}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                      <div className="flex gap-2">
                        {incident.status === "OPEN" && (
                          <button
                            onClick={(e) => acknowledgeIncident(incident.incidentId, e)}
                            className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm"
                          >
                            <AlertTriangle className="w-4 h-4" />
                            Acknowledge
                          </button>
                        )}
                        <button
                          disabled={incident.status !== "ACKNOWLEDGED"}
                          onClick={(e) => resolveIncident(incident.incidentId, e)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white
                            ${incident.status !== "ACKNOWLEDGED"
                              ? "bg-slate-700 cursor-not-allowed"
                              : "bg-emerald-600 hover:bg-emerald-700"}`}
                        >
                          <CheckCircle className="w-4 h-4" />
                          Resolve
                        </button>
                      </div>
                      <button
                        onClick={() => navigate(`/incidents/${incident.incidentId}`)}
                        className="flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-4 h-4" />
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

