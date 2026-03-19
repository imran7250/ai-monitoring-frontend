// import { useEffect, useState } from "react";
// import { api } from "../../api/client";
// import {
//   Bell,
//   Mail,
//   MessageSquare,
//   CheckCircle,
//   XCircle,
//   Clock,
//   Calendar,
//   Filter,
//   RefreshCw,
//   Inbox,
//   AlertCircle,
//   ChevronDown,
//   ChevronUp,
//   Eye,
//   AlertTriangle,
//   Server,
//   Activity
// } from "lucide-react";

// export default function Notifications() {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [filter, setFilter] = useState("all"); // all, sent, failed
//   const [expandedId, setExpandedId] = useState(null);

//   useEffect(() => {
//     loadNotifications();
//   }, []);

//   const loadNotifications = async () => {
//     try {
//       const res = await api.get("/api/notifications");
//       setNotifications(res.data || []);
//     } catch (e) {
//       console.error("Failed loading notifications", e);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await loadNotifications();
//   };

//   const toggleExpand = (id) => {
//     setExpandedId(expandedId === id ? null : id);
//   };

//   const statusStyle = (status) => {
//     return status === "SENT"
//       ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
//       : "bg-red-500/10 text-red-400 border-red-500/30";
//   };

//   const channelStyle = (type) => {
//     return type === "EMAIL"
//       ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
//       : "bg-purple-500/10 text-purple-400 border-purple-500/30";
//   };

//   const getChannelIcon = (type) => {
//     return type === "EMAIL" ? Mail : MessageSquare;
//   };

//   const formatDate = (dateString) => {
//     try {
//       const date = new Date(dateString);
//       const now = new Date();
//       const diff = now - date;
//       const minutes = Math.floor(diff / (1000 * 60));
//       const hours = Math.floor(diff / (1000 * 60 * 60));
//       const days = Math.floor(diff / (1000 * 60 * 60 * 24));

//       if (minutes < 1) return 'Just now';
//       if (minutes < 60) return `${minutes}m ago`;
//       if (hours < 24) return `${hours}h ago`;
//       if (days === 1) return 'Yesterday';
//       if (days < 7) return `${days} days ago`;
//       return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
//     } catch {
//       return dateString;
//     }
//   };

//   // Parse alert message to extract components
//   const parseAlertMessage = (message) => {
//     const alertMatch = message.match(/🚨 ALERT TRIGGERED/);
//     const ruleMatch = message.match(/Rule: ([^\n]+)/);
//     const serviceMatch = message.match(/Service: ([^\n]+)/);
//     const statusMatch = message.match(/Status: ([^\n]+)/);
//     const errorMatch = message.match(/Error: (.+)$/);
    
//     return {
//       isAlert: !!alertMatch,
//       rule: ruleMatch ? ruleMatch[1] : null,
//       service: serviceMatch ? serviceMatch[1] : null,
//       status: statusMatch ? statusMatch[1] : null,
//       error: errorMatch ? errorMatch[1] : null
//     };
//   };

//   const filteredNotifications = notifications.filter(n => {
//     if (filter === "sent") return n.status === "SENT";
//     if (filter === "failed") return n.status !== "SENT";
//     return true;
//   });

//   const sentCount = notifications.filter(n => n.status === "SENT").length;
//   const failedCount = notifications.filter(n => n.status !== "SENT").length;

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
//         <div className="text-center">
//           <div className="relative w-12 h-12 mx-auto mb-4">
//             <div className="absolute inset-0 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
//           </div>
//           <p className="text-slate-400 text-sm">Loading notifications...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      
//       {/* Background Pattern */}
//       <div className="fixed inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>

//       {/* Sticky Header */}
//       <div className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 px-6 py-4">
//         <div className="max-w-7xl mx-auto flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-indigo-500/10 rounded-lg">
//               <Bell className="w-5 h-5 text-indigo-400" />
//             </div>
//             <div>
//               <h1 className="text-xl font-semibold text-white">Notification Center</h1>
//               <p className="text-xs text-slate-400">
//                 {notifications.length} total • {sentCount} sent, {failedCount} failed
//               </p>
//             </div>
//           </div>

//           <button
//             onClick={handleRefresh}
//             disabled={refreshing}
//             className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
//           >
//             <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
//           </button>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-6 py-8">
        
//         {/* Filter Tabs */}
//         <div className="flex items-center gap-4 mb-6">
//           <div className="flex items-center gap-2">
//             <Filter className="w-4 h-4 text-slate-400" />
//             <span className="text-sm text-slate-400">Filter:</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => setFilter("all")}
//               className={`
//                 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
//                 ${filter === "all" 
//                   ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' 
//                   : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent'
//                 }
//               `}
//             >
//               All ({notifications.length})
//             </button>
//             <button
//               onClick={() => setFilter("sent")}
//               className={`
//                 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
//                 ${filter === "sent" 
//                   ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
//                   : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent'
//                 }
//               `}
//             >
//               Sent ({sentCount})
//             </button>
//             <button
//               onClick={() => setFilter("failed")}
//               className={`
//                 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
//                 ${filter === "failed" 
//                   ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
//                   : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent'
//                 }
//               `}
//             >
//               Failed ({failedCount})
//             </button>
//           </div>
//         </div>

