export default function AlertBanner({ alert }) {
  const colors = {
    Critical: { bg: "#FCEBEB", border: "#E24B4A", text: "#A32D2D", dot: "#E24B4A" },
    High:     { bg: "#FAEEDA", border: "#EF9F27", text: "#854F0B", dot: "#EF9F27" },
    Medium:   { bg: "#EAF3DE", border: "#639922", text: "#3B6D11", dot: "#639922" },
  };
  const c = colors[alert.severity] || colors.Medium;

  return (
    <div style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 10,
      background: c.bg,
      border: `1px solid ${c.border}`,
      borderRadius: 8,
      padding: "0.6rem 0.9rem",
      marginBottom: 6,
      fontSize: 13,
    }}>
      <span style={{ color: c.dot, fontSize: 16, lineHeight: 1.4 }}>⚠️</span>
      <div>
        <strong style={{ color: c.text }}>{alert.type}</strong>
        {alert.county && <span style={{ color: c.text, fontWeight: 400 }}> — {alert.county}</span>}
        <p style={{ margin: "2px 0 0", color: c.text, fontWeight: 400 }}>{alert.message}</p>
      </div>
    </div>
  );
}
