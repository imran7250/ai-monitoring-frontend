import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/client";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Activity, Server, Shield, Cpu, Clock, Zap, CheckCircle, AlertTriangle, XCircle, Database, Globe, BarChart3, Bell, Github, Twitter, Linkedin } from "lucide-react";
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
      navigate("/dashboard");
    } catch (e) {
      setLoginError(e?.response?.data?.message || "Invalid credentials");
    }
  };

  // Actual backend configuration values from your codebase
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

  // Incident lifecycle from IncidentStatus.java
  const incidentLifecycle = [
    { status: "OPEN", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", icon: AlertTriangle, description: "New incident detected" },
    { status: "ACKNOWLEDGED", color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20", icon: CheckCircle, description: "Being investigated" },
    { status: "RESOLVED", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: CheckCircle, description: "Mitigation complete" },
  ];

  // Architecture highlights - UPDATED with MySQL and Anomaly Detection
  const architectureHighlights = [
    { icon: Server, title: "Spring Boot Backend", items: ["REST APIs with JWT", "Scheduled health checks", "Parallel stream processing"] },
    { icon: Globe, title: "React Frontend", items: ["Real-time updates", "Mobile responsive", "Recharts visualization"] },
    { icon: Database, title: "MySQL Database", items: ["7-day retention", "Automated cleanup", "Incident tracking"] },
    { icon: BarChart3, title: "Anomaly Detection", items: ["3-sigma threshold", "Deviation scoring", "15min cooldown"] },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col lg:flex-row font-sans">
      
      {/* Left Panel - Production Infrastructure Dashboard - Hidden on mobile, visible on lg screens */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900/50 border-r border-slate-800">
        
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59,130,246,0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
        
        <div className="relative w-full p-8 flex flex-col overflow-y-auto">
          
          {/* Header with Status */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl border border-blue-500/30">
                <Activity className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">Ai Monitoring Platform</h1>
                <div className="flex items-center gap-2 mt-0.5">
                  {/* <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                  </span> */}
                 
                </div>
              </div>
            </div>
         
          </div>  

          {/* Hero Section - Professional Summary */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 rounded-full border border-blue-500/20 mb-4">
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs font-medium text-blue-400">Ai Monitoring Platform</span>
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
              Infrastructure<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Health & Performance Monitoring
              </span>
            </h2>
            
            <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
              Real-time health checks with statistical anomaly detection, automated incident workflows, 
              and role-based access control. Built with Spring Boot, React, and MySQL.
            </p>
          </div>

          {/* Architecture Cards Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {architectureHighlights.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 hover:border-blue-500/30 transition-all group"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                    <item.icon className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-sm font-semibold text-white">{item.title}</span>
                </div>
                <ul className="space-y-1.5">
                  {item.items.map((text, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-slate-400">
                      <div className="w-1 h-1 rounded-full bg-blue-400/50"></div>
                      {text}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* System Configuration Cards - Simplified without file names */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Server className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-white">System Configuration</h3>
            </div>
            
            <div className="grid grid-cols-4 gap-3">
              {backendConfig.map((item, idx) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  className="bg-slate-800/30 border border-slate-700 rounded-lg p-3 hover:border-blue-500/40 transition-all"
                >
                  <div className="flex items-center justify-between mb-1">
                    <item.icon className="w-3.5 h-3.5 text-blue-400/70" />
                    <span className="text-[10px] text-slate-600 font-mono">{item.category}</span>
                  </div>
                  <div className="font-mono text-lg font-semibold text-white">
                    {item.value}
                  </div>
                  <div className="text-[10px] text-slate-600 truncate">{item.label}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Incident Lifecycle Card */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-xl p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-semibold text-white">Incident Lifecycle</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-900/50 rounded-lg p-4 border border-slate-700 gap-4">
              {incidentLifecycle.map((incident, index) => {
                const Icon = incident.icon;
                return (
                  <div key={incident.status} className="flex-1 w-full">
                    <div className="flex flex-col items-center">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full ${incident.bg} border ${incident.border} mb-2`}>
                        <Icon className={`w-5 h-5 ${incident.color}`} />
                      </div>
                      <span className={`text-sm font-mono font-medium ${incident.color}`}>{incident.status}</span>
                      <span className="text-[10px] text-slate-500 mt-1 text-center">{incident.description}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-4 text-xs text-slate-500 bg-slate-900/30 rounded-lg p-3 border border-slate-700 text-center">
              Real-time incident tracking with automated status transitions
            </div>
          </div>

          {/* Footer with Tech Stack */}
          <div className="mt-auto pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4 text-xs flex-wrap">
                <span className="text-slate-600 font-mono">Spring Boot</span>
                <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                <span className="text-slate-600 font-mono">React</span>
                <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                <span className="text-slate-600 font-mono">MySQL</span>
              </div>
             
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form - Full width on mobile */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          
          {/* Mobile Logo - Always visible */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl border border-blue-500/30">
              <Activity className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <span className="text-xl font-bold text-white">AIMonitor</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <span className="text-xs text-slate-500">production</span>
              </div>
            </div>
          </div>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-slate-900/90 to-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-2xl"
          >
            {/* Card Header */}
            <div className="mb-6 sm:mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
              <p className="text-sm text-slate-400">Sign in to access your monitoring dashboard</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              
              {/* Email Field */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                  <input
                    type="email"
                    placeholder="admin@company.com"
                    {...register("email")}
                    className={`w-full bg-slate-800/50 border rounded-lg pl-10 pr-4 py-3 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 transition-all ${
                      errors.email 
                        ? "border-red-500 focus:ring-red-500/20" 
                        : "border-slate-700 focus:border-blue-500 focus:ring-blue-500/20"
                    }`}
                  />
                </div>
                {errors.email && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-xs text-red-400 flex items-center gap-1"
                  >
                    <XCircle className="w-3 h-3" />
                    {errors.email.message}
                  </motion.p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-slate-400">Password</label>
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                    className={`w-full bg-slate-800/50 border rounded-lg pl-10 pr-10 py-3 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 transition-all ${
                      errors.password 
                        ? "border-red-500 focus:ring-red-500/20" 
                        : "border-slate-700 focus:border-blue-500 focus:ring-blue-500/20"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-400 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-xs text-red-400 flex items-center gap-1"
                  >
                    <XCircle className="w-3 h-3" />
                    {errors.password.message}
                  </motion.p>
                )}
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {loginError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-500/10 border border-red-500/20 rounded-lg p-3"
                  >
                    <p className="text-xs text-red-400 text-center flex items-center justify-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {loginError}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium py-3.5 px-4 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
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

              {/* Register Link */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-slate-900 text-slate-500">New to AIMonitor?</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/register")}
                className="w-full bg-transparent border border-slate-700 hover:border-blue-500/50 text-slate-300 hover:text-white font-medium py-3 px-4 rounded-lg transition-all"
              >
                Create an account
              </button>

            </form>
          </motion.div>

          {/* Security Footer */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs">
            <span className="text-slate-600 font-mono flex items-center gap-1">
              <Shield className="w-3 h-3" />
              JWT Auth
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
            <span className="text-slate-600 font-mono">RBAC</span>
            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
            <span className="text-slate-600 font-mono">1h Session</span>
          </div>
        </div>
      </div>
    </div>
  );
}