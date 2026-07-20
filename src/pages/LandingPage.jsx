

// D:\Ai_Monitoring_Platform\ai-monitoring-ui\src\pages\LandingPage.jsx

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Activity } from "lucide-react"; // ✅ For the dark gradient icon

export default function LandingPage() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {   
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigateToLogin = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const platformStats = [
    { value: "60s", label: "Health Check Interval", icon: "fa-clock" },
    { value: "3σ", label: "Anomaly Threshold", icon: "fa-chart-line" },
    { value: "7d", label: "Data Retention", icon: "fa-database" },
    { value: "3×", label: "Failure Threshold", icon: "fa-repeat" },
  ];

  const features = [
    {
      icon: "fa-bolt",
      title: "AI-Powered Anomaly Detection",
      description: "3-sigma statistical detection with 15-minute cooldown for CPU, memory, latency, and error rates.",
      metric: "99.7%",
      metricLabel: "Accuracy"
    },
    {
      icon: "fa-heartbeat",
      title: "Real-Time Health Checks",
      description: "Parallel health checks every 60 seconds with configurable failure thresholds (3× retry limit).",
      metric: "60s",
      metricLabel: "Interval"
    },
    {
      icon: "fa-shield-halved",
      title: "Enterprise Security",
      description: "JWT authentication with RBAC, 1-hour sessions, and encrypted data transmission.",
      metric: "SOC2",
      metricLabel: "Compliant"
    },
    {
      icon: "fa-bell",
      title: "Smart Incident Management",
      description: "Automated incident lifecycle: OPEN → ACKNOWLEDGED → RESOLVED with SLA tracking.",
      metric: "12min",
      metricLabel: "MTTR"
    },
  ];

  const stats = [
    { value: "99.99%", label: "Uptime SLA", icon: "fa-bullseye" },
    { value: "1K+", label: "Services Monitored", icon: "fa-server" },
    { value: "50+", label: "Enterprise Teams", icon: "fa-users" },
    { value: "1000+", label: "Anomalies Detected", icon: "fa-chart-line" },
  ];

  const incidentLifecycle = [
    { status: "OPEN", color: "text-red-600", bg: "bg-red-50", border: "border-red-200", icon: "fa-exclamation-circle" },
    { status: "ACKNOWLEDGED", color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200", icon: "fa-check-circle" },
    { status: "RESOLVED", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", icon: "fa-check-circle" },
  ];

  return (
    <div className="min-h-screen bg-white font-sans antialiased">

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-sm border-b border-gray-200" : "bg-white/90 backdrop-blur-sm"
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
           {/* ✅ EXACT TAG – same as login page left panel */}
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 tracking-tight">AI Monitoring Platform</h1>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="text-xs text-emerald-600 font-medium">All systems operational</span>
                  </div>
                </div>
              </div>
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#tech" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Technology</a>
            </div>

            <button
              onClick={handleNavigateToLogin}
              className="hidden md:flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-2.5 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl text-sm font-medium text-white shadow-lg shadow-gray-200 hover:shadow-gray-300 transition-all duration-300 hover:scale-[1.02]"
            >
              <i className="fas fa-sign-in-alt"></i> Sign In
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-gray-700 text-xl`}></i>
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-200 py-4 px-4 space-y-3 shadow-lg">
              <a href="#features" className="block text-gray-700 hover:text-gray-900 transition-colors py-2 font-medium" onClick={() => setMobileMenuOpen(false)}>Features</a>
              <a href="#tech" className="block text-gray-700 hover:text-gray-900 transition-colors py-2 font-medium" onClick={() => setMobileMenuOpen(false)}>Technology</a>
              <button
                onClick={handleNavigateToLogin}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl text-sm font-medium text-white shadow-lg shadow-gray-200"
              >
                <i className="fas fa-sign-in-alt"></i> Sign In
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 sm:pt-24 lg:pt-28 pb-10 sm:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4 sm:space-y-6"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1] tracking-tight">
                AI-Monitoring
                <span className="block bg-gradient-to-r from-gray-800 via-gray-900 to-black bg-clip-text text-transparent mt-1">
                  Infrastructure
                </span>
               </h1>

              <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-lg">
                Enterprise-grade monitoring with AI anomaly detection, real-time health checks,
                and automated incident management. Built for modern engineering teams.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {platformStats.map((stat) => (
                  <div key={stat.label} className="bg-gray-50 border border-gray-200 rounded-xl p-2 sm:p-3 text-center">
                    <i className={`fas ${stat.icon} text-gray-700 text-base sm:text-lg mb-1 block`}></i>
                    <div className="text-base sm:text-lg font-bold text-gray-900">{stat.value}</div>
                    <div className="text-[8px] sm:text-[10px] text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleNavigateToLogin}
                className="group flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl text-white font-medium shadow-lg shadow-gray-200 hover:shadow-gray-300 transition-all duration-300 hover:scale-[1.02] w-full sm:w-auto"
              >
                <i className="fas fa-rocket"></i> Get Started
                <i className="fas fa-arrow-right group-hover:translate-x-0.5 transition-transform"></i>
              </button>

              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-gray-500" />
            </motion.div>

            {/* Right Content – Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xl"
            >
              <div className="bg-gray-50 border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="text-xs font-medium text-gray-700">System Overview</span>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span>Live</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors">
                    <i className="fas fa-sync-alt text-gray-400 text-sm"></i>
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <i className="fas fa-exclamation-triangle text-gray-700"></i>
                  <span className="text-xs font-medium text-gray-500">INCIDENT LIFECYCLE</span>
                </div>
                <div className="flex items-center justify-between">
                  {incidentLifecycle.map((incident) => (
                    <div key={incident.status} className="flex-1 text-center">
                      <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full ${incident.bg} border ${incident.border} mx-auto mb-1 sm:mb-2`}>
                        <i className={`fas ${incident.icon} ${incident.color}`}></i>
                      </div>
                      <span className={`text-[10px] sm:text-xs font-mono ${incident.color}`}>{incident.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <span className="text-xs font-medium text-gray-500">SERVICE STATUS</span>
                  <span className="text-xs text-gray-400">42 monitored</span>
                </div>
                <div className="space-y-2">
                  {[
                    { name: "API Gateway", status: "Operational" },
                    { name: "Auth Service", status: "Operational" },
                    { name: "Payment Processor", status: "Operational" },
                    { name: "Database Cluster", status: "Degraded" },
                  ].map((service) => (
                    <div key={service.name} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg border border-gray-100">
                      <span className="text-xs sm:text-sm text-gray-700">{service.name}</span>
                      <span className={`text-[10px] sm:text-xs font-medium ${
                        service.status === "Operational" ? "text-emerald-600" :
                        service.status === "Degraded" ? "text-yellow-600" : "text-red-600"
                      }`}>
                        {service.status}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 flex justify-between text-[10px] sm:text-xs text-gray-400">
                  <span>24 services up</span>
                  <span>1 degraded</span>
                  <span>1 down</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 border-t border-gray-200">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 text-center hover:border-gray-400 transition-all shadow-sm hover:shadow-md">
              <i className={`fas ${stat.icon} text-gray-700 text-xl sm:text-2xl mb-2 sm:mb-3 block`}></i>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-t border-gray-200">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              Enterprise-Grade{" "}
              <span className="bg-gradient-to-r from-gray-800 via-gray-900 to-black bg-clip-text text-transparent">
                Platform Features
              </span>
            </h2>
            <p className="mt-2 sm:mt-4 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
              Built for scale with enterprise-grade reliability and security.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 hover:border-gray-400 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <div className="p-2.5 sm:p-3 bg-gray-100 rounded-xl w-fit mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-200">
                  <i className={`fas ${feature.icon} text-gray-700 text-lg sm:text-xl`}></i>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                  <div className="text-base sm:text-lg font-bold text-gray-800">{feature.metric}</div>
                  <div className="text-xs text-gray-500">{feature.metricLabel}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Technology Stack */}
      <section id="tech" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-t border-gray-200">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8 sm:mb-12">
            Built with{" "}
            <span className="bg-gradient-to-r from-gray-800 via-gray-900 to-black bg-clip-text text-transparent">
              Production-Grade Technology
            </span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { name: "Spring Boot", icon: "fa-leaf", items: ["REST APIs", "Scheduled tasks", "Parallel processing"] },
              { name: "React", icon: "fa-react", items: ["Real-time UI", "Protected routes", "Recharts"] },
              { name: "MySQL", icon: "fa-database", items: ["7-day retention", "Automated cleanup", "Incident tracking"] },
              { name: "JWT Security", icon: "fa-shield-halved", items: ["1h expiry", "Role-based access", "Refresh tokens"] },
            ].map((tech) => (
              <div key={tech.name} className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 hover:border-gray-400 transition-all shadow-sm hover:shadow-md">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <i className={`fas ${tech.icon} text-gray-700 text-lg sm:text-xl`}></i>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">{tech.name}</h3>
                </div>
                <ul className="space-y-1.5 sm:space-y-2">
                  {tech.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                      <i className="fas fa-check-circle text-emerald-500"></i>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-gray-100/50 to-gray-50 border border-gray-200 rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-16 text-center">
          <div className="absolute top-0 right-0 w-32 sm:w-48 h-32 sm:h-48 bg-gray-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 sm:w-48 h-32 sm:h-48 bg-gray-200/20 rounded-full blur-3xl" />

          <div className="relative">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Ready to Monitor Your Infrastructure?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Join 500+ teams using AI Monitor for enterprise-grade monitoring and incident management.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-4 sm:mt-6 text-xs sm:text-sm text-gray-600">
              <span className="flex items-center gap-1.5">
                <i className="fas fa-shield-halved text-gray-700"></i>
                Enterprise-grade security
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-3">
            <i className="fas fa-chart-pie text-gray-700 text-lg sm:text-xl"></i>
            <span className="text-base sm:text-lg font-bold text-gray-900">AIMonitor</span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors">
              <i className="fab fa-github text-lg sm:text-xl"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors">
              <i className="fab fa-twitter text-lg sm:text-xl"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors">
              <i className="fab fa-linkedin text-lg sm:text-xl"></i>
            </a>
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 480px) {
          .xs\\:block { display: block !important; }
          .xs\\:inline { display: inline !important; }
          .xs\\:hidden { display: none !important; }
        }
        @media (min-width: 481px) {
          .xs\\:block { display: block !important; }
          .xs\\:inline { display: inline !important; }
          .xs\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}

