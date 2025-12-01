import { useState } from "react"
import { useOutletContext } from "react-router-dom"
import Map from "../components/Map"
import ReportForm from "../components/ReportForm"

export default function ReportPage() {
  const [selectedLocation, setSelectedLocation] = useState(null)
  const { setPotholeCount } = useOutletContext()

  const handleSubmitReport = (reportData) => {
    const newPothole = {
      id: Date.now(),
      ...reportData,
      status: "reported",
      date: new Date().toLocaleDateString()
    }
    setPotholeCount(prev => prev + 1)
    setSelectedLocation(null)
    alert("Pothole reported successfully!")
  }

  return (
    <div>
      <h2>Report a Pothole</h2>
      <p>Click on the map to select location</p>
      
      <Map onLocationSelect={setSelectedLocation} />
      
      {selectedLocation && (
        <div style={{ marginTop: "1rem" }}>
          <p>Selected location: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}</p>
          <ReportForm 
            selectedLocation={selectedLocation}
            onSubmit={handleSubmitReport}
          />
        </div>
      )}
    </div>
  )
}
