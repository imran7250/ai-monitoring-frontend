// D:\Ai_Monitoring_Platform\ai-monitoring-ui\src\pages\services\Services.jsx

import { useEffect, useState, useCallback, useRef } from "react";
import { api } from "../../api/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import EmptyCard from "../../components/ui/EmptyCard";
import PageHeader from "../../components/ui/PageHeader";
import {
  Server, Activity, Globe, Cpu, CheckCircle, AlertCircle,
  XCircle, Clock, Link as LinkIcon, Zap, Trash2, Filter,
  RefreshCw, Wifi, WifiOff, AlertTriangle,
} from "lucide-react";
import { colorMap, getStatusInfo, getTypeIcon } from "../../utils/serviceUtils";
import { formatRelativeTime } from "../../utils/dateUtils";
import { usePageTitle } from "../../hooks/usePageTitle";
import { useTimeAgo } from "../../hooks/useTimeAgo";

export default function Services() {
  usePageTitle("Services");

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const intervalRef = useRef(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get("status");
  const anomalyFilter = searchParams.get("anomaly");

  const timeAgo = useTimeAgo(lastRefreshed);

  const getStatusIcon = (status) => {
    switch (status) {
      case "UP": return Wifi;
      case "DOWN": return WifiOff;
      case "DEGRADED": return AlertTriangle;
      default: return Activity;
    }
  };

  const loadServices = useCallback(async () => {
    try {
      setError(null);
      setRefreshing(true);
      const res = await api.get("/api/services");
      const servicesData = res.data || [];

      const updated = await Promise.all(
        servicesData.map(async (service) => {
          try {
            const aiRes = await api.get(`/api/anomalies/service/${service.id}/status`);
            return { ...service, aiStatus: aiRes.data };
          } catch {
            return { ...service, aiStatus: null };
          }
        })
      );

      setServices(updated);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error("Failed loading services:", err);
      setError("Failed to load services");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadServices();
    intervalRef.current = setInterval(loadServices, 30000);

    const handleVisibility = () => {
      if (document.hidden) {
        clearInterval(intervalRef.current);
      } else {
        loadServices();
        intervalRef.current = setInterval(loadServices, 30000);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(intervalRef.current);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [loadServices]);

  const deleteService = async () => {
    if (!serviceToDelete) return;
    const toastId = toast.loading("Deleting service...");
    try {
      await api.delete(`/api/services/${serviceToDelete}`);
      setServices((prev) => prev.filter((s) => s.id !== serviceToDelete));
      setServiceToDelete(null);
      toast.success("Service deleted successfully", { id: toastId });
    } catch (err) {
      toast.error("Failed to delete service", { id: toastId });
    }
  };

  const counts = {
    total: services.length,
    up: services.filter((s) => s.status === "UP").length,
    down: services.filter((s) => s.status === "DOWN").length,
    degraded: services.filter((s) => s.status === "DEGRADED").length,
    anomaly: services.filter((s) => s.aiStatus?.hasAnomaly).length,
  };

  let filteredServices = services;
  if (statusFilter) filteredServices = filteredServices.filter((s) => s.status === statusFilter);
  if (anomalyFilter === "true") filteredServices = filteredServices.filter((s) => s.aiStatus?.hasAnomaly);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-gray-200 border-t-gray-700 rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 text-xs sm:text-sm mt-3 sm:mt-4">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ✅ PageHeader with Back Button */}
      <PageHeader title="Services" />

      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">

        {/* Header - Removed the standalone header since PageHeader now handles it */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-3 bg-gray-100 rounded-xl border border-gray-200 flex-shrink-0">
              <Server className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Services</h1>
              <p className="text-xs sm:text-sm text-gray-500 truncate">Monitor your services in real-time</p>
            </div>
          </div>
          <button
            onClick={loadServices}
            disabled={refreshing}
            aria-label="Refresh services"
            className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs sm:text-sm text-gray-700 hover:text-gray-900 transition-all disabled:opacity-50 flex-shrink-0 self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${refreshing ? "animate-spin" : ""}`} />
            <span className="hidden xs:inline">{refreshing ? "Refreshing..." : "Refresh"}</span>
            <span className="xs:hidden">{refreshing ? "..." : "⟳"}</span>
          </button>
        </div>

        {/* Stats - White Theme */}
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8">
          {[
            { label: "Total", value: counts.total, color: "text-gray-900" },
            { label: "Up", value: counts.up, color: "text-emerald-600" },
            { label: "Degraded", value: counts.degraded, color: "text-yellow-600" },
            { label: "Down", value: counts.down, color: "text-red-600" },
            { label: "AI Alerts", value: counts.anomaly, color: "text-purple-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-gray-50 border border-gray-200 rounded-xl p-2 sm:p-3 md:p-4">
              <p className={`text-[10px] sm:text-xs ${color}`}>{label}</p>
              <p className={`text-lg sm:text-xl md:text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Filters - White Theme */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
            <span className="text-xs sm:text-sm text-gray-400">Filter:</span>
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {[
              { path: "/services", label: "All", active: !statusFilter && !anomalyFilter },
              { path: "/services?status=UP", label: "Up", active: statusFilter === "UP" },
              { path: "/services?status=DEGRADED", label: "Degraded", active: statusFilter === "DEGRADED" },
              { path: "/services?status=DOWN", label: "Down", active: statusFilter === "DOWN" },
              { path: "/services?anomaly=true", label: "AI Alerts", active: anomalyFilter === "true" },
            ].map(({ path, label, active }) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                className={`px-2.5 sm:px-4 py-1 sm:py-2 rounded-lg text-[10px] sm:text-xs md:text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-gray-400 whitespace-nowrap ${
                  active
                    ? "bg-gray-200 text-gray-900 border border-gray-300"
                    : "bg-gray-50 text-gray-500 hover:text-gray-900 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {label}
              </button>
            ))}
            {(statusFilter || anomalyFilter) && (
              <button onClick={() => navigate("/services")} className="text-xs text-gray-400 hover:text-gray-600 underline">
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Services Grid - White Theme */}
        {filteredServices.length === 0 ? (
          <EmptyCard text="No services found" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {filteredServices.map((service) => {
              const { icon: StatusIcon, color: statusColor } = getStatusInfo(service.status);
              const { icon: TypeIcon, color: typeColor, label: typeLabel } = getTypeIcon(service.type);
              const StatusWiFiIcon = getStatusIcon(service.status);
              const statusStyles = colorMap[statusColor];
              const typeStyles = colorMap[typeColor];

              return (
                <button
                  key={service.id}
                  onClick={() => navigate(`/services/${service.id}`)}
                  aria-label={`View details for ${service.name}`}
                  className="group w-full text-left bg-white border border-gray-200 rounded-xl p-4 sm:p-5 md:p-6 hover:border-gray-400 hover:shadow-md transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <div className={`p-2 sm:p-3 rounded-xl ${typeStyles.bg} ${typeStyles.border} group-hover:scale-110 transition-transform flex-shrink-0`}>
                        <TypeIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${typeStyles.text}`} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-gray-700 transition-colors truncate">
                          {service.name}
                        </h3>
                        <p className="text-[10px] sm:text-xs text-gray-500">{typeLabel}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                      {service.aiStatus?.hasAnomaly && (
                        <div className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-purple-100 text-purple-700 border border-purple-200 rounded-lg">
                          <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          <span className="text-[8px] sm:text-[10px] font-bold hidden xs:inline">AI</span>
                        </div>
                      )}
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={(e) => { e.stopPropagation(); setServiceToDelete(service.id); }}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); setServiceToDelete(service.id); }}}
                        aria-label={`Delete ${service.name}`}
                        className="p-1.5 sm:p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 text-red-400 hover:text-red-600 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] sm:text-xs text-gray-500 bg-gray-50 p-2 sm:p-3 rounded-lg mb-3 sm:mb-4">
                    <LinkIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0 text-gray-400" />
                    <span className="truncate">{service.baseUrl}</span>
                  </div>

                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <StatusWiFiIcon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${statusStyles.text}`} />
                      <span className="text-xs sm:text-sm text-gray-500">Status</span>
                    </div>
                    <div className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full ${statusStyles.bg} ${statusStyles.border}`}>
                      <StatusIcon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${statusStyles.text}`} />
                      <span className={`text-[10px] sm:text-xs font-medium ${statusStyles.text}`}>{service.status}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-200 text-[10px] sm:text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      <span className="hidden xs:inline">Checked </span>
                      {formatRelativeTime(service.lastCheckedAt)}
                    </span>
                    <span className="font-mono">#{String(service.id).slice(0, 4)}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Delete Modal - White Theme */}
        {serviceToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/30 backdrop-blur-sm">
            <div className="bg-white border border-gray-200 rounded-xl w-full max-w-sm sm:max-w-md p-4 sm:p-6 mx-3 sm:mx-4 shadow-xl">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="p-2 sm:p-3 bg-red-50 rounded-xl border border-red-200 flex-shrink-0">
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Delete Service</h3>
                  <p className="text-xs sm:text-sm text-gray-500">This cannot be undone</p>
                </div>
              </div>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                This permanently removes all metrics, logs, incidents, and anomaly data for this service.
              </p>
              <div className="flex flex-col xs:flex-row justify-end gap-2 sm:gap-3">
                <button onClick={() => setServiceToDelete(null)} className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs sm:text-sm text-gray-700 order-2 xs:order-1">
                  Cancel
                </button>
                <button onClick={deleteService} className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 hover:bg-red-700 rounded-lg text-xs sm:text-sm text-white order-1 xs:order-2">
                  Delete Service
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer - White Theme */}
        {services.length > 0 && (
          <div className="mt-6 sm:mt-8 pt-3 sm:pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 text-[10px] sm:text-xs text-gray-400">
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center sm:justify-start">
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full" />{counts.up} Up</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-500 rounded-full" />{counts.degraded} Degraded</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full" />{counts.down} Down</span>
            </div>
            <span className="flex items-center gap-1">
              <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-500 rounded-full animate-pulse" />
              Updated {timeAgo}
            </span>
          </div>
        )}

      </div>
    </div>
  );
}