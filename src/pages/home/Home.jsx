// D:\Ai_Monitoring_Platform\ai-monitoring-ui\src\pages\home\Home.jsx

import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Server,
  AlertTriangle,
  Bell,
  Activity,
  ArrowRight,
  LogOut,
  User,
  Shield,
  Sparkles,
} from "lucide-react";
import { usePageTitle } from "../../hooks/usePageTitle";
import toast from "react-hot-toast";

export default function Home() {
  const navigate = useNavigate();
  usePageTitle("Home");

  // Get current user
  let user = {};
  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch (e) {
    user = {};
  }
  const isAdmin = user?.role === "ROLE_ADMIN";
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // Core modules (always visible)
  const modules = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
      description: "System overview & metrics",
      bg: "bg-blue-50",
      border: "border-blue-200",
      iconColor: "text-blue-600",
      hoverBorder: "group-hover:border-blue-400",
    },
    {
      title: "Projects",
      path: "/projects",
      icon: FolderKanban,
      description: "Manage your projects",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      iconColor: "text-emerald-600",
      hoverBorder: "group-hover:border-emerald-400",
    },
    {
      title: "Services",
      path: "/services",
      icon: Server,
      description: "Service health monitoring",
      bg: "bg-purple-50",
      border: "border-purple-200",
      iconColor: "text-purple-600",
      hoverBorder: "group-hover:border-purple-400",
    },
    {
      title: "Incidents",
      path: "/incidents",
      icon: AlertTriangle,
      description: "Active incidents",
      bg: "bg-red-50",
      border: "border-red-200",
      iconColor: "text-red-600",
      hoverBorder: "group-hover:border-red-400",
    },
    {
      title: "Alerts",
      path: "/alerts",
      icon: Bell,
      description: "Alert configurations",
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      iconColor: "text-yellow-600",
      hoverBorder: "group-hover:border-yellow-400",
    },
    {
      title: "Notifications",
      path: "/notifications",
      icon: Activity,
      description: "Service notifications",
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      iconColor: "text-indigo-600",
      hoverBorder: "group-hover:border-indigo-400",
    },
  ];

  // Profile Module – shows avatar and email
  const profileModule = {
    title: "My Profile",
    path: "/profile",
    icon: User,
    description: user?.email || "Manage your account",
    bg: "bg-gray-50",
    border: "border-gray-300",
    iconColor: "text-gray-700",
    hoverBorder: "group-hover:border-gray-400",
    isProfile: true,
  };

  // Admin-only Users Module with badge
  const usersModule = {
    title: "User Management",
    path: "/users",
    icon: Shield,
    description: "Manage platform users",
    bg: "bg-rose-50",
    border: "border-rose-200",
    iconColor: "text-rose-600",
    hoverBorder: "group-hover:border-rose-400",
    isAdmin: true,
  };

  // Build final module list: core + profile + (admin users if applicable)
  const finalModules = [...modules, profileModule];
  if (isAdmin) {
    finalModules.push(usersModule);
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Header – already has Profile & Logout, now mobile-optimized */}
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-2.5 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h1 className="text-sm sm:text-lg md:text-xl font-bold text-gray-900 tracking-tight">
                  AI Monitoring Platform
                </h1>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[10px] sm:text-xs text-emerald-600 font-medium">
                    Operational
                  </span>
                </div>
              </div>
            </div>

            {/* Right side - Profile + Logout (mobile-friendly) */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs sm:text-sm text-gray-700 hover:text-gray-900 transition-all"
                aria-label="Profile"
              >
                <User className="w-4 h-4" />
                <span className="hidden xs:inline">Profile</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs sm:text-sm text-red-600 hover:bg-red-50 transition-all"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden xs:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section – mobile-adjusted */}
      <section className="bg-gradient-to-br from-gray-50 via-white to-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 md:py-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full mb-2 sm:mb-3">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] sm:text-xs font-medium text-emerald-700">All Systems Operational</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                Welcome to Your
                <span className="block bg-gradient-to-r from-gray-800 via-gray-900 to-black bg-clip-text text-transparent">
                  Monitoring Dashboard
                </span>
              </h2> 
              <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-500 max-w-2xl">
                Monitor your infrastructure health, track incidents, and manage alerts from one central hub.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-gray-100 rounded-lg border border-gray-200">
                <Sparkles className="w-3.5 h-3.5 text-gray-600" />
                <span className="text-[10px] sm:text-xs text-gray-600 font-medium">
                  {finalModules.length} Modules
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modules Grid – fully responsive card sizes */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {finalModules.map((module) => {
            const Icon = module.icon;
            const isProfile = module.isProfile;
            const isAdminModule = module.isAdmin;

            return (
              <div
                key={module.title}
                onClick={() => navigate(module.path)}
                className={`
                  group relative bg-white border ${module.border} ${module.hoverBorder}
                  rounded-2xl p-4 sm:p-6 md:p-8
                  cursor-pointer
                  hover:shadow-lg hover:-translate-y-1
                  transition-all duration-300
                  shadow-sm
                  ${isProfile ? 'ring-1 ring-gray-200/50' : ''}
                `}
              >
                {/* Decorative gradient overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gray-50/0 via-gray-50/0 to-gray-50/0 group-hover:from-gray-50/30 group-hover:via-transparent group-hover:to-transparent transition-all duration-500 pointer-events-none" />

                {/* Icon or Avatar (for Profile) */}
                <div className={`
                  inline-flex p-2.5 sm:p-3 md:p-4 rounded-xl
                  ${module.bg} border ${module.border}
                  mb-3 sm:mb-4 md:mb-5
                  group-hover:scale-110 group-hover:-rotate-3
                  transition-all duration-300
                  ${isProfile ? 'relative' : ''}
                `}>
                  {isProfile ? (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-md">
                      {userInitial}
                    </div>
                  ) : (
                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 ${module.iconColor}`} />
                  )}
                </div>

                {/* Title & Description */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1 group-hover:text-gray-700 transition-colors truncate">
                      {module.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed line-clamp-2">
                      {module.description}
                    </p>
                  </div>
                  {/* Admin Badge for Users module */}
                  {isAdminModule && (
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-rose-100 text-rose-700 rounded-full border border-rose-200 whitespace-nowrap ml-1 mt-0.5 flex-shrink-0">
                      Admin
                    </span>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-gray-200">
                  <span className="text-[10px] sm:text-xs text-gray-400">
                    {isProfile ? 'Manage account' : 'Click to access'}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300" />
                </div>

                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 rounded-tr-2xl bg-gradient-to-br from-gray-50/0 to-gray-50/0 group-hover:from-gray-100/10 group-hover:to-gray-100/20 transition-all duration-500 pointer-events-none" />
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer – mobile-optimized */}
      <footer className="border-t border-gray-200 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
          <div className="flex flex-col xs:flex-row items-center justify-between gap-2 text-[10px] sm:text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-gray-400" />
              <span>AI Monitoring Platform</span>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                All systems operational
              </span>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 480px) {
          .xs\\:inline { display: inline !important; }
          .xs\\:hidden { display: none !important; }
        }
        @media (min-width: 481px) {
          .xs\\:inline { display: inline !important; }
          .xs\\:hidden { display: none !important; }
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}   