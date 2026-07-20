// import React, { useState, useEffect } from "react";
// import { api } from "../../api/client";
// import { X, Loader2, FolderPlus } from "lucide-react";
// export default function CreateProjectModal({ open, onClose, reload }) {
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   useEffect(() => {
//     if (open) {
//       setName("");
//       setDescription("");
//       setError("");
//     }
//   }, [open]);
//   const handleSubmit = async () => {
//     if (!name.trim()) {
//       setError("Project name is required");
//       return;
//     }
//     setLoading(true);
//     setError("");
//     try {
//       await api.post("/api/projects", { name, description });
//       reload();
//       onClose();
//     } catch (err) {
//       setError(err?.response?.data?.message || "Failed to create project");
//     } finally {
//       setLoading(false);
//     }
//   };
//   if (!open) return null;
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//       <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
//       <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-lg font-semibold text-white">Create Project</h2>
//           <button onClick={onClose} className="text-slate-400 hover:text-white">
//             <X className="w-5 h-5" />
//           </button>
//         </div>
//         {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
//         <div className="space-y-4">
//           <input
//             type="text"
//             placeholder="Project name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <input
//             type="text"
//             placeholder="Description (optional)"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <div className="flex justify-end gap-3 mt-6">
//           <button onClick={onClose} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm text-white">
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm text-white disabled:opacity-50"
//           >
//             {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FolderPlus className="w-4 h-4" />}
//             Create
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// D:\Ai_Monitoring_Platform\ai-monitoring-ui\src\components\projects\CreateProjectModal.jsx

import React, { useState, useEffect } from "react";
import { api } from "../../api/client";
import { X, Loader2, FolderPlus } from "lucide-react";

export default function CreateProjectModal({ open, onClose, reload }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setName("");
      setDescription("");
      setError("");
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Project name is required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api.post("/api/projects", { name, description });
      reload();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-white border border-gray-200 rounded-2xl p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Create Project</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-600 text-sm mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
            {error}
          </p>
        )}

        {/* Form Fields */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition-all"
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition-all"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm text-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 rounded-xl text-sm text-white transition-all disabled:opacity-50 shadow-sm"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FolderPlus className="w-4 h-4" />}
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
