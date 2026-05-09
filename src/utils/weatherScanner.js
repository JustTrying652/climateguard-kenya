import { getWeatherByCoords, evaluateWeatherAlerts } from "./weatherApi";
import { createAlert } from "../hooks/useFirestore";
import { KENYA_COUNTIES, getRiskScore } from "./kenyaData";

// Check the top N highest-risk counties for weather alerts
const HIGH_RISK_COUNTIES = KENYA_COUNTIES
  .sort((a, b) => getRiskScore(b) - getRiskScore(a))
  .slice(0, 12);

export async function runWeatherScan() {
  const results = { alerts: [], errors: [], checked: 0 };

  for (const county of HIGH_RISK_COUNTIES) {
    try {
      const weather = await getWeatherByCoords(county.lat, county.lng);
      const triggered = evaluateWeatherAlerts(weather, county.name);

      for (const alert of triggered) {
        await createAlert({
          ...alert,
          source: "OpenWeatherMap",
          weatherSnapshot: {
            temp: weather.main.temp,
            humidity: weather.main.humidity,
            description: weather.weather[0].description,
            windSpeed: weather.wind.speed,
            rain: weather.rain?.["1h"] ?? 0,
          },
        });
        results.alerts.push(alert);
      }

      results.checked++;
    } catch (err) {
      results.errors.push({ county: county.name, error: err.message });
    }
  }

  return results;
}

// Simulate alerts using realistic Kenya climate scenarios
// Use this for demos if you hit OWM rate limits or API key issues
export async function runSimulatedScan() {
  const results = { alerts: [], errors: [], checked: 0, simulated: true };

  const scenarios = [
    {
      county: "Tana River",
      type: "Flood Warning",
      severity: "Critical",
      message: "Simulated: Rainfall of 62mm/hr detected. Tana River overflow risk. Evacuate low-lying areas immediately.",
      weatherSnapshot: { temp: 28, humidity: 94, description: "heavy intensity rain", windSpeed: 8.2, rain: 62 },
    },
    {
      county: "Garissa",
      type: "Heatwave Alert",
      severity: "High",
      message: "Simulated: Temperature of 41°C recorded. Risk of heat stress, livestock loss, and drought acceleration.",
      weatherSnapshot: { temp: 41, humidity: 12, description: "clear sky", windSpeed: 3.1, rain: 0 },
    },
    {
      county: "Mandera",
      type: "Heatwave Alert",
      severity: "Critical",
      message: "Simulated: Temperature of 44°C recorded. Extreme drought conditions. Water sources critically low.",
      weatherSnapshot: { temp: 44, humidity: 8, description: "clear sky", windSpeed: 5.4, rain: 0 },
    },
    {
      county: "Kisumu",
      type: "Flood Warning",
      severity: "High",
      message: "Simulated: Rainfall of 28mm/hr detected. Lake Victoria water levels rising. Flash flood risk in low zones.",
      weatherSnapshot: { temp: 24, humidity: 88, description: "moderate rain", windSpeed: 6.7, rain: 28 },
    },
    {
      county: "Mombasa",
      type: "Storm Warning",
      severity: "High",
      message: "Simulated: Wind speeds of 18 m/s detected. Coastal storm conditions. Small craft should not sail.",
      weatherSnapshot: { temp: 31, humidity: 76, description: "thunderstorm", windSpeed: 18, rain: 9 },
    },
  ];

  for (const scenario of scenarios) {
    try {
      await createAlert({ ...scenario, source: "Simulation" });
      results.alerts.push(scenario);
      results.checked++;
    } catch (err) {
      results.errors.push({ county: scenario.county, error: err.message });
    }
  }

  return results;
}