//         {/* Empty State */}
//         {filteredNotifications.length === 0 ? (
//           <div className="flex flex-col items-center justify-center py-16 text-center bg-slate-900/30 border border-slate-800 rounded-xl">
//             <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
//               {filter === "all" ? (
//                 <Inbox className="w-10 h-10 text-slate-600" />
//               ) : filter === "sent" ? (
//                 <CheckCircle className="w-10 h-10 text-slate-600" />
//               ) : (
//                 <XCircle className="w-10 h-10 text-slate-600" />
//               )}
//             </div>
//             <h3 className="text-lg font-medium text-white mb-2">
//               {filter === "all" && "No notifications yet"}
//               {filter === "sent" && "No sent notifications"}
//               {filter === "failed" && "No failed notifications"}
//             </h3>
//             <p className="text-sm text-slate-400">
//               {filter === "all" && "Notifications will appear here when alerts are triggered"}
//               {filter === "sent" && "All sent notifications will appear here"}
//               {filter === "failed" && "Failed delivery attempts will appear here"}
//             </p>
//           </div>
//         ) : (
//           <div className="space-y-3">
//             {filteredNotifications.map((n) => {
//               const ChannelIcon = getChannelIcon(n.channelType);
//               const isExpanded = expandedId === n.id;
//               const parsedAlert = parseAlertMessage(n.message);
              
//               return (
//                 <div
//                   key={n.id}
//                   className="group bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all"
//                 >
//                   {/* Clickable Header */}
//                   <div
//                     onClick={() => toggleExpand(n.id)}
//                     className="p-5 cursor-pointer hover:bg-slate-800/30 transition-colors"
//                   >
//                     <div className="flex items-start justify-between">
//                       <div className="flex items-start gap-3 flex-1 min-w-0">
//                         {/* Icon - Now with alert styling */}
//                         <div className={`p-2 rounded-lg ${channelStyle(n.channelType)} ${parsedAlert.isAlert ? 'relative' : ''}`}>
//                           <ChannelIcon className="w-4 h-4" />
//                           {parsedAlert.isAlert && (
//                             <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
//                           )}
//                         </div>
                        
//                         {/* Content - Improved layout for alerts */}
//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-center gap-2 mb-1.5 flex-wrap">
//                             {parsedAlert.isAlert ? (
//                               <>
//                                 <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-full text-xs font-medium">
//                                   <AlertTriangle className="w-3 h-3" />
//                                   ALERT
//                                 </span>
//                                 <span className="text-sm font-medium text-white truncate max-w-[200px]">
//                                   {parsedAlert.rule || `Notification #${n.id}`}
//                                 </span>
//                               </>
//                             ) : (
//                               <span className="text-sm font-medium text-white">
//                                 Notification #{n.id}
//                               </span>
//                             )}
//                             <span className={`px-2 py-0.5 text-xs rounded-full ${statusStyle(n.status)}`}>
//                               {n.status}
//                             </span>
//                           </div>
                          
//                           {/* Alert-specific preview */}
//                           {parsedAlert.isAlert ? (
//                             <div className="space-y-1.5">
//                               <div className="flex items-center gap-2 text-sm">
//                                 <Server className="w-3.5 h-3.5 text-slate-500" />
//                                 <span className="text-slate-300">{parsedAlert.service}</span>
//                                 <span className={`text-xs px-1.5 py-0.5 rounded ${
//                                   parsedAlert.status === 'UP' 
//                                     ? 'bg-emerald-500/10 text-emerald-400' 
//                                     : 'bg-red-500/10 text-red-400'
//                                 }`}>
//                                   {parsedAlert.status}
//                                 </span>
//                               </div>
//                               {parsedAlert.error && (
//                                 <p className="text-sm text-slate-400 truncate">
//                                   <span className="text-slate-500">Error:</span> {parsedAlert.error}
//                                 </p>
//                               )}
//                             </div>
//                           ) : (
//                             <p className="text-sm text-slate-300 truncate">
//                               {n.message}
//                             </p>
//                           )}
                          
