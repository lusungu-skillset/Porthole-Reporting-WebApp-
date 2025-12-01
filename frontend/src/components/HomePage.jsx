import Map from "./Map"
import ReportForm from "./ReportForm"

export default function HomePage({ 
  selectedLocation, 
  potholes, 
  onLocationSelect, 
  onSubmitReport 
}) {
  return (
    <>
      <h2>Click on the map to report a pothole</h2>
      
      <Map 
        onLocationSelect={onLocationSelect} 
        potholes={potholes}
      />
      
      {selectedLocation && (
        <div>
          <p>Selected location: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}</p>
          <ReportForm 
            selectedLocation={selectedLocation}
            onSubmit={onSubmitReport}
          />
        </div>
      )}
    </>
  )
}
