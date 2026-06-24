






// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getProjects, createProject, deleteProject } from "../../api/project.api";
// import toast from "react-hot-toast";
// import {
//   Folder, Plus, FileText, Trash2, Eye, Clock,
//   LayoutGrid, AlertCircle, CheckCircle, XCircle,
//   Loader2, ChevronRight, Info, Hash,
// } from "lucide-react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { projectSchema } from "../../validation/projectSchema";
// import { usePageTitle } from "../../hooks/usePageTitle";

// const BG_STYLE = {
//   backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
//     linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
//   backgroundSize: "50px 50px",
// };

// export default function Projects() {
//   const navigate = useNavigate();
//   usePageTitle("Projects");

//   const [projects, setProjects] = useState([]);
//   const [deleteModal, setDeleteModal] = useState(null);
//   const [deleteError, setDeleteError] = useState("");
//   const [isLoading, setIsLoading] = useState(true);

//   const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
//     resolver: zodResolver(projectSchema),
//     mode: "onTouched",
//   });

//   useEffect(() => { loadProjects(); }, []);

//   const loadProjects = async () => {
//     setIsLoading(true);
//     try {
//       const data = await getProjects();
//       setProjects(data || []);
//     } catch (e) {
//       console.error("Failed loading projects", e);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const onSubmit = async (data) => {
//     const toastId = toast.loading("Creating project...");
//     try {
//       await createProject(data);
//       reset();
//       await loadProjects();
//       toast.success("Project created successfully!", { id: toastId });
//     } catch (e) {
//       toast.error(e?.response?.data?.message || "Failed to create project", { id: toastId });
//     }
//   };

//   const handleDeleteProject = async () => {
//     if (!deleteModal) return;
//     const toastId = toast.loading("Deleting project...");
//     try {
//       await deleteProject(deleteModal);
//       setProjects((prev) => prev.filter((p) => p.id !== deleteModal));
//       setDeleteModal(null);
//       setDeleteError("");
//       toast.success("Project deleted successfully", { id: toastId });
//     } catch (err) {
//       const message = err?.response?.data?.message || "Cannot delete project. Remove services first.";
//       setDeleteError(message);
//       toast.error(message, { id: toastId });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
//       <div className="fixed inset-0 pointer-events-none" style={{ ...BG_STYLE, opacity: 0.02 }} />

//       <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">

//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div className="flex items-center gap-3">
//             <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
//               <LayoutGrid className="w-6 h-6 text-indigo-400" />
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold text-white">Projects</h1>
//               <p className="text-sm text-slate-400 mt-1">Manage and monitor your projects</p>
//             </div>
//           </div>
//         </div>

//         {/* Create Project */}
//         <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 lg:p-8 mb-10">
//           <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
//             <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl">
//               <Plus className="w-5 h-5 text-blue-400" />
//             </div>
//             <div>
//               <h2 className="text-lg font-semibold text-white">Create New Project</h2>
//               <p className="text-xs text-slate-400">Add a new project to start monitoring</p>
//             </div>
//           </div>

//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//             <div className="grid md:grid-cols-2 gap-5">
//               <div className="space-y-2">
//                 <label className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
//                   <FileText className="w-3.5 h-3.5" />
//                   Project Name <span className="text-red-400">*</span>
//                 </label>
//                 <input
//                   {...register("name")}
//                   placeholder="e.g., Production Monitoring"
//                   className={`w-full px-4 py-2.5 bg-slate-800/50 border rounded-lg text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all ${
//                     errors.name
//                       ? "border-red-500 focus:ring-red-500/20"
//                       : "border-slate-700 focus:border-blue-500 focus:ring-blue-500/20"
//                   }`}
//                 />
//                 {errors.name && (
//                   <p className="flex items-center gap-1 text-xs text-red-400">
//                     <XCircle className="w-3 h-3" />{errors.name.message}
//                   </p>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <label className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
//                   <Info className="w-3.5 h-3.5" />
//                   Description <span className="text-slate-500 text-xs">(optional)</span>
//                 </label>
//                 <input
//                   {...register("description")}
//                   placeholder="Brief description..."
//                   className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
//                 />
//               </div>
//             </div>

//             <div className="flex justify-end">
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 aria-label="Create project"
//                 className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-lg text-sm font-medium text-white flex items-center gap-2 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" />Creating...</> : <><Plus className="w-4 h-4" />Create Project</>}
//               </button>
//             </div>
//           </form>
//         </div>

//         {/* Projects Header */}
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center gap-2">
//             <h2 className="text-lg font-semibold text-white">Your Projects</h2>
//             <span className="px-2 py-0.5 bg-slate-800 rounded-full text-xs text-slate-400">{projects.length} total</span>
//           </div>
//         </div>

