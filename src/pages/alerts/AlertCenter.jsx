// D:\Ai_Monitoring_Platform\ai-monitoring-ui\src\pages\alerts\AlertCenter.jsx

import { useEffect, useState } from "react";
import { api } from "../../api/client";
import { useNavigate } from "react-router-dom";
import CreateAlertModal from "./CreateAlertModal";
import {
  Bell, Plus, Server, Power, Trash2,
  AlertTriangle, Eye, RefreshCw, Filter,
} from "lucide-react";
import { formatRelativeTime } from "../../utils/dateUtils";
import { usePageTitle } from "../../hooks/usePageTitle";
import PageHeader from "../../components/ui/PageHeader";

export default function AlertCenter() {
  usePageTitle("Alerts");

  const [alerts, setAlerts] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/alerts/all");
      setAlerts(res.data);
    } catch (e) {
      console.error("Failed loading alerts", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAlerts();
  };

  const enableRule = async (ruleId) => {
    try {
      await api.put(`/api/alerts/${ruleId}/enable`);
      loadAlerts();
    } catch (err) {
      setMessage(err?.response?.data?.message || "Failed to enable alert rule");
      console.error("Enable failed:", err?.response?.data);
    }
  };

  const disableRule = async (ruleId) => {
    try {
      await api.put(`/api/alerts/${ruleId}/disable`);
      loadAlerts();
    } catch (err) {
      setMessage(err?.response?.data?.message || "Failed to disable alert rule");
      console.error("Disable failed:", err?.response?.data);
    }
  };

  const deleteRule = async (ruleId) => {
    if (!ruleId) return;
    try {
      await api.delete(`/api/alerts/${ruleId}`);
      setMessage("Alert rule deleted successfully");
      loadAlerts();
    } catch (error) {
      setMessage(error?.response?.data?.message || "Failed to delete alert rule");
    }
  };

  const filteredAlerts = alerts.filter((rule) => {
    if (filter === "active") return rule.enabled;
    if (filter === "disabled") return !rule.enabled;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-gray-200 border-t-gray-700 rounded-full animate-spin mx-auto mb-3 sm:mb-4" />
          <p className="text-gray-500 text-xs sm:text-sm">Loading alert rules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">

      {/* ✅ PageHeader with Back Button */}
      <PageHeader title="Alert Center" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 md:py-8">

        {/* Header with title, count, and actions */}
        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg border border-gray-200 flex-shrink-0">
              <Bell className="w-5 h-5 text-gray-700" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Alert Center</h1>
              <p className="text-sm text-gray-500">
                {alerts.length} alert rule{alerts.length !== 1 ? "s" : ""} configured
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={() => setOpenModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium text-white transition-all active:scale-95 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">New Alert</span>
              <span className="xs:hidden">New</span>
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className="mb-4 sm:mb-6 p-3 bg-blue-50 border border-blue-200 text-blue-700 text-xs sm:text-sm rounded-lg">
            {message}
          </div>
        )}

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-xs sm:text-sm text-gray-400">Filter:</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {[
              { key: "all", label: `All (${alerts.length})` },
              { key: "active", label: `Active (${alerts.filter((a) => a.enabled).length})` },
              { key: "disabled", label: `Disabled (${alerts.filter((a) => !a.enabled).length})` },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-medium transition-all ${
                  filter === key
                    ? "bg-gray-200 text-gray-900 border border-gray-300"
                    : "bg-gray-50 text-gray-500 hover:text-gray-900 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Alert Cards - White Theme */}
        {filteredAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center bg-gray-50 border border-gray-200 rounded-xl">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
              <Bell className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1">No alerts found</h3>
            <p className="text-xs sm:text-sm text-gray-500">
              {filter === "all" ? "Get started by creating your first alert rule" : `No ${filter} alert rules`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            {filteredAlerts.map((rule) => (
              <div
                key={rule.id}
                className="group relative bg-white border border-gray-200 rounded-xl p-4 sm:p-5 hover:border-gray-300 hover:shadow-md transition-all"
              >
                {/* Status indicator - colored left border */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${
                  rule.enabled ? "bg-emerald-500" : "bg-gray-300"
                }`} />

                <div className="ml-3 sm:ml-4">
                  {/* Top row */}
                  <div className="flex flex-col xs:flex-row xs:items-start justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="flex items-start gap-2 sm:gap-3 min-w-0">
                      <div className={`p-2 rounded-lg flex-shrink-0 ${
                        rule.enabled ? "bg-emerald-50 border border-emerald-200" : "bg-gray-100 border border-gray-200"
                      }`}>
                        <Bell className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          rule.enabled ? "text-emerald-600" : "text-gray-400"
                        }`} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{rule.name}</h3>
                        <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                          Created {formatRelativeTime(rule.createdAt)}
                        </p>
                      </div>
                    </div>

                    <span className={`px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium rounded-full border whitespace-nowrap self-start ${
                      rule.enabled
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-gray-100 text-gray-500 border-gray-200"
                    }`}>
                      {rule.enabled ? "● Active" : "○ Disabled"}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4">
                    <div className="bg-gray-50 rounded-lg p-2.5 sm:p-3 border border-gray-200">
                      <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5">Service</p>
                      <button
                        onClick={() => navigate(`/services/${rule.serviceId}`)}
                        className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-700 hover:text-gray-900 transition group"
                      >
                        <Server className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="truncate">{rule.serviceName}</span>
                        <Eye className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
                      </button>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-2.5 sm:p-3 border border-gray-200">
                      <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5">Trigger</p>
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-600" />
                        <span className="text-xs sm:text-sm text-gray-900 font-medium">{rule.triggerStatus}</span>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-2.5 sm:p-3 border border-gray-200">
                      <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5">Actions</p>
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        {rule.enabled ? (
                          <button
                            onClick={() => disableRule(rule.id)}
                            className="flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-yellow-100 hover:bg-yellow-200 rounded-lg text-[10px] sm:text-xs text-yellow-700 transition"
                          >
                            <Power className="w-3 h-3" />
                            Disable
                          </button>
                        ) : (
                          <button
                            onClick={() => enableRule(rule.id)}
                            className="flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-emerald-100 hover:bg-emerald-200 rounded-lg text-[10px] sm:text-xs text-emerald-700 transition"
                          >
                            <Power className="w-3 h-3" />
                            Enable
                          </button>
                        )}
                        <button
                          onClick={() => deleteRule(rule.id)}
                          className="flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-red-100 hover:bg-red-200 rounded-lg text-[10px] sm:text-xs text-red-700 transition"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex flex-col xs:flex-row items-center justify-between gap-2 text-[10px] sm:text-xs text-gray-400 mt-6 sm:mt-8 pt-3 sm:pt-4 border-t border-gray-200">
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {alerts.filter((a) => a.enabled).length} Active
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
              {alerts.filter((a) => !a.enabled).length} Disabled
            </span>
          </div>
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      <CreateAlertModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        reload={loadAlerts}
      />
    </div>
  );
}