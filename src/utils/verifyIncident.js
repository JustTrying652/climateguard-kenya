// AI-powered incident verification via Firebase Cloud Function (Gemini backend)
const VERIFY_URL = "https://verifyincident-dxxue4zcxq-uc.a.run.app";

export async function verifyIncident(report) {
  try {
    const response = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type:         report.type,
        county:       report.county,
        severity:     report.severity,
        description:  report.description,
        reporterName: report.reporterName || "",
      }),
    });

    if (!response.ok) throw new Error(`Function error: ${response.status}`);

    const data = await response.json();
    return data;

  } catch (err) {
    console.error("Verification failed:", err);
    return {
      confidence: 50,
      verdict:    "REVIEW",
      reasoning:  "Automated verification unavailable. Flagged for manual review.",
      flags:      ["verification_error"],
      verified:   false,
    };
  }
}

// Map verdict to Firestore status
export function verdictToStatus(verdict) {
  switch (verdict) {
    case "APPROVE": return "active";
    case "REVIEW":  return "pending";
    case "REJECT":  return "rejected";
    default:        return "pending";
  }
}

// Confidence level label + colour for UI
export function getConfidenceDisplay(confidence) {
  if (confidence >= 70) return { label: "High confidence", color: "#2D6A4F", bg: "#EAF3DE" };
  if (confidence >= 40) return { label: "Needs review",    color: "#D4850A", bg: "#FEF3DC" };
  return                       { label: "Likely fake",     color: "#C0392B", bg: "#FDECEA" };
}
