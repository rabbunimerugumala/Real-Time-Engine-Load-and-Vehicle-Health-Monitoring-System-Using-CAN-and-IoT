# 🚗 RabbuniDrive — Smart Vehicle Monitoring Dashboard

Real-time vehicle health, GPS, and usage monitoring using ESP32 + Firebase Realtime Database.

## ✨ Features

| Feature | Details |
|---|---|
| Live Sensors | Temperature, Load, Fuel, Door, Tilt, G-Force |
| GPS Tracking | Leaflet map with animated vehicle marker |
| Charts | Temperature area chart + Load bar chart (Recharts) |
| Alerts | Door open, overload, high temperature (toast notifications) |
| Theme | Light (default) + Dark mode, persisted to localStorage |
| Mock Mode | Built-in data generator — no hardware required |

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## 🔌 Firebase Setup

1. Create a [Firebase project](https://console.firebase.google.com/)
2. Enable **Realtime Database** (start in test mode)
3. Copy `.env.example` → `.env.local` and fill in your credentials:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_DATABASE_URL=https://your-project-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## 🤖 Mock Mode

By default `VITE_USE_MOCK=true` in `.env.local`. The dashboard will generate random sensor + GPS data every 2 seconds without any real hardware.

To disable mock mode and use real data:

```env
VITE_USE_MOCK=false
```

## 📡 Firebase Data Structure (ESP32 writes this)

```json
{
  "vehicle": {
    "id": "VEHICLE_01",
    "online": true,
    "timestamp": 1710000000000,
    "sensors": {
      "temperature": 32.5,
      "load": 250,
      "tilt": 2.1,
      "gforce": 1.2,
      "fuel": 70,
      "door": 0
    },
    "location": {
      "lat": 16.506,
      "lng": 80.648
    }
  }
}
```

## 🚨 Alert Thresholds

| Alert | Condition |
|---|---|
| 🚪 Door Open | `door === 1` |
| ⚖️ Overload | `load > 400 kg` |
| 🌡️ High Temp | `temperature > 45°C` |

## ☁️ Deploy to Vercel

```bash
npx vercel
```

Add all `VITE_*` environment variables in the Vercel dashboard under **Settings → Environment Variables**.

## 🛠️ Tech Stack

- React + Vite + TypeScript
- TailwindCSS v3
- Firebase Realtime Database
- Leaflet / react-leaflet
- Recharts
- Framer Motion
- React Hot Toast
- Lucide React
