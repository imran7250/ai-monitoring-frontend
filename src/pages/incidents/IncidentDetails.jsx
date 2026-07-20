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
      icon: AlertTriangle, 
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-gray-200 border-t-gray-700 rounded-full animate-spin mx-auto mb-3 sm:mb-4" />
          <p className="text-gray-500 text-xs sm:text-sm">Loading incident details...</p>
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
    <div className="min-h-screen bg-white">

      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-3 sm:px-4 md:px-6 py-3 sm:py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 sm:gap-3">
          <button
            onClick={() => navigate("/incidents")}
            className="flex items-center gap-1.5 sm:gap-2 text-gray-500 hover:text-gray-900 transition-colors text-xs sm:text-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Back to Incidents</span>
            <span className="xs:hidden">Back</span>
          </button>
          
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className={`px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium rounded-full border ${config.bg} ${config.border} ${config.text}`}>
              {config.label}
            </span>
            <span className="text-xs sm:text-sm text-gray-500 font-mono">
              #{incident.id}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">

        {/* Hero Banner */}
        <div className={`relative overflow-hidden border rounded-xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 md:mb-8 ${config.bg} ${config.border}`}>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
            
            {/* Left side - Icon + Title */}
            <div className="flex items-start gap-3 sm:gap-4">
              <div className={`p-2 sm:p-3 rounded-xl ${config.bg} border ${config.border} flex-shrink-0`}>
                <SeverityIcon className={`w-5 h-5 sm:w-6 sm:h-6 ${config.text}`} />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 truncate">
                  Incident #{incident.id}
                </h1>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 mt-1 sm:mt-2">
                  <span className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
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
                <p className="text-[10px] sm:text-xs text-gray-500">Duration</p>
                <p className="text-base sm:text-lg font-semibold text-gray-900">
                  {getDuration(incident.startedAt, incident.resolvedAt)}
                </p>
              </div>
              <div className="w-px h-8 sm:h-10 bg-gray-200" />
              <div className="text-right">
                <p className="text-[10px] sm:text-xs text-gray-500">Status</p>
                <p className={`text-base sm:text-lg font-semibold ${incident.status === "RESOLVED" ? "text-emerald-600" : config.text}`}>
                  {incident.status}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-5 md:space-y-6">

          {/* Root Cause */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 md:p-6 shadow-sm">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
              Root Cause Analysis
            </h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4">
              <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">
                {incident.reason || "No root cause analysis available"}
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 md:p-6 shadow-sm">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
              Incident Timeline
            </h2>
            <div className="space-y-3 sm:space-y-4">
              
              {/* Started Event */}
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-2.5 sm:p-3">
                  <p className="text-xs sm:text-sm text-gray-700">Incident started</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">
                    {formatDate(incident.startedAt)}
                  </p>
                </div>
              </div>

              {/* Resolved Event - if resolved */}
              {incident.resolvedAt && (
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                  <div className="flex-1 bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 sm:p-3">
                    <p className="text-xs sm:text-sm text-emerald-700">Incident resolved</p>
                    <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">
                      {formatDate(incident.resolvedAt)}
                    </p>
                  </div>
                </div>
              )}

              {/* Acknowledged Event - if acknowledged but not resolved */}
              {incident.status === "ACKNOWLEDGED" && !incident.resolvedAt && (
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 flex-shrink-0" />
                  <div className="flex-1 bg-yellow-50 border border-yellow-200 rounded-lg p-2.5 sm:p-3">
                    <p className="text-xs sm:text-sm text-yellow-700">Incident acknowledged</p>
                    <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">
                      Being investigated
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Resolve Button - only for ACKNOWLEDGED */}
          {isAcknowledged && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 md:p-6 shadow-sm">
              <h2 className="text-xs sm:text-sm font-medium text-gray-500 mb-3 sm:mb-4">Actions</h2>
              <button
                onClick={resolveIncident}
                disabled={resolving}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 disabled:cursor-not-allowed py-2.5 sm:py-3 px-4 rounded-lg text-white font-medium text-sm sm:text-base transition-all active:scale-95"
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