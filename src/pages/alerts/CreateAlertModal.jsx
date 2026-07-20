// D:\Ai_Monitoring_Platform\ai-monitoring-ui\src\pages\alerts\CreateAlertModal.jsx

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal - White Theme */}
      <div className="relative w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
        
        {/* Decorative header - Clean gray */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800" />
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg border border-gray-200">
              <Bell className="w-5 h-5 text-gray-700" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Create Alert Rule</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          
          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Service Select */}
          <div className="space-y-1.5 sm:space-y-2">
            <label className="block text-xs sm:text-sm font-medium text-gray-700">
              Service <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Server className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <select
                value={serviceId}
                onChange={(e) => {
                  setServiceId(e.target.value);
                  setError("");
                }}
                className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition-all"
              >
                <option value="">Select a service</option>
                {services.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.type || 'API'})
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {services.length === 0 && !error && (
              <p className="text-xs text-gray-500 mt-1">Loading services...</p>
            )}
          </div>

          {/* Alert Name Input */}
          <div className="space-y-1.5 sm:space-y-2">
            <label className="block text-xs sm:text-sm font-medium text-gray-700">
              Alert Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Bell className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="e.g., High CPU Alert"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                onKeyDown={handleKeyDown}
                className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition-all"
              />
            </div>
          </div>

          {/* Trigger Status Select */}
          <div className="space-y-1.5 sm:space-y-2">
            <label className="block text-xs sm:text-sm font-medium text-gray-700">
              Trigger When Status Is
            </label>
            <div className="relative">
              <AlertTriangle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition-all"
              >
                <option value="DOWN">DOWN - Service Unavailable</option>
                <option value="DEGRADED">DEGRADED - Performance Issues</option>
                <option value="UP">UP - Service Healthy</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Helper Text */}
          <div className="flex items-start gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <CheckCircle className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-500">
              You'll be notified whenever this service status matches the trigger condition.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50/50">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 sm:px-5 py-2 sm:py-2.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-xs sm:text-sm font-medium text-gray-700 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={createAlert}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-xs sm:text-sm font-medium text-white transition-all active:scale-95 min-w-[80px] sm:min-w-[100px] shadow-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Create</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}