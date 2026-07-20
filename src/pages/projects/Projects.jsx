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
import PageHeader from "../../components/ui/PageHeader";

const BG_STYLE = {
  backgroundImage: `linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)`,
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
    <div className="min-h-screen bg-white">
      <div className="fixed inset-0 pointer-events-none" style={{ ...BG_STYLE, opacity: 0.5 }} />

      {/* ✅ PageHeader with Back Button */}
      <PageHeader title="Projects" />

      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-10">

        {/* Sub-header with icon and description */}
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 md:mb-8">
          <div className="p-2 sm:p-3 bg-gray-100 rounded-xl border border-gray-200 flex-shrink-0">
            <LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Projects</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Manage and monitor your projects</p>
          </div>
        </div>

        {/* Create Project - White Theme */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 md:mb-10 shadow-sm">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-200">
            <div className="p-2 sm:p-2.5 bg-gray-100 border border-gray-200 rounded-xl flex-shrink-0">
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Create New Project</h2>
              <p className="text-[10px] sm:text-xs text-gray-500">Add a new project to start monitoring</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
              <div className="space-y-1.5 sm:space-y-2">
                <label className="flex items-center gap-1 text-[10px] sm:text-xs font-medium text-gray-700">
                  <FileText className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("name")}
                  placeholder="e.g., Production Monitoring"
                  className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 border rounded-lg text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.name
                      ? "border-red-400 focus:ring-red-200"
                      : "border-gray-200 focus:border-gray-400 focus:ring-gray-200"
                  }`}
                />
                {errors.name && (
                  <p className="flex items-center gap-1 text-[10px] sm:text-xs text-red-600">
                    <XCircle className="w-3 h-3" />{errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label className="flex items-center gap-1 text-[10px] sm:text-xs font-medium text-gray-700">
                  <Info className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  Description <span className="text-gray-400 text-[10px]">(optional)</span>
                </label>
                <input
                  {...register("description")}
                  placeholder="Brief description..."
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                aria-label="Create project"
                className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 rounded-lg text-xs sm:text-sm font-medium text-white flex items-center gap-1.5 sm:gap-2 disabled:opacity-50 transition-all shadow-sm"
              >
                {isSubmitting ? <><Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />Creating...</> : <><Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />Create Project</>}
              </button>
            </div>
          </form>
        </div>

        {/* Projects Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 min-w-0">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Your Projects</h2>
            <span className="px-1.5 sm:px-2 py-0.5 bg-gray-100 rounded-full text-[10px] sm:text-xs text-gray-500 flex-shrink-0">{projects.length} total</span>
          </div>
        </div>

        {/* Projects Grid - White Theme */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16 sm:py-20">
            <div className="text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-gray-200 border-t-gray-700 rounded-full animate-spin mx-auto mb-3 sm:mb-4" />
              <p className="text-gray-500 text-xs sm:text-sm">Loading projects...</p>
            </div>
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center bg-gray-50 border border-gray-200 rounded-2xl">
            <Folder className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">No projects yet</h3>
            <p className="text-xs sm:text-sm text-gray-500">Create your first project above</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {projects.map((project) => (
              <div key={project.id} className="group bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 md:p-6 hover:border-gray-400 hover:shadow-md transition-all hover:-translate-y-1">
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="p-2 sm:p-3 rounded-xl bg-gray-100 border border-gray-200 flex-shrink-0">
                      <Folder className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-gray-700 transition-colors truncate">
                        {project.name}
                      </h3>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Hash className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-400" />
                        <span className="text-[9px] sm:text-xs text-gray-400 font-mono">{String(project.id).slice(0, 8)}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => { setDeleteModal(project.id); setDeleteError(""); }}
                    aria-label={`Delete project ${project.name}`}
                    className="p-1.5 sm:p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 text-red-400 hover:text-red-600 transition-all focus:outline-none focus:ring-2 focus:ring-red-400 flex-shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>

                {project.description && (
                  <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 line-clamp-2">{project.description}</p>
                )}

                <div className="flex items-center justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                  <button
                    onClick={() => navigate(`/projects/${project.id}`)}
                    aria-label={`Open project ${project.name}`}
                    className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-gray-400"
                  >
                    <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span className="hidden xs:inline">Open</span> Project
                    <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </button>
                  <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-400">
                    <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    <span className="hidden xs:inline">{new Date(project.createdAt).toLocaleDateString()}</span>
                    <span className="xs:hidden">{new Date(project.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Modal - White Theme */}
        {deleteModal && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50">
            <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md mx-3 sm:mx-4 shadow-xl">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="p-2 sm:p-3 bg-red-50 rounded-xl border border-red-200 flex-shrink-0">
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Delete Project</h3>
                  <p className="text-xs sm:text-sm text-gray-500">This cannot be undone</p>
                </div>
              </div>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                Are you sure? All associated services and alerts will be permanently removed.
              </p>
              {deleteError && (
                <div className="mb-4 flex items-start gap-1.5 sm:gap-2 text-xs sm:text-sm text-red-600 bg-red-50 border border-red-200 p-2.5 sm:p-3 rounded-lg">
                  <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5" />{deleteError}
                </div>
              )}
              <div className="flex flex-col xs:flex-row justify-end gap-2 sm:gap-3">
                <button onClick={() => setDeleteModal(null)} className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs sm:text-sm text-gray-700 transition-colors order-2 xs:order-1">
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