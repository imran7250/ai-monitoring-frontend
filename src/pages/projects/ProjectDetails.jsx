

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
  // delete state
  const [serviceToDelete, setServiceToDelete] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting } // ✅ FIX 1: removed touchedFields
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


  // delete service
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
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      text: "text-emerald-400"
    },
    red: {
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      text: "text-red-400"
    },
    yellow: {
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
      text: "text-yellow-400"
    },
    blue: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      text: "text-blue-400"
    },
    purple: {
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      text: "text-purple-400"
    },
    slate: {
      bg: "bg-slate-500/10",
      border: "border-slate-500/20",
      text: "text-slate-400"
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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <span className="text-slate-400">Loading project...</span>
      </div>
    );

  }

  return (

    <div className="min-h-screen bg-slate-950 p-6 lg:p-8">

      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}

        <div className="flex items-center justify-between">

          <button
            onClick={() => navigate("/projects")}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 transition"
          >

            <ArrowLeft className="w-4 h-4 text-slate-400" />

            <span className="text-sm text-slate-400">
              Back to Projects
            </span>

          </button>

          <span className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-full text-sm text-slate-300">

            {services.length} Service{services.length !== 1 ? "s" : ""}

          </span>

        </div>


        {/* Project Info */}

        <div>

          <h1 className="text-4xl font-bold text-white">
            {project.name}
          </h1>

          <p className="text-slate-400 mt-2">
            {project.description || "No description provided"}
          </p>

        </div>


        {/* Add Service */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

          <h2 className="text-xl font-semibold text-white mb-6">
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >

            {/* NAME */}
            <div>
              <input
                {...register("name")}
                placeholder="Service Name"
                className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white w-full"
              />
              {/* ✅ FIX 2: show name error only after submit clicked */}
              {isSubmittedOnce && errors.name && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* BASE URL */}
            <div>
              <input
                {...register("baseUrl")}
                placeholder="https://api.example.com"
                className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white w-full"
              />
              {/* ✅ FIX 3: show baseUrl error only when name is valid */}
              {/* {isSubmittedOnce && !errors.name && errors.baseUrl && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.baseUrl.message}
                </p>
              )} */}

              {!errors.name && errors.baseUrl && (
  <p className="text-red-400 text-xs mt-1">
    {errors.baseUrl.message}
  </p>
)}
            </div>

            {/* TYPE */}
            <div>
              <select
                {...register("type")}
                className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white w-full"
              >
                {SERVICE_TYPES.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              {errors.type && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.type.message}
                </p>
              )}
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-600 rounded-xl text-white min-w-[140px] h-[48px] flex items-center justify-center"
            >
              {isSubmitting ? "Adding..." : "Add Service"}
            </button>

          </form>

        </div>


        {/* Services Grid */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {services.map(service => {

            const { icon: StatusIcon, color: statusColor } =
              getStatusInfo(service.status);

            const { icon: TypeIcon, color: typeColor } =
              getTypeIcon(service.type);

            const statusStyles = colorMap[statusColor];
            const typeStyles = colorMap[typeColor];

            return (

              <div
                key={service.id}
                onClick={() => navigate(`/services/${service.id}`)}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 cursor-pointer hover:border-blue-500/50 transition"
              >

                <div className="flex items-center justify-between mb-4">

                  <div className="flex items-center gap-3">

                    <div className={`p-2.5 rounded-xl ${typeStyles.bg} ${typeStyles.border}`}>
                      <TypeIcon className={`w-5 h-5 ${typeStyles.text}`} />
                    </div>

                    <div>

                      <h3 className="text-lg font-semibold text-white">
                        {service.name}
                      </h3>

                      <p className="text-xs text-slate-500">
                        {service.type}
                      </p>

                    </div>

                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setServiceToDelete(service.id);
                    }}
                    className="p-1.5 rounded-md hover:bg-red-500/20 text-red-400 transition"
                  >

                    <Trash2 className="w-4 h-4" />

                  </button>

                </div>


                <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/30 p-2 rounded-lg mb-4">

                  <LinkIcon className="w-3.5 h-3.5" />

                  <span className="truncate">
                    {service.baseUrl}
                  </span>

                </div>


                <div className="flex items-center justify-between">

                  <span className="text-xs text-slate-500">
                    Status
                  </span>

                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${statusStyles.bg} ${statusStyles.border}`}>

                    <StatusIcon className={`w-3.5 h-3.5 ${statusStyles.text}`} />

                    <span className={`text-xs ${statusStyles.text}`}>
                      {service.status || "UNKNOWN"}
                    </span>

                  </div>

                </div>


                <div className="flex items-center gap-2 mt-4 text-xs text-slate-500">

                  <Clock className="w-3 h-3" />

                  ID: {String(service.id).slice(0,6)}...

                </div>

              </div>

            );

          })}

        </div>

      </div>


      {/* Delete Modal */}

      {serviceToDelete && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6">

            <h2 className="text-lg font-semibold text-white mb-2">
              Delete Service
            </h2>

            <p className="text-sm text-slate-400 mb-6">
              Are you sure you want to delete this service?
              This action will permanently remove all monitoring data.
            </p>

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setServiceToDelete(null)}
                className="px-4 py-2 text-sm rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
              >
                Cancel
              </button>

              <button
                onClick={deleteService}
                className="px-4 py-2 text-sm rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
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
