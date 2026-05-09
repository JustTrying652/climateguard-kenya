# ClimateGuard Kenya — Disaster Management System

A real-time climate disaster management dashboard for Kenya, built with React + Firebase + Leaflet.

## Setup (5 minutes)

### 1. Install dependencies
```bash
npm install
```

### 2. Create Firebase project
1. Go to https://console.firebase.google.com
2. Create a new project (e.g. "climateguard-kenya")
3. Enable **Firestore Database** (start in test mode)
4. Go to Project Settings → Your apps → Add Web app
5. Copy the config object

### 3. Configure environment
Create a `.env` file in the project root:
```
VITE_OWM_API_KEY=your_openweathermap_key
```
For OpenWeatherMap: sign up free at https://openweathermap.org/api

### 4. Add Firebase credentials
Open `src/firebase.js` and replace the `firebaseConfig` object with your project's values.

### 5. Deploy Firestore rules
```bash
npm install -g firebase-tools
firebase login
firebase init firestore
firebase deploy --only firestore:rules
```

### 6. Run locally
```bash
npm run dev
```

## Features
- 🗺️  Interactive Kenya map showing county-level climate risk scores
- 🚨  Real-time incident reporting (anyone can report a disaster event)
- ⚠️  Live alert banners for weather-triggered warnings
- 📊  Dashboard stats (active incidents, alerts, critical counties)
- 📞  Emergency contacts (Kenya Red Cross, Police, Met Dept)

## Adding weather alerts automatically
See `src/utils/weatherApi.js`. You can call `getWeatherByCoords` and 
`evaluateWeatherAlerts` on a schedule using Firebase Cloud Functions to 
auto-generate alerts when thresholds are breached.

## Build for production
```bash
npm run build
```
Deploy the `dist/` folder to Firebase Hosting, Vercel, or Netlify.
