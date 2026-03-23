import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix default marker icon issue with Vite bundling
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom SVG vehicle icon
const vehicleIcon = L.divIcon({
  className: '',
  html: `
    <div style="
      width: 40px; height: 40px;
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 12px rgba(59,130,246,0.5);
      border: 2px solid white;
    ">
      <div style="transform: rotate(45deg); font-size: 18px; margin-left: 1px;">🚗</div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

interface FlyToProps {
  lat: number;
  lng: number;
}

function FlyTo({ lat, lng }: FlyToProps) {
  const map = useMap();
  const prevPos = useRef<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!prevPos.current || prevPos.current.lat !== lat || prevPos.current.lng !== lng) {
      map.flyTo([lat, lng], map.getZoom(), { animate: true, duration: 1.2 });
      prevPos.current = { lat, lng };
    }
  }, [lat, lng, map]);

  return null;
}

interface MapViewProps {
  lat: number;
  lng: number;
  vehicleId: string;
  online: boolean;
}

const MapView: React.FC<MapViewProps> = ({ lat, lng, vehicleId, online }) => {
  return (
    <div className="card-elevated overflow-hidden">
      <div className="px-4 pt-4 pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-gray-900 dark:text-white">Live Location</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {lat.toFixed(5)}°N, {lng.toFixed(5)}°E
          </p>
        </div>
        <span
          className={`badge ${
            online
              ? 'bg-success-500/10 text-success-600 dark:text-success-400'
              : 'bg-danger-500/10 text-danger-400'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${online ? 'bg-success-500 animate-pulse' : 'bg-danger-400'}`} />
          {online ? 'Tracking' : 'Lost Signal'}
        </span>
      </div>
      <div className="h-72 md:h-96">
        <MapContainer
          center={[lat, lng]}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <FlyTo lat={lat} lng={lng} />
          <Marker position={[lat, lng]} icon={vehicleIcon}>
            <Popup className="rounded-xl">
              <div className="text-sm font-semibold">{vehicleId}</div>
              <div className="text-xs text-gray-500 mt-0.5">
                {lat.toFixed(5)}°N, {lng.toFixed(5)}°E
              </div>
              <div className={`text-xs font-semibold mt-1 ${online ? 'text-success-600' : 'text-danger-500'}`}>
                ● {online ? 'Online' : 'Offline'}
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default MapView;
