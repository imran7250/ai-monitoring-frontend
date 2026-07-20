// D:\Ai_Monitoring_Platform\ai-monitoring-ui\src\pages\auth\Login.jsx

import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/client";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Activity, Server, Shield, Cpu, Clock, Zap, CheckCircle, AlertTriangle, XCircle, Database, Globe, BarChart3, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../validation/loginSchema";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data) => {
    setLoginError(null);
    try {
      const res = await api.post("/auth/login", data);
      login(res.data.user, res.data.token);
      navigate("/home");
    } catch (e) {
      setLoginError(e?.response?.data?.message || "Invalid credentials");
    }
  };

  // Backend config (unchanged)
  const backendConfig = [
    { icon: Clock, label: "CHECK INTERVAL", value: "60s", category: "Health Checks" },
    { icon: Zap, label: "THRESHOLD", value: "3.0σ", category: "Anomaly Detection" },
    { icon: Shield, label: "JWT EXPIRY", value: "1h", category: "Security" },
    { icon: Server, label: "RETENTION", value: "7d", category: "Data Management" },
    { icon: Cpu, label: "RETRY LIMIT", value: "3×", category: "Health Checks" },
    { icon: Activity, label: "COOLDOWN", value: "15min", category: "Anomaly Detection" },
    { icon: Database, label: "PARALLEL", value: "Enabled", category: "Performance" },
    { icon: Bell, label: "ALERTS", value: "5min", category: "Notifications" },
  ];

  const incidentLifecycle = [
    { status: "OPEN", color: "text-red-600", bg: "bg-red-50", border: "border-red-200", icon: AlertTriangle, description: "New incident detected" },
    { status: "ACKNOWLEDGED", color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200", icon: CheckCircle, description: "Being investigated" },
    { status: "RESOLVED", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", icon: CheckCircle, description: "Mitigation complete" },
  ];

  const architectureHighlights = [
    { icon: Server, title: "Spring Boot Backend", items: ["REST APIs with JWT", "Scheduled health checks", "Parallel stream processing"] },
    { icon: Globe, title: "React Frontend", items: ["Real-time updates", "Mobile responsive", "Recharts visualization"] },
    { icon: Database, title: "MySQL Database", items: ["7-day retention", "Automated cleanup", "Incident tracking"] },
    { icon: BarChart3, title: "Anomaly Detection", items: ["3-sigma threshold", "Deviation scoring", "15min cooldown"] },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row font-sans">
      
      {/* Left Panel - Hidden on mobile, visible on lg screens */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gray-50 border-r border-gray-200">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
        
        <div className="relative w-full p-6 xl:p-8 flex flex-col overflow-y-auto">
          <div className="flex items-center justify-between mb-6 xl:mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </div> 
              <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">AI Monitoring Platform</h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs text-emerald-600 font-medium">All systems operational</span>
                </div>
              </div>
            </div>
          </div>  

          <div className="mb-6 xl:mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-200 mb-4">
              <Zap className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-xs font-medium text-blue-700">AI Monitoring Platform</span>
            </div>
            <h2 className="text-2xl xl:text-3xl font-bold text-gray-900 mb-3 leading-tight">
              Infrastructure<br />
              <span className="bg-gradient-to-r from-gray-800 via-gray-900 to-black bg-clip-text text-transparent">
                Health & Performance Monitoring
              </span>
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed max-w-xl">
              Real-time health checks with statistical anomaly detection, automated incident workflows, 
              and role-based access control. Built with Spring Boot, React, and MySQL.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 xl:gap-4 mb-6 xl:mb-8">
            {architectureHighlights.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-400 transition-all group shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                    <item.icon className="w-4 h-4 text-gray-700" />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{item.title}</span>
                </div>
                <ul className="space-y-1.5">
                  {item.items.map((text, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
                      <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                      {text}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <div className="mb-6 xl:mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Server className="w-4 h-4 text-gray-700" />
              <h3 className="text-sm font-semibold text-gray-900">System Configuration</h3>
            </div>
            <div className="grid grid-cols-4 gap-2 xl:gap-3">
              {backendConfig.map((item, idx) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  className="bg-white border border-gray-200 rounded-lg p-2 xl:p-3 hover:border-gray-400 transition-all shadow-sm"
                >
                  <div className="flex items-center justify-between mb-1">
                    <item.icon className="w-3.5 h-3.5 text-gray-600" />
                    <span className="text-[10px] text-gray-500 font-mono">{item.category}</span>
                  </div>
                  <div className="font-mono text-base xl:text-lg font-semibold text-gray-900">
                    {item.value}
                  </div>
                  <div className="text-[10px] text-gray-500 truncate">{item.label}</div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 xl:p-5 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-semibold text-gray-900">Incident Lifecycle</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between bg-gray-50 rounded-lg p-4 border border-gray-200 gap-4">
              {incidentLifecycle.map((incident, index) => {
                const Icon = incident.icon;
                return (
                  <div key={incident.status} className="flex-1 w-full">
                    <div className="flex flex-col items-center">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full ${incident.bg} border ${incident.border} mb-2`}>
                        <Icon className={`w-5 h-5 ${incident.color}`} />
                      </div>
                      <span className={`text-sm font-mono font-medium ${incident.color}`}>{incident.status}</span>
                      <span className="text-[10px] text-gray-500 mt-1 text-center">{incident.description}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 text-xs text-gray-500 bg-gray-50 rounded-lg p-3 border border-gray-200 text-center">
              Real-time incident tracking with automated status transitions
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-gray-200">
            <div className="flex items-center gap-4 text-xs flex-wrap">
              <span className="text-gray-500 font-mono">Spring Boot</span>
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <span className="text-gray-500 font-mono">React</span>
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <span className="text-gray-500 font-mono">MySQL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form - Full width on mobile */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-md">
          
          {/* Mobile Logo - Always visible */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-6 sm:mb-8">
            <div className="p-3 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">AIMonitor</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs text-gray-500">production</span>
              </div>
            </div>
          </div>

          {/* Login Card - White Theme */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg"
          >
            <div className="mb-5 sm:mb-6 md:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Welcome back</h2>
              <p className="text-sm text-gray-500">Sign in to access your monitoring dashboard</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gray-700 transition-colors" />
                  <input
                    type="email"
                    placeholder="admin@company.com"
                    {...register("email")}
                    className={`w-full bg-gray-50 border rounded-lg pl-10 pr-4 py-2.5 sm:py-3 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.email 
                        ? "border-red-400 focus:ring-red-200" 
                        : "border-gray-200 focus:border-gray-400 focus:ring-gray-200"
                    }`}
                  />
                </div>
                {errors.email && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1.5 text-xs text-red-600 flex items-center gap-1"
                  >
                    <XCircle className="w-3 h-3" />
                    {errors.email.message}
                  </motion.p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-gray-600">Password</label>
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gray-700 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                    className={`w-full bg-gray-50 border rounded-lg pl-10 pr-10 py-2.5 sm:py-3 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.password 
                        ? "border-red-400 focus:ring-red-200" 
                        : "border-gray-200 focus:border-gray-400 focus:ring-gray-200"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1.5 text-xs text-red-600 flex items-center gap-1"
                  >
                    <XCircle className="w-3 h-3" />
                    {errors.password.message}
                  </motion.p>
                )}
              </div>

              <AnimatePresence>
                {loginError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-50 border border-red-200 rounded-lg p-3"
                  >
                    <p className="text-xs text-red-600 text-center flex items-center justify-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {loginError}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white font-medium py-3 sm:py-3.5 px-4 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 group shadow-lg shadow-gray-200 hover:shadow-gray-300"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-gray-500">New to AIMonitor?</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/register")}
                className="w-full bg-transparent border border-gray-300 hover:border-gray-500 text-gray-700 hover:text-gray-900 font-medium py-2.5 sm:py-3 px-4 rounded-lg transition-all"
              >
                Create an account
              </button>
            </form>
          </motion.div>

          <div className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs">
            <span className="text-gray-500 font-mono flex items-center gap-1">
              <Shield className="w-3 h-3 text-gray-600" />
              JWT Auth
            </span>
            <span className="w-px h-3 bg-gray-300"></span>
            <span className="text-gray-500 font-mono">RBAC</span>
            <span className="w-px h-3 bg-gray-300"></span>
            <span className="text-gray-500 font-mono">1h Session</span>
          </div>
        </div>
      </div>
    </div>
  );
}