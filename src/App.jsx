import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './components/Landing'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import DonorDashboard from './components/dashboards/DonorDashboard'
import NgoDashboard from './components/dashboards/NgoDashboard'
import AdminDashboard from './components/dashboards/AdminDashboard'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import { useAuthState } from './hooks/useAuthState'

function ProtectedRoute({ children, roles }) {
  const { user, role, loading } = useAuthState()
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(role)) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-gray-800">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/donor"
            element={
              <ProtectedRoute roles={["donor", "admin"]}>
                <DonorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ngo"
            element={
              <ProtectedRoute roles={["ngo", "admin"]}>
                <NgoDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
