
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

  // Token validation
  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
        <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Invalid Reset Link</h2>
          <p className="text-slate-400 text-sm mb-6">
            This password reset link is invalid or has expired.
          </p>
          <button
            onClick={() => navigate("/forgot-password")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium text-white transition-colors"
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
      console.log("FULL ERROR OBJECT:", err);
      console.log("ERROR RESPONSE:", err?.response);

      let backendMessage = "Something went wrong";

      if (err.response && err.response.data) {
        backendMessage =
          err.response.data.message ||
          err.response.data.error ||
          backendMessage;
      } else if (err.message) {
        backendMessage = err.message;
      }

      setMessage(backendMessage);
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator (visual only)
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      
     
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59,130,246,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Glass card */}
        <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          
          {/* Header with Icon */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
              <KeyRound className="w-6 h-6 text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">
              Reset Password
            </h1>
            <p className="text-sm text-slate-400">
              Enter your new password below
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* New Password */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">
                New Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  className={`w-full bg-slate-800/50 border rounded-lg pl-10 pr-12 py-3 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 transition-all ${
                    isSuccess
                      ? "border-emerald-500/50 focus:ring-emerald-500/20"
                      : "border-slate-700 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                  disabled={loading || isSuccess}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-400 transition-colors"
                  disabled={loading || isSuccess}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password Strength Indicator */}
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
                            : "bg-slate-700"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500">
                    Use at least 8 characters with uppercase, numbers & symbols
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">
                Confirm Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className={`w-full bg-slate-800/50 border rounded-lg pl-10 pr-12 py-3 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 transition-all ${
                    isSuccess
                      ? "border-emerald-500/50 focus:ring-emerald-500/20"
                      : "border-slate-700 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                  disabled={loading || isSuccess}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-400 transition-colors"
                  disabled={loading || isSuccess}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && !isSuccess && (
                <p className="text-xs text-red-400 mt-2">Passwords do not match</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || isSuccess}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:from-slate-800 disabled:to-slate-800 rounded-lg text-sm font-medium text-white disabled:text-slate-500 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-blue-500/25 disabled:shadow-none"
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

          {/* Message Display */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-5 p-4 rounded-lg text-sm flex items-start gap-3 ${
                isSuccess
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-red-500/10 text-red-400 border border-red-500/20"
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

          {/* Back to Login Link */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/login")}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center justify-center gap-1 mx-auto"
              disabled={loading}
            >
              <ArrowLeft className="w-3 h-3" />
              Back to login
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-slate-600 mt-4 font-mono">
          Secure password reset • Token expires in 15 minutes
        </p>
      </motion.div>
    </div>
  );
}