//                           <div className="flex items-center gap-3 mt-2">
//                             <span className="flex items-center gap-1 text-xs text-slate-500">
//                               <Clock className="w-3 h-3" />
//                               {formatDate(n.sentAt)}
//                             </span>
//                             <span className="text-slate-600">•</span>
//                             <span className="flex items-center gap-1 text-xs text-slate-500 truncate max-w-[150px]">
//                               <Eye className="w-3 h-3 flex-shrink-0" />
//                               <span className="truncate">{n.target}</span>
//                             </span>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Expand/Collapse Icon */}
//                       <div className="ml-4 flex-shrink-0">
//                         {isExpanded ? (
//                           <ChevronUp className="w-5 h-5 text-slate-400" />
//                         ) : (
//                           <ChevronDown className="w-5 h-5 text-slate-400" />
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Expanded Details - Enhanced for alerts */}
//                   {isExpanded && (
//                     <div className="px-5 pb-5 pt-2 border-t border-slate-800 bg-slate-800/20">
//                       <div className="grid grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                           <p className="text-xs text-slate-500">Channel</p>
//                           <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${channelStyle(n.channelType)}`}>
//                             <ChannelIcon className="w-4 h-4" />
//                             <span className="text-sm">{n.channelType}</span>
//                           </div>
//                         </div>
//                         <div className="space-y-2">
//                           <p className="text-xs text-slate-500">Target</p>
//                           <p className="text-sm text-slate-300 break-all">{n.target}</p>
//                         </div>
//                         <div className="space-y-2">
//                           <p className="text-xs text-slate-500">Sent At</p>
//                           <p className="text-sm text-slate-300">
//                             {new Date(n.sentAt).toLocaleString()}
//                           </p>
//                         </div>
//                         <div className="space-y-2">
//                           <p className="text-xs text-slate-500">Status</p>
//                           <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${statusStyle(n.status)}`}>
//                             {n.status === "SENT" ? (
//                               <CheckCircle className="w-4 h-4" />
//                             ) : (
//                               <XCircle className="w-4 h-4" />
//                             )}
//                             <span className="text-sm">{n.status}</span>
//                           </div>
//                         </div>
//                       </div>
                      
//                       {/* Full Message - Enhanced formatting for alerts */}
//                       <div className="mt-4 pt-4 border-t border-slate-800">
//                         <p className="text-xs text-slate-500 mb-2">Full Message</p>
//                         <div className="text-sm text-slate-300 bg-slate-800/30 p-4 rounded-lg font-mono">
//                           {parsedAlert.isAlert ? (
//                             <div className="space-y-2">
//                               <div className="flex items-center gap-2 text-amber-400">
//                                 <AlertTriangle className="w-4 h-4" />
//                                 <span className="font-bold">🚨 ALERT TRIGGERED</span>
//                               </div>
//                               <div className="grid gap-1.5 pl-2 border-l-2 border-slate-700">
//                                 <p><span className="text-slate-500">Rule:</span> {parsedAlert.rule}</p>
//                                 <p><span className="text-slate-500">Service:</span> {parsedAlert.service}</p>
//                                 <p><span className="text-slate-500">Status:</span> {parsedAlert.status}</p>
//                                 <p><span className="text-slate-500">Time:</span> {new Date(n.sentAt).toLocaleString()}</p>
//                                 {parsedAlert.error && (
//                                   <p className="text-red-400"><span className="text-slate-500">Error:</span> {parsedAlert.error}</p>
//                                 )}
//                               </div>
//                             </div>
//                           ) : (
//                             <p className="whitespace-pre-wrap break-words">{n.message}</p>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {/* Footer Stats */}
//         <div className="flex items-center justify-between text-xs text-slate-500 mt-8 pt-4 border-t border-slate-800">
//           <div className="flex items-center gap-4">
//             <span className="flex items-center gap-1">
//               <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
//               {sentCount} Successful
//             </span>
//             <span className="flex items-center gap-1">
//               <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
//               {failedCount} Failed
//             </span>
//           </div>
//           <span>Last updated: {new Date().toLocaleTimeString()}</span>
//         </div>
//       </div>

//       <style>{`
//         .bg-grid-pattern {
//           background-image: 
//             linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
//             linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
//           background-size: 50px 50px;
//         }
        
//         .truncate {
//           overflow: hidden;
//           text-overflow: ellipsis;
//           white-space: nowrap;
//         }
        
//         .break-all {
//           word-break: break-all;
//         }
        
//         .whitespace-pre-wrap {
//           white-space: pre-wrap;
//         }
//       `}</style>
//     </div>
//   );
// }



import { useEffect, useState } from "react";
import { api } from "../../api/client";
import {
  Bell, Mail, MessageSquare, CheckCircle, XCircle,
  Clock, Filter, RefreshCw, Inbox, AlertTriangle,
  ChevronDown, ChevronUp, Eye, Server,
} from "lucide-react";
import { formatRelativeTime } from "../../utils/dateUtils";
import { usePageTitle } from "../../hooks/usePageTitle";

