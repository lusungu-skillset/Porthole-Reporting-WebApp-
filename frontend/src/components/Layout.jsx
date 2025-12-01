import { Link, Outlet, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

export default function Layout() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminEmail, setAdminEmail] = useState("")
  const [potholeCount, setPotholeCount] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if admin is logged in
    const adminStatus = localStorage.getItem("isAdmin") === "true"
    const savedEmail = localStorage.getItem("adminEmail") || ""
    setIsAdmin(adminStatus)
    setAdminEmail(savedEmail)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("isAdmin")
    localStorage.removeItem("adminEmail")
    setIsAdmin(false)
    setAdminEmail("")
    navigate("/")
  }

  return (
    <div className="app">
      <nav style={{ background: "#2563eb", color: "white", padding: "1rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link to="/" style={{ color: "white", textDecoration: "none" }}>
            <h1 style={{ margin: 0 }}>POTHOLEREPORTER</h1>
          </Link>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <Link to="/">
              <button style={{ 
                background: "transparent",
                color: "white",
                padding: "0.5rem 1rem",
                border: "1px solid white",
                borderRadius: "0.25rem",
                cursor: "pointer"
              }}>
                Home
              </button>
            </Link>
            <Link to="/report">
              <button style={{ 
                background: "transparent",
                color: "white",
                padding: "0.5rem 1rem",
                border: "1px solid white",
                borderRadius: "0.25rem",
                cursor: "pointer"
              }}>
                Report
              </button>
            </Link>
            
            {isAdmin ? (
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <span style={{ fontSize: "0.875rem" }}>
                  {adminEmail}
                </span>
                <Link to="/admin">
                  <button style={{ 
                    background: "white",
                    color: "#2563eb",
                    padding: "0.5rem 1rem",
                    border: "none",
                    borderRadius: "0.25rem",
                    cursor: "pointer"
                  }}>
                    Dashboard ({potholeCount})
                  </button>
                </Link>
                <button 
                  onClick={handleLogout}
                  style={{ 
                    background: "transparent",
                    color: "white",
                    padding: "0.5rem 1rem",
                    border: "1px solid white",
                    borderRadius: "0.25rem",
                    cursor: "pointer"
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login">
                <button style={{ 
                  background: "transparent",
                  color: "white",
                  padding: "0.5rem 1rem",
                  border: "1px solid white",
                  borderRadius: "0.25rem",
                  cursor: "pointer"
                }}>
                  Admin Login
                </button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "1rem" }}>
        <Outlet context={{ potholeCount, setPotholeCount, isAdmin, setIsAdmin }} />
      </div>
    </div>
  )
}
