import { useState } from "react";
import { reportIncident } from "../hooks/useFirestore";
import { KENYA_COUNTIES, DISASTER_TYPES, SEVERITY_LEVELS } from "../utils/kenyaData";
import { verifyIncident, verdictToStatus, getConfidenceDisplay } from "../utils/verifyIncident";

const inputStyle = {
  width: "100%",
  padding: "0.6rem 0.75rem",
  borderRadius: 8,
  border: "1px solid #ddd",
  fontSize: 14,
  boxSizing: "border-box",
  marginTop: 4,
  fontFamily: "inherit",
  outline: "none",
};

function Steps({ current }) {
  const steps = ["Details", "Verifying", "Result"];
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: "1.25rem" }}>
      {steps.map((s, i) => (
        <div key={s} style={{ display: "flex", alignItems: "center", flex: i < 2 ? 1 : 0 }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 600, flexShrink: 0,
            background: i < current ? "#2D6A4F" : i === current ? "#1B4332" : "#f0f0f0",
            color: i <= current ? "#fff" : "#aaa",
          }}>
            {i < current ? "✓" : i + 1}
          </div>
          <span style={{ fontSize: 12, marginLeft: 6, color: i === current ? "#1B4332" : "#aaa", fontWeight: i === current ? 500 : 400 }}>
            {s}
          </span>
          {i < 2 && <div style={{ flex: 1, height: 1, background: i < current ? "#2D6A4F" : "#e0e0e0", margin: "0 10px" }} />}
        </div>
      ))}
    </div>
  );
}

export default function ReportForm({ onClose }) {
  const [form, setForm] = useState({ type: "", county: "", severity: "Medium", description: "", reporterName: "" });
  const [step, setStep]     = useState(0);
  const [result, setResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  async function handleSubmit() {
    if (!form.type || !form.county || !form.description.trim()) {
      alert("Please fill in type, county, and description.");
      return;
    }
    if (form.description.trim().length < 15) {
      alert("Please provide a more detailed description (at least 15 characters).");
      return;
    }
    setStep(1);
    const verification = await verifyIncident(form);
    setResult(verification);
    setStep(2);
  }

  async function handleConfirmSave() {
    setSaving(true);
    try {
      const county = KENYA_COUNTIES.find(c => c.name === form.county);
      const status = verdictToStatus(result.verdict);
      await reportIncident({
        ...form,
        lat: county?.lat,
        lng: county?.lng,
        status,
        verification: {
          confidence: result.confidence,
          verdict:    result.verdict,
          reasoning:  result.reasoning,
          flags:      result.flags,
        },
      });
      setSaved(true);
    } catch (err) {
      alert("Failed to save. Check your Firebase config.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  const conf = result ? getConfidenceDisplay(result.confidence) : null;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "1rem" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: "1.5rem", width: "100%", maxWidth: 460, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.1rem" }}>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 600, color: "#1B4332" }}>Report a Disaster Incident</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#bbb" }}>✕</button>
        </div>

        <Steps current={step} />

        {/* Step 0: Form */}
        {step === 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: "#444" }}>
              Disaster Type *
              <select value={form.type} onChange={set("type")} style={inputStyle}>
                <option value="">Select type...</option>
                {DISASTER_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </label>
            <label style={{ fontSize: 13, fontWeight: 500, color: "#444" }}>
              County *
              <select value={form.county} onChange={set("county")} style={inputStyle}>
                <option value="">Select county...</option>
                {KENYA_COUNTIES.map(c => <option key={c.id}>{c.name}</option>)}
              </select>
            </label>
            <label style={{ fontSize: 13, fontWeight: 500, color: "#444" }}>
              Severity *
              <select value={form.severity} onChange={set("severity")} style={inputStyle}>
                {SEVERITY_LEVELS.map(s => <option key={s}>{s}</option>)}
              </select>
            </label>
            <label style={{ fontSize: 13, fontWeight: 500, color: "#444" }}>
              Description *
              <textarea
                value={form.description}
                onChange={set("description")}
                placeholder="Describe what is happening — include location details, number of people affected, immediate needs, road conditions..."
                rows={4}
                style={{ ...inputStyle, resize: "vertical" }}
              />
              <span style={{ fontSize: 11, color: form.description.length < 15 ? "#C0392B" : "#aaa" }}>
                {form.description.length} characters {form.description.length < 15 ? "(minimum 15)" : "✓"}
              </span>
            </label>
            <label style={{ fontSize: 13, fontWeight: 500, color: "#444" }}>
              Your Name (optional)
              <input type="text" value={form.reporterName} onChange={set("reporterName")} placeholder="Community member / Officer name" style={inputStyle} />
            </label>
            <div style={{ background: "#EAF3DE", borderRadius: 8, padding: "0.6rem 0.85rem", fontSize: 12, color: "#2D5016" }}>
              🤖 Your report will be analysed by AI before going live to prevent false alerts.
            </div>
            <button
              onClick={handleSubmit}
              style={{ background: "#1B4332", color: "#fff", border: "none", borderRadius: 8, padding: "0.75rem", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}
            >
              Submit for Verification →
            </button>
          </div>
        )}

        {/* Step 1: Verifying */}
        {step === 1 && (
          <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
            <div style={{ width: 48, height: 48, margin: "0 auto 1rem", border: "3px solid #1B4332", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ fontSize: 15, fontWeight: 500, color: "#1B4332" }}>Verifying your report...</p>
            <p style={{ fontSize: 13, color: "#999", marginTop: 6 }}>AI is checking plausibility against Kenya climate patterns</p>
          </div>
        )}

        {/* Step 2: Result */}
        {step === 2 && result && !saved && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ background: conf.bg, borderRadius: 12, padding: "1rem", textAlign: "center" }}>
              <p style={{ fontSize: 36, fontWeight: 700, color: conf.color, lineHeight: 1 }}>{result.confidence}%</p>
              <p style={{ fontSize: 13, color: conf.color, fontWeight: 500, marginTop: 4 }}>{conf.label}</p>
            </div>
            <div style={{ background: "#f8f9fa", borderRadius: 10, padding: "0.85rem" }}>
              <p style={{ fontSize: 12, fontWeight: 500, color: "#555", marginBottom: 4 }}>AI Assessment</p>
              <p style={{ fontSize: 13, color: "#333" }}>{result.reasoning}</p>
              {result.flags?.length > 0 && (
                <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {result.flags.map(f => (
                    <span key={f} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: "#FDECEA", color: "#C0392B" }}>{f}</span>
                  ))}
                </div>
              )}
            </div>
            <div style={{ borderRadius: 10, padding: "0.85rem", background: result.verdict === "APPROVE" ? "#EAF3DE" : result.verdict === "REVIEW" ? "#FEF3DC" : "#FDECEA" }}>
              <p style={{ fontSize: 12, fontWeight: 500, marginBottom: 4, color: result.verdict === "APPROVE" ? "#2D6A4F" : result.verdict === "REVIEW" ? "#D4850A" : "#C0392B" }}>
                {result.verdict === "APPROVE" ? "✅ Will go live immediately" : result.verdict === "REVIEW" ? "⏳ Will be held for admin review" : "❌ Report flagged as likely fake"}
              </p>
              <p style={{ fontSize: 12, color: "#666" }}>
                {result.verdict === "APPROVE"
                  ? "Your report will appear on the map and alert responders right away."
                  : result.verdict === "REVIEW"
                  ? "An administrator will review your report before it goes live. Genuine reports are usually approved within minutes."
                  : "This report does not appear to describe a real disaster event. If you believe this is a mistake, resubmit with more specific details."}
              </p>
            </div>
            {result.verdict !== "REJECT" ? (
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={onClose} style={{ flex: 1, background: "#f0f0f0", color: "#555", border: "none", borderRadius: 8, padding: "0.7rem", cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>Cancel</button>
                <button onClick={handleConfirmSave} disabled={saving} style={{ flex: 2, background: saving ? "#ccc" : "#1B4332", color: "#fff", border: "none", borderRadius: 8, padding: "0.7rem", cursor: saving ? "default" : "pointer", fontWeight: 600, fontFamily: "inherit", fontSize: 13 }}>
                  {saving ? "Saving..." : "Confirm & Submit Report"}
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => { setStep(0); setResult(null); }} style={{ flex: 1, background: "#EAF3DE", color: "#2D6A4F", border: "none", borderRadius: 8, padding: "0.7rem", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 500 }}>Edit & Resubmit</button>
                <button onClick={onClose} style={{ flex: 1, background: "#f0f0f0", color: "#555", border: "none", borderRadius: 8, padding: "0.7rem", cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>Cancel</button>
              </div>
            )}
          </div>
        )}

        {/* Saved */}
        {saved && (
          <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
            <p style={{ fontSize: 44, marginBottom: "0.5rem" }}>{result.verdict === "APPROVE" ? "✅" : "⏳"}</p>
            <p style={{ fontSize: 15, fontWeight: 600, color: "#1B4332" }}>
              {result.verdict === "APPROVE" ? "Report submitted successfully!" : "Report submitted for review!"}
            </p>
            <p style={{ fontSize: 13, color: "#888", marginTop: 6 }}>
              {result.verdict === "APPROVE" ? "Your report is now live on the map." : "An admin will review your report shortly."}
            </p>
            <button onClick={onClose} style={{ marginTop: "1.25rem", background: "#1B4332", color: "#fff", border: "none", borderRadius: 8, padding: "0.65rem 2rem", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 500 }}>Close</button>
          </div>
        )}

      </div>
    </div>
  );
}
