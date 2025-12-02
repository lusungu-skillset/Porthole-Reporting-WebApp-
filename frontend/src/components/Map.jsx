import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet"
import { useState } from "react"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

function LocationMarker({ onLocationSelect }) {
  const [position, setPosition] = useState(null)

  useMapEvents({
    click(e) {
      setPosition(e.latlng)
      onLocationSelect(e.latlng)
    },
  })

  return position === null ? null : (
    <Marker position={position}>
      <Popup>Pothole location selected</Popup>
    </Marker>
  )
}

export default function Map({ onLocationSelect, potholes = [] }) {
  const defaultPosition = [-15.3875, 28.3228] // Zambia coordinates

  return (
    <MapContainer 
      center={defaultPosition} 
      zoom={13} 
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      
      {/* Show existing potholes */}
      {potholes.map(pothole => (
        <Marker key={pothole.id} position={[pothole.latitude, pothole.longitude]}>
          <Popup>
            <div>
              <h3 style={{ fontWeight: "bold" }}>Pothole Report</h3>
              <p>Severity: {pothole.severity}</p>
              <p>Status: {pothole.status}</p>
              <p>{pothole.description}</p>
            </div>
          </Popup>
        </Marker>
      ))}
      
      {/* Click to add new pothole */}
      <LocationMarker onLocationSelect={onLocationSelect} />
    </MapContainer>
  )
}
