// import { useEffect, useState } from "react";
// import { api } from "../api/client";
// import { useNavigate } from "react-router-dom";
// import { changePasswordSchema } from "../validation/changePassword.schema";
// import { useAuth } from "../context/AuthContext";

// export default function Profile() {
//   const [user, setUser] = useState(null);
//   const [name, setName] = useState("");

//   const [currentPassword, setCurrentPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState(null);
//   const [errors, setErrors] = useState({});

//   const navigate = useNavigate();

//   // ✅ FIX 1 — get updateUser from AuthContext so Sidebar
//   // updates immediately when name is changed without needing
//   // to logout and login again
//   const { updateUser } = useAuth();

//   useEffect(() => {
//     loadUser();
//   }, []);

//   const loadUser = async () => {
//     try {
//       const res = await api.get("/api/users/me");
//       setUser(res.data);
//       setName(res.data.name);
//     } catch (err) {
//       console.error(err);
//       navigate("/login");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateProfile = async () => {

//     const nameChanged = name !== user.name;
//     const passwordAttempt =
//       currentPassword || newPassword || confirmPassword;

//     if (!nameChanged && !passwordAttempt) {
//       setMessage({
//         type: "error",
//         text: "No changes to update"
//       });
//       return;
//     }

//     try {

//       if (passwordAttempt) {

//         const result = changePasswordSchema.safeParse({
//           currentPassword,
//           newPassword,
//           confirmPassword
//         });

//         if (!result.success) {

//           const fieldErrors = {};

//           result.error.issues.forEach((err) => {
//             fieldErrors[err.path[0]] = err.message;
//           });

//           setErrors(fieldErrors);
//           return;
//         }

//         setErrors({});

//         await api.put("/api/users/me/password", {
//           currentPassword,
//           newPassword
//         });

//         setCurrentPassword("");
//         setNewPassword("");
//         setConfirmPassword("");
//       }

//       if (nameChanged) {
//         await api.put("/api/users/me", { name });

//         // ✅ FIX 1 — update AuthContext so Sidebar reflects
//         // the new name immediately without page refresh
//         updateUser({ name });
//       }

//       setMessage({
//         type: "success",
//         text: "Profile updated successfully"
//       });

//       loadUser();

//     } catch (err) {

//       setMessage({
//         type: "error",
//         text:
//           err?.response?.data?.message ||
//           err?.response?.data?.error ||
//           err?.message ||
//           "Update failed"
//       });

//     }

//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
//         <div className="flex flex-col items-center space-y-4">
//           <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//           <p className="text-slate-400 font-medium">Loading profile...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
//       <div className="max-w-3xl mx-auto">

//         <div className="flex justify-between items-center mb-8">
//           <div className="flex items-center space-x-3">
//             <div className="h-10 w-1 bg-blue-500 rounded-full"></div>
//             <h1 className="text-3xl font-bold text-white tracking-tight">
//               My Profile
//             </h1>
//           </div>

//           <button
//             onClick={() => navigate(-1)}
//             className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700 rounded-xl border border-slate-700 text-slate-300"
//           >
//             Close
//           </button>
//         </div>

//         <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">

//           <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-8 border-b border-slate-700/50">
//             <div className="flex items-center space-x-6">

//               <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
//                 <span className="text-3xl font-bold text-white">
//                   {user?.name?.charAt(0).toUpperCase()}
//                 </span>
//               </div>

//               <div>
//                 <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
//                 <p className="text-slate-400 text-sm mt-1">{user?.email}</p>
//               </div>

//             </div>
//           </div>

//           <div className="p-8 space-y-6">

//             <div className="space-y-2">
//               <label className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
//                 Full Name
//               </label>
//               <input
//                 autoComplete="name"
//                 className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
//                 Email Address
//               </label>
//               <input
//                 autoComplete="email"
//                 className="w-full px-4 py-3 bg-slate-900/30 border border-slate-700 rounded-xl text-slate-400 cursor-not-allowed"
//                 value={user?.email}
//                 disabled
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
//                 Current Password
//               </label>
//               <input
//                 type="password"
//                 // ✅ FIX 2 — autoComplete stops browser warning
//                 autoComplete="current-password"
//                 className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white"
//                 value={currentPassword}
//                 onChange={(e) => setCurrentPassword(e.target.value)}
//               />
//               {errors.currentPassword && (
//                 <p className="text-red-400 text-sm">{errors.currentPassword}</p>
//               )}
//             </div>