// ✅ FIX — style jsx removed, background style moved to constant
const BG_STYLE = {
  backgroundImage: `
    linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
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
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
      : "bg-red-500/10 text-red-400 border-red-500/30";

  const channelStyle = (type) =>
    type === "EMAIL"
      ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
      : "bg-purple-500/10 text-purple-400 border-purple-500/30";

  const getChannelIcon = (type) => (type === "EMAIL" ? Mail : MessageSquare);

  // Parse alert message to extract components
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
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">

      {/* ✅ FIX — style jsx removed */}
      <div className="fixed inset-0 pointer-events-none" style={{ ...BG_STYLE, opacity: 0.02 }} />

      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <Bell className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">Notification Center</h1>
              <p className="text-xs text-slate-400">
                {notifications.length} total • {sentCount} sent, {failedCount} failed
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

        {/* Filter Tabs */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-400">Filter:</span>
          </div>
          <div className="flex items-center gap-2">
            {[
              { key: "all", label: `All (${notifications.length})`, active: "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" },
              { key: "sent", label: `Sent (${sentCount})`, active: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" },
              { key: "failed", label: `Failed (${failedCount})`, active: "bg-red-500/20 text-red-400 border border-red-500/30" },
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

        {/* Empty State */}
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-slate-900/30 border border-slate-800 rounded-xl">
            <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
              <Inbox className="w-10 h-10 text-slate-600" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No notifications</h3>
            <p className="text-sm text-slate-400">
              Notifications will appear here when alerts are triggered
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((n) => {
              const ChannelIcon = getChannelIcon(n.channelType);
              const isExpanded = expandedId === n.id;
              const parsed = parseAlertMessage(n.message);

              return (
                <div
                  key={n.id}
                  className="group bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all"
                >
                  {/* Clickable Header */}
                  <div
                    onClick={() => toggleExpand(n.id)}
                    className="p-5 cursor-pointer hover:bg-slate-800/30 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1 min-w-0">

                        <div className={`p-2 rounded-lg ${channelStyle(n.channelType)}`}>
                          <ChannelIcon className="w-4 h-4" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            {parsed.isAlert && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-full text-xs font-medium">
                                <AlertTriangle className="w-3 h-3" />
                                ALERT
                              </span>
                            )}
                            <span className="text-sm font-medium text-white truncate max-w-[200px]">
                              {parsed.rule || `Notification #${n.id}`}
                            </span>
                            <span className={`px-2 py-0.5 text-xs rounded-full border ${statusStyle(n.status)}`}>
                              {n.status}
                            </span>
                          </div>

                          {parsed.isAlert ? (
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm">
                                <Server className="w-3.5 h-3.5 text-slate-500" />
                                <span className="text-slate-300">{parsed.service}</span>
                                <span className={`text-xs px-1.5 py-0.5 rounded ${
                                  parsed.status === "UP"
                                    ? "bg-emerald-500/10 text-emerald-400"
                                    : "bg-red-500/10 text-red-400"
                                }`}>
                                  {parsed.status}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-slate-300 truncate">{n.message}</p>
                          )}

                          <div className="flex items-center gap-3 mt-2">
                            <span className="flex items-center gap-1 text-xs text-slate-500">
                              <Clock className="w-3 h-3" />
                              {/* ✅ Using dateUtils instead of inline formatDate */}
                              {formatRelativeTime(n.sentAt)}
                            </span>
                            <span className="text-slate-600">•</span>
                            <span className="flex items-center gap-1 text-xs text-slate-500 truncate max-w-[150px]">
                              <Eye className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{n.target}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="ml-4 flex-shrink-0">
                        {isExpanded
                          ? <ChevronUp className="w-5 h-5 text-slate-400" />
                          : <ChevronDown className="w-5 h-5 text-slate-400" />
                        }
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 border-t border-slate-800 bg-slate-800/20">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Channel</p>
                          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border ${channelStyle(n.channelType)}`}>
                            <ChannelIcon className="w-4 h-4" />
                            {n.channelType}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Target</p>
                          <p className="text-sm text-slate-300 break-all">{n.target}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Sent At</p>
                          <p className="text-sm text-slate-300">
                            {new Date(n.sentAt).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Status</p>
                          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border ${statusStyle(n.status)}`}>
                            {n.status === "SENT"
                              ? <CheckCircle className="w-4 h-4" />
                              : <XCircle className="w-4 h-4" />
                            }
                            {n.status}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-800">
                        <p className="text-xs text-slate-500 mb-2">Full Message</p>
                        <div className="text-sm text-slate-300 bg-slate-800/30 p-4 rounded-lg font-mono whitespace-pre-wrap break-words">
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
        <div className="flex items-center justify-between text-xs text-slate-500 mt-8 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {sentCount} Successful
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              {failedCount} Failed
            </span>
          </div>
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
}

