import { useState } from "react";
import { runWeatherScan, runSimulatedScan } from "../utils/weatherScanner";

const SEVERITY_STYLE = {
  Critical: { bg: "#FCEBEB", color: "#A32D2D", dot: "#E24B4A" },
  High:     { bg: "#FAEEDA", color: "#854F0B", dot: "#EF9F27" },
  Medium:   { bg: "#EAF3DE", color: "#3B6D11", dot: "#639922" },
  Low:      { bg: "#E6F1FB", color: "#185FA5", dot: "#378ADD" },
};

export default function WeatherScanPanel() {
  const [status, setStatus]   = useState("idle"); // idle | scanning | done | error
  const [results, setResults] = useState(null);

  async function handleScan(simulated = false) {
    setStatus("scanning");
    setResults(null);
    try {
      const res = simulated ? await runSimulatedScan() : await runWeatherScan();
      setResults(res);
      setStatus("done");
    } catch (err) {
      setStatus("error");
      console.error(err);
    }
  }

  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "0.5px solid #e0e0e0" }}>

      {/* Header */}
      <div style={{ padding: "0.75rem 1rem", borderBottom: "0.5px solid #e0e0e0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 500, fontSize: 14 }}>🌦️ Weather Alert Scanner</span>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => handleScan(true)}
            disabled={status === "scanning"}
            title="Use simulated data — good for demos without API key"
            style={{
              background: "#E6F1FB", color: "#185FA5", border: "0.5px solid #B5D4F4",
              borderRadius: 8, padding: "0.35rem 0.75rem", fontSize: 12,
              cursor: status === "scanning" ? "default" : "pointer", fontWeight: 500,
            }}
          >
            Demo scan
          </button>
          <button
            onClick={() => handleScan(false)}
            disabled={status === "scanning"}
            title="Fetch real weather from OpenWeatherMap"
            style={{
              background: status === "scanning" ? "#ccc" : "#0F6E56",
              color: "#fff", border: "none", borderRadius: 8,
              padding: "0.35rem 0.75rem", fontSize: 12,
              cursor: status === "scanning" ? "default" : "pointer", fontWeight: 500,
            }}
          >
            {status === "scanning" ? "Scanning..." : "Live scan"}
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "0.75rem 1rem" }}>

        {status === "idle" && (
          <p style={{ fontSize: 13, color: "#888", margin: 0 }}>
            Scan checks the top 12 highest-risk counties for live weather conditions and auto-creates alerts when thresholds are breached.
          </p>
        )}

        {status === "scanning" && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0.5rem 0" }}>
            <div style={{ width: 16, height: 16, border: "2px solid #0F6E56", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <span style={{ fontSize: 13, color: "#555" }}>Checking county weather conditions...</span>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {status === "error" && (
          <p style={{ fontSize: 13, color: "#A32D2D", margin: 0 }}>
            Scan failed. Check your API key in the .env file and try again.
          </p>
        )}

        {status === "done" && results && (
          <div>
            {/* Summary */}
            <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
              {[
                { label: "Counties checked", value: results.checked,        color: "#0F6E56" },
                { label: "Alerts generated", value: results.alerts.length,  color: "#E24B4A" },
                { label: "Errors",           value: results.errors.length,  color: results.errors.length > 0 ? "#854F0B" : "#888" },
              ].map((s) => (
                <div key={s.label} style={{ flex: 1, background: "#f8f9fa", borderRadius: 8, padding: "0.5rem 0.75rem", textAlign: "center" }}>
                  <p style={{ margin: 0, fontSize: 11, color: "#888" }}>{s.label}</p>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 20, color: s.color }}>{s.value}</p>
                </div>
              ))}
            </div>

            {results.simulated && (
              <div style={{ background: "#E6F1FB", borderRadius: 8, padding: "0.5rem 0.75rem", fontSize: 12, color: "#185FA5", marginBottom: 8 }}>
                ℹ️ Demo mode — simulated data based on Kenya climate patterns. Switch to Live scan with a real OWM key for actual weather.
              </div>
            )}

            {/* Alert list */}
            {results.alerts.length === 0 ? (
              <p style={{ fontSize: 13, color: "#3B6D11", margin: 0 }}>✅ No alert thresholds breached. Conditions normal across monitored counties.</p>
            ) : (
              results.alerts.map((a, i) => {
                const s = SEVERITY_STYLE[a.severity] || SEVERITY_STYLE.Medium;
                return (
                  <div key={i} style={{ background: s.bg, borderRadius: 8, padding: "0.6rem 0.75rem", marginBottom: 6, fontSize: 13 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                      <strong style={{ color: s.color }}>{a.type}</strong>
                      <span style={{ fontSize: 11, fontWeight: 600, color: s.color }}>{a.severity}</span>
                    </div>
                    <p style={{ margin: 0, color: s.color, fontWeight: 400 }}>{a.message}</p>
                    {a.weatherSnapshot && (
                      <p style={{ margin: "4px 0 0", fontSize: 11, color: s.color, opacity: 0.8 }}>
                        🌡️ {a.weatherSnapshot.temp}°C · 💧 {a.weatherSnapshot.humidity}% humidity · 🌧️ {a.weatherSnapshot.rain}mm/hr · 💨 {a.weatherSnapshot.windSpeed} m/s
                      </p>
                    )}
                  </div>
                );
              })
            )}

            {results.errors.length > 0 && (
              <div style={{ marginTop: 8, fontSize: 12, color: "#854F0B" }}>
                ⚠️ Failed to check: {results.errors.map(e => e.county).join(", ")}
              </div>
            )}

            <button
              onClick={() => { setStatus("idle"); setResults(null); }}
              style={{ marginTop: 10, background: "none", border: "0.5px solid #ccc", borderRadius: 8, padding: "0.35rem 0.75rem", fontSize: 12, cursor: "pointer", color: "#666" }}
            >
              Clear
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
