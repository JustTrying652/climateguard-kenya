import { MapContainer, TileLayer, CircleMarker, Tooltip, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getRiskScore, getRiskLevel } from "../utils/kenyaData";

const SEVERITY_COLOR = {
  Critical: "#E24B4A",
  High:     "#EF9F27",
  Medium:   "#639922",
  Low:      "#378ADD",
};

export default function IncidentMap({ incidents, counties, onCountyClick }) {
  return (
    <MapContainer
      center={[0.0236, 37.9062]}
      zoom={6}
      style={{ height: "480px", width: "100%" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* County risk circles */}
      {counties.map((county) => {
        const score = getRiskScore(county);
        const level = getRiskLevel(score);
        return (
          <CircleMarker
            key={county.id}
            center={[county.lat, county.lng]}
            radius={10}
            pathOptions={{
              fillColor: level.color,
              fillOpacity: 0.4,
              color: level.color,
              weight: 1.5,
            }}
            eventHandlers={{ click: () => onCountyClick(county) }}
          >
            <Tooltip direction="top" offset={[0, -8]}>
              <strong>{county.name}</strong><br />
              Risk: {level.label} ({score}/100)
            </Tooltip>
          </CircleMarker>
        );
      })}

      {/* Active incident pins */}
      {incidents.map((inc) =>
        inc.lat && inc.lng ? (
          <CircleMarker
            key={inc.id}
            center={[inc.lat, inc.lng]}
            radius={8}
            pathOptions={{
              fillColor: SEVERITY_COLOR[inc.severity] || "#888",
              fillOpacity: 0.9,
              color: "#fff",
              weight: 2,
            }}
          >
            <Popup>
              <strong>{inc.type}</strong> — {inc.severity}<br />
              {inc.county}<br />
              <small>{inc.description}</small>
            </Popup>
          </CircleMarker>
        ) : null
      )}
    </MapContainer>
  );
}
