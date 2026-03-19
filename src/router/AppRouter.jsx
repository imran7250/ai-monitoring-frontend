import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "../pages/LandingPage.jsx";

import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";
import ForgotPassword from "../pages/auth/ForgotPassword.jsx";
import ResetPassword from "../pages/auth/ResetPassword.jsx";

import Dashboard from "../pages/dashboard/Dashboard.jsx";
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
import Home from "../pages/home/Home.jsx";
import Users from "../pages/users/Users.jsx";

import SectionLayout from "../layout/SectionLayout.jsx";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔥 LANDING PAGE */}
        <Route path="/" element={<LandingPage />} />

        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* PROTECTED — no sidebar */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* PROTECTED — with layout */}
        <Route
          element={
            <ProtectedRoute>
              <SectionLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:projectId" element={<ProjectDetails />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:serviceId" element={<ServiceDetails />} />
          <Route path="/services/:serviceId/logs" element={<Logs />} />
          <Route path="/incidents" element={<Incidents />} />
          <Route path="/incidents/:incidentId" element={<IncidentDetails />} />
          <Route path="/alerts" element={<AlertCenter />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/anomalies" element={<Anomalies />} />
          <Route path="/users" element={<Users />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}
