// D:\Ai_Monitoring_Platform\ai-monitoring-ui\src\pages\notifications\Notifications.jsx

import { useEffect, useState } from "react";
import { api } from "../../api/client";
import {
  Bell, Mail, MessageSquare, CheckCircle, XCircle,
  Clock, Filter, RefreshCw, Inbox, AlertTriangle,
  ChevronDown, ChevronUp, Eye, Server,
} from "lucide-react";
import { formatRelativeTime } from "../../utils/dateUtils";
import { usePageTitle } from "../../hooks/usePageTitle";
import PageHeader from "../../components/ui/PageHeader";

const BG_STYLE = {
  backgroundImage: `
    linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
  `,
  backgroundSize: "50px 50px",
};

export default function Notifications() {
  usePageTitle("Notifications");

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const res = await api.get("/api/notifications");
      setNotifications(res.data || []);
    } catch (e) {
      console.error("Failed loading notifications", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const statusStyle = (status) =>
    status === "SENT"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : "bg-red-50 text-red-700 border-red-200";

  const channelStyle = (type) =>
    type === "EMAIL"
      ? "bg-blue-50 text-blue-700 border-blue-200"
      : "bg-purple-50 text-purple-700 border-purple-200";

  const getChannelIcon = (type) => (type === "EMAIL" ? Mail : MessageSquare);

  const parseAlertMessage = (message) => {
    const ruleMatch = message.match(/Rule: ([^\n]+)/);
    const serviceMatch = message.match(/Service: ([^\n]+)/);
    const statusMatch = message.match(/Status: ([^\n]+)/);
    const errorMatch = message.match(/Error:\n(.+)$/s);
    return {
      isAlert: message.includes("ALERT TRIGGERED"),
      rule: ruleMatch?.[1]?.trim() || null,
      service: serviceMatch?.[1]?.trim() || null,
      status: statusMatch?.[1]?.trim() || null,
      error: errorMatch?.[1]?.trim() || null,
    };
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "sent") return n.status === "SENT";
    if (filter === "failed") return n.status !== "SENT";
    return true;
  });

  const sentCount = notifications.filter((n) => n.status === "SENT").length;
  const failedCount = notifications.filter((n) => n.status !== "SENT").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-700 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed inset-0 pointer-events-none" style={{ ...BG_STYLE, opacity: 0.5 }} />

      {/* ✅ PageHeader with Back Button */}
      <PageHeader title="Notifications" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* Header with title, count, and refresh */}
        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg border border-gray-200 flex-shrink-0">
              <Bell className="w-5 h-5 text-gray-700" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Notification Center</h1>
              <p className="text-sm text-gray-500">
                {notifications.length} total • {sentCount} sent, {failedCount} failed
              </p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-xs sm:text-sm text-gray-400">Filter:</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {[
              { key: "all", label: `All (${notifications.length})` },
              { key: "sent", label: `Sent (${sentCount})` },
              { key: "failed", label: `Failed (${failedCount})` },
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

        {/* Empty State */}
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center bg-gray-50 border border-gray-200 rounded-xl">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
              <Inbox className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1">No notifications</h3>
            <p className="text-xs sm:text-sm text-gray-500">
              Notifications will appear here when alerts are triggered
            </p>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {filteredNotifications.map((n) => {
              const ChannelIcon = getChannelIcon(n.channelType);
              const isExpanded = expandedId === n.id;
              const parsed = parseAlertMessage(n.message);

              return (
                <div
                  key={n.id}
                  className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 shadow-sm hover:shadow-md transition-all"
                >
                  {/* Clickable Header */}
                  <div
                    onClick={() => toggleExpand(n.id)}
                    className="p-3 sm:p-5 cursor-pointer hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">

                        <div className={`p-2 rounded-lg ${channelStyle(n.channelType)} flex-shrink-0`}>
                          <ChannelIcon className="w-4 h-4" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                            {parsed.isAlert && (
                              <span className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[10px] sm:text-xs font-medium border border-amber-200">
                                <AlertTriangle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                ALERT
                              </span>
                            )}
                            <span className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[120px] sm:max-w-[200px]">
                              {parsed.rule || `Notification #${n.id}`}
                            </span>
                            <span className={`px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs rounded-full border ${statusStyle(n.status)}`}>
                              {n.status}
                            </span>
                          </div>

                          {parsed.isAlert ? (
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                                <Server className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" />
                                <span className="text-gray-700">{parsed.service}</span>
                                <span className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded ${
                                  parsed.status === "UP"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-red-100 text-red-700"
                                }`}>
                                  {parsed.status}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs sm:text-sm text-gray-600 truncate">{n.message}</p>
                          )}

                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1.5">
                            <span className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-400">
                              <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              {formatRelativeTime(n.sentAt)}
                            </span>
                            <span className="text-gray-300 hidden xs:inline">•</span>
                            <span className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-400 truncate max-w-[100px] sm:max-w-[150px]">
                              <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                              <span className="truncate">{n.target}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="ml-2 flex-shrink-0">
                        {isExpanded
                          ? <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                          : <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        }
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-3 sm:px-5 pb-3 sm:pb-5 pt-2 border-t border-gray-200 bg-gray-50/50">
                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <p className="text-[10px] sm:text-xs text-gray-500 mb-1">Channel</p>
                          <span className={`inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm border ${channelStyle(n.channelType)}`}>
                            <ChannelIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                            {n.channelType}
                          </span>
                        </div>
                        <div>
                          <p className="text-[10px] sm:text-xs text-gray-500 mb-1">Target</p>
                          <p className="text-xs sm:text-sm text-gray-700 break-all">{n.target}</p>
                        </div>
                        <div>
                          <p className="text-[10px] sm:text-xs text-gray-500 mb-1">Sent At</p>
                          <p className="text-xs sm:text-sm text-gray-700">
                            {new Date(n.sentAt).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] sm:text-xs text-gray-500 mb-1">Status</p>
                          <span className={`inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm border ${statusStyle(n.status)}`}>
                            {n.status === "SENT"
                              ? <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                              : <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                            }
                            {n.status}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                        <p className="text-[10px] sm:text-xs text-gray-500 mb-1.5">Full Message</p>
                        <div className="text-xs sm:text-sm text-gray-700 bg-white p-3 sm:p-4 rounded-lg border border-gray-200 font-mono whitespace-pre-wrap break-words">
                          {n.message}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="flex flex-col xs:flex-row items-center justify-between gap-2 text-[10px] sm:text-xs text-gray-400 mt-6 sm:mt-8 pt-3 sm:pt-4 border-t border-gray-200">
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {sentCount} Successful
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              {failedCount} Failed
            </span>
          </div>
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
}