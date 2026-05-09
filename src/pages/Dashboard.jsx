import { useState } from "react";
import { useIncidents, useAlerts } from "../hooks/useFirestore";
import { KENYA_COUNTIES, getRiskScore, getRiskLevel, EMERGENCY_CONTACTS } from "../utils/kenyaData";
import IncidentMap from "../components/IncidentMap";
import ReportForm from "../components/ReportForm";
import AlertBanner from "../components/AlertBanner";
import WeatherScanPanel from "../components/WeatherScanPanel";
import ClimateTrendChart from "../components/ClimateTrendChart";

const theme = {
  forest:    "#1B4332",
  canopy:    "#2D6A4F",
  moss:      "#40916C",
  fern:      "#52B788",
  mist:      "#D8F3DC",
  earth:     "#6B4226",
  ochre:     "#C77C3A",
  sand:      "#F4E4C1",
  bark:      "#3E2C1C",
  cream:     "#FAF6EE",
  alert:     "#C0392B",
  alertSoft: "#FDECEA",
  warn:      "#D4850A",
  warnSoft:  "#FEF3DC",
};

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=DM+Sans:wght@400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #FAF6EE; font-family: 'DM Sans', sans-serif; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #D8F3DC; }
  ::-webkit-scrollbar-thumb { background: #52B788; border-radius: 4px; }
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.45; }
  }
  .card {
    background: #fff;
    border-radius: 14px;
    border: 1px solid rgba(64,145,108,0.15);
    animation: fadeSlideIn 0.4s ease both;
  }
  .card-header {
    padding: 0.75rem 1.1rem;
    border-bottom: 1px solid rgba(64,145,108,0.1);
    font-size: 13px;
    font-weight: 500;
    color: #1B4332;
    display: flex;
    align-items: center;
    gap: 7px;
  }
  .stat-card {
    background: #fff;
    border-radius: 12px;
    border: 1px solid rgba(64,145,108,0.15);
    padding: 1rem 1.1rem;
    animation: fadeSlideIn 0.4s ease both;
  }
  .badge {
    display: inline-block;
    font-size: 10px;
    padding: 2px 8px;
    border-radius: 20px;
    font-weight: 500;
    letter-spacing: 0.02em;
  }
  .btn-primary {
    background: #C0392B;
    color: #fff;
    border: none;
    padding: 0.55rem 1.1rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.15s, transform 0.1s;
  }
  .btn-primary:hover { background: #a93226; transform: translateY(-1px); }
  .btn-primary:active { transform: scale(0.98); }
`;

function LiveDot({ color = "#40916C" }) {
  return (
    <span style={{
      display: "inline-block", width: 7, height: 7,
      borderRadius: "50%", background: color,
      animation: "pulse 2s ease infinite",
    }} />
  );
}

function SeverityBadge({ severity }) {
  const map = {
    Critical: { bg: "#FDECEA", color: "#C0392B" },
    High:     { bg: "#FEF3DC", color: "#D4850A" },
    Medium:   { bg: "#EAF3DE", color: "#2D6A4F" },
    Low:      { bg: "#E8F4FD", color: "#1A6B9A" },
  };
  const s = map[severity] || map.Low;
  return (
    <span className="badge" style={{ background: s.bg, color: s.color }}>{severity}</span>
  );
}

export default function Dashboard() {
  const { incidents, loading } = useIncidents();
  const alerts                 = useAlerts();
  const [showForm, setShowForm]             = useState(false);
  const [selectedCounty, setSelectedCounty] = useState(null);

  const activeIncidents  = incidents.filter(i => i.status === "active" || !i.status);
  const resolvedToday    = incidents.filter(i => i.status === "resolved");
  const criticalCounties = KENYA_COUNTIES.filter(c => getRiskScore(c) >= 75);

  const stats = [
    { label: "Active Incidents",  value: activeIncidents.length,  color: "#C0392B", icon: "🚨", delay: "0s"    },
    { label: "Live Alerts",       value: alerts.length,           color: "#D4850A", icon: "⚠️",  delay: "0.05s" },
    { label: "Critical Counties", value: criticalCounties.length, color: "#6B4226", icon: "📍", delay: "0.1s"  },
    { label: "Resolved Today",    value: resolvedToday.length,    color: "#40916C", icon: "✅", delay: "0.15s" },
  ];

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ minHeight: "100vh", background: "#FAF6EE" }}>

        {/* Header */}
        <header style={{
          background: "linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)",
          padding: "0 1.5rem",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "3px solid #C77C3A",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 24 }}>🌍</span>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: "#fff", fontWeight: 600, lineHeight: 1.1 }}>
                ClimateGuard Kenya
              </h1>
              <p style={{ fontSize: 10, color: "#52B788", letterSpacing: "0.06em" }}>
                DISASTER MANAGEMENT & CLIMATE RISK SYSTEM
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.1)", borderRadius: 20, padding: "4px 12px" }}>
              <LiveDot color="#52B788" />
              <span style={{ fontSize: 12, color: "#D8F3DC" }}>Live monitoring</span>
            </div>
            <button className="btn-primary" onClick={() => setShowForm(true)}>
              + Report Incident
            </button>
          </div>
        </header>

        {/* Alert banners */}
        {alerts.length > 0 && (
          <div style={{ background: "#FEF3DC", borderBottom: "2px solid #C77C3A", padding: "0.6rem 1.5rem" }}>
            {alerts.slice(0, 3).map(a => <AlertBanner key={a.id} alert={a} />)}
          </div>
        )}

        <div style={{ padding: "1.25rem 1.5rem", maxWidth: 1400, margin: "0 auto" }}>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 }}>
            {stats.map(s => (
              <div className="stat-card" key={s.label} style={{ animationDelay: s.delay }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <p style={{ fontSize: 12, color: "#999", marginBottom: 4 }}>{s.label}</p>
                    <p style={{ fontSize: 32, fontWeight: 600, color: s.color, lineHeight: 1 }}>{s.value}</p>
                  </div>
                  <span style={{ fontSize: 22, opacity: 0.75 }}>{s.icon}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Map + sidebar */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 330px", gap: 14 }}>

            {/* Map card */}
            <div className="card" style={{ overflow: "hidden", animationDelay: "0.2s" }}>
              <div className="card-header">
                <span>🗺️</span>
                <span>Kenya Climate Risk & Incident Map</span>
                <div style={{ marginLeft: "auto", display: "flex", gap: 12, fontSize: 11 }}>
                  {[
                    { color: "#E24B4A", label: "Critical" },
                    { color: "#EF9F27", label: "High"     },
                    { color: "#639922", label: "Moderate" },
                    { color: "#378ADD", label: "Low"      },
                  ].map(l => (
                    <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: l.color, display: "inline-block" }} />
                      <span style={{ color: "#777" }}>{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <IncidentMap
                incidents={activeIncidents}
                counties={KENYA_COUNTIES}
                onCountyClick={setSelectedCounty}
              />
            </div>

            {/* Sidebar */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

              {/* County detail / hint */}
              {selectedCounty ? (
                <div className="card" style={{ animationDelay: "0.25s" }}>
                  <div className="card-header">
                    <span>📍</span>
                    <span>{selectedCounty.name} County</span>
                    <button
                      onClick={() => setSelectedCounty(null)}
                      style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#bbb", fontSize: 18, lineHeight: 1 }}
                    >×</button>
                  </div>
                  <div style={{ padding: "0.85rem 1.1rem" }}>
                    {(() => {
                      const score = getRiskScore(selectedCounty);
                      const level = getRiskLevel(score);
                      return (
                        <>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                            <span style={{ color: "#777" }}>Overall climate risk</span>
                            <span style={{ fontWeight: 600, color: level.color }}>{level.label} — {score}/100</span>
                          </div>
                          <div style={{ background: "#f0f0f0", borderRadius: 6, height: 6, marginBottom: 12 }}>
                            <div style={{ width: `${score}%`, background: level.color, height: 6, borderRadius: 6, transition: "width 0.5s ease" }} />
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                            <div style={{ background: "#E6F1FB", borderRadius: 8, padding: "0.6rem", textAlign: "center" }}>
                              <p style={{ fontSize: 11, color: "#1A6B9A", margin: "0 0 2px" }}>Flood Risk</p>
                              <p style={{ fontSize: 20, fontWeight: 600, color: "#185FA5", margin: 0 }}>{selectedCounty.floodRisk}%</p>
                            </div>
                            <div style={{ background: "#FEF3DC", borderRadius: 8, padding: "0.6rem", textAlign: "center" }}>
                              <p style={{ fontSize: 11, color: "#D4850A", margin: "0 0 2px" }}>Drought Risk</p>
                              <p style={{ fontSize: 20, fontWeight: 600, color: "#D4850A", margin: 0 }}>{selectedCounty.droughtRisk}%</p>
                            </div>
                          </div>
                          <p style={{ fontSize: 12, color: "#888" }}>
                            Population: <strong style={{ color: "#1B4332" }}>{selectedCounty.population.toLocaleString()}</strong>
                          </p>
                        </>
                      );
                    })()}
                  </div>
                </div>
              ) : (
                <div className="card" style={{ padding: "0.85rem 1.1rem", animationDelay: "0.25s", textAlign: "center" }}>
                  <p style={{ fontSize: 13, color: "#aaa" }}>
                    Click any county on the map to view its climate risk profile
                  </p>
                </div>
              )}

              {/* Weather scanner */}
              <WeatherScanPanel />

              {/* Recent incidents */}
              <div className="card" style={{ animationDelay: "0.3s" }}>
                <div className="card-header">
                  <LiveDot />
                  <span>Recent Incidents</span>
                  <span style={{ marginLeft: "auto", fontSize: 11, color: "#40916C", fontWeight: 500 }}>
                    {activeIncidents.length} active
                  </span>
                </div>
                <div style={{ maxHeight: 200, overflowY: "auto" }}>
                  {loading ? (
                    <p style={{ padding: "1rem", color: "#bbb", fontSize: 13 }}>Loading...</p>
                  ) : activeIncidents.length === 0 ? (
                    <p style={{ padding: "1rem", color: "#bbb", fontSize: 13 }}>No active incidents.</p>
                  ) : (
                    activeIncidents.slice(0, 8).map(inc => (
                      <div key={inc.id} style={{ padding: "0.65rem 1.1rem", borderBottom: "1px solid #f5f5f5" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                          <span style={{ fontSize: 13, fontWeight: 500, color: "#3E2C1C" }}>{inc.type}</span>
                          <SeverityBadge severity={inc.severity} />
                        </div>
                        <p style={{ fontSize: 12, color: "#999", margin: 0 }}>
                          {inc.county} — {inc.description?.slice(0, 48)}{inc.description?.length > 48 ? "…" : ""}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Emergency contacts */}
              <div className="card" style={{ animationDelay: "0.35s" }}>
                <div className="card-header">
                  <span>📞</span>
                  <span>Emergency Contacts</span>
                </div>
                {EMERGENCY_CONTACTS.map(c => (
                  <div key={c.name} style={{
                    padding: "0.55rem 1.1rem",
                    borderBottom: "1px solid #f5f5f5",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}>
                    <div>
                      <span style={{ fontSize: 13, color: "#3E2C1C", fontWeight: 500 }}>{c.name}</span>
                      <span style={{ marginLeft: 6, fontSize: 10, color: "#bbb" }}>{c.type}</span>
                    </div>
                    <a href={`tel:${c.phone}`} style={{ color: "#40916C", fontWeight: 600, textDecoration: "none", fontSize: 13 }}>
                      {c.phone}
                    </a>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* Climate trend chart — full width */}
          <div style={{ marginTop: 14 }}>
            <ClimateTrendChart />
          </div>

          {/* Footer */}
          <p style={{ marginTop: 20, textAlign: "center", fontSize: 11, color: "#ccc", paddingBottom: "1rem" }}>
            ClimateGuard Kenya · Built for the Climate Action & Green Innovation Hackathon · Data: OpenWeatherMap, Kenya Meteorological Department
          </p>
        </div>
      </div>

      {showForm && <ReportForm onClose={() => setShowForm(false)} />}
    </>
  );
}
