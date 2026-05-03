import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

const defaultZoom = 12;

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

export default function MapViewer({ location }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current || !location?.latitude || !location?.longitude) return;

    const center = [location.latitude, location.longitude];

    mapRef.current = L.map(mapContainerRef.current, {
      center,
      zoom: defaultZoom,
      scrollWheelZoom: true,
      zoomControl: true,
      dragging: true,
      touchZoom: true,
      doubleClickZoom: true,
      boxZoom: true,
      keyboard: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap contributors",
    }).addTo(mapRef.current);

    markerRef.current = L.marker(center, { draggable: false }).addTo(mapRef.current);

    // Add a popup with coordinates
    markerRef.current.bindPopup(`
      <div class="text-sm">
        <strong>Location:</strong><br>
        Latitude: ${location.latitude.toFixed(6)}<br>
        Longitude: ${location.longitude.toFixed(6)}
      </div>
    `).openPopup();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [location]);

  if (!location?.latitude || !location?.longitude) {
    return (
      <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
        <div className="h-72 w-full flex items-center justify-center">
          <div className="text-gray-500 text-center">
            <div className="text-2xl mb-2">📍</div>
            <p>Location coordinates not available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200">
      <div ref={mapContainerRef} className="h-72 w-full" />
    </div>
  );
}