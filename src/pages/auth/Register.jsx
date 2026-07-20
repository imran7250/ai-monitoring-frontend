// import { useState } from "react";
// import { api } from "../../api/client";
// import { useNavigate } from "react-router-dom";
// import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
// import { motion } from "framer-motion";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { registerSchema } from "../../validation/registerSchema";

// // ✅ FIX #11 — Register error is now shown to the user
// // Before: catch block only did console.log(e) — user saw nothing on failure
// // After:  error message displayed below the form with clear text

// export default function Register() {
//   const navigate = useNavigate();
//   const [showPassword, setShowPassword] = useState(false);
//   const [registerError, setRegisterError] = useState(null); // ✅ NEW error state

//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors, isSubmitting },
//   } = useForm({
//     resolver: zodResolver(registerSchema),
//     mode: "onTouched",
//   });

//   const passwordValue = watch("password");

//   const onSubmit = async (data) => {
//     setRegisterError(null); // clear previous errors
//     try {
//       await api.post("/auth/register", data);
//       navigate("/login");
//     } catch (e) {
//       // ✅ FIX: show error to user instead of silently swallowing it
//       setRegisterError(
//         e?.response?.data?.message ||
//         e?.response?.data ||
//         "Registration failed. Please try again."
//       );
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">

//       <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="w-full max-w-md"
//         >
//           <div className="relative bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-8">

//             <div className="text-center mb-8">
//               <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
//               <p className="text-slate-400 text-sm">
//                 Sign up to start monitoring your infrastructure
//               </p>
//             </div>

//             {/* ✅ FIX: Show register error message */}
//             {registerError && (
//               <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
//                 {registerError}
//               </div>
//             )}

//             <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

//               {/* Name */}
//               <div>
//                 <label className="block text-sm font-medium text-slate-300 mb-2">
//                   Full Name
//                 </label>
//                 <div className="relative">
//                   <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
//                   <input
//                     {...register("name")}
//                     placeholder="John Doe"
//                     className={`w-full pl-10 pr-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
//                       errors.name
//                         ? "border-red-500/50 focus:ring-red-500/50"
//                         : "border-slate-700 focus:border-emerald-500/50 focus:ring-emerald-500/50"
//                     }`}
//                   />
//                 </div>
//                 {errors.name && (
//                   <p className="text-red-400 text-xs mt-2">{errors.name.message}</p>
//                 )}
//               </div>

//               {/* Email */}
//               <div>
//                 <label className="block text-sm font-medium text-slate-300 mb-2">
//                   Email Address
//                 </label>
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
//                   {/* <input
//                     type="email"
//                     {...register("email")}
//                     placeholder="you@gmail.com"
//                     className={`w-full pl-10 pr-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
//                       errors.email
//                         ? "border-red-500/50 focus:ring-red-500/50"
//                         : "border-slate-700 focus:border-emerald-500/50 focus:ring-emerald-500/50"
//                     }`}
//                   /> */}



//    <input
//   type="email"
//   {...register("email")}
//   placeholder="you@gmail.com"
//   autoComplete="username"
//   className={`w-full pl-10 pr-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
//     errors.email
//       ? "border-red-500/50 focus:ring-red-500/50"
//       : "border-slate-700 focus:border-emerald-500/50 focus:ring-emerald-500/50"
//   }`}
// />


//                 </div>
//                 {errors.email && (
//                   <p className="text-red-400 text-xs mt-2">{errors.email.message}</p>
//                 )}
//               </div>

//               {/* Password */}
//               <div>
//                 <label className="block text-sm font-medium text-slate-300 mb-2">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
//                   {/* <input
//                     type={showPassword ? "text" : "password"}
//                     {...register("password")}
//                     placeholder="••••••••"
//                     className={`w-full pl-10 pr-12 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
//                       errors.password
//                         ? "border-red-500/50 focus:ring-red-500/50"
//                         : "border-slate-700 focus:border-emerald-500/50 focus:ring-emerald-500/50"
//                     }`}
//                   /> */}


//                    <input
//   type={showPassword ? "text" : "password"}
//   {...register("password")}
//   placeholder="••••••••"
//   autoComplete="new-password"
//   className={`w-full pl-10 pr-12 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
//     errors.password
//       ? "border-red-500/50 focus:ring-red-500/50"
//       : "border-slate-700 focus:border-emerald-500/50 focus:ring-emerald-500/50"
//   }`}
// />

//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
//                   >
//                     {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                   </button>
//                 </div>
//                 {errors.password && (
//                   <p className="text-red-400 text-xs mt-2">{errors.password.message}</p>
//                 )}
//               </div>

//               {/* Password Strength */}
//               {passwordValue && !errors.password && (
//                 <div className="space-y-2">
//                   <div className="flex items-center gap-2">
//                     <div className={`h-1 flex-1 rounded-full ${passwordValue.length >= 6 ? "bg-emerald-500" : "bg-slate-700"}`} />
//                     <div className={`h-1 flex-1 rounded-full ${passwordValue.length >= 8 ? "bg-emerald-500" : "bg-slate-700"}`} />
//                     <div className={`h-1 flex-1 rounded-full ${/[!@#$%^&*]/.test(passwordValue) ? "bg-emerald-500" : "bg-slate-700"}`} />
//                   </div>
//                 </div>
//               )}

//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="relative w-full py-3 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-xl font-medium text-white transition-all disabled:opacity-50"
//               >
//                 {isSubmitting ? "Creating account..." : "Create Account"}
//               </button>

