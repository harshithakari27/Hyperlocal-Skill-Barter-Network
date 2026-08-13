import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// fixes a common bug where marker pin images don't load with bundlers like Vite
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// MapContainer only reads `center` once on mount, so moving the map later
// has to happen imperatively. This component must live inside MapContainer.
function FlyToSelected({ selectedId, lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat != null && lng != null) {
      map.flyTo([lat, lng], 15, { duration: 0.8 });
    }
  }, [selectedId]);
  return null;
}

function MapView({ skills, selectedId }) {
  // GeoJSON stores coordinates as [lng, lat], so index 1 is latitude.
  // Skip any skill missing coords so we don't crash reading .coordinates
  const withLocation = (skills || []).filter(
    (s) => s.location?.coordinates?.length === 2
  );

  if (withLocation.length === 0) return null;

  const selected = withLocation.find((s) => s._id === selectedId);
  const center = [
    withLocation[0].location.coordinates[1],
    withLocation[0].location.coordinates[0]
  ];

  return (
    <MapContainer center={center} zoom={12} style={{ height: '350px', width: '100%' }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyToSelected
        selectedId={selectedId}
        lat={selected?.location.coordinates[1]}
        lng={selected?.location.coordinates[0]}
      />
      {withLocation.map((skill) => (
        <Marker
          key={skill._id}
          position={[skill.location.coordinates[1], skill.location.coordinates[0]]}
          opacity={selectedId && skill._id !== selectedId ? 0.5 : 1}
        >
          <Popup>
            <strong>{skill.title}</strong><br />
            {skill.category}<br />
            {skill.hourlyCreditRate} credits/hour<br />
            Posted by {skill.userId?.name || 'Unknown'}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapView;