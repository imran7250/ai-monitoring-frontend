// D:\Ai_Monitoring_Platform\ai-monitoring-ui\src\pages\incidents\IncidentDetails.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../api/client";
import {
  AlertTriangle, Clock, CheckCircle, XCircle,
  Activity, Calendar, ArrowLeft,
} from "lucide-react";
import { formatDate, getDuration } from "../../utils/dateUtils";
import { usePageTitle } from "../../hooks/usePageTitle";

export default function IncidentDetails() {
  const { incidentId } = useParams();
  const navigate = useNavigate();
  usePageTitle("Incident Details");

  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    loadIncident();
  }, [incidentId]);

  const loadIncident = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/incidents/${incidentId}`);
      setIncident(res.data);
    } catch (e) {
      console.error("Incident details load failed", e);
    } finally {
      setLoading(false);
    }
  };

  const getSeverity = () => {
    if (!incident) return "LOW";
    if (incident.status === "DOWN") return "CRITICAL";
    if (incident.status === "DEGRADED") return "HIGH";
    return "LOW";
  };

  const severityConfig = {
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
      icon: AlertTriangle, 
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

  const resolveIncident = async () => {
    setResolving(true);
    try {
      await api.put(`/api/incidents/${incidentId}/resolve`);
      await loadIncident();
    } catch {
      alert("Failed to resolve incident");
    } finally {
      setResolving(false);
    }
  };

  // ✅ Responsive loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-3 sm:mb-4" />
          <p className="text-slate-400 text-xs sm:text-sm">Loading incident details...</p>
        </div>
      </div>
    );
  }

  if (!incident) return null;

  const severity = getSeverity();
  const config = severityConfig[severity];
  const SeverityIcon = config.icon;
  const isAcknowledged = incident.status === "ACKNOWLEDGED";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">

      {/* ✅ Responsive Header */}
      <div className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 px-3 sm:px-4 md:px-6 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 sm:gap-3">
          <button
            onClick={() => navigate("/incidents")}
            className="flex items-center gap-1.5 sm:gap-2 text-slate-400 hover:text-white transition-colors text-xs sm:text-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Back to Incidents</span>
            <span className="xs:hidden">Back</span>
          </button>
          
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className={`px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium rounded-full border ${config.bg} ${config.border} ${config.text}`}>
              {config.label}
            </span>
            <span className="text-xs sm:text-sm text-slate-400 font-mono">
              #{incident.id}
            </span>
          </div>
        </div>
      </div>

      {/* ✅ Responsive Content */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">

        {/* ✅ Hero Banner - Responsive */}
        <div className={`relative overflow-hidden border rounded-xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 md:mb-8 ${config.bg} ${config.border}`}>
          
          {/* Mobile: Stacked layout, Desktop: Row layout */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
            
            {/* Left side - Icon + Title */}
            <div className="flex items-start gap-3 sm:gap-4">
              <div className={`p-2 sm:p-3 rounded-xl ${config.bg} border ${config.border} flex-shrink-0`}>
                <SeverityIcon className={`w-5 h-5 sm:w-6 sm:h-6 ${config.text}`} />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white truncate">
                  Incident #{incident.id}
                </h1>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 mt-1 sm:mt-2">
                  <span className="flex items-center gap-1 text-xs sm:text-sm text-slate-400">
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="truncate max-w-[120px] sm:max-w-[200px]">
                      {formatDate(incident.startedAt)}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right side - Duration + Status */}
            <div className="flex items-center gap-3 sm:gap-4 pl-12 sm:pl-14 md:pl-0">
              <div className="text-right">
                <p className="text-[10px] sm:text-xs text-slate-400">Duration</p>
                <p className="text-base sm:text-lg font-semibold text-white">
                  {getDuration(incident.startedAt, incident.resolvedAt)}
                </p>
              </div>
              <div className="w-px h-8 sm:h-10 bg-slate-700" />
              <div className="text-right">
                <p className="text-[10px] sm:text-xs text-slate-400">Status</p>
                <p className={`text-base sm:text-lg font-semibold ${incident.status === "RESOLVED" ? "text-emerald-400" : config.text}`}>
                  {incident.status}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-5 md:space-y-6">

          {/* ✅ Root Cause - Responsive */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 sm:p-5 md:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
              Root Cause Analysis
            </h2>
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-3 sm:p-4">
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed break-words">
                {incident.reason || "No root cause analysis available"}
              </p>
            </div>
          </div>

          {/* ✅ Timeline - Responsive */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 sm:p-5 md:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
              Incident Timeline
            </h2>
            <div className="space-y-3 sm:space-y-4">
              
              {/* Started Event */}
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                <div className="flex-1 bg-slate-800/30 border border-slate-700 rounded-lg p-2.5 sm:p-3">
                  <p className="text-xs sm:text-sm text-slate-300">Incident started</p>
                  <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">
                    {formatDate(incident.startedAt)}
                  </p>
                </div>
              </div>

              {/* Resolved Event - if resolved */}
              {incident.resolvedAt && (
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                  <div className="flex-1 bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-2.5 sm:p-3">
                    <p className="text-xs sm:text-sm text-emerald-400">Incident resolved</p>
                    <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">
                      {formatDate(incident.resolvedAt)}
                    </p>
                  </div>
                </div>
              )}

              {/* Acknowledged Event - if acknowledged but not resolved */}
              {incident.status === "ACKNOWLEDGED" && !incident.resolvedAt && (
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-2 flex-shrink-0" />
                  <div className="flex-1 bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-2.5 sm:p-3">
                    <p className="text-xs sm:text-sm text-yellow-400">Incident acknowledged</p>
                    <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">
                      Being investigated
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* ✅ Resolve Button - Responsive (only for ACKNOWLEDGED) */}
          {isAcknowledged && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 sm:p-5 md:p-6">
              <h2 className="text-xs sm:text-sm font-medium text-slate-400 mb-3 sm:mb-4">Actions</h2>
              <button
                onClick={resolveIncident}
                disabled={resolving}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800/50 disabled:cursor-not-allowed py-2.5 sm:py-3 px-4 rounded-lg text-white font-medium text-sm sm:text-base transition-all active:scale-95"
              >
                {resolving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Resolving...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Resolve Incident</span>
                  </>
                )}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}