import { useState } from "react"
import { useOutletContext } from "react-router-dom"
import PotholeList from "../components/PotholeList"

export default function AdminPage() {
  const [potholes, setPotholes] = useState([])
  const { potholeCount, setPotholeCount } = useOutletContext()
  const adminEmail = localStorage.getItem("adminEmail") || ""

  const handleUpdateStatus = (id, newStatus) => {
    setPotholes(potholes.map(pothole => 
      pothole.id === id ? { ...pothole, status: newStatus } : pothole
    ))
  }

  const handleDeletePothole = (id) => {
    setPotholes(potholes.filter(pothole => pothole.id !== id))
    setPotholeCount(prev => prev - 1)
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div>
          <h2>Admin Dashboard</h2>
          <p style={{ color: "#6b7280" }}>
            Logged in as: <strong>{adminEmail}</strong>
          </p>
        </div>
        <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
          Total Reports: <strong>{potholeCount}</strong>
        </div>
      </div>
      
      <PotholeList 
        potholes={potholes}
        onUpdateStatus={handleUpdateStatus}
        onDeletePothole={handleDeletePothole}
      />
    </div>
  )
}
