import { useState, useEffect } from "react"
import { Navigate, useLocation } from "react-router-dom"
import axios from "axios"

export default function ProtectedRoute({ children }) {
  const location = useLocation()
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  const [loading, setLoading] = useState(true)
  const authToken = localStorage.getItem("authToken")

  useEffect(() => {
    const validateToken = async () => {
      if (!authToken) {
        setIsAuthenticated(false)
        setLoading(false)
        return
      }

      try {
        const response = await axios.get("http://localhost:3005/auth/verify", {
          headers: {
            "Authorization": `Bearer ${authToken}`
          }
        })

        if (response.data.valid) {
          setIsAuthenticated(true)
          // Update admin data if provided
          if (response.data.admin) {
            localStorage.setItem("adminData", JSON.stringify(response.data.admin))
            localStorage.setItem("adminEmail", response.data.admin.email)
          }
        } else {
          setIsAuthenticated(false)
          localStorage.removeItem("authToken")
          localStorage.removeItem("adminData")
          localStorage.removeItem("adminEmail")
        }
      } catch (err) {
        console.error("Token validation error:", err)
        setIsAuthenticated(false)
        localStorage.removeItem("authToken")
        localStorage.removeItem("adminData")
        localStorage.removeItem("adminEmail")
      } finally {
        setLoading(false)
      }
    }

    validateToken()
  }, [authToken])

  if (loading) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Validating session...</div>
  }

  if (!isAuthenticated) {
    // Redirect to login page, but save where they were trying to go
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return children
}
