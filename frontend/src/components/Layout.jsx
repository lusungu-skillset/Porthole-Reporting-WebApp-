import { Link, Outlet, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

export default function Layout() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminEmail, setAdminEmail] = useState("")
  const [potholeCount, setPotholeCount] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if admin is logged in
    const authToken = localStorage.getItem("authToken")
    const savedEmail = localStorage.getItem("adminEmail") || ""
    setIsAdmin(!!authToken)
    setAdminEmail(savedEmail)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("adminData")
    localStorage.removeItem("adminEmail")
    setIsAdmin(false)
    setAdminEmail("")
    setMobileMenuOpen(false)
    navigate("/")
  }

  const buttonStyle = {
    background: "transparent",
    color: "white",
    padding: "0.5rem 1rem",
    border: "1px solid white",
    borderRadius: "0.25rem",
    cursor: "pointer",
    fontSize: "0.875rem",
    whiteSpace: "nowrap"
  }

  return (
    <div className="app">
      <nav style={{ background: "#2563eb", color: "white", padding: "0.75rem 1rem" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link to="/" style={{ color: "white", textDecoration: "none", flex: 1 }}>
            <h1 style={{ margin: 0, fontSize: "clamp(1rem, 4vw, 1.5rem)" }}>POTHOLE REPORTER</h1>
          </Link>

          {/* Desktop menu - shown only on screens >= 768px */}
          <div style={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "flex-end"
          }}>
            <Link to="/">
              <button style={buttonStyle}>Home</button>
            </Link>
            <Link to="/report">
              <button style={buttonStyle}>Report</button>
            </Link>
            
            {isAdmin ? (
              <>
                <span style={{ fontSize: "0.75rem", maxWidth: "150px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {adminEmail}
                </span>
                <Link to="/admin">
                  <button style={{ ...buttonStyle, background: "white", color: "#2563eb", border: "none" }}>
                    Dashboard ({potholeCount})
                  </button>
                </Link>
                <button 
                  onClick={handleLogout}
                  style={buttonStyle}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login">
                <button style={buttonStyle}>Admin Login</button>
              </Link>
            )}
          </div>

          {/* Mobile menu button - shown only on screens < 768px */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: "flex",
              background: "transparent",
              color: "white",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer"
            }}
            className="mobile-menu-btn"
          >
            ☰
          </button>
        </div>

        {/* Mobile menu - shown only when open on screens < 768px */}
        {mobileMenuOpen && (
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            marginTop: "1rem",
            paddingTop: "1rem",
            borderTop: "1px solid rgba(255,255,255,0.2)"
          }}>
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>
              <button style={{ ...buttonStyle, width: "100%" }}>Home</button>
            </Link>
            <Link to="/report" onClick={() => setMobileMenuOpen(false)}>
              <button style={{ ...buttonStyle, width: "100%" }}>Report</button>
            </Link>
            
            {isAdmin ? (
              <>
                <div style={{ fontSize: "0.75rem", padding: "0.5rem 0" }}>Email: {adminEmail}</div>
                <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                  <button style={{ ...buttonStyle, width: "100%", background: "white", color: "#2563eb", border: "none" }}>
                    Dashboard ({potholeCount})
                  </button>
                </Link>
                <button 
                  onClick={handleLogout}
                  style={{ ...buttonStyle, width: "100%" }}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <button style={{ ...buttonStyle, width: "100%" }}>Admin Login</button>
              </Link>
            )}
          </div>
        )}
      </nav>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "1rem", boxSizing: "border-box" }}>
        <Outlet context={{ potholeCount, setPotholeCount, isAdmin, setIsAdmin }} />
      </div>

      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: flex !important;
          }
          nav div:first-child > div:not(.mobile-menu-btn) {
            display: none !important;
          }
        }
        @media (min-width: 769px) {
          .mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
