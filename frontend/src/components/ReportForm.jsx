import { useState } from "react"
import axios from "axios"

// Axios client - direct API URL (no env variables)
const apiClient = axios.create({
  baseURL: "http://localhost:3005",
  headers: {
    "Content-Type": "application/json"
  }
})

export default function ReportForm({ selectedLocation, onSubmit }) {
  const [formData, setFormData] = useState({
    reporterName: "",
    description: "",
    severity: "MEDIUM"
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    
    if (!selectedLocation) {
      setError("Please select a location on the map first")
      return
    }

    if (!formData.reporterName.trim()) {
      setError("Please enter your name")
      return
    }

    if (!formData.description.trim()) {
      setError("Please enter a description")
      return
    }
    
    setLoading(true)
    try {
      const payload = {
        reporterName: formData.reporterName,
        description: formData.description,
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng,
        severity: formData.severity
      }
      
      const response = await apiClient.post("/potholes", payload)

      alert("Report submitted successfully!")

      // Call parent callback if provided
      if (onSubmit) {
        onSubmit(response.data)
      }

      // Reset form
      setFormData({ reporterName: "", description: "", severity: "MEDIUM" })
    } catch (err) {
      console.error("Full error object:", err)

      let errorMessage = "Failed to submit report"

      const backendUrl = apiClient?.defaults?.baseURL || "(unknown backend URL)"

      if (err?.code === "ERR_NETWORK") {
        errorMessage = `Network error: Cannot connect to server. Make sure the backend is running at ${backendUrl}`
      } else if (err.response?.status === 0) {
        errorMessage = `Connection failed: Backend server ${backendUrl} is not accessible`
      } else if (err.response?.status === 404) {
        errorMessage = `API endpoint not found (404) at ${backendUrl}`
      } else if (err.response?.status === 400) {
        errorMessage = err.response?.data?.message || "Invalid data submitted"
      } else if (err.response?.status === 500) {
        errorMessage = "Server error: " + (err.response?.data?.message || "Internal server error")
      } else if (err.message === "Network Error") {
        errorMessage = `Network error: Check if backend ${backendUrl} is running and CORS is configured`
      } else {
        errorMessage = err.response?.data?.message || err.message || errorMessage
      }

      setError(errorMessage)
      console.error("Error submitting report:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{
      background: "white",
      padding: "clamp(1rem, 5vw, 1.5rem)",
      borderRadius: "0.5rem",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      marginTop: "clamp(0.5rem, 3vw, 1rem)"
    }}>
      <h2 style={{
        fontSize: "clamp(1.25rem, 5vw, 1.5rem)",
        fontWeight: "bold",
        marginBottom: "1rem"
      }}>Report a Pothole</h2>
      
      {error && (
        <div style={{
          background: "#fee2e2",
          color: "#991b1b",
          padding: "0.75rem",
          borderRadius: "0.25rem",
          marginBottom: "1rem",
          border: "1px solid #fecaca",
          fontSize: "0.875rem"
        }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: "1rem" }}>
        <label style={{
          display: "block",
          color: "#374151",
          marginBottom: "0.5rem",
          fontSize: "clamp(0.75rem, 2vw, 0.875rem)",
          fontWeight: "500"
        }}>Your Name *</label>
        <input
          type="text"
          value={formData.reporterName}
          onChange={(e) => setFormData({...formData, reporterName: e.target.value})}
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
          placeholder="Enter your name..."
        />
      </div>
      
      <div style={{ marginBottom: "1rem" }}>
        <label style={{
          display: "block",
          color: "#374151",
          marginBottom: "0.5rem",
          fontSize: "clamp(0.75rem, 2vw, 0.875rem)",
          fontWeight: "500"
        }}>Description *</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          style={{
            width: "100%",
            padding: "0.75rem",
            border: "1px solid #d1d5db",
            borderRadius: "0.25rem",
            boxSizing: "border-box",
            fontSize: "1rem",
            fontFamily: "inherit",
            resize: "vertical",
            minHeight: "120px",
            transition: "border-color 0.2s"
          }}
          onFocus={(e) => e.target.style.borderColor = "#2563eb"}
          onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
          rows="4"
          placeholder="Describe the pothole location and condition..."
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label style={{
          display: "block",
          color: "#374151",
          marginBottom: "0.5rem",
          fontSize: "clamp(0.75rem, 2vw, 0.875rem)",
          fontWeight: "500"
        }}>Severity</label>
        <select
          value={formData.severity}
          onChange={(e) => setFormData({...formData, severity: e.target.value})}
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
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%",
          background: loading ? "#9ca3af" : "#2563eb",
          color: "white",
          padding: "clamp(0.5rem, 2vw, 0.75rem) 1rem",
          borderRadius: "0.25rem",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          fontSize: "1rem",
          fontWeight: "500",
          transition: "background 0.2s"
        }}
        onMouseEnter={(e) => !loading && (e.target.style.background = "#1d4ed8")}
        onMouseLeave={(e) => !loading && (e.target.style.background = "#2563eb")}
      >
        {loading ? "Submitting..." : "Submit Report"}
      </button>
    </form>
  )
}
