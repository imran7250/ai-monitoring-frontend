// D:\Ai_Monitoring_Platform\ai-monitoring-ui\src\pages\anomalies\Anomalies.jsx

import { useEffect, useState } from "react";
import { api } from "../../api/client";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowRight, Zap, Activity, Clock } from "lucide-react";
import { formatTime } from "../../utils/dateUtils";
import PageHeader from "../../components/ui/PageHeader";

export default function Anomalies() {
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/anomalies/latest");
      setAnomalies(res.data || []);
    } catch (err) {
      console.error("Failed loading anomalies", err);
    } finally {
      setLoading(false);
    }
  };

  const getSeverity = (score) => {
    if (!score) return { label: "LOW", color: "bg-yellow-50 text-yellow-700 border-yellow-200", dot: "bg-yellow-500" };
    if (score > 10) return { label: "CRITICAL", color: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500" };
    if (score > 5) return { label: "HIGH", color: "bg-orange-50 text-orange-700 border-orange-200", dot: "bg-orange-500" };
    return { label: "LOW", color: "bg-yellow-50 text-yellow-700 border-yellow-200", dot: "bg-yellow-500" };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-gray-200 border-t-gray-700 rounded-full animate-spin mx-auto mb-3 sm:mb-4" />
          <p className="text-gray-500 text-xs sm:text-sm">Loading anomalies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">

      {/* ✅ PageHeader with Back Button */}
      <PageHeader title="Anomalies" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* Header with title, subtitle, and live status */}
        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-3 bg-purple-50 rounded-xl border border-purple-200 flex-shrink-0">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">AI Anomaly Events</h1>
              <p className="text-sm text-gray-500">Real-time anomaly detection powered by AI</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs text-emerald-700 font-medium">Live</span>
            </span>
            <span className="text-sm text-gray-400">
              {anomalies.length} anomalies
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto">
          {anomalies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20 text-center bg-gray-50 border border-gray-200 rounded-2xl">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <Activity className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">No Anomalies Detected</h2>
              <p className="text-xs sm:text-sm text-gray-500">All systems are operating within normal parameters</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {anomalies.map((a) => {
                const severity = getSeverity(a.deviationScore);
                const SeverityIcon = severity.label === "CRITICAL" ? AlertTriangle : 
                                    severity.label === "HIGH" ? AlertTriangle : 
                                    Activity;

                return (
                  <div
                    key={`${a.serviceId}-${a.metricName}-${a.detectedAt}`}
                    className="group bg-white border border-gray-200 rounded-xl p-4 sm:p-5 md:p-6 hover:border-purple-300 hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
                      
                      {/* LEFT SIDE - Service Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 sm:gap-3 mb-1">
                          <div className={`w-2 h-2 rounded-full ${severity.dot} flex-shrink-0`} />
                          <span className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Service
                          </span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 truncate">
                            {a.serviceName || `Service ${a.serviceId}`}
                          </span>
                          <span className={`px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium rounded-full border ${severity.color} flex-shrink-0`}>
                            {severity.label}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1 text-xs sm:text-sm text-gray-500">
                          <span>
                            Metric: <span className="font-medium text-gray-700">{a.metricName}</span>
                          </span>
                          <span className="w-px h-3 bg-gray-300 hidden xs:inline" />
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            {formatTime(a.detectedAt)}
                          </span>
                        </div>
                      </div>

                      {/* CENTER - Deviation Score */}
                      <div className="flex items-center gap-4 sm:gap-6 md:gap-8 flex-shrink-0">
                        <div className="text-center min-w-[70px] sm:min-w-[80px]">
                          <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">
                            Deviation
                          </div>
                          <div className="text-xl sm:text-2xl font-bold text-gray-900">
                            {a.deviationScore ? a.deviationScore.toFixed(2) : "0.00"}σ
                          </div>
                        </div>
                      </div>

                      {/* RIGHT SIDE - Action Button */}
                      <div className="flex-shrink-0">
                        <button
                          onClick={() => navigate(`/services/${a.serviceId}`)}
                          className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm text-white transition-all shadow-sm hover:shadow-md active:scale-95 w-full sm:w-auto justify-center"
                        >
                          Investigate
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

        {/* Footer */}
        <div className="max-w-7xl mx-auto mt-6 sm:mt-8 pt-3 sm:pt-4 border-t border-gray-200">
          <div className="flex flex-col xs:flex-row items-center justify-between gap-2 text-[10px] sm:text-xs text-gray-400">
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                Critical
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                High
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                Low
              </span>
            </div>
            <span>Showing {anomalies.length} anomalies</span>
          </div>
        </div>

      </div>
    </div>
  );
}