import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/home/Home.jsx";
import Login from "../pages/login/Login.jsx";
import Register from "../pages/register/Register.jsx";
import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout.jsx";
import Dashboard from "../pages/dashboard/Dashboard.jsx";
import Customers from "../pages/customers/Customers.jsx";
import Sales from "../pages/sales/Sales.jsx";
import Tasks from "../pages/tasks/Tasks.jsx";
import Analytics from "../pages/Analytics/Analytics.jsx";
import AI from "../pages/AI/AI.jsx";
import Settings from "../pages/settings/Settings.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import PublicAuthRoute from "./PublicAuthRoute.jsx";
import AuthLayout from "../layouts/AuthLayout/AuthLayout.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<Home />} />

      {/* Public Auth Routes (Redirect to /dashboard if logged in) */}
      <Route
        path="/login"
        element={
          <PublicAuthRoute>
            <AuthLayout title="Welcome back to BizPilot AI" subtitle="Sign in to manage your sales, CRM & inventory.">
              <Login />
            </AuthLayout>
          </PublicAuthRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicAuthRoute>
            <AuthLayout title="Start your free merchant account" subtitle="Setup your business hub in 2 minutes.">
              <Register />
            </AuthLayout>
          </PublicAuthRoute>
        }
      />

      {/* Strict Protected Dashboard Routes (Redirect to /login if unauthenticated) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="customers" element={<Customers />} />
        <Route path="sales" element={<Sales />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="ai" element={<AI />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Direct Top-Level Route Aliases */}
      <Route path="/customers" element={<Navigate to="/dashboard/customers" replace />} />
      <Route path="/sales" element={<Navigate to="/dashboard/sales" replace />} />
      <Route path="/tasks" element={<Navigate to="/dashboard/tasks" replace />} />
      <Route path="/analytics" element={<Navigate to="/dashboard/analytics" replace />} />
      <Route path="/ai" element={<Navigate to="/dashboard/ai" replace />} />
      <Route path="/settings" element={<Navigate to="/dashboard/settings" replace />} />

      {/* Catch-all Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