//               <p className="text-center text-sm text-slate-400">
//                 Already have an account?{" "}
//                 <button
//                   type="button"
//                   onClick={() => navigate("/login")}
//                   className="text-emerald-400 hover:text-emerald-300 font-medium transition"
//                 >
//                   Sign in
//                 </button>
//               </p>

//             </form>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// }


// D:\Ai_Monitoring_Platform\ai-monitoring-ui\src\pages\auth\Register.jsx

import { useState } from "react";
import { api } from "../../api/client";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Activity, Shield, Server, Database, Zap, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../../validation/registerSchema";

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [registerError, setRegisterError] = useState(null);

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
    setRegisterError(null);
    try {
      await api.post("/auth/register", data);
      navigate("/login");
    } catch (e) {
      setRegisterError(
        e?.response?.data?.message ||
        e?.response?.data ||
        "Registration failed. Please try again."
      );
    }
  };

  // Backend configuration for the left panel
  const platformStats = [
    { icon: Zap, label: "AI Detection", value: "3σ" },
    { icon: Server, label: "Services", value: "10K+" },
    { icon: Database, label: "Retention", value: "7d" },
    { icon: Shield, label: "Security", value: "JWT" },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row font-sans">
      
      {/* Left Panel - Platform Info - Hidden on mobile, visible on lg screens */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gray-50 border-r border-gray-200">
        
        {/* Subtle Background Grid */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
        
        <div className="relative w-full p-8 flex flex-col justify-center">
          
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">AI Monitoring Platform</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs text-emerald-600 font-medium">Enterprise Ready</span>
              </div>
            </div>
          </div>

          {/* Hero Section */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-200 mb-4">
              <Zap className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-xs font-medium text-blue-700">AI-Powered Monitoring</span>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
              Start Monitoring Your
              <span className="block bg-gradient-to-r from-gray-800 via-gray-900 to-black bg-clip-text text-transparent mt-1">
                Infrastructure Today
              </span>
            </h2>
            
            <p className="text-gray-600 text-sm leading-relaxed max-w-xl">
              Join thousands of engineering teams using AI Monitor for enterprise-grade 
              infrastructure monitoring, anomaly detection, and incident management.
            </p>
          </div>

          {/* Platform Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {platformStats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <stat.icon className="w-4 h-4 text-gray-700" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Features Preview */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-medium text-gray-700">What you get</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                Real-time monitoring
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                AI anomaly detection
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                Automated alerts
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                Incident management
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                7-day data retention
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                Role-based access
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto pt-4 border-t border-gray-200">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="font-mono">Spring Boot</span>
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <span className="font-mono">React</span>
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <span className="font-mono">MySQL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Register Form - Full width on mobile */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">AIMonitor</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs text-gray-500">enterprise</span>
              </div>
            </div>
          </div>

          {/* Register Card - White Theme */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-lg"
          >
            {/* Card Header */}
            <div className="mb-6 sm:mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
              <p className="text-sm text-gray-500">Sign up to start monitoring your infrastructure</p>
            </div>

            {/* Error Message */}
            {registerError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <p className="text-xs text-red-600 text-center flex items-center justify-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {registerError}
                </p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

              {/* Name Field */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Full Name
                </label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gray-700 transition-colors" />
                  <input
                    {...register("name")}
                    placeholder="John Doe"
                    className={`w-full bg-gray-50 border rounded-lg pl-10 pr-4 py-3 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.name
                        ? "border-red-400 focus:ring-red-200"
                        : "border-gray-200 focus:border-gray-400 focus:ring-gray-200"
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gray-700 transition-colors" />
                  <input
                    type="email"
                    {...register("email")}
                    placeholder="you@gmail.com"
                    autoComplete="username"
                    className={`w-full bg-gray-50 border rounded-lg pl-10 pr-4 py-3 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.email
                        ? "border-red-400 focus:ring-red-200"
                        : "border-gray-200 focus:border-gray-400 focus:ring-gray-200"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gray-700 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className={`w-full bg-gray-50 border rounded-lg pl-10 pr-10 py-3 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.password
                        ? "border-red-400 focus:ring-red-200"
                        : "border-gray-200 focus:border-gray-400 focus:ring-gray-200"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Password Strength */}
              {passwordValue && !errors.password && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`h-1 flex-1 rounded-full ${
                      passwordValue.length >= 6 ? "bg-emerald-500" : "bg-gray-200"
                    }`} />
                    <div className={`h-1 flex-1 rounded-full ${
                      passwordValue.length >= 8 ? "bg-emerald-500" : "bg-gray-200"
                    }`} />
                    <div className={`h-1 flex-1 rounded-full ${
                      /[!@#$%^&*]/.test(passwordValue) ? "bg-emerald-500" : "bg-gray-200"
                    }`} />
                  </div>
                  <p className="text-[10px] text-gray-400">
                    Use at least 8 characters with uppercase, numbers & symbols
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white font-medium py-3.5 px-4 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 group shadow-lg shadow-gray-200 hover:shadow-gray-300"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {/* Login Link */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-gray-500">Already have an account?</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="w-full bg-transparent border border-gray-300 hover:border-gray-500 text-gray-700 hover:text-gray-900 font-medium py-3 px-4 rounded-lg transition-all"
              >
                Sign in
              </button>

            </form>
          </motion.div>

          {/* Security Footer */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs">
            <span className="text-gray-500 font-mono flex items-center gap-1">
              <Shield className="w-3 h-3 text-gray-600" />
              JWT Auth
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span className="text-gray-500 font-mono">RBAC</span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span className="text-gray-500 font-mono">1h Session</span>
          </div>
        </div>
      </div>
    </div>
  );
}
