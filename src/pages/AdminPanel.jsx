import { useState } from "react";
import { useIncidents, resolveIncident } from "../hooks/useFirestore";
import { collection, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getConfidenceDisplay } from "../utils/verifyIncident";

async function approveIncident(id) {
  await updateDoc(doc(db, "incidents", id), { status: "active" });
}

async function dismissIncident(id) {
  await updateDoc(doc(db, "incidents", id), { status: "rejected" });
}

function IncidentCard({ inc, onApprove, onDismiss, onResolve, loading }) {
  const conf = inc.verification ? getConfidenceDisplay(inc.verification.confidence) : null;
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{
      background: "#fff", borderRadius: 12,
      border: `1px solid ${inc.status === "pending" ? "#EF9F27" : inc.status === "rejected" ? "#E24B4A" : "rgba(64,145,108,0.2)"}`,
      padding: "1rem 1.1rem", marginBottom: 10,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4, flexWrap: "wrap" }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#1B4332" }}>{inc.type}</span>
            <span style={{
              fontSize: 11, padding: "2px 8px", borderRadius: 20, fontWeight: 500,
              background: inc.severity === "Critical" ? "#FDECEA" : inc.severity === "High" ? "#FEF3DC" : "#EAF3DE",
              color: inc.severity === "Critical" ? "#C0392B" : inc.severity === "High" ? "#D4850A" : "#2D6A4F",
            }}>{inc.severity}</span>
            {conf && (
              <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: conf.bg, color: conf.color, fontWeight: 500 }}>
                AI: {inc.verification.confidence}%
              </span>
            )}
          </div>
          <p style={{ fontSize: 13, color: "#555", margin: "0 0 4px" }}>
            📍 {inc.county} {inc.reporterName && `· 👤 ${inc.reporterName}`}
          </p>
          <p style={{ fontSize: 13, color: "#777", margin: 0 }}>
            {expanded ? inc.description : `${inc.description?.slice(0, 80)}${inc.description?.length > 80 ? "..." : ""}`}
            {inc.description?.length > 80 && (
              <button onClick={() => setExpanded(!expanded)} style={{ background: "none", border: "none", color: "#40916C", fontSize: 12, cursor: "pointer", marginLeft: 4 }}>
                {expanded ? "less" : "more"}
              </button>
            )}
          </p>

          {/* AI reasoning */}
          {inc.verification?.reasoning && (
            <div style={{ marginTop: 8, background: "#f8f9fa", borderRadius: 8, padding: "0.5rem 0.75rem" }}>
              <p style={{ fontSize: 11, color: "#999", marginBottom: 2 }}>AI reasoning</p>
              <p style={{ fontSize: 12, color: "#555" }}>{inc.verification.reasoning}</p>
              {inc.verification.flags?.length > 0 && (
                <div style={{ marginTop: 4, display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {inc.verification.flags.map(f => (
                    <span key={f} style={{ fontSize: 10, padding: "1px 6px", borderRadius: 20, background: "#FDECEA", color: "#C0392B" }}>{f}</span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
          {inc.status === "pending" && (
            <>
              <button
                onClick={() => onApprove(inc.id)}
                disabled={loading}
                style={{ background: "#2D6A4F", color: "#fff", border: "none", borderRadius: 8, padding: "0.4rem 0.85rem", fontSize: 12, cursor: "pointer", fontWeight: 500, whiteSpace: "nowrap" }}
              >
                ✓ Approve
              </button>
              <button
                onClick={() => onDismiss(inc.id)}
                disabled={loading}
                style={{ background: "#FDECEA", color: "#C0392B", border: "none", borderRadius: 8, padding: "0.4rem 0.85rem", fontSize: 12, cursor: "pointer", fontWeight: 500 }}
              >
                ✕ Reject
              </button>
            </>
          )}
          {inc.status === "active" && (
            <button
              onClick={() => onResolve(inc.id)}
              disabled={loading}
              style={{ background: "#EAF3DE", color: "#2D6A4F", border: "none", borderRadius: 8, padding: "0.4rem 0.85rem", fontSize: 12, cursor: "pointer", fontWeight: 500, whiteSpace: "nowrap" }}
            >
              ✓ Resolve
            </button>
          )}
          {inc.status === "rejected" && (
            <button
              onClick={() => onApprove(inc.id)}
              disabled={loading}
              style={{ background: "#FEF3DC", color: "#D4850A", border: "none", borderRadius: 8, padding: "0.4rem 0.85rem", fontSize: 12, cursor: "pointer", fontWeight: 500, whiteSpace: "nowrap" }}
            >
              ↩ Restore
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const { incidents, loading } = useIncidents();
  const [tab, setTab]         = useState("pending");
  const [actionLoading, setActionLoading] = useState(false);

  const tabs = [
    { id: "pending",  label: "Pending Review", color: "#D4850A" },
    { id: "active",   label: "Active",         color: "#2D6A4F" },
    { id: "rejected", label: "Rejected",       color: "#C0392B" },
    { id: "resolved", label: "Resolved",       color: "#888"    },
  ];

  const filtered = incidents.filter(i => i.status === tab);

  async function handleApprove(id) {
    setActionLoading(true);
    await approveIncident(id);
    setActionLoading(false);
  }

  async function handleDismiss(id) {
    setActionLoading(true);
    await dismissIncident(id);
    setActionLoading(false);
  }

  async function handleResolve(id) {
    setActionLoading(true);
    await resolveIncident(id);
    setActionLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#FAF6EE", fontFamily: "DM Sans, sans-serif" }}>

      {/* Header */}
      <header style={{
        background: "linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)",
        padding: "0 1rem", height: "auto", minHeight: 60, flexWrap: "wrap", gap: 8,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "3px solid #C77C3A",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <a href="/" style={{ color: "#52B788", fontSize: 13, textDecoration: "none" }}>← Back to Dashboard</a>
          <span style={{ color: "rgba(255,255,255,0.3)" }}>|</span>
          <h1 style={{ fontSize: 16, color: "#fff", fontWeight: 600, margin: 0 }}>🛡️ Admin Panel — Incident Review</h1>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {tabs.map(t => (
            <div key={t.id} style={{ fontSize: 12, color: "#D8F3DC" }}>
              <strong style={{ color: t.color === "#888" ? "#D8F3DC" : t.color }}>
                {incidents.filter(i => i.status === t.id).length}
              </strong> {t.label.toLowerCase()}
            </div>
          ))}
        </div>
      </header>

      <div style={{ padding: "1.25rem 1.5rem", maxWidth: 900, padding: "1rem", margin: "0 auto" }}>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {tabs.map(t => {
            const count = incidents.filter(i => i.status === t.id).length;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  background: tab === t.id ? "#fff" : "transparent",
                  border: tab === t.id ? "1px solid rgba(64,145,108,0.2)" : "1px solid transparent",
                  borderRadius: 8, padding: "0.5rem 1rem",
                  cursor: "pointer", fontSize: 13,
                  color: tab === t.id ? t.color : "#888",
                  fontWeight: tab === t.id ? 600 : 400,
                  fontFamily: "inherit",
                  display: "flex", alignItems: "center", gap: 6,
                }}
              >
                {t.label}
                {count > 0 && (
                  <span style={{
                    background: t.color, color: "#fff",
                    borderRadius: 20, padding: "1px 7px", fontSize: 11, fontWeight: 600,
                  }}>{count}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Info banner for pending tab */}
        {tab === "pending" && (
          <div style={{ background: "#FEF3DC", border: "1px solid #EF9F27", borderRadius: 10, padding: "0.75rem 1rem", marginBottom: 14, fontSize: 13, color: "#854F0B" }}>
            ⚠️ These reports were flagged by AI for human review (confidence 40–69%). Review each one and approve or reject.
          </div>
        )}

        {/* Incident list */}
        {loading ? (
          <p style={{ color: "#aaa", fontSize: 13 }}>Loading...</p>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#bbb" }}>
            <p style={{ fontSize: 32 }}>
              {tab === "pending" ? "✅" : tab === "active" ? "📭" : "—"}
            </p>
            <p style={{ fontSize: 14, marginTop: 8 }}>No {tab} incidents</p>
          </div>
        ) : (
          filtered.map(inc => (
            <IncidentCard
              key={inc.id}
              inc={inc}
              onApprove={handleApprove}
              onDismiss={handleDismiss}
              onResolve={handleResolve}
              loading={actionLoading}
            />
          ))
        )}
      </div>
    </div>
  );
}
