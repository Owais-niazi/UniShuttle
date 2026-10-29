import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Bus, Navigation, Gauge } from 'lucide-react';
import { Badge } from '@/Components/ui/badge';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom shuttle icon
const createShuttleIcon = (status) => {
  const color = status === 'moving' ? '#10b981' : status === 'stopped' ? '#f59e0b' : '#6b7280';
  return L.divIcon({
    html: `
      <div style="background: ${color}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
          <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
        </svg>
      </div>
    `,
    className: 'custom-shuttle-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

export default function LiveShuttleMap({ centerLat = 24.9227, centerLng = 67.0854, zoom = 14, height = '500px' }) {
  const [center] = useState([centerLat, centerLng]);

  // Fetch shuttles
  const { data: shuttles = [] } = useQuery({
    queryKey: ['shuttles'],
    queryFn: () => base44.entities.Shuttle.list(),
  });

  // Fetch shuttle locations with auto-refresh every 5 seconds
  const { data: locations = [] } = useQuery({
    queryKey: ['shuttleLocations'],
    queryFn: () => base44.entities.ShuttleLocation.list('-updated_date'),
    refetchInterval: 5000, // Refresh every 5 seconds for real-time tracking
  });

  // Get the latest location for each shuttle
  const latestLocations = locations.reduce((acc, loc) => {
    if (!acc[loc.shuttle_id] || new Date(loc.updated_date) > new Date(acc[loc.shuttle_id].updated_date)) {
      acc[loc.shuttle_id] = loc;
    }
    return acc;
  }, {});

  return (
    <div style={{ height, width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {Object.values(latestLocations).map((location) => {
          const shuttle = shuttles.find(s => s.id === location.shuttle_id);
          if (!shuttle || shuttle.status !== 'active') return null;

          return (
            <Marker
              key={location.shuttle_id}
              position={[location.latitude, location.longitude]}
              icon={createShuttleIcon(location.status)}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <div className="flex items-center gap-2 mb-2">
                    <Bus className="w-4 h-4 text-indigo-600" />
                    <span className="font-semibold text-gray-900">{shuttle.name}</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {shuttle.shuttle_number}
                      </Badge>
                      <Badge className={
                        location.status === 'moving' ? 'bg-emerald-100 text-emerald-700' :
                        location.status === 'stopped' ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-700'
                      }>
                        {location.status}
                      </Badge>
                    </div>
                    {location.speed !== undefined && (
                      <div className="flex items-center gap-1 text-gray-600">
                        <Gauge className="w-3 h-3" />
                        <span>{location.speed} km/h</span>
                      </div>
                    )}
                    {location.heading !== undefined && (
                      <div className="flex items-center gap-1 text-gray-600">
                        <Navigation className="w-3 h-3" style={{ transform: `rotate(${location.heading}deg)` }} />
                        <span>Heading {location.heading}°</span>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Last update: {new Date(location.updated_date).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </Popup>
              <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
                <div className="text-xs font-medium">
                  {shuttle.name} - {location.status}
                </div>
              </Tooltip>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}