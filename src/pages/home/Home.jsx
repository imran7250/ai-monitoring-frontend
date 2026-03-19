


import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Server,
  AlertTriangle,
  Bell,
  Activity,
  ArrowRight,
} from "lucide-react";
import { usePageTitle } from "../../hooks/usePageTitle";

export default function Home() {
  const navigate = useNavigate();
  usePageTitle("Home");

  const modules = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
      description: "System overview & metrics",
      color: "blue",
    },
    {
      title: "Projects",
      path: "/projects",
      icon: FolderKanban,
      description: "Manage your projects",
      color: "emerald",
    },
    {
      title: "Services",
      path: "/services",
      icon: Server,
      description: "Service health monitoring",
      color: "purple",
    },
    {
      title: "Incidents",
      path: "/incidents",
      icon: AlertTriangle,
      description: "Active incidents",
      color: "red",
    },
    {
      title: "Alerts",
      path: "/alerts",
      icon: Bell,
      description: "Alert configurations",
      color: "yellow",
    },
    {
      title: "Notifications",
      path: "/notifications",
      icon: Activity,
      description: "Service notifications",
      color: "indigo",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">

      {/* Header */}
      <div className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }} />
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-8 py-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">
                AI Monitoring Platform
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-sm text-slate-400">System Status: Operational</p>
              </div>
            </div>
          </div>
          <p className="text-lg text-slate-400 max-w-2xl">
            Monitor your infrastructure health, track incidents, and manage alerts in real-time
          </p>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <div
              key={module.title}
              onClick={() => navigate(module.path)}
              className="group relative bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 cursor-pointer hover:border-slate-500/50 hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              {/* Icon */}
              <div className="inline-flex p-4 rounded-xl bg-slate-700/30 border border-slate-600/20 mb-5 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
                <module.icon className="w-7 h-7 text-slate-300" />
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">{module.title}</h2>
              <p className="text-slate-400 mb-6 text-sm">{module.description}</p>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Click to access</span>
                <ArrowRight className="w-5 h-5 text-slate-400 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
              <span>All systems operational</span>
            </div>
            <span>AI Monitoring Platform v1.0</span>
          </div>
        </div>
      </div>

    </div>
  );
}

