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

  // const enableRule = async (ruleId) => {
  //   await api.put(`/api/alerts/${ruleId}/enable`);
  //   loadAlerts();
  // };

  // const disableRule = async (ruleId) => {
  //   await api.put(`/api/alerts/${ruleId}/disable`);
  //   loadAlerts();
  // };

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
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Loading alert rules...</p>
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
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <Bell className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">Alert Center</h1>
              <p className="text-xs text-slate-400">
                {alerts.length} alert rule{alerts.length !== 1 ? "s" : ""} configured
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={() => setOpenModal(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              New Alert
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Message */}
        {message && (
          <div className="mb-6 p-3 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm rounded-lg">
            {message}
          </div>
        )}

        {/* Filter Bar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-400">Filter:</span>
          </div>
          <div className="flex items-center gap-2">
            {[
              { key: "all", label: `All (${alerts.length})`, active: "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" },
              { key: "active", label: `Active (${alerts.filter((a) => a.enabled).length})`, active: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" },
              { key: "disabled", label: `Disabled (${alerts.filter((a) => !a.enabled).length})`, active: "bg-slate-500/20 text-slate-400 border border-slate-500/30" },
            ].map(({ key, label, active }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filter === key
                    ? active
                    : "bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Alert Cards */}
        {filteredAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-slate-900/30 border border-slate-800 rounded-xl">
            <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
              <Bell className="w-10 h-10 text-slate-600" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No alerts found</h3>
            <p className="text-sm text-slate-400">
              {filter === "all" ? "Get started by creating your first alert rule" : `No ${filter} alert rules`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredAlerts.map((rule) => (
              <div
                key={rule.id}
                className="group relative bg-slate-900/50 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all"
              >
                {/* Status indicator */}
                <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 rounded-r-full ${
                  rule.enabled ? "bg-emerald-500" : "bg-slate-600"
                }`} />

                <div className="ml-3">
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${rule.enabled ? "bg-indigo-500/10" : "bg-slate-800"}`}>
                        <Bell className={`w-5 h-5 ${rule.enabled ? "text-indigo-400" : "text-slate-500"}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{rule.name}</h3>
                        <p className="text-xs text-slate-500 mt-1">
                          {/* ✅ Using dateUtils instead of inline formatDate */}
                          Created {formatRelativeTime(rule.createdAt)}
                        </p>
                      </div>
                    </div>

                    <span className={`px-3 py-1.5 text-xs font-medium rounded-full ${
                      rule.enabled
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                        : "bg-slate-500/10 text-slate-400 border border-slate-500/30"
                    }`}>
                      {rule.enabled ? "● Active" : "○ Disabled"}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-slate-800/30 rounded-lg p-3">
                      <p className="text-xs text-slate-500 mb-1">Service</p>
                      {/* <button
                        onClick={() => navigate(`/services/${rule.service.id}`)}
                        className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition"
                      >
                        <Server className="w-4 h-4" />
                        <span>{alert.serviceName}</span>
                        <Eye className="w-3 h-3" />
                      </button> */}
                      <button
  onClick={() => navigate(`/services/${rule.serviceId}`)}
  className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition"
>
  <Server className="w-4 h-4" />
  <span>{rule.serviceName}</span>
  <Eye className="w-3 h-3" />
</button>
                    </div>

                    <div className="bg-slate-800/30 rounded-lg p-3">
                      <p className="text-xs text-slate-500 mb-1">Trigger</p>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-white font-medium">{rule.triggerStatus}</span>
                      </div>
                    </div>

                    <div className="bg-slate-800/30 rounded-lg p-3">
                      <p className="text-xs text-slate-500 mb-1">Actions</p>
                      <div className="flex items-center gap-2">
                        {rule.enabled ? (
                          <button
                            onClick={() => disableRule(rule.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-yellow-600/20 hover:bg-yellow-600/30 rounded-lg text-xs text-yellow-400 transition"
                          >
                            <Power className="w-3 h-3" />
                            Disable
                          </button>
                        ) : (
                          <button
                            onClick={() => enableRule(rule.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 rounded-lg text-xs text-emerald-400 transition"
                          >
                            <Power className="w-3 h-3" />
                            Enable
                          </button>
                        )}
                        <button
                          onClick={() => deleteRule(rule.id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 rounded-lg text-xs text-red-400 transition"
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
        <div className="flex items-center justify-between text-xs text-slate-500 mt-8 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {alerts.filter((a) => a.enabled).length} Active
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
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

