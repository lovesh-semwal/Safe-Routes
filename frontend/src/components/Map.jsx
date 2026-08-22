import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Circle,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function getRouteColor(score) {
  if (score >= 80) return "#10b981";
  if (score >= 60) return "#facc15";
  return "#ef4444";
}

// Automatically move map to show the selected route
function MapController({
  startCoordinates,
  destinationCoordinates,
  selectedRouteData,
}) {
  const map = useMap();

  useEffect(() => {
    let points = [];

    if (startCoordinates?.length === 2) {
      points.push([
        Number(startCoordinates[1]),
        Number(startCoordinates[0]),
      ]);
    }

    if (destinationCoordinates?.length === 2) {
      points.push([
        Number(destinationCoordinates[1]),
        Number(destinationCoordinates[0]),
      ]);
    }

    if (
      selectedRouteData?.coordinates &&
      selectedRouteData.coordinates.length > 0
    ) {
      points = [
        ...points,
        ...selectedRouteData.coordinates.map((point) => [
          Number(point[0]),
          Number(point[1]),
        ]),
      ];
    }

    if (points.length >= 2) {
      map.fitBounds(points, {
        padding: [50, 50],
        maxZoom: 16,
      });
    }
  }, [
    map,
    startCoordinates,
    destinationCoordinates,
    selectedRouteData,
  ]);

  return null;
}

function Map({
  routes = [],
  selectedRoute,
  startCoordinates,
  destinationCoordinates,
}) {
  const defaultCenter = [28.9845, 77.7064];

  const start =
    startCoordinates?.length === 2
      ? [
          Number(startCoordinates[1]),
          Number(startCoordinates[0]),
        ]
      : null;

  const destination =
    destinationCoordinates?.length === 2
      ? [
          Number(destinationCoordinates[1]),
          Number(destinationCoordinates[0]),
        ]
      : null;

  const selectedRouteData =
    routes.find((route) => route.id === selectedRoute) ||
    routes[0] ||
    null;

  const center = start || defaultCenter;

  return (
    <div className="h-full w-full">
      <MapContainer
        center={center}
        zoom={15}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Automatically fit route on map */}
        <MapController
          startCoordinates={startCoordinates}
          destinationCoordinates={destinationCoordinates}
          selectedRouteData={selectedRouteData}
        />

        {/* START MARKER */}
        {start && (
          <Marker position={start}>
            <Popup>
              <strong>📍 Starting Point</strong>
            </Popup>
          </Marker>
        )}

        {/* DESTINATION MARKER */}
        {destination && (
          <Marker position={destination}>
            <Popup>
              <strong>🏁 Destination</strong>
            </Popup>
          </Marker>
        )}

        {/* ROUTES */}
        {routes.map((route, index) => {
          if (
            !route.coordinates ||
            !Array.isArray(route.coordinates) ||
            route.coordinates.length < 2
          ) {
            return null;
          }

          const isSelected =
            route.id === selectedRoute ||
            (!selectedRoute && index === 0);

          const coordinates = route.coordinates
            .map((point) => {
              if (!Array.isArray(point) || point.length < 2) {
                return null;
              }

              const lat = Number(point[0]);
              const lng = Number(point[1]);

              if (
                Number.isNaN(lat) ||
                Number.isNaN(lng)
              ) {
                return null;
              }

              return [lat, lng];
            })
            .filter(Boolean);

          if (coordinates.length < 2) {
            return null;
          }

          return (
            <Polyline
              key={route.id || index}
              positions={coordinates}
              pathOptions={{
                color: getRouteColor(
                  Number(route.safety) || 0
                ),
                weight: isSelected ? 8 : 4,
                opacity: isSelected ? 1 : 0.55,
                dashArray: isSelected
                  ? undefined
                  : "8 8",
              }}
            >
              <Popup>
                <strong>
                  {route.name || `Route ${index + 1}`}
                </strong>

                <br />

                Safety Score:{" "}
                {route.safety ?? "N/A"}/100

                <br />

                Distance:{" "}
                {route.distance || "N/A"}

                <br />

                Travel Time:{" "}
                {route.time || "N/A"}

                <br />

                Risk:{" "}
                {route.risk || "Unknown"}
              </Popup>
            </Polyline>
          );
        })}

        {/* RISK ZONE */}
        <Circle
          center={[28.9875, 77.714]}
          radius={250}
          pathOptions={{
            color: "#ef4444",
            fillColor: "#ef4444",
            fillOpacity: 0.15,
          }}
        >
          <Popup>
            <strong>🚨 Potential Risk Zone</strong>
            <br />
            Increased safety risk detected.
          </Popup>
        </Circle>

        {/* POOR LIGHTING ZONE */}
        <Circle
          center={[28.984, 77.716]}
          radius={150}
          pathOptions={{
            color: "#f59e0b",
            fillColor: "#f59e0b",
            fillOpacity: 0.12,
          }}
        >
          <Popup>
            <strong>💡 Poor Lighting Area</strong>
          </Popup>
        </Circle>
      </MapContainer>
    </div>
  );
}

export default Map;