//         {/* Projects Grid */}
//         {isLoading ? (
//           <div className="flex items-center justify-center py-20">
//             <div className="text-center">
//               <div className="w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
//               <p className="text-slate-400 text-sm">Loading projects...</p>
//             </div>
//           </div>
//         ) : projects.length === 0 ? (
//           <div className="flex flex-col items-center justify-center py-16 text-center bg-slate-900/30 border border-slate-800 rounded-2xl">
//             <Folder className="w-12 h-12 text-slate-600 mb-4" />
//             <h3 className="text-lg font-medium text-white mb-2">No projects yet</h3>
//             <p className="text-sm text-slate-400">Create your first project above</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {projects.map((project) => (
//               <div key={project.id} className="group bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/50 transition-all hover:-translate-y-1">
//                 <div className="flex items-start justify-between mb-4">
//                   <div className="flex items-center gap-3 min-w-0 flex-1">
//                     <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 flex-shrink-0">
//                       <Folder className="w-5 h-5 text-purple-400" />
//                     </div>
//                     <div className="min-w-0 flex-1">
//                       <h3 className="text-white font-semibold group-hover:text-blue-400 transition-colors break-words pr-2">{project.name}</h3>
//                       <div className="flex items-center gap-1.5 mt-1">
//                         <Hash className="w-3 h-3 text-slate-600 flex-shrink-0" />
//                         <span className="text-xs text-slate-600 font-mono break-all">{String(project.id).slice(0, 8)}</span>
//                       </div>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => { setDeleteModal(project.id); setDeleteError(""); }}
//                     aria-label={`Delete project ${project.name}`}
//                     className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-red-500 flex-shrink-0"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </button>
//                 </div>

//                 {project.description && (
//                   <p className="text-sm text-slate-400 mb-4 line-clamp-2 break-words">{project.description}</p>
//                 )}

//                 <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800">
//                   <button
//                     onClick={() => navigate(`/projects/${project.id}`)}
//                     aria-label={`Open project ${project.name}`}
//                     className="flex items-center gap-2 text-xs font-medium bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white px-4 py-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <Eye className="w-3.5 h-3.5" />
//                     Open Project
//                     <ChevronRight className="w-3.5 h-3.5" />
//                   </button>
//                   <div className="flex items-center gap-1.5 text-xs text-slate-600">
//                     <Clock className="w-3 h-3 flex-shrink-0" />
//                     <span className="whitespace-nowrap">{new Date(project.createdAt).toLocaleDateString()}</span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Delete Modal */}
//         {deleteModal && (
//           <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//             <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md">
//               <div className="flex items-center gap-3 mb-4">
//                 <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
//                   <Trash2 className="w-5 h-5 text-red-400" />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-semibold text-white">Delete Project</h3>
//                   <p className="text-sm text-slate-400">This cannot be undone</p>
//                 </div>
//               </div>
//               <p className="text-sm text-slate-300 mb-6">
//                 Are you sure? All associated services and alerts will be permanently removed.
//               </p>
//               {deleteError && (
//                 <div className="mb-4 flex items-start gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
//                   <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />{deleteError}
//                 </div>
//               )}
//               <div className="flex justify-end gap-3">
//                 <button onClick={() => setDeleteModal(null)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-white transition-colors">
//                   Cancel
//                 </button>
//                 <button onClick={handleDeleteProject} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm text-white transition-colors">
//                   Delete Project
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// }

// D:\Ai_Monitoring_Platform\ai-monitoring-ui\src\pages\projects\Projects.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProjects, createProject, deleteProject } from "../../api/project.api";
import toast from "react-hot-toast";
import {
  Folder, Plus, FileText, Trash2, Eye, Clock,
  LayoutGrid, AlertCircle, CheckCircle, XCircle,
  Loader2, ChevronRight, Info, Hash,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema } from "../../validation/projectSchema";
import { usePageTitle } from "../../hooks/usePageTitle";

const BG_STYLE = {
  backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
  backgroundSize: "50px 50px",
};

