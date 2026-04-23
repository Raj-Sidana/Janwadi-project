import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

const defaultCenter = [19.076, 72.8777]; // Mumbai as fallback
const defaultZoom = 12;

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

export default function MapSelector({ location, onChange }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  // Get user's current location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition([latitude, longitude]);
          setIsLoadingLocation(false);
        },
        (error) => {
          console.warn("Geolocation error:", error.message);
          setCurrentPosition(defaultCenter);
          setIsLoadingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    } else {
      console.warn("Geolocation not supported");
      setCurrentPosition(defaultCenter);
      setIsLoadingLocation(false);
    }
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || isLoadingLocation) return;

    const center = location && location.latitude && location.longitude
      ? [location.latitude, location.longitude]
      : currentPosition || defaultCenter;

    mapRef.current = L.map(mapContainerRef.current, {
      center,
      zoom: defaultZoom,
      scrollWheelZoom: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap contributors",
    }).addTo(mapRef.current);

    markerRef.current = L.marker(center, { draggable: true }).addTo(mapRef.current);

    markerRef.current.on("dragend", () => {
      const latlng = markerRef.current.getLatLng();
      onChange({ latitude: latlng.lat, longitude: latlng.lng });
    });

    mapRef.current.on("click", (event) => {
      const { lat, lng } = event.latlng;
      markerRef.current.setLatLng([lat, lng]);
      onChange({ latitude: lat, longitude: lng });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [currentPosition, isLoadingLocation, location, onChange]);

  useEffect(() => {
    if (mapRef.current && markerRef.current && location?.latitude && location?.longitude) {
      const newLatLng = [location.latitude, location.longitude];
      markerRef.current.setLatLng(newLatLng);
      mapRef.current.setView(newLatLng, mapRef.current.getZoom());
    }
  }, [location]);

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200">
      <div ref={mapContainerRef} className="h-72 w-full" />
      {isLoadingLocation && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
          <div className="text-gray-600">Getting your location...</div>
        </div>
      )}
    </div>
  );
}
