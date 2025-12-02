import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import axios from "axios"
import PotholeList from "../components/PotholeList"

export default function AdminPage() {
  const [potholes, setPotholes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const { potholeCount, setPotholeCount } = useOutletContext()
  const adminEmail = localStorage.getItem("adminEmail") || ""
  const authToken = localStorage.getItem("authToken")

  // Create axios instance with auth header
  const apiClient = axios.create({
    baseURL: "http://localhost:3005",
    headers: {
      "Authorization": authToken ? `Bearer ${authToken}` : "",
      "Content-Type": "application/json"
    }
  })

  // Fetch potholes from backend
  const fetchPotholes = async () => {
    try {
      setRefreshing(true)
      const response = await apiClient.get("/potholes")
      const data = response.data
      
      setPotholes(Array.isArray(data) ? data : [])
      setPotholeCount(data.length || 0)
      setError(null)
    } catch (err) {
      console.error("Error fetching potholes:", err)
      setError("Failed to fetch potholes from backend")
    } finally {
      setRefreshing(false)
      setLoading(false)
    }
  }

  // Fetch potholes on component mount and set up auto-refresh
  useEffect(() => {
    fetchPotholes()

    // Auto-refresh every 5 seconds to reflect backend changes
    const interval = setInterval(fetchPotholes, 5000)

    return () => clearInterval(interval)
  }, [authToken])

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      // Update backend using PUT (backend expects PUT to update status)
      await apiClient.put(`/potholes/${id}`, { status: newStatus })
      
      // Update local state
      setPotholes(potholes.map(pothole => 
        pothole.id === id ? { ...pothole, status: newStatus } : pothole
      ))
    } catch (err) {
      console.error("Error updating pothole status:", err)
      alert("Failed to update status")
    }
  }

  const handleDeletePothole = async (id) => {
    if (!window.confirm("Are you sure you want to delete this report?")) {
      return
    }

    try {
      // Delete from backend
      await apiClient.delete(`/potholes/${id}`)
      
      // Update local state
      setPotholes(potholes.filter(pothole => pothole.id !== id))
      setPotholeCount(prev => prev - 1)
    } catch (err) {
      console.error("Error deleting pothole:", err)
      alert("Failed to delete report")
    }
  }

  if (loading) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Loading potholes...</div>
  }

  return (
    <div>
      {/* Header - shown only on mobile */}
      <div style={{
        display: "block",
        padding: "clamp(1rem, 4vw, 1.5rem)",
        background: "white",
        borderRadius: "0.5rem",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        marginBottom: "clamp(1rem, 4vw, 1.5rem)"
      }} className="mobile-admin-header">
        <h2 style={{
          margin: "0 0 0.5rem 0",
          fontSize: "clamp(1.5rem, 5vw, 1.75rem)"
        }}>Admin Dashboard</h2>
        <p style={{
          color: "#6b7280",
          fontSize: "clamp(0.75rem, 2vw, 0.875rem)",
          margin: "0.5rem 0 1rem 0",
          wordBreak: "break-all"
        }}>
          Logged in as: <strong>{adminEmail}</strong>
        </p>
        <div style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <div style={{
            fontSize: "clamp(0.75rem, 2vw, 0.875rem)",
            color: "#6b7280"
          }}>
            Total Reports: <strong>{potholeCount}</strong>
          </div>
          <button
            onClick={fetchPotholes}
            disabled={refreshing}
            style={{
              padding: "0.5rem 1rem",
              background: refreshing ? "#9ca3af" : "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "0.25rem",
              cursor: refreshing ? "not-allowed" : "pointer",
              fontSize: "clamp(0.75rem, 2vw, 0.875rem)",
              fontWeight: "500",
              transition: "background 0.2s",
              whiteSpace: "nowrap"
            }}
            onMouseEnter={(e) => !refreshing && (e.target.style.background = "#1d4ed8")}
            onMouseLeave={(e) => !refreshing && (e.target.style.background = "#2563eb")}
          >
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {error && (
        <div style={{
          padding: "clamp(0.75rem, 3vw, 1rem)",
          background: "#fee2e2",
          color: "#991b1b",
          borderRadius: "0.25rem",
          marginBottom: "clamp(1rem, 3vw, 1.5rem)",
          border: "1px solid #fecaca",
          fontSize: "clamp(0.75rem, 2vw, 0.875rem)"
        }}>
          {error}
        </div>
      )}
      
      <PotholeList 
        potholes={potholes}
        onUpdateStatus={handleUpdateStatus}
        onDeletePothole={handleDeletePothole}
      />

      <style>{`
        @media (max-width: 768px) {
          .mobile-admin-header {
            display: block !important;
          }
        }
        @media (min-width: 769px) {
          .mobile-admin-header {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
