
import { useEffect, useState } from "react";
import { api } from "../../api/client";
import { 
  X, 
  AlertTriangle, 
  Server, 
  Bell, 
  CheckCircle,
  Loader2,
  AlertCircle
} from "lucide-react";

export default function CreateAlertModal({ open, onClose, reload }) {
  const [services, setServices] = useState([]);
  const [serviceId, setServiceId] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("DOWN");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      loadServices();
      setError("");
      // Reset form when opened
      setServiceId("");
      setName("");
      setStatus("DOWN");
    }
  }, [open]);

  const loadServices = async () => {
    try {
      const res = await api.get("/api/services");
      setServices(res.data);
    } catch (err) {
      console.error("Failed loading services", err);
      setError("Unable to load services");
    }
  };

  const createAlert = async () => {
    if (!serviceId) {
      setError("Please select a service");
      return;
    }

    if (!name.trim()) {
      setError("Alert name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.post(
        `/api/alerts/service/${serviceId}?name=${name}&triggerStatus=${status}`
      );

      reload();
      onClose();
    } catch (err) {
      console.error("Alert create failed", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 409) {
        setError("Alert already exists for this service and status");
      } else {
        setError("Failed to create alert");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !loading) {
      createAlert();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Decorative header gradient */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <Bell className="w-5 h-5 text-indigo-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Create Alert Rule</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5 text-slate-400 hover:text-white" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          
          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Service Select */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Service <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Server className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <select
                value={serviceId}
                onChange={(e) => {
                  setServiceId(e.target.value);
                  setError("");
                }}
                className="
                  w-full pl-10 pr-4 py-3
                  bg-slate-800/50
                  border border-slate-700
                  rounded-xl
                  text-white
                  appearance-none
                  cursor-pointer
                  focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50
                  transition-all
                "
              >
                <option value="">Select a service</option>
                {services.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.type || 'API'})
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {services.length === 0 && !error && (
              <p className="text-xs text-slate-500 mt-1">Loading services...</p>
            )}
          </div>

          {/* Alert Name Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Alert Name <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Bell className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="e.g., High CPU Alert"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                onKeyDown={handleKeyDown}
                className="
                  w-full pl-10 pr-4 py-3
                  bg-slate-800/50
                  border border-slate-700
                  rounded-xl
                  text-white placeholder-slate-500
                  focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50
                  transition-all
                "
              />
            </div>
          </div>

          {/* Trigger Status Select */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Trigger When Status Is
            </label>
            <div className="relative">
              <AlertTriangle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="
                  w-full pl-10 pr-4 py-3
                  bg-slate-800/50
                  border border-slate-700
                  rounded-xl
                  text-white
                  appearance-none
                  cursor-pointer
                  focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50
                  transition-all
                "
              >
                <option value="DOWN">DOWN - Service Unavailable</option>
                <option value="DEGRADED">DEGRADED - Performance Issues</option>
                <option value="UP">UP - Service Healthy</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Helper Text */}
          <div className="flex items-start gap-2 p-3 bg-slate-800/30 rounded-lg">
            <CheckCircle className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-500">
              You'll be notified whenever this service status matches the trigger condition.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-800 bg-slate-900/50">
          <button
            onClick={onClose}
            disabled={loading}
            className="
              px-5 py-2.5
              bg-slate-800 hover:bg-slate-700
              disabled:opacity-50 disabled:cursor-not-allowed
              rounded-xl
              text-sm font-medium text-slate-300 hover:text-white
              transition-all
            "
          >
            Cancel
          </button>
          <button
            onClick={createAlert}
            disabled={loading}
            className="
              flex items-center justify-center gap-2
              px-5 py-2.5
              bg-gradient-to-r from-indigo-600 to-purple-600
              hover:from-indigo-700 hover:to-purple-700
              disabled:opacity-50 disabled:cursor-not-allowed
              rounded-xl
              text-sm font-medium text-white
              transition-all
              active:scale-95
              min-w-[100px]
            "
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <Bell className="w-4 h-4" />
                <span>Create Alert</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
