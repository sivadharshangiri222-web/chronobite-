import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// Helper to auto-recenter map when coordinates change
function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, map.getZoom(), { animate: true });
    }
  }, [center, map]);
  return null;
}

// Custom Leaflet DivIcon factories
const createRiderIcon = () => {
  return L.divIcon({
    className: 'custom-rider-marker-wrapper',
    html: `
      <div class="custom-rider-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/>
        </svg>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22]
  });
};

const createRestaurantIcon = () => {
  return L.divIcon({
    className: 'custom-rest-marker-wrapper',
    html: `
      <div class="custom-restaurant-pin">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
        </svg>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });
};

const createCustomerIcon = () => {
  return L.divIcon({
    className: 'custom-cust-marker-wrapper',
    html: `
      <div class="custom-customer-pin">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });
};

export default function LiveTrackingMap({
  riderLat,
  riderLng,
  restaurantLat = 12.9345,
  restaurantLng = 77.6265,
  customerLat = 12.9716,
  customerLng = 77.6413,
  restaurantName = 'Restaurant',
  customerName = 'Your Address'
}) {
  const currentRiderPos = riderLat && riderLng ? [riderLat, riderLng] : [restaurantLat, restaurantLng];
  const restaurantPos = [restaurantLat, restaurantLng];
  const customerPos = [customerLat, customerLng];

  // Route path: restaurant -> rider -> customer
  const polylineCoordinates = [
    restaurantPos,
    currentRiderPos,
    customerPos
  ];

  return (
    <div className="w-full h-72 sm:h-96 rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
      <MapContainer
        center={currentRiderPos}
        zoom={13}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        {/* Dark Matter CartoDB tiles for sleek modern dark aesthetic */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <MapRecenter center={currentRiderPos} />

        {/* Route Line */}
        <Polyline
          positions={polylineCoordinates}
          pathOptions={{
            color: '#FF5200',
            weight: 4,
            opacity: 0.85,
            dashArray: '8, 8',
            lineJoin: 'round'
          }}
        />

        {/* Restaurant Pin */}
        <Marker position={restaurantPos} icon={createRestaurantIcon()}>
          <Popup>
            <div className="text-xs p-1">
              <strong className="text-primary font-bold">{restaurantName}</strong>
              <p className="text-gray-600 text-[10px] mt-0.5">Order pickup point</p>
            </div>
          </Popup>
        </Marker>

        {/* Moving Delivery Rider Pin */}
        {riderLat && riderLng && (
          <Marker position={currentRiderPos} icon={createRiderIcon()}>
            <Popup>
              <div className="text-xs p-1">
                <strong className="text-primary font-bold">ChronoBite Rider</strong>
                <p className="text-gray-600 text-[10px] mt-0.5">Live GPS Speeding to destination</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Customer Destination Pin */}
        <Marker position={customerPos} icon={createCustomerIcon()}>
          <Popup>
            <div className="text-xs p-1">
              <strong className="text-emerald-600 font-bold">{customerName}</strong>
              <p className="text-gray-600 text-[10px] mt-0.5">Delivery destination</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Floating GPS live badge */}
      <div className="absolute top-3 right-3 z-[1000] bg-swiggy-surface/90 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-xs font-bold text-white flex items-center gap-2 shadow-card">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
        </span>
        <span>Live GPS Active</span>
      </div>
    </div>
  );
}
