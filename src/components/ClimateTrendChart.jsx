import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer, Legend
} from "recharts";

// Annual rainfall data for Kenya — 8 WFP agroecological regions
// Source: WFP CHIRPS Rainfall Indicators at Subnational Level (HDX)
// https://data.humdata.org/dataset/ken-rainfall-subnational
// Baseline period: 1981–2010 (905.3 mm/yr average)
const RAINFALL_DATA = [
  { year: 1981, rainfall: 995.4,  anomaly:  10.0 },
  { year: 1982, rainfall: 1040.4, anomaly:  14.9 },
  { year: 1983, rainfall: 807.0,  anomaly: -10.9 },
  { year: 1984, rainfall: 704.9,  anomaly: -22.1 },
  { year: 1985, rainfall: 892.3,  anomaly:  -1.4 },
  { year: 1986, rainfall: 897.5,  anomaly:  -0.9 },
  { year: 1987, rainfall: 788.0,  anomaly: -13.0 },
  { year: 1988, rainfall: 1023.2, anomaly:  13.0 },
  { year: 1989, rainfall: 975.9,  anomaly:   7.8 },
  { year: 1990, rainfall: 989.4,  anomaly:   9.3 },
  { year: 1991, rainfall: 844.2,  anomaly:  -6.7 },
  { year: 1992, rainfall: 846.7,  anomaly:  -6.5 },
  { year: 1993, rainfall: 765.2,  anomaly: -15.5 },
  { year: 1994, rainfall: 962.5,  anomaly:   6.3 },
  { year: 1995, rainfall: 911.6,  anomaly:   0.7 },
  { year: 1996, rainfall: 831.6,  anomaly:  -8.1 },
  { year: 1997, rainfall: 1201.6, anomaly:  32.7 },
  { year: 1998, rainfall: 970.5,  anomaly:   7.2 },
  { year: 1999, rainfall: 867.6,  anomaly:  -4.2 },
  { year: 2000, rainfall: 706.9,  anomaly: -21.9 },
  { year: 2001, rainfall: 949.4,  anomaly:   4.9 },
  { year: 2002, rainfall: 1010.2, anomaly:  11.6 },
  { year: 2003, rainfall: 905.3,  anomaly:   0.0 },
  { year: 2004, rainfall: 859.2,  anomaly:  -5.1 },
  { year: 2005, rainfall: 730.2,  anomaly: -19.3 },
  { year: 2006, rainfall: 1174.6, anomaly:  29.8 },
  { year: 2007, rainfall: 893.8,  anomaly:  -1.3 },
  { year: 2008, rainfall: 823.4,  anomaly:  -9.0 },
  { year: 2009, rainfall: 788.0,  anomaly: -13.0 },
  { year: 2010, rainfall: 1001.4, anomaly:  10.6 },
  { year: 2011, rainfall: 986.6,  anomaly:   9.0 },
  { year: 2012, rainfall: 1082.6, anomaly:  19.6 },
  { year: 2013, rainfall: 1001.7, anomaly:  10.6 },
  { year: 2014, rainfall: 912.6,  anomaly:   0.8 },
  { year: 2015, rainfall: 1021.9, anomaly:  12.9 },
  { year: 2016, rainfall: 817.9,  anomaly:  -9.7 },
  { year: 2017, rainfall: 852.6,  anomaly:  -5.8 },
  { year: 2018, rainfall: 1256.1, anomaly:  38.8 },
  { year: 2019, rainfall: 1216.0, anomaly:  34.3 },
  { year: 2020, rainfall: 1325.7, anomaly:  46.4 },
  { year: 2021, rainfall: 895.0,  anomaly:  -1.1 },
  { year: 2022, rainfall: 901.9,  anomaly:  -0.4 },
  { year: 2023, rainfall: 1141.5, anomaly:  26.1 },
  { year: 2024, rainfall: 1225.6, anomaly:  35.4 },
  { year: 2025, rainfall: 1026.0, anomaly:  13.3 },
];

const BASELINE = 905.3;

// Decade summaries for the stat cards
const DECADES = [
  { label: "1981–1990", anomaly:  0.7 },
  { label: "1991–2000", anomaly: -1.6 },
  { label: "2001–2010", anomaly:  0.9 },
  { label: "2011–2020", anomaly: 15.7 },
  { label: "2021–2025", anomaly: 14.7 },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div style={{
      background: "#fff", border: "1px solid rgba(64,145,108,0.2)",
      borderRadius: 10, padding: "0.75rem 1rem", fontSize: 13, boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
    }}>
      <p style={{ fontWeight: 600, color: "#1B4332", marginBottom: 4 }}>{label}</p>
      <p style={{ color: "#555" }}>Rainfall: <strong>{d?.rainfall} mm</strong></p>
      <p style={{ color: d?.anomaly >= 0 ? "#185FA5" : "#C0392B" }}>
        vs baseline: <strong>{d?.anomaly >= 0 ? "+" : ""}{d?.anomaly}%</strong>
      </p>
    </div>
  );
}

