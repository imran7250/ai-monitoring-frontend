// D:\Ai_Monitoring_Platform\ai-monitoring-ui\src\pages\auth\ResetPassword.jsx

import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { api } from "../../api/client";
import { Lock, Eye, EyeOff, KeyRound, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!token) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-200">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Invalid Reset Link</h2>
          <p className="text-gray-500 text-sm mb-6">
            This password reset link is invalid or has expired.
          </p>
          <button
            onClick={() => navigate("/forgot-password")}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium text-white transition-colors"
          >
            Request New Link
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password) {
      setMessage("Password is required");
      return;
    }

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setIsSuccess(false);

      await api.post("/auth/reset-password", {
        token,
        newPassword: password
      });

      setMessage("Password reset successful. Redirecting to login...");
      setIsSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      let backendMessage = "Something went wrong";
      if (err.response && err.response.data) {
        backendMessage = err.response.data.message || err.response.data.error || backendMessage;
      } else if (err.message) {
        backendMessage = err.message;
      }
      setMessage(backendMessage);
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-lg">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4 border border-gray-200">
              <KeyRound className="w-6 h-6 text-gray-700" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Reset Password
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Enter your new password below
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">
                New Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gray-700 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  className={`w-full bg-gray-50 border rounded-lg pl-10 pr-12 py-3 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    isSuccess
                      ? "border-emerald-400 focus:ring-emerald-200"
                      : "border-gray-200 focus:border-gray-400 focus:ring-gray-200"
                  }`}
                  disabled={loading || isSuccess}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={loading || isSuccess}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {password && !isSuccess && (
                <div className="mt-3 space-y-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          level <= strength
                            ? level === 1
                              ? "bg-red-400"
                              : level === 2
                              ? "bg-yellow-400"
                              : level === 3
                              ? "bg-blue-400"
                              : "bg-emerald-400"
                            : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    Use at least 8 characters with uppercase, numbers & symbols
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Confirm Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gray-700 transition-colors" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className={`w-full bg-gray-50 border rounded-lg pl-10 pr-12 py-3 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    isSuccess
                      ? "border-emerald-400 focus:ring-emerald-200"
                      : "border-gray-200 focus:border-gray-400 focus:ring-gray-200"
                  }`}
                  disabled={loading || isSuccess}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={loading || isSuccess}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && !isSuccess && (
                <p className="text-xs text-red-600 mt-2">Passwords do not match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || isSuccess}
              className="w-full py-3 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 disabled:from-gray-200 disabled:to-gray-200 rounded-lg text-sm font-medium text-white disabled:text-gray-400 transition-all flex items-center justify-center gap-2 shadow-sm disabled:shadow-none"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Resetting...</span>
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Success!</span>
                </>
              ) : (
                <>
                  <span>Reset Password</span>
                  <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">→</span>
                </>
              )}
            </button>
          </form>

          {message && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-5 p-4 rounded-lg text-sm flex items-start gap-3 ${
                isSuccess
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {isSuccess ? (
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              )}
              <span>{message}</span>
            </motion.div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/login")}
              className="text-xs text-gray-500 hover:text-gray-900 transition-colors flex items-center justify-center gap-1 mx-auto"
              disabled={loading}
            >
              <ArrowLeft className="w-3 h-3" />
              Back to login
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Secure password reset • Token expires in 15 minutes
        </p>
      </motion.div>
    </div>
  );
}