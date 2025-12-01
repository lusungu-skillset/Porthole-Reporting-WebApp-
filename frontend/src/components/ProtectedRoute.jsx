import { Navigate, useLocation } from "react-router-dom"

export default function ProtectedRoute({ children }) {
  const location = useLocation()
  const isAuthenticated = localStorage.getItem("isAdmin") === "true"

  if (!isAuthenticated) {
    // Redirect to login page, but save where they were trying to go
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return children
}
