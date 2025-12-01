import { useState } from "react"

export default function ReportForm({ selectedLocation, onSubmit }) {
  const [formData, setFormData] = useState({
    description: "",
    severity: "medium"
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedLocation) {
      alert("Please select a location on the map first")
      return
    }
    
    onSubmit({
      ...formData,
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng
    })
    
    // Reset form
    setFormData({ description: "", severity: "medium" })
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: "white", padding: "1.5rem", borderRadius: "0.5rem", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", marginTop: "1rem" }}>
      <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem" }}>Report a Pothole</h2>
      
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", color: "#374151", marginBottom: "0.5rem" }}>Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          style={{ width: "100%", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.25rem" }}
          rows="3"
          placeholder="Describe the pothole location and condition..."
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", color: "#374151", marginBottom: "0.5rem" }}>Severity</label>
        <select
          value={formData.severity}
          onChange={(e) => setFormData({...formData, severity: e.target.value})}
          style={{ width: "100%", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.25rem" }}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <button
        type="submit"
        style={{ width: "100%", background: "#2563eb", color: "white", padding: "0.5rem 1rem", borderRadius: "0.25rem", border: "none" }}
      >
        Submit Report
      </button>
    </form>
  )
}
