import { useState } from "react"

// Normalize various backend status representations to user-friendly labels
const normalizeStatus = (s) => {
  if (!s) return "Pending"
  const v = String(s).toLowerCase()
  if (v === "pending" || v === "reported") return "Pending"
  if (v === "in_progress" || v === "in progress" || v === "inprogress") return "In Progress"
  if (v === "fixed" || v === "resolved") return "Fixed"
  return s
}

export default function PotholeList({ potholes, onUpdateStatus, onDeletePothole }) {
  const [filter, setFilter] = useState("all")

  // Compute normalized statuses and counts
  const normalized = potholes.map(p => ({ ...p, normalizedStatus: normalizeStatus(p.status) }))

  const filteredPotholes = filter === "all"
    ? normalized
    : normalized.filter(p => p.normalizedStatus === filter)

  const counts = {
    all: normalized.length,
    Pending: normalized.filter(p => p.normalizedStatus === "Pending").length,
    "In Progress": normalized.filter(p => p.normalizedStatus === "In Progress").length,
    Fixed: normalized.filter(p => p.normalizedStatus === "Fixed").length
  }

  const handleStatusChange = (id, newStatus) => {
    // newStatus is a display label like "In Progress"; pass it through
    onUpdateStatus(id, newStatus)
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this pothole report?")) {
      onDeletePothole(id)
    }
  }

  const filterButtonStyle = (isActive) => ({
    padding: "0.5rem 1rem",
    borderRadius: "0.25rem",
    background: isActive ? "#2563eb" : "#f3f4f6",
    color: isActive ? "white" : "#374151",
    border: "none",
    cursor: "pointer",
    fontSize: "clamp(0.75rem, 2vw, 0.875rem)",
    fontWeight: "500",
    whiteSpace: "nowrap"
  })

  return (
    <div style={{
      background: "white",
      borderRadius: "0.5rem",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      overflow: "hidden"
    }}>
      <div style={{
        padding: "clamp(1rem, 4vw, 1.5rem)",
        borderBottom: "1px solid #e5e7eb"
      }}>
        <h2 style={{
          fontSize: "clamp(1.25rem, 5vw, 1.5rem)",
          fontWeight: "bold",
          marginBottom: "1rem"
        }}>
          Pothole Reports Management
        </h2>
        
        {/* Filter buttons - responsive grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
          gap: "0.5rem",
          marginBottom: "1rem"
        }}>
          <button 
            onClick={() => setFilter("all")}
            style={filterButtonStyle(filter === "all")}
          >
            All ({counts.all})
          </button>
          <button 
            onClick={() => setFilter("Pending")}
            style={filterButtonStyle(filter === "Pending")}
          >
            Pending ({counts.Pending})
          </button>
          <button 
            onClick={() => setFilter("In Progress")}
            style={filterButtonStyle(filter === "In Progress")}
          >
            In Progress ({counts["In Progress"]})
          </button>
          <button 
            onClick={() => setFilter("Fixed")}
            style={filterButtonStyle(filter === "Fixed")}
          >
            Fixed ({counts.Fixed})
          </button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div style={{ display: "none", "@media (min-width: 768px)": { display: "block" } }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#f9fafb" }}>
            <tr>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left", borderBottom: "1px solid #e5e7eb", fontSize: "0.875rem" }}>Location</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left", borderBottom: "1px solid #e5e7eb", fontSize: "0.875rem" }}>Description</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left", borderBottom: "1px solid #e5e7eb", fontSize: "0.875rem" }}>Severity</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left", borderBottom: "1px solid #e5e7eb", fontSize: "0.875rem" }}>Status</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left", borderBottom: "1px solid #e5e7eb", fontSize: "0.875rem" }}>Date</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left", borderBottom: "1px solid #e5e7eb", fontSize: "0.875rem" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPotholes.map(pothole => (
              <tr key={pothole.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: "0.75rem 1rem", fontSize: "0.875rem" }}>
                  {pothole.latitude?.toFixed?.(4) || ""}, {pothole.longitude?.toFixed?.(4) || ""}
                </td>
                <td style={{ padding: "0.75rem 1rem", fontSize: "0.875rem" }}>{pothole.description}</td>
                <td style={{ padding: "0.75rem 1rem" }}>
                  <span style={{ 
                    padding: "0.25rem 0.5rem", 
                    borderRadius: "0.25rem", 
                    fontSize: "0.75rem",
                    background: 
                      (pothole.severity || "").toLowerCase() === "high" ? "#fef2f2" :
                      (pothole.severity || "").toLowerCase() === "medium" ? "#fffbeb" : "#f0fdf4",
                    color: 
                      (pothole.severity || "").toLowerCase() === "high" ? "#dc2626" :
                      (pothole.severity || "").toLowerCase() === "medium" ? "#d97706" : "#16a34a"
                  }}>
                    {pothole.severity}
                  </span>
                </td>
                <td style={{ padding: "0.75rem 1rem" }}>
                  <select
                    value={pothole.normalizedStatus}
                    onChange={(e) => handleStatusChange(pothole.id, e.target.value)}
                    style={{ 
                      padding: "0.5rem",
                      border: "1px solid #d1d5db",
                      borderRadius: "0.25rem",
                      fontSize: "0.875rem"
                    }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Fixed">Fixed</option>
                  </select>
                </td>
                <td style={{ padding: "0.75rem 1rem", fontSize: "0.875rem", color: "#6b7280" }}>
                  {pothole.date || "Today"}
                </td>
                <td style={{ padding: "0.75rem 1rem" }}>
                  <button
                    onClick={() => handleDelete(pothole.id)}
                    style={{ 
                      padding: "0.5rem 1rem",
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "0.25rem",
                      fontSize: "0.875rem",
                      cursor: "pointer",
                      transition: "background 0.2s"
                    }}
                    onMouseEnter={(e) => e.target.style.background = "#dc2626"}
                    onMouseLeave={(e) => e.target.style.background = "#ef4444"}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: "1rem",
        padding: "clamp(0.5rem, 3vw, 1rem)"
      }}>
        {filteredPotholes.map(pothole => (
          <div key={pothole.id} style={{
            display: "none",
            "@media (max-width: 768px)": { display: "block" },
            border: "1px solid #e5e7eb",
            borderRadius: "0.5rem",
            padding: "1rem",
            background: "#f9fafb"
          }} className={`pothole-card-${pothole.id}`}>
            <div style={{ marginBottom: "0.75rem" }}>
              <label style={{ fontSize: "0.75rem", color: "#6b7280", fontWeight: "600" }}>Location</label>
              <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.875rem" }}>
                {pothole.latitude?.toFixed?.(4) || ""}, {pothole.longitude?.toFixed?.(4) || ""}
              </p>
            </div>

            <div style={{ marginBottom: "0.75rem" }}>
              <label style={{ fontSize: "0.75rem", color: "#6b7280", fontWeight: "600" }}>Description</label>
              <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.875rem" }}>{pothole.description}</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "0.75rem" }}>
              <div>
                <label style={{ fontSize: "0.75rem", color: "#6b7280", fontWeight: "600" }}>Severity</label>
                <span style={{ 
                  display: "inline-block",
                  marginTop: "0.25rem",
                  padding: "0.25rem 0.5rem",
                  borderRadius: "0.25rem",
                  fontSize: "0.75rem",
                  background: 
                    (pothole.severity || "").toLowerCase() === "high" ? "#fef2f2" :
                    (pothole.severity || "").toLowerCase() === "medium" ? "#fffbeb" : "#f0fdf4",
                  color: 
                    (pothole.severity || "").toLowerCase() === "high" ? "#dc2626" :
                    (pothole.severity || "").toLowerCase() === "medium" ? "#d97706" : "#16a34a"
                }}>
                  {pothole.severity}
                </span>
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", color: "#6b7280", fontWeight: "600" }}>Date</label>
                <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.875rem" }}>
                  {pothole.date || "Today"}
                </p>
              </div>
            </div>

            <div style={{ marginBottom: "0.75rem" }}>
              <label style={{ fontSize: "0.75rem", color: "#6b7280", fontWeight: "600" }}>Status</label>
              <select
                value={pothole.normalizedStatus}
                onChange={(e) => handleStatusChange(pothole.id, e.target.value)}
                style={{ 
                  width: "100%",
                  marginTop: "0.25rem",
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.25rem",
                  fontSize: "0.875rem"
                }}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Fixed">Fixed</option>
              </select>
            </div>

            <button
              onClick={() => handleDelete(pothole.id)}
              style={{
                width: "100%",
                padding: "0.75rem",
                background: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "0.25rem",
                fontSize: "0.875rem",
                cursor: "pointer",
                transition: "background 0.2s"
              }}
              onMouseEnter={(e) => e.target.style.background = "#dc2626"}
              onMouseLeave={(e) => e.target.style.background = "#ef4444"}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {filteredPotholes.length === 0 && (
        <div style={{
          padding: "clamp(2rem, 5vw, 3rem)",
          textAlign: "center",
          color: "#6b7280",
          fontSize: "clamp(0.875rem, 2vw, 1rem)"
        }}>
          No potholes found {filter !== "all" && `with status "${filter}"`}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .pothole-card-1, .pothole-card-2, .pothole-card-3,
          .pothole-card-4, .pothole-card-5, .pothole-card-6,
          .pothole-card-7, .pothole-card-8, .pothole-card-9 {
            display: block !important;
          }
        }
        @media (min-width: 768px) {
          div[style*="display: none"] {
            display: block !important;
          }
        }
      `}</style>
    </div>
  )
}