export default function ClimateTrendChart() {
  const recent5 = RAINFALL_DATA.slice(-5);
  const avgRecent = (recent5.reduce((s, d) => s + d.anomaly, 0) / recent5.length).toFixed(1);

  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid rgba(64,145,108,0.15)" }}>

      {/* Header */}
      <div style={{
        padding: "0.85rem 1.1rem",
        borderBottom: "1px solid rgba(64,145,108,0.1)",
        display: "flex", justifyContent: "space-between", alignItems: "flex-start"
      }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 500, color: "#1B4332" }}>
            🌧️ Kenya Rainfall Trends (1981–2025)
          </p>
          <p style={{ fontSize: 11, color: "#999", marginTop: 2 }}>
            Source: WFP CHIRPS · Baseline: 1981–2010 avg ({BASELINE} mm/yr)
          </p>
        </div>
        <div style={{
          background: Number(avgRecent) >= 0 ? "#E6F1FB" : "#FDECEA",
          color: Number(avgRecent) >= 0 ? "#185FA5" : "#C0392B",
          borderRadius: 8, padding: "4px 10px", fontSize: 12, fontWeight: 600
        }}>
          Last 5 yrs: {avgRecent >= 0 ? "+" : ""}{avgRecent}% vs baseline
        </div>
      </div>

      {/* Decade stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 0, borderBottom: "1px solid rgba(64,145,108,0.1)" }}>
        {DECADES.map((d, i) => (
          <div key={d.label} style={{
            padding: "0.6rem 0.75rem", textAlign: "center",
            borderRight: i < 4 ? "1px solid rgba(64,145,108,0.1)" : "none",
            background: d.anomaly > 10 ? "rgba(24,95,165,0.04)" : d.anomaly < -5 ? "rgba(192,57,43,0.04)" : "transparent"
          }}>
            <p style={{ fontSize: 10, color: "#aaa", marginBottom: 2 }}>{d.label}</p>
            <p style={{
              fontSize: 15, fontWeight: 600,
              color: d.anomaly > 0 ? "#185FA5" : "#C0392B"
            }}>
              {d.anomaly > 0 ? "+" : ""}{d.anomaly}%
            </p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{ padding: "1rem 0.5rem 0.5rem" }}>
        <ResponsiveContainer width="100%" height={240}>
          <ComposedChart data={RAINFALL_DATA} margin={{ top: 5, right: 16, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(64,145,108,0.1)" vertical={false} />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: "#aaa" }}
              tickFormatter={v => v % 5 === 0 ? v : ""}
            />
            <YAxis
              yAxisId="rainfall"
              orientation="left"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: "#aaa" }}
              tickFormatter={v => `${v}mm`}
              domain={[500, 1500]}
            />
            <YAxis
              yAxisId="anomaly"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: "#aaa" }}
              tickFormatter={v => `${v}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              yAxisId="rainfall"
              y={BASELINE}
              stroke="#C77C3A"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{ value: "Baseline", position: "insideTopLeft", fontSize: 10, fill: "#C77C3A" }}
            />
            <Bar
              yAxisId="rainfall"
              dataKey="rainfall"
              fill="#52B788"
              opacity={0.6}
              radius={[2, 2, 0, 0]}
              name="Annual Rainfall (mm)"
            />
            <Line
              yAxisId="anomaly"
              type="monotone"
              dataKey="anomaly"
              stroke="#185FA5"
              strokeWidth={2}
              dot={false}
              name="Anomaly vs baseline (%)"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Insight callout */}
      <div style={{
        margin: "0 1rem 1rem",
        background: "linear-gradient(135deg, #E6F1FB, #EAF3DE)",
        borderRadius: 10, padding: "0.75rem 1rem", fontSize: 12, color: "#2D5016"
      }}>
        <strong>Climate signal:</strong> Since 2011, Kenya has experienced consistently above-baseline
        rainfall — averaging <strong>+15.7%</strong> above the historical norm. This intensification
        drives both flash floods in highland counties and drought cycles in ASAL regions as rainfall
        becomes less predictable.
      </div>
    </div>
  );
}
