// OpenWeatherMap integration
// Sign up free at https://openweathermap.org/api — use the "Current Weather Data" plan
// Add your key to a .env file as VITE_OWM_API_KEY=your_key_here

const API_KEY = import.meta.env.VITE_OWM_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export async function getWeatherByCoords(lat, lng) {
  const res = await fetch(
    `${BASE_URL}/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`
  );
  if (!res.ok) throw new Error("Weather fetch failed");
  return res.json();
}

export async function getForecastByCoords(lat, lng) {
  const res = await fetch(
    `${BASE_URL}/forecast?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric&cnt=8`
  );
  if (!res.ok) throw new Error("Forecast fetch failed");
  return res.json();
}

// Evaluate weather data and return triggered alerts
export function evaluateWeatherAlerts(weather, countyName) {
  const alerts = [];
  const { main, wind, rain, weather: conditions } = weather;

  // Heavy rain → flood risk
  if (rain?.["1h"] > 20) {
    alerts.push({
      type: "Flood Warning",
      severity: rain["1h"] > 50 ? "Critical" : "High",
      county: countyName,
      message: `Heavy rainfall of ${rain["1h"]}mm/hr detected. Flood risk elevated.`,
    });
  }

  // Extreme heat → heatwave / drought stress
  if (main.temp > 38) {
    alerts.push({
      type: "Heatwave Alert",
      severity: main.temp > 42 ? "Critical" : "High",
      county: countyName,
      message: `Temperature of ${main.temp}°C recorded. Risk of heat stress and drought conditions.`,
    });
  }

  // Strong winds → storm risk
  if (wind.speed > 15) {
    alerts.push({
      type: "Storm Warning",
      severity: wind.speed > 25 ? "Critical" : "Medium",
      county: countyName,
      message: `Wind speeds of ${wind.speed} m/s detected. Storm conditions possible.`,
    });
  }

  return alerts;
}

// Map OpenWeatherMap condition codes to disaster types
export function getDisasterRisk(weatherCode) {
  if (weatherCode >= 200 && weatherCode < 300) return { type: "Storm",      risk: "High"     };
  if (weatherCode >= 300 && weatherCode < 600) return { type: "Flood",      risk: "Moderate" };
  if (weatherCode >= 600 && weatherCode < 700) return { type: "Flash Flood", risk: "Moderate" };
  if (weatherCode >= 800)                       return { type: "Drought",    risk: "Low"      };
  return { type: "Clear", risk: "Low" };
}