//             <div className="space-y-2">
//               <label className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
//                 New Password
//               </label>
//               <input
//                 type="password"
//                 // ✅ FIX 2 — autoComplete stops browser warning
//                 autoComplete="new-password"
//                 className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//               />
//               {errors.newPassword && (
//                 <p className="text-red-400 text-sm">{errors.newPassword}</p>
//               )}
//             </div>

//             <div className="space-y-2">
//               <label className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
//                 Confirm Password
//               </label>
//               <input
//                 type="password"
//                 // ✅ FIX 2 — autoComplete stops browser warning
//                 autoComplete="new-password"
//                 className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//               />
//               {errors.confirmPassword && (
//                 <p className="text-red-400 text-sm">{errors.confirmPassword}</p>
//               )}
//             </div>

//             <div className="pt-4">
//               <button
//                 onClick={updateProfile}
//                 className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-white"
//               >
//                 Update Profile
//               </button>
//             </div>

//             {message && (
//               <div
//                 className={`p-4 rounded-xl text-sm font-medium ${
//                   message.type === "success"
//                     ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
//                     : "bg-red-500/10 border border-red-500/30 text-red-400"
//                 }`}
//               >
//                 {message.text}
//               </div>
//             )}

//           </div>
//         </div>

//         <p className="text-center text-xs text-slate-600 mt-6">
//           Securely manage your profile information
//         </p>

//       </div>
//     </div>
//   );
// }


// D:\Ai_Monitoring_Platform\ai-monitoring-ui\src\pages\Profile.jsx

import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useNavigate } from "react-router-dom";
import { changePasswordSchema } from "../validation/changePassword.schema";

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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3 sm:space-y-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-xs sm:text-sm font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-4 sm:py-6 md:py-8 px-3 sm:px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-4 sm:mb-6 md:mb-8">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <div className="h-8 w-1 sm:h-10 bg-blue-500 rounded-full flex-shrink-0" />
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight truncate">
              My Profile
            </h1>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-800/50 hover:bg-slate-700 rounded-xl border border-slate-700 text-slate-300 text-xs sm:text-sm flex-shrink-0"
          >
            Close
          </button>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">

          {/* User header */}
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-4 sm:p-6 md:p-8 border-b border-slate-700/50">
            <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white truncate">{user?.name}</h2>
                <p className="text-slate-400 text-xs sm:text-sm mt-0.5 truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5 md:space-y-6">

            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[10px] sm:text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Full Name
              </label>
              <input
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white text-sm sm:text-base"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[10px] sm:text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Email Address
              </label>
              <input
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-900/30 border border-slate-700 rounded-xl text-slate-400 text-sm sm:text-base cursor-not-allowed"
                value={user?.email}
                disabled
              />
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[10px] sm:text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Current Password
              </label>
              <input
                type="password"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white text-sm sm:text-base"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              {errors.currentPassword && (
                <p className="text-red-400 text-[10px] sm:text-xs">{errors.currentPassword}</p>
              )}
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[10px] sm:text-xs font-semibold text-slate-300 uppercase tracking-wider">
                New Password
              </label>
              <input
                type="password"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white text-sm sm:text-base"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              {errors.newPassword && (
                <p className="text-red-400 text-[10px] sm:text-xs">{errors.newPassword}</p>
              )}
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[10px] sm:text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white text-sm sm:text-base"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {errors.confirmPassword && (
                <p className="text-red-400 text-[10px] sm:text-xs">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="pt-2 sm:pt-4">
              <button
                onClick={updateProfile}
                className="w-full px-4 sm:px-6 py-2.5 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-white text-sm sm:text-base"
              >
                Update Profile
              </button>
            </div>

            {message && (
              <div
                className={`p-3 sm:p-4 rounded-xl text-xs sm:text-sm font-medium ${
                  message.type === "success"
                    ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                    : "bg-red-500/10 border border-red-500/30 text-red-400"
                }`}
              >
                {message.text}
              </div>
            )}

          </div>
        </div>

        <p className="text-center text-[10px] sm:text-xs text-slate-600 mt-4 sm:mt-6">
          Securely manage your profile information
        </p>

      </div>
    </div>
  );
}