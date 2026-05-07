import React from 'react'
import { Routes, Route, Navigate } from "react-router-dom"
import { useAppSelector } from "./hooks/useAppDispatch"

import LandingPage    from "./pages/LandingPage"
import LoginPage      from "./pages/auth/LoginPage"
import RegisterPage   from "./pages/auth/RegisterPage"
import ShipperDashboard from "./pages/shipper/Dashboard"
import TruckerDashboard from "./pages/trucker/Dashboard"
import AdminDashboard   from "./pages/admin/Dashboard"

// Protected route component
const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode, allowedRole?: string }) => {
  const { user, accessToken } = useAppSelector((state) => state.auth)

  if (!accessToken || !user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

function App() {
  return (
    <Routes>
      <Route path="/"        element={<LandingPage />} />
      <Route path="/login"   element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/shipper/*" element={
        <ProtectedRoute allowedRole="shipper">
          <ShipperDashboard />
        </ProtectedRoute>
      } />

      <Route path="/trucker/*" element={
        <ProtectedRoute allowedRole="trucker">
          <TruckerDashboard />
        </ProtectedRoute>
      } />

      <Route path="/admin/*" element={
        <ProtectedRoute allowedRole="admin">
          <AdminDashboard />
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App