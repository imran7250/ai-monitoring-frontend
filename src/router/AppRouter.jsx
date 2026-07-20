// // // D:\Ai_Monitoring_Platform\ai-monitoring-ui\src\router\AppRouter.jsx

// // import React from "react";
// // import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// // // 🏠 Landing Page (Public)
// // import LandingPage from "../pages/LandingPage.jsx";

// // // 🔐 Auth Pages (Public)
// // import Login from "../pages/auth/Login.jsx";
// // import Register from "../pages/auth/Register.jsx";
// // import ForgotPassword from "../pages/auth/ForgotPassword.jsx";
// // import ResetPassword from "../pages/auth/ResetPassword.jsx";

// // // 📊 Dashboard & Main Pages (Protected)
// // import Dashboard from "../pages/dashboard/Dashboard.jsx";
// // import Projects from "../pages/projects/Projects.jsx";
// // import ProjectDetails from "../pages/projects/ProjectDetails.jsx";

// // import Services from "../pages/services/Services.jsx";
// // import ServiceDetails from "../pages/services/ServiceDetails.jsx";

// // import Incidents from "../pages/incidents/Incidents.jsx";
// // import IncidentDetails from "../pages/incidents/IncidentDetails.jsx";

// // import Anomalies from "../pages/anomalies/Anomalies.jsx";
// // import AlertCenter from "../pages/alerts/AlertCenter.jsx";
// // import Logs from "../pages/logs/Logs.jsx";
// // import Notifications from "../pages/notifications/Notifications.jsx";

// // import Profile from "../pages/Profile.jsx";
// // import Home from "../pages/home/Home.jsx";
// // import Users from "../pages/users/Users.jsx";

// // // 📐 Layout Components
// // import SectionLayout from "../layout/SectionLayout.jsx";

// // // 🛡️ Protected Route Wrapper
// // function ProtectedRoute({ children }) {
// //   const token = localStorage.getItem("token");
// //   if (!token) return <Navigate to="/login" replace />;
// //   return children;
// // }

// // // 🔄 Public Route Wrapper (redirects to dashboard if already logged in)
// // function PublicRoute({ children }) {
// //   const token = localStorage.getItem("token");
// //   if (token) return <Navigate to="/dashboard" replace />;
// //   return children;
// // }

// // export default function AppRouter() {
// //   return (
// //     <BrowserRouter>
// //       <Routes>
// //         {/* 🏠 LANDING PAGE - Public */}
// //         <Route path="/" element={<LandingPage />} />

// //         {/* 🔐 AUTHENTICATION - Public (redirect if logged in) */}
// //         <Route
// //           path="/login"
// //           element={
// //             <PublicRoute>
// //               <Login />
// //             </PublicRoute>
// //           }
// //         />
// //         <Route
// //           path="/register"
// //           element={
// //             <PublicRoute>
// //               <Register />
// //             </PublicRoute>
// //           }
// //         />
// //         <Route path="/forgot-password" element={<ForgotPassword />} />
// //         <Route path="/reset-password" element={<ResetPassword />} />

// //         {/* 🏠 HOME - Protected (no sidebar) */}
// //         <Route
// //           path="/home"
// //           element={
// //             <ProtectedRoute>
// //               <Home />
// //             </ProtectedRoute>
// //           }
// //         />

// //         {/* 📊 PROTECTED ROUTES - With Sidebar + Header */}
// //         <Route
// //           element={
// //             <ProtectedRoute>
// //               <SectionLayout />
// //             </ProtectedRoute>
// //           }
// //         >
// //           <Route path="/dashboard" element={<Dashboard />} />
// //           <Route path="/projects" element={<Projects />} />
// //           <Route path="/projects/:projectId" element={<ProjectDetails />} />
// //           <Route path="/services" element={<Services />} />
// //           <Route path="/services/:serviceId" element={<ServiceDetails />} />
// //           <Route path="/services/:serviceId/logs" element={<Logs />} />
// //           <Route path="/incidents" element={<Incidents />} />
// //           <Route path="/incidents/:incidentId" element={<IncidentDetails />} />
// //           <Route path="/alerts" element={<AlertCenter />} />
// //           <Route path="/notifications" element={<Notifications />} />
// //           <Route path="/anomalies" element={<Anomalies />} />
// //           <Route path="/users" element={<Users />} />
// //           <Route path="/profile" element={<Profile />} />
// //         </Route>

// //         {/* 🔄 FALLBACK - Redirect to landing page */}
// //         <Route path="*" element={<Navigate to="/" replace />} />
// //       </Routes>
// //     </BrowserRouter>
// //   );
// // }
// // D:\Ai_Monitoring_Platform\ai-monitoring-ui\src\router\AppRouter.jsx

// import React from "react";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// // 🏠 Landing Page (Public)
// import LandingPage from "../pages/LandingPage.jsx";

// // 🔐 Auth Pages (Public)
// import Login from "../pages/auth/Login.jsx";
// import Register from "../pages/auth/Register.jsx";
// import ForgotPassword from "../pages/auth/ForgotPassword.jsx";
// import ResetPassword from "../pages/auth/ResetPassword.jsx";

// // 📊 Dashboard & Main Pages (Protected)
// import Dashboard from "../pages/dashboard/Dashboard.jsx";
// import Projects from "../pages/projects/Projects.jsx";
// import ProjectDetails from "../pages/projects/ProjectDetails.jsx";

