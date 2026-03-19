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
    CRITICAL: { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-400", icon: XCircle, label: "Critical" },
    HIGH: { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-400", icon: AlertTriangle, label: "High" },
    LOW: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400", icon: Activity, label: "Low" },
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
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Loading incident details...</p>
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

      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate("/incidents")}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Incidents</span>
          </button>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${config.bg} ${config.border} ${config.text}`}>
              {config.label}
            </span>
            <span className="text-sm text-slate-400">#{incident.id}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Hero Banner */}
        <div className={`relative overflow-hidden border rounded-xl p-6 mb-8 ${config.bg} ${config.border}`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${config.bg} border ${config.border}`}>
                <SeverityIcon className={`w-6 h-6 ${config.text}`} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Incident #{incident.id}
                </h1>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <span className="flex items-center gap-1 text-sm text-slate-400">
                    <Calendar className="w-4 h-4" />
                    {/* ✅ Using dateUtils */}
                    {formatDate(incident.startedAt)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-slate-400">Duration</p>
                <p className="text-lg font-semibold text-white">
                  {/* ✅ Using dateUtils */}
                  {getDuration(incident.startedAt, incident.resolvedAt)}
                </p>
              </div>
              <div className="w-px h-10 bg-slate-700" />
              <div className="text-right">
                <p className="text-xs text-slate-400">Status</p>
                <p className={`text-lg font-semibold ${incident.status === "RESOLVED" ? "text-emerald-400" : config.text}`}>
                  {incident.status}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">

          {/* Root Cause */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-slate-400" />
              Root Cause Analysis
            </h2>
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <p className="text-slate-300 text-sm leading-relaxed">{incident.reason}</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-400" />
              Incident Timeline
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2" />
                <div className="flex-1 bg-slate-800/30 border border-slate-700 rounded-lg p-3">
                  <p className="text-sm text-slate-300">Incident started</p>
                  <p className="text-xs text-slate-500 mt-1">{formatDate(incident.startedAt)}</p>
                </div>
              </div>

              {incident.resolvedAt && (
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2" />
                  <div className="flex-1 bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3">
                    <p className="text-sm text-emerald-400">Incident resolved</p>
                    <p className="text-xs text-slate-500 mt-1">{formatDate(incident.resolvedAt)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Resolve button — only shown for ACKNOWLEDGED incidents */}
          {isAcknowledged && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h2 className="text-sm font-medium text-slate-400 mb-4">Actions</h2>
              <button
                onClick={resolveIncident}
                disabled={resolving}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800/50 disabled:cursor-not-allowed py-3 px-4 rounded-lg text-white font-medium transition-all active:scale-95"
              >
                {resolving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Resolving...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
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

