import { useState } from "react"

export default function PotholeList({ potholes, onUpdateStatus, onDeletePothole }) {
  const [filter, setFilter] = useState("all")

  // Filter potholes based on selection
  const filteredPotholes = filter === "all" 
    ? potholes 
    : potholes.filter(pothole => pothole.status === filter)

  const handleStatusChange = (id, newStatus) => {
    onUpdateStatus(id, newStatus)
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this pothole report?")) {
      onDeletePothole(id)
    }
  }

  return (
    <div style={{ background: "white", borderRadius: "0.5rem", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
      <div style={{ padding: "1.5rem", borderBottom: "1px solid #e5e7eb" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem" }}>
          Pothole Reports Management
        </h2>
        
        {/* Filter buttons */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
          <button 
            onClick={() => setFilter("all")}
            style={{ 
              padding: "0.25rem 0.75rem", 
              borderRadius: "0.25rem", 
              background: filter === "all" ? "#2563eb" : "#f3f4f6",
              color: filter === "all" ? "white" : "#374151",
              border: "none"
            }}
          >
            All ({potholes.length})
          </button>
          <button 
            onClick={() => setFilter("reported")}
            style={{ 
              padding: "0.25rem 0.75rem", 
              borderRadius: "0.25rem", 
              background: filter === "reported" ? "#2563eb" : "#f3f4f6",
              color: filter === "reported" ? "white" : "#374151",
              border: "none"
            }}
          >
            Reported ({potholes.filter(p => p.status === "reported").length})
          </button>
          <button 
            onClick={() => setFilter("in_progress")}
            style={{ 
              padding: "0.25rem 0.75rem", 
              borderRadius: "0.25rem", 
              background: filter === "in_progress" ? "#2563eb" : "#f3f4f6",
              color: filter === "in_progress" ? "white" : "#374151",
              border: "none"
            }}
          >
            In Progress ({potholes.filter(p => p.status === "in_progress").length})
          </button>
          <button 
            onClick={() => setFilter("fixed")}
            style={{ 
              padding: "0.25rem 0.75rem", 
              borderRadius: "0.25rem", 
              background: filter === "fixed" ? "#2563eb" : "#f3f4f6",
              color: filter === "fixed" ? "white" : "#374151",
              border: "none"
            }}
          >
            Fixed ({potholes.filter(p => p.status === "fixed").length})
          </button>
        </div>
      </div>

      {/* Potholes table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#f9fafb" }}>
            <tr>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Location</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Description</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Severity</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Status</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Date</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPotholes.map(pothole => (
              <tr key={pothole.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: "0.75rem 1rem" }}>
                  {pothole.latitude?.toFixed(4)}, {pothole.longitude?.toFixed(4)}
                </td>
                <td style={{ padding: "0.75rem 1rem" }}>{pothole.description}</td>
                <td style={{ padding: "0.75rem 1rem" }}>
                  <span style={{ 
                    padding: "0.25rem 0.5rem", 
                    borderRadius: "0.25rem", 
                    fontSize: "0.75rem",
                    background: 
                      pothole.severity === "high" ? "#fef2f2" :
                      pothole.severity === "medium" ? "#fffbeb" : "#f0fdf4",
                    color: 
                      pothole.severity === "high" ? "#dc2626" :
                      pothole.severity === "medium" ? "#d97706" : "#16a34a"
                  }}>
                    {pothole.severity}
                  </span>
                </td>
                <td style={{ padding: "0.75rem 1rem" }}>
                  <select
                    value={pothole.status}
                    onChange={(e) => handleStatusChange(pothole.id, e.target.value)}
                    style={{ 
                      padding: "0.25rem 0.5rem", 
                      border: "1px solid #d1d5db", 
                      borderRadius: "0.25rem",
                      fontSize: "0.875rem"
                    }}
                  >
                    <option value="reported">Reported</option>
                    <option value="in_progress">In Progress</option>
                    <option value="fixed">Fixed</option>
                  </select>
                </td>
                <td style={{ padding: "0.75rem 1rem", fontSize: "0.875rem", color: "#6b7280" }}>
                  {pothole.date || "Today"}
                </td>
                <td style={{ padding: "0.75rem 1rem" }}>
                  <button
                    onClick={() => handleDelete(pothole.id)}
                    style={{ 
                      padding: "0.25rem 0.5rem", 
                      background: "#ef4444", 
                      color: "white", 
                      border: "none",
                      borderRadius: "0.25rem",
                      fontSize: "0.875rem"
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredPotholes.length === 0 && (
          <div style={{ padding: "2rem", textAlign: "center", color: "#6b7280" }}>
            No potholes found {filter !== "all" && `with status "${filter}"`}
          </div>
        )}
      </div>
    </div>
  )
}
