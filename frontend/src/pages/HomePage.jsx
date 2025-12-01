import { useOutletContext } from "react-router-dom"
import Map from "../components/Map"

export default function HomePage() {
  const { setPotholeCount } = useOutletContext()

  return (
    <div>
      <h2>Welcome to Pothole Reporter</h2>
      <p>Report and track potholes in your area</p>
      <Map />
    </div>
  )
}
