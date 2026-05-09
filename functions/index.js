const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");

const geminiKey = defineSecret("ANTHROPIC_API_KEY");

exports.verifyIncident = onRequest(
  { secrets: [geminiKey], cors: true },
  async (req, res) => {

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { type, county, severity, description, reporterName } = req.body;

    if (!type || !county || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const prompt = `You are a disaster management verification system for Kenya.
Analyse this incident report and determine if it is a plausible, genuine disaster report or potentially fake/malicious.

INCIDENT REPORT:
- Type: ${type}
- County: ${county}
- Severity: ${severity}
- Description: "${description}"
- Reporter name: ${reporterName || "Anonymous"}

KENYA CONTEXT:
- Counties prone to flooding: Tana River, Nakuru, Turkana, Mombasa, Kisumu, Siaya, Lamu, Homa Bay
- Counties prone to drought: Garissa, Kirinyaga, Nairobi, Tharaka-Nithi, Kajiado, Kilifi, Embu
- Common disaster types: Floods, Droughts, Landslides, Heatwaves, Storms

Evaluate the report on these criteria:
1. Geographic plausibility — does this disaster type make sense for this county?
2. Description quality — is it specific and coherent, or vague/nonsensical?
3. Severity appropriateness — does the severity match the description?
4. Red flags — any signs of spam, testing, joke entries, or malicious intent?

Respond ONLY with a valid JSON object in exactly this format, no other text:
{
  "confidence": <number 0-100>,
  "verdict": "<APPROVE|REVIEW|REJECT>",
  "reasoning": "<1-2 sentence explanation>",
  "flags": ["<flag1>", "<flag2>"]
}

Verdict rules:
- APPROVE (confidence 70-100): Plausible report, publish immediately
- REVIEW (confidence 40-69): Uncertain, needs human admin review
- REJECT (confidence 0-39): Likely fake, spam, or test entry`;

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiKey.value()}`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 300,
          },
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`Gemini API error: ${err}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);

      return res.status(200).json({
        confidence: parsed.confidence,
        verdict:    parsed.verdict,
        reasoning:  parsed.reasoning,
        flags:      parsed.flags || [],
        verified:   true,
      });

    } catch (err) {
      console.error("Verification error:", err);
      return res.status(200).json({
        confidence: 50,
        verdict:    "REVIEW",
        reasoning:  "Automated verification unavailable. Flagged for manual review.",
        flags:      ["verification_error"],
        verified:   false,
      });
    }
  }
);
