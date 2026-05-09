// Kenya county climate risk data
// Risk scores sourced from: UNICEF Children's Climate & Disaster Risk Model (CCRI-DRM) v2.3, June 2024
// Published by UNICEF Kenya in partnership with Kenya national authorities and INFORM
// Dataset: https://data.humdata.org/dataset/kenya-children-s-climate-risk-index-disaster-risk-model-ccri-drm-subnational-risk-assessment
//
// floodRisk   = % of children under 18 exposed to 50-year return period riverine floods (scaled 0-100)
// droughtRisk = % of children under 18 exposed to at least moderate drought (scaled 0-100)
// heatRisk    = % of children under 18 exposed to high heatwave frequency (scaled 0-100)

export const KENYA_COUNTIES = [
  { id:  1, name: "Baringo",         lat: 0.55,    lng: 35.9667, floodRisk:  2, droughtRisk:  0, heatRisk:  36, population:  666763 },
  { id:  2, name: "Bomet",           lat: -0.7833, lng: 35.3167, floodRisk:  0, droughtRisk: 54, heatRisk: 100, population:  875689 },
  { id:  3, name: "Bungoma",         lat: 0.5635,  lng: 34.5606, floodRisk:  1, droughtRisk:  4, heatRisk:   7, population: 1670570 },
  { id:  4, name: "Busia",           lat: 0.461,   lng: 34.1116, floodRisk:  6, droughtRisk:  0, heatRisk:   0, population:  893681 },
  { id:  5, name: "Elgeyo-Marakwet", lat: 1.0167,  lng: 35.5,    floodRisk:  0, droughtRisk:  0, heatRisk:  59, population:  454480 },
  { id:  6, name: "Embu",            lat: -0.53,   lng: 37.46,   floodRisk:  1, droughtRisk: 96, heatRisk:  99, population:  608599 },
  { id:  7, name: "Garissa",         lat: -0.4532, lng: 39.6461, floodRisk:  5, droughtRisk: 98, heatRisk:  64, population:  841353 },
  { id:  8, name: "Homa Bay",        lat: -0.5273, lng: 34.4571, floodRisk: 15, droughtRisk:  1, heatRisk:  78, population: 1131950 },
  { id:  9, name: "Isiolo",          lat: 0.3556,  lng: 37.5822, floodRisk:  5, droughtRisk: 25, heatRisk:  15, population:  268002 },
  { id: 10, name: "Kajiado",         lat: -2.0983, lng: 36.7772, floodRisk:  1, droughtRisk: 91, heatRisk:  97, population: 1117840 },
  { id: 11, name: "Kakamega",        lat: 0.2827,  lng: 34.7519, floodRisk:  3, droughtRisk:  3, heatRisk:  44, population: 1867579 },
  { id: 12, name: "Kericho",         lat: -0.3692, lng: 35.2863, floodRisk:  2, droughtRisk: 38, heatRisk: 100, population:  901777 },
  { id: 13, name: "Kiambu",          lat: -1.0311, lng: 36.8308, floodRisk:  0, droughtRisk: 90, heatRisk:  99, population: 2417735 },
  { id: 14, name: "Kilifi",          lat: -3.5107, lng: 39.9093, floodRisk: 15, droughtRisk: 96, heatRisk:   6, population: 1453787 },
  { id: 15, name: "Kirinyaga",       lat: -0.559,  lng: 37.2838, floodRisk:  1, droughtRisk: 100, heatRisk: 100, population:  610411 },
  { id: 16, name: "Kisii",           lat: -0.6817, lng: 34.7669, floodRisk:  0, droughtRisk: 19, heatRisk: 100, population: 1266860 },
  { id: 17, name: "Kisumu",          lat: -0.1022, lng: 34.7617, floodRisk: 15, droughtRisk:  4, heatRisk: 100, population: 1155574 },
  { id: 18, name: "Kitui",           lat: -1.3667, lng: 38.0167, floodRisk:  1, droughtRisk: 61, heatRisk:  94, population: 1136187 },
  { id: 19, name: "Kwale",           lat: -4.1833, lng: 39.45,   floodRisk: 15, droughtRisk: 86, heatRisk:  57, population:  866820 },
  { id: 20, name: "Laikipia",        lat: 0.36,    lng: 36.78,   floodRisk:  0, droughtRisk: 23, heatRisk:   6, population:  518560 },
  { id: 21, name: "Lamu",            lat: -2.2686, lng: 40.902,  floodRisk: 20, droughtRisk: 78, heatRisk:   0, population:  143920 },
  { id: 22, name: "Machakos",        lat: -1.5177, lng: 37.2634, floodRisk:  2, droughtRisk: 94, heatRisk: 100, population: 1421932 },
  { id: 23, name: "Makueni",         lat: -2.2558, lng: 37.624,  floodRisk:  1, droughtRisk: 76, heatRisk:  78, population:  987653 },
  { id: 24, name: "Mandera",         lat: 3.9366,  lng: 41.867,  floodRisk: 12, droughtRisk:  1, heatRisk:  82, population: 1025756 },
  { id: 25, name: "Marsabit",        lat: 2.3284,  lng: 37.9899, floodRisk:  4, droughtRisk: 47, heatRisk:  73, population:  459785 },
  { id: 26, name: "Meru",            lat: 0.0467,  lng: 37.6494, floodRisk:  0, droughtRisk: 61, heatRisk:  50, population: 1545714 },
  { id: 27, name: "Migori",          lat: -1.0634, lng: 34.4731, floodRisk:  5, droughtRisk: 16, heatRisk:  75, population: 1116436 },
  { id: 28, name: "Mombasa",         lat: -4.0435, lng: 39.6682, floodRisk: 23, droughtRisk: 92, heatRisk:   0, population: 1208333 },
  { id: 29, name: "Murang'a",        lat: -0.7167, lng: 37.15,   floodRisk:  1, droughtRisk: 84, heatRisk: 100, population: 1056640 },
  { id: 30, name: "Nairobi",         lat: -1.2921, lng: 36.8219, floodRisk:  0, droughtRisk: 100, heatRisk: 100, population: 4397073 },
  { id: 31, name: "Nakuru",          lat: -0.3031, lng: 36.08,   floodRisk: 31, droughtRisk:  2, heatRisk:  92, population: 2162202 },
  { id: 32, name: "Nandi",           lat: 0.1667,  lng: 35.1,    floodRisk:  1, droughtRisk:  0, heatRisk:  81, population:  885711 },
  { id: 33, name: "Narok",           lat: -1.0833, lng: 35.87,   floodRisk:  0, droughtRisk: 12, heatRisk:  98, population: 1157873 },
  { id: 34, name: "Nyamira",         lat: -0.5667, lng: 34.9333, floodRisk:  0, droughtRisk: 29, heatRisk: 100, population:  605576 },
  { id: 35, name: "Nyandarua",       lat: -0.18,   lng: 36.57,   floodRisk:  0, droughtRisk: 11, heatRisk:  22, population:  638289 },
  { id: 36, name: "Nyeri",           lat: -0.4167, lng: 36.95,   floodRisk:  1, droughtRisk: 96, heatRisk:  92, population:  759164 },
  { id: 37, name: "Samburu",         lat: 1.07,    lng: 36.69,   floodRisk:  0, droughtRisk: 11, heatRisk:  75, population:  310327 },
  { id: 38, name: "Siaya",           lat: -0.0617, lng: 34.2422, floodRisk: 20, droughtRisk:  0, heatRisk:  35, population:  993183 },
  { id: 39, name: "Taita Taveta",    lat: -3.3156, lng: 38.3541, floodRisk:  0, droughtRisk: 99, heatRisk:  99, population:  340671 },
  { id: 40, name: "Tana River",      lat: -1.48,   lng: 40.11,   floodRisk: 37, droughtRisk: 95, heatRisk:  23, population:  315943 },
  { id: 41, name: "Tharaka-Nithi",   lat: -0.2967, lng: 37.95,   floodRisk:  0, droughtRisk: 97, heatRisk:  96, population:  393177 },
  { id: 42, name: "Trans Nzoia",     lat: 1.0567,  lng: 35.0033, floodRisk:  2, droughtRisk:  0, heatRisk:  99, population:  990341 },
  { id: 43, name: "Turkana",         lat: 3.1,     lng: 35.5986, floodRisk: 26, droughtRisk: 44, heatRisk: 100, population:  926976 },
  { id: 44, name: "Uasin Gishu",     lat: 0.5167,  lng: 35.2833, floodRisk:  1, droughtRisk:  0, heatRisk:  23, population: 1163186 },
  { id: 45, name: "Vihiga",          lat: 0.0167,  lng: 34.7167, floodRisk:  1, droughtRisk:  0, heatRisk: 100, population:  590013 },
  { id: 46, name: "Wajir",           lat: 1.7471,  lng: 40.0573, floodRisk:  3, droughtRisk:  9, heatRisk: 100, population:  781263 },
  { id: 47, name: "West Pokot",      lat: 1.73,    lng: 35.12,   floodRisk:  0, droughtRisk: 14, heatRisk:  97, population:  621241 },
];

