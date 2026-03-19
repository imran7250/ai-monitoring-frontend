

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      
      {/* Gradient background with subtle grid */}
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
        {/* Glass card with blur */}
        <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800 rounded-2xl p-8 shadow-2xl">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
              <Mail className="w-6 h-6 text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">
              Forgot password?
            </h1>
            <p className="text-sm text-slate-400">
              Enter your email to reset your password
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email Input */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">
                Email address
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (message) setMessage("");
                  }}
                  placeholder="name@company.com"
                  className={`w-full bg-slate-800/50 border rounded-lg pl-10 pr-4 py-3 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 transition-all ${
                    isSuccess
                      ? "border-emerald-500/50 focus:ring-emerald-500/20"
                      : "border-slate-700 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                  disabled={loading || isSuccess}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !email || isSuccess}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:from-slate-800 disabled:to-slate-800 rounded-lg text-sm font-medium text-white disabled:text-slate-500 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-blue-500/25 disabled:shadow-none"
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
              <span className="text-sm">{message}</span>
            </motion.div>
          )}

          {/* Success extra info */}
          {isSuccess && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xs text-slate-500 text-center mt-4"
            >
              Didn't receive it? Check your spam folder
            </motion.p>
          )}

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/login")}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center justify-center gap-1 mx-auto"
            >
              <ArrowLeft className="w-3 h-3" />
              Back to login
            </button>
          </div>

        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-600 mt-4 font-mono">
          Secure password reset • Link expires in 15 minutes
        </p>
      </motion.div>
    </div>
  );
}
