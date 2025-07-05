'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect, useState } from 'react'
import type { MapContainerProps } from 'react-leaflet'
import { useMap } from 'react-leaflet'

// Fix default marker icon issue in Leaflet with Next.js
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })
}

type Venue = {
  id: string
  name: string
  type?: string
  location?: string
  lat?: number
  lng?: number
  capacity?: number
  image?: string
  amenities?: string[]
}

// Custom user marker icon
const userIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'user-marker-icon',
});

// Custom venue marker icon
const venueIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'venue-marker-icon',
});

function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: true });
  }, [center, map]);
  return null;
}

export default function VenueMap({ venues }: { venues: Venue[] }) {
  const defaultCenter: [number, number] = [19.0760, 72.8777] // Mumbai
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [geoError, setGeoError] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation([pos.coords.latitude, pos.coords.longitude])
        },
        (err) => {
          setGeoError('Unable to access your location. Showing default area.');
        },
        { enableHighAccuracy: true, timeout: 10000 }
      )
    } else {
      setGeoError('Geolocation is not supported by your browser.')
    }
  }, [])

  const center = userLocation || defaultCenter

  // Don't render map until client-side
  if (!isClient) {
    return (
      <div className="w-full h-96 glass flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          <div className="text-white">Loading map...</div>
        </div>
      </div>
    )
  }

  return (
    <>
      <MapContainer 
        center={center as [number, number]} 
        zoom={12} 
        style={{ height: 400, width: '100%' }} 
        scrollWheelZoom={true as MapContainerProps['scrollWheelZoom']}
        key={isClient ? 'map-loaded' : 'map-loading'}
        className="rounded-b-2xl"
      >
        <TileLayer
          attribution={'© OpenStreetMap contributors'}
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {userLocation && <RecenterMap center={userLocation} />}
        {userLocation && (
          <Marker position={userLocation} icon={userIcon}>
            <Popup>
              <div className="text-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white text-sm font-bold">📍</span>
                </div>
                <div className="font-semibold text-blue-700">You are here</div>
              </div>
            </Popup>
          </Marker>
        )}
        {venues.map(venue => (
          venue.lat && venue.lng ? (
            <Marker key={venue.id} position={[venue.lat, venue.lng]} icon={venueIcon}>
              <Popup>
                <div className="text-center min-w-[200px]">
                  <div className="relative mb-3">
                    <img 
                      src={venue.image || '/globe.svg'} 
                      alt={venue.name} 
                      className="w-full h-24 object-cover rounded-lg" 
                    />
                    <div className="absolute top-2 right-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                        📍 Venue
                      </span>
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-gray-800">{venue.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{venue.type || 'Venue'} • {venue.location || 'Mumbai'}</p>
                  {venue.capacity && (
                    <p className="text-xs text-gray-500 mb-2">Capacity: {venue.capacity}</p>
                  )}
                  {venue.amenities && venue.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1 justify-center">
                      {venue.amenities.map(a => (
                        <span key={a} className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs px-2 py-1 rounded-full">
                          {a}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ) : null
        ))}
      </MapContainer>
      {geoError && (
        <div className="text-center text-sm text-red-400 mt-2 p-2 glass rounded-lg">
          {geoError}
        </div>
      )}
    </>
  )
} 