// import Services from "../pages/services/Services.jsx";
// import ServiceDetails from "../pages/services/ServiceDetails.jsx";

// import Incidents from "../pages/incidents/Incidents.jsx";
// import IncidentDetails from "../pages/incidents/IncidentDetails.jsx";

// import Anomalies from "../pages/anomalies/Anomalies.jsx";
// import AlertCenter from "../pages/alerts/AlertCenter.jsx";
// import Logs from "../pages/logs/Logs.jsx";
// import Notifications from "../pages/notifications/Notifications.jsx";

// import Profile from "../pages/Profile.jsx";
// import Home from "../pages/home/Home.jsx";
// import Users from "../pages/users/Users.jsx";

// // 🛡️ Protected Route Wrapper
// function ProtectedRoute({ children }) {
//   const token = localStorage.getItem("token");
//   if (!token) return <Navigate to="/login" replace />;
//   return children;
// }

// // 🔄 Public Route Wrapper (redirects to HOME if already logged in)
// function PublicRoute({ children }) {
//   const token = localStorage.getItem("token");
//   if (token) return <Navigate to="/home" replace />; // ✅ changed from /dashboard
//   return children;
// }

// export default function AppRouter() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* 🏠 LANDING PAGE - Public */}
//         <Route path="/" element={<LandingPage />} />

//         {/* 🔐 AUTH - Public */}
//         <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
//         <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
//         <Route path="/forgot-password" element={<ForgotPassword />} />
//         <Route path="/reset-password" element={<ResetPassword />} />

//         {/* 🏠 HOME - Protected (Main Module Grid) */}
//         <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />

//         {/* 📊 OTHER PAGES - Protected, rendered without sidebar */}
//         <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
//         <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
//         <Route path="/projects/:projectId" element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} />
//         <Route path="/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
//         <Route path="/services/:serviceId" element={<ProtectedRoute><ServiceDetails /></ProtectedRoute>} />
//         <Route path="/services/:serviceId/logs" element={<ProtectedRoute><Logs /></ProtectedRoute>} />
//         <Route path="/incidents" element={<ProtectedRoute><Incidents /></ProtectedRoute>} />
//         <Route path="/incidents/:incidentId" element={<ProtectedRoute><IncidentDetails /></ProtectedRoute>} />
//         <Route path="/alerts" element={<ProtectedRoute><AlertCenter /></ProtectedRoute>} />
//         <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
//         <Route path="/anomalies" element={<ProtectedRoute><Anomalies /></ProtectedRoute>} />
//         <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
//         <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

//         {/* 🔄 FALLBACK */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// D:\Ai_Monitoring_Platform\ai-monitoring-ui\src\router\AppRouter.jsx

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// 🏠 Landing Page (Public)
import LandingPage from "../pages/LandingPage.jsx";

// 🔐 Auth Pages (Public)
import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";
import ForgotPassword from "../pages/auth/ForgotPassword.jsx";
import ResetPassword from "../pages/auth/ResetPassword.jsx";

// 📊 All Pages (Protected)
import Dashboard from "../pages/dashboard/Dashboard.jsx";
import Home from "../pages/home/Home.jsx";
import Projects from "../pages/projects/Projects.jsx";
import ProjectDetails from "../pages/projects/ProjectDetails.jsx";
import Services from "../pages/services/Services.jsx";
import ServiceDetails from "../pages/services/ServiceDetails.jsx";
import Incidents from "../pages/incidents/Incidents.jsx";
import IncidentDetails from "../pages/incidents/IncidentDetails.jsx";
import Anomalies from "../pages/anomalies/Anomalies.jsx";
import AlertCenter from "../pages/alerts/AlertCenter.jsx";
import Logs from "../pages/logs/Logs.jsx";
import Notifications from "../pages/notifications/Notifications.jsx";
import Profile from "../pages/Profile.jsx";
import Users from "../pages/users/Users.jsx";

// 🛡️ Protected Route Wrapper
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

// 🔄 Public Route Wrapper (redirects to HOME if already logged in)
function PublicRoute({ children }) {
  const token = localStorage.getItem("token");
  if (token) return <Navigate to="/home" replace />; // ✅ Changed from /dashboard to /home
  return children;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🏠 LANDING PAGE - Public */}
        <Route path="/" element={<LandingPage />} />

        {/* 🔐 AUTHENTICATION - Public (redirect if already logged in) */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* 🏠 HOME - Protected (Main Module Grid - No Sidebar) */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />

        {/* 📊 ALL OTHER PAGES - Protected, Rendered Without Sidebar */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
        <Route path="/projects/:projectId" element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} />
        <Route path="/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
        <Route path="/services/:serviceId" element={<ProtectedRoute><ServiceDetails /></ProtectedRoute>} />
        <Route path="/services/:serviceId/logs" element={<ProtectedRoute><Logs /></ProtectedRoute>} />
        <Route path="/incidents" element={<ProtectedRoute><Incidents /></ProtectedRoute>} />
        <Route path="/incidents/:incidentId" element={<ProtectedRoute><IncidentDetails /></ProtectedRoute>} />
        <Route path="/alerts" element={<ProtectedRoute><AlertCenter /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/anomalies" element={<ProtectedRoute><Anomalies /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* 🔄 FALLBACK - Redirect to landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}