// Composite climate risk score
// Weighted: flood (40%) + drought (40%) + heat (20%)
// Rationale: flood and drought are Kenya's primary climate disaster drivers per OCHA/KMD
export function getRiskScore(county) {
  return Math.round(
    (county.floodRisk * 0.4) +
    (county.droughtRisk * 0.4) +
    (county.heatRisk * 0.2)
  );
}

export function getRiskLevel(score) {
  if (score >= 60) return { label: "Critical", color: "#E24B4A" };
  if (score >= 40) return { label: "High",     color: "#EF9F27" };
  if (score >= 20) return { label: "Moderate", color: "#639922" };
  return              { label: "Low",          color: "#378ADD" };
}

export const DISASTER_TYPES = [
  "Flood", "Drought", "Landslide", "Flash Flood",
  "Wildfire", "Storm", "Heatwave", "Other",
];

export const SEVERITY_LEVELS = ["Low", "Medium", "High", "Critical"];

export const EMERGENCY_CONTACTS = [
  { name: "Kenya Red Cross",        phone: "1199",         type: "Humanitarian" },
  { name: "National Disaster Ops.", phone: "0800 723 334", type: "Government"   },
  { name: "Kenya Meteorological",   phone: "020 3867880",  type: "Weather"      },
  { name: "Kenya Police",           phone: "999",          type: "Security"     },
  { name: "Ambulance / Fire",       phone: "112",          type: "Emergency"    },
];

export const DATA_SOURCE = {
  riskScores: "UNICEF CCRI-DRM v2.3 (June 2024)",
  riskScoresUrl: "https://data.humdata.org/dataset/kenya-children-s-climate-risk-index-disaster-risk-model-ccri-drm-subnational-risk-assessment",
  weather: "OpenWeatherMap API",
};
