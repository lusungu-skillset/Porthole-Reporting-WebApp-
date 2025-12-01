import PotholeList from "./PotholeList"

export default function AdminDashboard({ potholes, onUpdateStatus, onDeletePothole }) {
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p style={{ color: "#6b7280", marginBottom: "1rem" }}>
        Manage all reported potholes. Total: {potholes.length}
      </p>
      <PotholeList 
        potholes={potholes}
        onUpdateStatus={onUpdateStatus}
        onDeletePothole={onDeletePothole}
      />
    </div>
  )
}
