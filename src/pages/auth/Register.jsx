import { useState } from "react";
import { api } from "../../api/client";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../../validation/registerSchema";

// ✅ FIX #11 — Register error is now shown to the user
// Before: catch block only did console.log(e) — user saw nothing on failure
// After:  error message displayed below the form with clear text

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [registerError, setRegisterError] = useState(null); // ✅ NEW error state

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });

  const passwordValue = watch("password");

  const onSubmit = async (data) => {
    setRegisterError(null); // clear previous errors
    try {
      await api.post("/auth/register", data);
      navigate("/login");
    } catch (e) {
      // ✅ FIX: show error to user instead of silently swallowing it
      setRegisterError(
        e?.response?.data?.message ||
        e?.response?.data ||
        "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">

      <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="relative bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-8">

            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
              <p className="text-slate-400 text-sm">
                Sign up to start monitoring your infrastructure
              </p>
            </div>

            {/* ✅ FIX: Show register error message */}
            {registerError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                {registerError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    {...register("name")}
                    placeholder="John Doe"
                    className={`w-full pl-10 pr-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                      errors.name
                        ? "border-red-500/50 focus:ring-red-500/50"
                        : "border-slate-700 focus:border-emerald-500/50 focus:ring-emerald-500/50"
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-400 text-xs mt-2">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  {/* <input
                    type="email"
                    {...register("email")}
                    placeholder="you@gmail.com"
                    className={`w-full pl-10 pr-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                      errors.email
                        ? "border-red-500/50 focus:ring-red-500/50"
                        : "border-slate-700 focus:border-emerald-500/50 focus:ring-emerald-500/50"
                    }`}
                  /> */}



   <input
  type="email"
  {...register("email")}
  placeholder="you@gmail.com"
  autoComplete="username"
  className={`w-full pl-10 pr-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
    errors.email
      ? "border-red-500/50 focus:ring-red-500/50"
      : "border-slate-700 focus:border-emerald-500/50 focus:ring-emerald-500/50"
  }`}
/>


                </div>
                {errors.email && (
                  <p className="text-red-400 text-xs mt-2">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  {/* <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-12 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                      errors.password
                        ? "border-red-500/50 focus:ring-red-500/50"
                        : "border-slate-700 focus:border-emerald-500/50 focus:ring-emerald-500/50"
                    }`}
                  /> */}


                   <input
  type={showPassword ? "text" : "password"}
  {...register("password")}
  placeholder="••••••••"
  autoComplete="new-password"
  className={`w-full pl-10 pr-12 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
    errors.password
      ? "border-red-500/50 focus:ring-red-500/50"
      : "border-slate-700 focus:border-emerald-500/50 focus:ring-emerald-500/50"
  }`}
/>

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-xs mt-2">{errors.password.message}</p>
                )}
              </div>

              {/* Password Strength */}
              {passwordValue && !errors.password && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`h-1 flex-1 rounded-full ${passwordValue.length >= 6 ? "bg-emerald-500" : "bg-slate-700"}`} />
                    <div className={`h-1 flex-1 rounded-full ${passwordValue.length >= 8 ? "bg-emerald-500" : "bg-slate-700"}`} />
                    <div className={`h-1 flex-1 rounded-full ${/[!@#$%^&*]/.test(passwordValue) ? "bg-emerald-500" : "bg-slate-700"}`} />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="relative w-full py-3 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-xl font-medium text-white transition-all disabled:opacity-50"
              >
                {isSubmitting ? "Creating account..." : "Create Account"}
              </button>

              <p className="text-center text-sm text-slate-400">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-emerald-400 hover:text-emerald-300 font-medium transition"
                >
                  Sign in
                </button>
              </p>

            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

