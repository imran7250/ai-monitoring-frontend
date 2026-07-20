// D:\Ai_Monitoring_Platform\ai-monitoring-ui\src\components\ui\PageHeader.jsx

import { useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut, Home, User } from "lucide-react";
import toast from "react-hot-toast";

export default function PageHeader({ title, showBack = true, backTo = "/home" }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => navigate(backTo)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
        )}
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        {/* Home Button */}
        <button
          onClick={() => navigate("/home")}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Home"
        >
          <Home className="w-5 h-5 text-gray-500" />
        </button>

        {/* Profile Button */}
        <button
          onClick={() => navigate("/profile")}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Profile"
        >
          <User className="w-5 h-5 text-gray-500" />
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden xs:inline">Logout</span>
        </button>
      </div>
    </div>
  );
}