

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Activity, ArrowRight, CheckCircle, AlertTriangle, Shield, Zap, Server, Database, Clock, Cpu, Globe, Wifi, WifiOff } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  // Actual backend configuration from your codebase
  const backendStats = [
    { value: "60s", label: "Health Check Interval", description: "Parallel health checks every 60 seconds" },
    { value: "3σ", label: "Anomaly Threshold", description: "3-sigma deviation detection" },
    { value: "7d", label: "Data Retention", description: "7-day metric and incident storage" },
    { value: "3×", label: "Failure Threshold", description: "3 consecutive failures trigger incident" },
  ];

  // Incident lifecycle from IncidentStatus.java
  const incidentLifecycle = [
    { status: "OPEN", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", icon: AlertTriangle, description: "Auto-opened after 3 failures" },
    { status: "ACKNOWLEDGED", color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20", icon: CheckCircle, description: "Being investigated" },
    { status: "RESOLVED", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: CheckCircle, description: "Mitigation complete" },
  ];

  // Technology stack
  const techStack = [
    { name: "Spring Boot", items: ["REST APIs", "Scheduled tasks", "Parallel processing"] },
    { name: "React", items: ["Real-time UI", "Protected routes", "Recharts"] },
    { name: "MySQL", items: ["7-day retention", "Automated cleanup", "Incident tracking"] },
    { name: "JWT Security", items: ["1h expiry", "Role-based access", "Refresh tokens"] },
  ];

  // Real service types including WEBSITE
  const serviceTypes = ["API", "WEBSITE", "MICROSERVICE", "SERVER", "DATABASE"];

  // Production-level monitored services with realistic names
  const monitoredServices = [
    { name: "Payment Gateway API", type: "API", status: "UP" },
    { name: "Company Website", type: "WEBSITE", status: "UP" },
    { name: "User Authentication", type: "MICROSERVICE", status: "UP" },
    { name: "Analytics Pipeline", type: "SERVER", status: "DEGRADED" },
    { name: "Customer Database", type: "DATABASE", status: "DOWN" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 font-sans">
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
              <Activity className="w-5 h-5 text-indigo-400" />
            </div>
            <span className="text-lg font-bold text-white">Ai Monitoring Platform</span>
          </div>
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 hover:text-white transition-all"
          >
            Sign In <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 rounded-full border border-blue-500/20 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span className="text-xs font-medium text-blue-400">Ai Monitoring Platform</span>
            </div> 

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Infrastructure Health
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                with Statistical Depth
              </span>
            </h1>

            <p className="text-lg text-slate-400 mb-8 leading-relaxed max-w-xl">
              Spring Boot backend runs parallel health checks every 60 seconds with a 3-failure threshold. 
              Statistical anomaly detection identifies deviations in CPU, memory, latency, and error rates. 
              Complete incident lifecycle with role-based access control.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-all"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-4 mt-8 text-xs text-slate-600 font-mono">
              <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> JWT Auth</span>
              <span className="w-1 h-1 rounded-full bg-slate-700"></span>
              <span>RBAC</span>
              <span className="w-1 h-1 rounded-full bg-slate-700"></span>
              <span>1h Session</span>
            </div>
          </motion.div>

          {/* Right Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {backendStats.map((stat, idx) => (
                <div key={stat.label} className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
                  <div className="text-2xl font-bold text-white font-mono">{stat.value}</div>
                  <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
                  <div className="text-[10px] text-slate-600 mt-1">{stat.description}</div>
                </div>
              ))}
            </div>

            {/* Service Status - Production Level with WEBSITE and no random latencies */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Server className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-medium text-slate-400">MONITORED SERVICES</span>
              </div>
              <div className="space-y-2">
                {monitoredServices.map((service) => (
                  <div key={service.name} className="flex items-center justify-between py-2 px-3 bg-slate-800/30 rounded-lg border border-slate-700">
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${
                        service.status === "UP" ? "bg-emerald-400" :
                        service.status === "DEGRADED" ? "bg-yellow-400" : "bg-red-400"
                      }`} />
                      <span className="text-sm text-slate-300">{service.name}</span>
                      <span className="text-xs text-slate-600">{service.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {service.status === "UP" && <Wifi className="w-3 h-3 text-emerald-400" />}
                      {service.status === "DEGRADED" && <Wifi className="w-3 h-3 text-yellow-400" />}
                      {service.status === "DOWN" && <WifiOff className="w-3 h-3 text-red-400" />}
                      <span className={`text-xs font-medium ${
                        service.status === "UP" ? "text-emerald-400" :
                        service.status === "DEGRADED" ? "text-yellow-400" : "text-red-400"
                      }`}>{service.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Types */}
            <div className="mb-4 flex flex-wrap gap-2">
              {serviceTypes.map((type) => (
                <span key={type} className="px-2 py-1 bg-slate-800/50 border border-slate-700 rounded-md text-xs text-slate-400">
                  {type}
                </span>
              ))}
            </div>

            {/* Incident Lifecycle Preview */}
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-orange-400" />
                <span className="text-xs font-medium text-slate-400">INCIDENT LIFECYCLE</span>
              </div>
              <div className="flex items-center justify-between">
                {incidentLifecycle.map((incident, index) => (
                  <div key={incident.status} className="flex-1">
                    <div className="flex flex-col items-center">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${incident.bg} border ${incident.border} mb-1`}>
                        <incident.icon className={`w-4 h-4 ${incident.color}`} />
                      </div>
                      <span className={`text-xs font-mono ${incident.color}`}>{incident.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 border-t border-slate-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Built with Production-Grade Technology</h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {techStack.map((tech, idx) => (
              <div key={tech.name} className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-all">
                <h3 className="text-lg font-semibold text-white mb-3">{tech.name}</h3>
                <ul className="space-y-2">
                  {tech.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-400">
                      <CheckCircle className="w-4 h-4 text-blue-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 border-t border-slate-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-3 gap-6"
        >
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <Clock className="w-8 h-8 text-blue-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Real-time Monitoring</h3>
            <p className="text-sm text-slate-400">Parallel health checks every 60 seconds with configurable failure thresholds and immediate alerting.</p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <Zap className="w-8 h-8 text-purple-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Anomaly Detection</h3>
            <p className="text-sm text-slate-400">3-sigma statistical model detects deviations in CPU, memory, latency, and error rates with 15min cooldown.</p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <Database className="w-8 h-8 text-emerald-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Data Retention</h3>
            <p className="text-sm text-slate-400">Automated 7-day retention with daily cleanup. All incidents and metrics stored in MySQL.</p>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            <span>AI Monitoring Platform</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Spring Boot</span>
            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
            <span>React</span>
            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
            <span>MySQL</span>
          </div>
        </div>
      </footer>
    </div>
  );
}