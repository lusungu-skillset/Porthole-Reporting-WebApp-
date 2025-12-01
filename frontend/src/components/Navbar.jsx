export default function Navbar({ activeTab, setActiveTab, potholeCount }) {
  return (
    <nav style={{ background: "#2563eb", color: "white", padding: "1rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ margin: 0 }}>POTHOLEREPORTER</h1>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button 
            onClick={() => setActiveTab("map")}
            style={{ 
              background: activeTab === "map" ? "white" : "transparent",
              color: activeTab === "map" ? "#2563eb" : "white",
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "0.25rem",
              cursor: "pointer"
            }}
          >
            Map View
          </button>
          <button 
            onClick={() => setActiveTab("admin")}
            style={{ 
              background: activeTab === "admin" ? "white" : "transparent",
              color: activeTab === "admin" ? "#2563eb" : "white",
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "0.25rem",
              cursor: "pointer"
            }}
          >
            Admin ({potholeCount})
          </button>
        </div>
      </div>
    </nav>
  )
}
