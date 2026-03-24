'use client'

import { MapContainer, Marker, Popup, TileLayer, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

type Props = {
  driverLat: number | null
  driverLng: number | null
  destinationLat?: number | null
  destinationLng?: number | null
}

const chauffeurIcon = new L.Icon({
  iconUrl: "/driver.png",
  iconSize: [45, 45],
  iconAnchor: [22, 45],
})

const klantIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

export default function LiveMap({
  driverLat,
  driverLng,
  destinationLat,
  destinationLng
}: Props) {

  const center: [number, number] =
    driverLat && driverLng
      ? [driverLat, driverLng]
      : [51.9851, 5.8987]

  const linePositions: [number, number][] = []

  if (driverLat && driverLng && destinationLat && destinationLng) {
    linePositions.push([driverLat, driverLng])
    linePositions.push([destinationLat, destinationLng])
  }

  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: '420px', width: '100%', borderRadius: '16px' }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {driverLat && driverLng && (
        <Marker position={[driverLat, driverLng]} icon={chauffeurIcon}>
          <Popup>Chauffeur is hier</Popup>
        </Marker>
      )}

      {destinationLat && destinationLng && (
        <Marker position={[destinationLat, destinationLng]} icon={klantIcon}>
          <Popup>Bestemming klant</Popup>
        </Marker>
      )}

      {linePositions.length === 2 && (
        <Polyline positions={linePositions} pathOptions={{ color: "#d4af37", weight: 4 }} />
      )}

    </MapContainer>
  )
}