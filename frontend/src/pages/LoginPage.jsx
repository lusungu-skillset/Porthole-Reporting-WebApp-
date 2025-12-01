import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const location = useLocation()

  // Get the page they were trying to access
  const from = location.state?.from || "/admin"

  const handleLogin = (e) => {
    e.preventDefault()
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      return
    }
    
    // Simple hardcoded login (for demo)
    // In real app, this would call your backend
    if (email === "admin@example.com" && password === "admin123") {
      localStorage.setItem("isAdmin", "true")
      localStorage.setItem("adminEmail", email) // Store email for display
      navigate(from, { replace: true })
    } else {
      setError("Invalid email or password")
    }
  }

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto", padding: "2rem", background: "white", borderRadius: "0.5rem", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
      <h2 style={{ marginBottom: "1rem" }}>Admin Login</h2>
      <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>
        Please login with your admin credentials
      </p>
      
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", color: "#374151" }}>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.25rem" }}
            placeholder="admin@example.com"
            required
          />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", color: "#374151" }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.25rem" }}
            placeholder="Enter password"
            required
          />
        </div>

        {error && (
          <div style={{ padding: "0.5rem", background: "#fee2e2", color: "#dc2626", borderRadius: "0.25rem", marginBottom: "1rem" }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          style={{ width: "100%", background: "#2563eb", color: "white", padding: "0.5rem", border: "none", borderRadius: "0.25rem", cursor: "pointer" }}
        >
          Login
        </button>
      </form>

      <div style={{ marginTop: "1rem", fontSize: "0.875rem", color: "#6b7280", textAlign: "center" }}>
        <p>Demo credentials:</p>
        <p><strong>Email:</strong> admin@example.com</p>
        <p><strong>Password:</strong> admin123</p>
      </div>
    </div>
  )
}
