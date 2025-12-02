import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import axios from "axios"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Get the page they were trying to access
  const from = location.state?.from || "/admin"

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      return
    }
    
    if (!password) {
      setError("Please enter your password")
      return
    }

    setLoading(true)
    try {
      // Call backend login endpoint
      const response = await axios.post("http://localhost:3005/auth/login", {
        email,
        password
      })

      const { token, admin } = response.data

      // Store token in localStorage for auth header
      localStorage.setItem("authToken", token)
      localStorage.setItem("adminData", JSON.stringify(admin))
      localStorage.setItem("adminEmail", admin.email)
      
      // Redirect to admin dashboard
      navigate(from, { replace: true })
    } catch (err) {
      console.error("Login error:", err)
      
      let errorMessage = "Login failed"
      
      if (err.response?.status === 401) {
        errorMessage = "Invalid email or password"
      } else if (err.response?.status === 404) {
        errorMessage = "Admin not found"
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      } else if (err.code === "ERR_NETWORK") {
        errorMessage = "Cannot connect to backend. Make sure it's running at http://localhost:3005"
      } else if (err.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem",
      background: "#f9fafb"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "500px",
        padding: "clamp(1.5rem, 5vw, 2.5rem)",
        background: "white",
        borderRadius: "0.5rem",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ marginBottom: "0.5rem", fontSize: "clamp(1.5rem, 5vw, 2rem)" }}>Admin Login</h2>
        <p style={{ color: "#6b7280", marginBottom: "1.5rem", fontSize: "clamp(0.875rem, 2vw, 1rem)" }}>
          Please login with your admin credentials
        </p>
        
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{
              display: "block",
              marginBottom: "0.5rem",
              color: "#374151",
              fontSize: "clamp(0.75rem, 2vw, 0.875rem)",
              fontWeight: "500"
            }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.25rem",
                boxSizing: "border-box",
                fontSize: "1rem",
                transition: "border-color 0.2s"
              }}
              onFocus={(e) => e.target.style.borderColor = "#2563eb"}
              onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
              placeholder="admin@example.com"
              disabled={loading}
              required
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{
              display: "block",
              marginBottom: "0.5rem",
              color: "#374151",
              fontSize: "clamp(0.75rem, 2vw, 0.875rem)",
              fontWeight: "500"
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.25rem",
                boxSizing: "border-box",
                fontSize: "1rem",
                transition: "border-color 0.2s"
              }}
              onFocus={(e) => e.target.style.borderColor = "#2563eb"}
              onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
              placeholder="Enter password"
              disabled={loading}
              required
            />
          </div>

          {error && (
            <div style={{
              padding: "0.75rem",
              background: "#fee2e2",
              color: "#dc2626",
              borderRadius: "0.25rem",
              marginBottom: "1rem",
              fontSize: "0.875rem",
              border: "1px solid #fecaca"
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: loading ? "#9ca3af" : "#2563eb",
              color: "white",
              padding: "0.75rem",
              border: "none",
              borderRadius: "0.25rem",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "1rem",
              fontWeight: "500",
              transition: "background 0.2s"
            }}
            onMouseEnter={(e) => !loading && (e.target.style.background = "#1d4ed8")}
            onMouseLeave={(e) => !loading && (e.target.style.background = "#2563eb")}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  )
}
