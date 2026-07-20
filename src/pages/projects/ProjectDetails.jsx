// D:\Ai_Monitoring_Platform\ai-monitoring-ui\src\pages\projects\ProjectDetails.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../api/client";

import {
  ArrowLeft,
  Cpu,
  Globe,
  Server,
  Activity,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  Link as LinkIcon,
  Trash2
} from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { serviceSchema, SERVICE_TYPES } from "../../validation/serviceSchema";

export default function ProjectDetails() {

  const { projectId } = useParams();
  const numericProjectId = Number(projectId);

  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [services, setServices] = useState([]);
  const [isSubmittedOnce, setIsSubmittedOnce] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues: { type: "API" },
    mode: "onChange"
  });

  useEffect(() => {
    if (!numericProjectId) {
      console.error("Invalid project ID:", projectId);
      return;
    }
    loadProject();
    loadServices();
  }, [numericProjectId]);

  const loadProject = async () => {
    try {
      const res = await api.get(`/api/projects/${numericProjectId}`);
      setProject(res.data);
    } catch (e) {
      console.error("Failed loading project:", e.response?.data);
    }
  };

  const loadServices = async () => {
    try {
      const res = await api.get(`/api/services`);
      const filtered = (res.data || []).filter(
        s => s.projectId === numericProjectId
      );
      setServices(filtered);
    } catch (e) {
      console.error("Failed loading services:", e.response?.data);
    }
  };

  const onSubmit = async (data) => {
    try {
      await api.post(`/api/services`, {
        projectId: numericProjectId,
        name: data.name,
        baseUrl: data.baseUrl,
        type: data.type
      });
      reset();
      setIsSubmittedOnce(false);
      loadServices();
    } catch (e) {
      console.error("Backend error:", e.response?.data);
    }
  };

  const deleteService = async () => {
    if (!serviceToDelete) return;
    try {
      await api.delete(`/api/services/${serviceToDelete}`);
      setServices(prev =>
        prev.filter(service => service.id !== serviceToDelete)
      );
      setServiceToDelete(null);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete service");
    }
  };

  const colorMap = {
    emerald: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-700",
      dot: "bg-emerald-500"
    },
    red: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      dot: "bg-red-500"
    },
    yellow: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-700",
      dot: "bg-yellow-500"
    },
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
      dot: "bg-blue-500"
    },
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      text: "text-purple-700",
      dot: "bg-purple-500"
    },
    slate: {
      bg: "bg-gray-50",
      border: "border-gray-200",
      text: "text-gray-600",
      dot: "bg-gray-400"
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "UP":
        return { icon: CheckCircle, color: "emerald" };
      case "DOWN":
        return { icon: XCircle, color: "red" };
      case "DEGRADED":
        return { icon: AlertCircle, color: "yellow" };
      default:
        return { icon: Activity, color: "slate" };
    }
  };

  const getTypeIcon = (type) => {
    switch (type?.toUpperCase()) {
      case "API":
        return { icon: Cpu, color: "blue" };
      case "WEBSITE":
        return { icon: Globe, color: "purple" };
      case "MICROSERVICE":
        return { icon: Server, color: "emerald" };
      default:
        return { icon: Server, color: "slate" };
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-700 rounded-full animate-spin mx-auto mb-3" />
          <span className="text-gray-500 text-sm">Loading project...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">

      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">

        {/* Header */}
        <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 sm:gap-4">
          <button
            onClick={() => navigate("/projects")}
            className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 border border-gray-200 rounded-xl hover:bg-gray-200 transition text-gray-700 text-xs sm:text-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
            <span className="hidden xs:inline">Back to Projects</span>
            <span className="xs:hidden">Back</span>
          </button>

          <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 border border-gray-200 rounded-full text-xs sm:text-sm text-gray-600">
            {services.length} Service{services.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Project Info */}
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            {project.name}
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1 sm:mt-2">
            {project.description || "No description provided"}
          </p>
        </div>

        {/* Add Service - White Theme */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
            Add New Service
          </h2>

          <form
            onSubmit={handleSubmit(
              (data) => {
                setIsSubmittedOnce(true);
                onSubmit(data);
              },
              () => {
                setIsSubmittedOnce(true);
              }
            )}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
          >
            {/* NAME */}
            <div>
              <input
                {...register("name")}
                placeholder="Service Name"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition-all"
              />
              {isSubmittedOnce && errors.name && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* BASE URL */}
            <div>
              <input
                {...register("baseUrl")}
                placeholder="https://api.example.com"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition-all"
              />
              {!errors.name && errors.baseUrl && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.baseUrl.message}
                </p>
              )}
            </div>

            {/* TYPE */}
            <div>
              <select
                {...register("type")}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition-all"
              >
                {SERVICE_TYPES.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.type.message}
                </p>
              )}
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 rounded-xl text-white font-medium min-w-[120px] h-[46px] sm:h-[48px] flex items-center justify-center px-4 sm:px-6 transition-all shadow-sm disabled:opacity-50 text-sm"
            >
              {isSubmitting ? "Adding..." : "Add Service"}
            </button>
          </form>
        </div>

        {/* Services Grid - White Theme */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {services.map(service => {
            const { icon: StatusIcon, color: statusColor } = getStatusInfo(service.status);
            const { icon: TypeIcon, color: typeColor } = getTypeIcon(service.type);
            const statusStyles = colorMap[statusColor];
            const typeStyles = colorMap[typeColor];

            return (
              <div
                key={service.id}
                onClick={() => navigate(`/services/${service.id}`)}
                className="group bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 md:p-6 cursor-pointer hover:border-gray-400 hover:shadow-md transition-all hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className={`p-2 sm:p-2.5 rounded-xl ${typeStyles.bg} ${typeStyles.border} flex-shrink-0`}>
                      <TypeIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${typeStyles.text}`} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 group-hover:text-gray-700 transition-colors truncate">
                        {service.name}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-gray-500">
                        {service.type}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setServiceToDelete(service.id);
                    }}
                    className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 text-red-400 hover:text-red-600 transition flex-shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-[10px] sm:text-xs text-gray-500 bg-gray-50 p-2 sm:p-3 rounded-lg mb-3 sm:mb-4">
                  <LinkIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{service.baseUrl}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs text-gray-400">Status</span>
                  <div className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full ${statusStyles.bg} ${statusStyles.border}`}>
                    <StatusIcon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${statusStyles.text}`} />
                    <span className={`text-[10px] sm:text-xs font-medium ${statusStyles.text}`}>
                      {service.status || "UNKNOWN"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200 text-[10px] sm:text-xs text-gray-400">
                  <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span className="font-mono">#{String(service.id).slice(0, 6)}...</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Delete Modal - White Theme */}
      {serviceToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-3 sm:p-4">
          <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-sm sm:max-w-md p-4 sm:p-6 mx-3 sm:mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-red-50 rounded-xl border border-red-200 flex-shrink-0">
                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Delete Service</h2>
                <p className="text-xs sm:text-sm text-gray-500">This cannot be undone</p>
              </div>
            </div>

            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
              Are you sure you want to delete this service? This action will permanently remove all monitoring data.
            </p>

            <div className="flex flex-col xs:flex-row justify-end gap-2 sm:gap-3">
              <button
                onClick={() => setServiceToDelete(null)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs sm:text-sm text-gray-700 transition order-2 xs:order-1"
              >
                Cancel
              </button>
              <button
                onClick={deleteService}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 hover:bg-red-700 rounded-lg text-xs sm:text-sm text-white transition order-1 xs:order-2"
              >
                Delete Service
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}