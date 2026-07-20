// D:\Ai_Monitoring_Platform\ai-monitoring-ui\src\pages\auth\ForgotPassword.jsx

import { useState } from "react";
import { api } from "../../api/client";
import { Mail, ArrowLeft, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("Email is required");
      setIsSuccess(false);
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setIsSuccess(false);

      const res = await api.post("/auth/forgot-password", { email });

      setMessage(res.data.message || "Reset instructions sent");
      setIsSuccess(true);
      setEmail("");
    } catch (err) {
      setMessage(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to generate reset link"
      );
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4 border border-gray-200">
              <Mail className="w-6 h-6 text-gray-700" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Forgot password?
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Enter your email to reset your password
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Email address
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gray-700 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (message) setMessage("");
                  }}
                  placeholder="name@company.com"
                  className={`w-full bg-gray-50 border rounded-lg pl-10 pr-4 py-3 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    isSuccess
                      ? "border-emerald-400 focus:ring-emerald-200"
                      : "border-gray-200 focus:border-gray-400 focus:ring-gray-200"
                  }`}
                  disabled={loading || isSuccess}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email || isSuccess}
              className="w-full py-3 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 disabled:from-gray-200 disabled:to-gray-200 rounded-lg text-sm font-medium text-white disabled:text-gray-400 transition-all flex items-center justify-center gap-2 shadow-sm disabled:shadow-none"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Sending...</span>
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Email sent</span>
                </>
              ) : (
                <>
                  <span>Send reset link</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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

          {isSuccess && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xs text-gray-500 text-center mt-4"
            >
              Didn't receive it? Check your spam folder
            </motion.p>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/login")}
              className="text-xs text-gray-500 hover:text-gray-900 transition-colors flex items-center justify-center gap-1 mx-auto"
            >
              <ArrowLeft className="w-3 h-3" />
              Back to login
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Secure password reset • Link expires in 15 minutes
        </p>
      </motion.div>
    </div>
  );
}