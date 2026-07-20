// D:\Ai_Monitoring_Platform\ai-monitoring-ui\src\pages\Profile.jsx

import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useNavigate } from "react-router-dom";
import { changePasswordSchema } from "../validation/changePassword.schema";
import PageHeader from "../components/ui/PageHeader";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const res = await api.get("/api/users/me");
      setUser(res.data);
      setName(res.data.name);
    } catch (err) {
      console.error(err);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    const nameChanged = name !== user.name;
    const passwordAttempt = currentPassword || newPassword || confirmPassword;

    if (!nameChanged && !passwordAttempt) {
      setMessage({
        type: "error",
        text: "No changes to update"
      });
      return;
    }

    try {
      if (passwordAttempt) {
        const result = changePasswordSchema.safeParse({
          currentPassword,
          newPassword,
          confirmPassword
        });

        if (!result.success) {
          const fieldErrors = {};
          result.error.issues.forEach((err) => {
            fieldErrors[err.path[0]] = err.message;
          });
          setErrors(fieldErrors);
          return;
        }

        setErrors({});
        await api.put("/api/users/me/password", {
          currentPassword,
          newPassword
        });

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }

      if (nameChanged) {
        await api.put("/api/users/me", { name });
      }

      setMessage({
        type: "success",
        text: "Profile updated successfully"
      });

      loadUser();
    } catch (err) {
      setMessage({
        type: "error",
        text: err?.response?.data?.message || err?.response?.data?.error || err?.message || "Update failed"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-700 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <PageHeader title="My Profile" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          {/* User header */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="text-3xl md:text-4xl font-bold text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 truncate">{user?.name}</h2>
                <p className="text-sm text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-400 text-sm cursor-not-allowed"
                value={user?.email}
                disabled
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition-all"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              {errors.currentPassword && (
                <p className="text-red-600 text-xs mt-1">{errors.currentPassword}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                New Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition-all"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              {errors.newPassword && (
                <p className="text-red-600 text-xs mt-1">{errors.newPassword}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition-all"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {errors.confirmPassword && (
                <p className="text-red-600 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              onClick={updateProfile}
              className="w-full py-3 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 rounded-xl text-white font-semibold text-sm shadow-sm transition-all"
            >
              Update Profile
            </button>

            {message && (
              <div
                className={`p-4 rounded-xl text-sm font-medium ${
                  message.type === "success"
                    ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                    : "bg-red-50 border border-red-200 text-red-700"
                }`}
              >
                {message.text}
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Securely manage your profile information
        </p>
      </div>
    </div>
  );
}