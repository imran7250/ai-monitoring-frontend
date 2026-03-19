import { useEffect, useState, useCallback, useRef } from "react";
import { api } from "../../api/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import EmptyCard from "../../components/ui/EmptyCard";
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
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 text-sm mt-4">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
              <Server className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Services</h1>
              <p className="text-sm text-slate-400">Monitor your services in real-time</p>
            </div>
          </div>
          <button
            onClick={loadServices}
            disabled={refreshing}
            aria-label="Refresh services"
            className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-800 rounded-lg text-sm text-slate-300 hover:text-white transition-all disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Total", value: counts.total, color: "text-white" },
            { label: "Up", value: counts.up, color: "text-emerald-400" },
            { label: "Degraded", value: counts.degraded, color: "text-yellow-400" },
            { label: "Down", value: counts.down, color: "text-red-400" },
            { label: "AI Alerts", value: counts.anomaly, color: "text-purple-400" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
              <p className={`text-xs mb-1 ${color}`}>{label}</p>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-400">Filter:</span>
          </div>
          <div className="flex flex-wrap gap-2">
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
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  active
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    : "bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                {label}
              </button>
            ))}
            {(statusFilter || anomalyFilter) && (
              <button
                onClick={() => navigate("/services")}
                className="text-sm text-slate-400 hover:text-white underline"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <EmptyCard text="No services found" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => {
              const { icon: StatusIcon, color: statusColor } = getStatusInfo(service.status);
              const { icon: TypeIcon, color: typeColor, label: typeLabel } = getTypeIcon(service.type);
              const StatusWiFiIcon = getStatusIcon(service.status);
              const statusStyles = colorMap[statusColor];
              const typeStyles = colorMap[typeColor];

              return (
                <div
                  key={service.id}
                  onClick={() => navigate(`/services/${service.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") navigate(`/services/${service.id}`);
                  }}
                  aria-label={`View details for ${service.name}`}
                  className="group w-full text-left bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl ${typeStyles.bg} ${typeStyles.border} group-hover:scale-110 transition-transform`}>
                        <TypeIcon className={`w-5 h-5 ${typeStyles.text}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                          {service.name}
                        </h3>
                        <p className="text-xs text-slate-500">{typeLabel}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {service.aiStatus?.hasAnomaly && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg">
                          <Zap className="w-3 h-3" />
                          <span className="text-[10px] font-bold">AI</span>
                        </div>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setServiceToDelete(service.id);
                        }}
                        aria-label={`Delete ${service.name}`}
                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/30 p-3 rounded-lg mb-4">
                    <LinkIcon className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{service.baseUrl}</span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <StatusWiFiIcon className={`w-4 h-4 ${statusStyles.text}`} />
                      <span className="text-sm text-slate-300">Status</span>
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${statusStyles.bg} ${statusStyles.border}`}>
                      <StatusIcon className={`w-3.5 h-3.5 ${statusStyles.text}`} />
                      <span className={`text-xs font-medium ${statusStyles.text}`}>{service.status}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Checked {formatRelativeTime(service.lastCheckedAt)}
                    </span>
                    <span>ID: {String(service.id).slice(0, 6)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Delete Modal */}
        {serviceToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                  <Trash2 className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Delete Service</h3>
                  <p className="text-sm text-slate-400">This cannot be undone</p>
                </div>
              </div>
              <p className="text-sm text-slate-300 mb-6">
                This permanently removes all metrics, logs, incidents, and anomaly data for this service.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setServiceToDelete(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteService}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm text-white"
                >
                  Delete Service
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        {services.length > 0 && (
          <div className="mt-8 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                {counts.up} Up
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-yellow-400 rounded-full" />
                {counts.degraded} Degraded
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-red-400 rounded-full" />
                {counts.down} Down
              </span>
            </div>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
              Updated {timeAgo}
            </span>
          </div>
        )}

      </div>
    </div>
  );
}