export default function Projects() {
  const navigate = useNavigate();
  usePageTitle("Projects");

  const [projects, setProjects] = useState([]);
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(projectSchema),
    mode: "onTouched",
  });

  useEffect(() => { loadProjects(); }, []);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const data = await getProjects();
      setProjects(data || []);
    } catch (e) {
      console.error("Failed loading projects", e);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    const toastId = toast.loading("Creating project...");
    try {
      await createProject(data);
      reset();
      await loadProjects();
      toast.success("Project created successfully!", { id: toastId });
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to create project", { id: toastId });
    }
  };

  const handleDeleteProject = async () => {
    if (!deleteModal) return;
    const toastId = toast.loading("Deleting project...");
    try {
      await deleteProject(deleteModal);
      setProjects((prev) => prev.filter((p) => p.id !== deleteModal));
      setDeleteModal(null);
      setDeleteError("");
      toast.success("Project deleted successfully", { id: toastId });
    } catch (err) {
      const message = err?.response?.data?.message || "Cannot delete project. Remove services first.";
      setDeleteError(message);
      toast.error(message, { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="fixed inset-0 pointer-events-none" style={{ ...BG_STYLE, opacity: 0.02 }} />

      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-10">

        {/* Header */}
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 md:mb-8">
          <div className="p-2 sm:p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 flex-shrink-0">
            <LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-white">Projects</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">Manage and monitor your projects</p>
          </div>
        </div>

        {/* Create Project - Responsive */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 md:mb-10">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-slate-800">
            <div className="p-2 sm:p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl flex-shrink-0">
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-semibold text-white">Create New Project</h2>
              <p className="text-[10px] sm:text-xs text-slate-400">Add a new project to start monitoring</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
              <div className="space-y-1.5 sm:space-y-2">
                <label className="flex items-center gap-1 text-[10px] sm:text-xs font-medium text-slate-300">
                  <FileText className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  Project Name <span className="text-red-400">*</span>
                </label>
                <input
                  {...register("name")}
                  placeholder="e.g., Production Monitoring"
                  className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-800/50 border rounded-lg text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.name
                      ? "border-red-500 focus:ring-red-500/20"
                      : "border-slate-700 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                />
                {errors.name && (
                  <p className="flex items-center gap-1 text-[10px] sm:text-xs text-red-400">
                    <XCircle className="w-3 h-3" />{errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label className="flex items-center gap-1 text-[10px] sm:text-xs font-medium text-slate-300">
                  <Info className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  Description <span className="text-slate-500 text-[10px]">(optional)</span>
                </label>
                <input
                  {...register("description")}
                  placeholder="Brief description..."
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                aria-label="Create project"
                className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-lg text-xs sm:text-sm font-medium text-white flex items-center gap-1.5 sm:gap-2 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {isSubmitting ? <><Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />Creating...</> : <><Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />Create Project</>}
              </button>
            </div>
          </form>
        </div>

        {/* Projects Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 min-w-0">
            <h2 className="text-base sm:text-lg font-semibold text-white">Your Projects</h2>
            <span className="px-1.5 sm:px-2 py-0.5 bg-slate-800 rounded-full text-[10px] sm:text-xs text-slate-400 flex-shrink-0">{projects.length} total</span>
          </div>
        </div>

        {/* Projects Grid - Responsive */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16 sm:py-20">
            <div className="text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-3 sm:mb-4" />
              <p className="text-slate-400 text-xs sm:text-sm">Loading projects...</p>
            </div>
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center bg-slate-900/30 border border-slate-800 rounded-2xl">
            <Folder className="w-10 h-10 sm:w-12 sm:h-12 text-slate-600 mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-white mb-1 sm:mb-2">No projects yet</h3>
            <p className="text-xs sm:text-sm text-slate-400">Create your first project above</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {projects.map((project) => (
              <div key={project.id} className="group bg-slate-900/50 border border-slate-800 rounded-2xl p-4 sm:p-5 md:p-6 hover:border-blue-500/50 transition-all hover:-translate-y-1">
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="p-2 sm:p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 flex-shrink-0">
                      <Folder className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm sm:text-base font-semibold text-white group-hover:text-blue-400 transition-colors truncate">
                        {project.name}
                      </h3>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Hash className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-600" />
                        <span className="text-[9px] sm:text-xs text-slate-600 font-mono">{String(project.id).slice(0, 8)}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => { setDeleteModal(project.id); setDeleteError(""); }}
                    aria-label={`Delete project ${project.name}`}
                    className="p-1.5 sm:p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-red-400 transition-all focus:outline-none focus:ring-2 focus:ring-red-500 flex-shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>

                {project.description && (
                  <p className="text-xs sm:text-sm text-slate-400 mb-3 sm:mb-4 line-clamp-2">{project.description}</p>
                )}

                <div className="flex items-center justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-800">
                  <button
                    onClick={() => navigate(`/projects/${project.id}`)}
                    aria-label={`Open project ${project.name}`}
                    className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-medium bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span className="hidden xs:inline">Open</span> Project
                    <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </button>
                  <div className="flex items-center gap-1 text-[10px] sm:text-xs text-slate-600">
                    <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    <span className="hidden xs:inline">{new Date(project.createdAt).toLocaleDateString()}</span>
                    <span className="xs:hidden">{new Date(project.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Modal - Responsive */}
        {deleteModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md mx-3 sm:mx-4">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="p-2 sm:p-3 bg-red-500/10 rounded-xl border border-red-500/20 flex-shrink-0">
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-white">Delete Project</h3>
                  <p className="text-xs sm:text-sm text-slate-400">This cannot be undone</p>
                </div>
              </div>
              <p className="text-sm sm:text-base text-slate-300 mb-4 sm:mb-6">
                Are you sure? All associated services and alerts will be permanently removed.
              </p>
              {deleteError && (
                <div className="mb-4 flex items-start gap-1.5 sm:gap-2 text-xs sm:text-sm text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 sm:p-3 rounded-lg">
                  <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5" />{deleteError}
                </div>
              )}
              <div className="flex flex-col xs:flex-row justify-end gap-2 sm:gap-3">
                <button onClick={() => setDeleteModal(null)} className="px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs sm:text-sm text-white transition-colors order-2 xs:order-1">
                  Cancel
                </button>
                <button onClick={handleDeleteProject} className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 hover:bg-red-700 rounded-lg text-xs sm:text-sm text-white transition-colors order-1 xs:order-2">
                  Delete Project
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}