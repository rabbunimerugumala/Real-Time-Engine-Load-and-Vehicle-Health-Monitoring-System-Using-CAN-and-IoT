# 🚗 Real-Time Vehicle Monitoring System

A high-performance, real-time vehicle health and location monitoring dashboard built with React, Firebase, and Vite. Features intelligent heartbeat logic and robust offline state handling.

## ✨ Key Features

| Feature | Details |
|---|---|
| **Live Sensor Grid** | Real-time monitoring of Temperature, Load, Fuel, Gas Level, Humidity, Tilt, and Door Status. |
| **GPS Tracking** | High-precision location tracking with fix status and satellite count visualization. |
| **Heartbeat Logic** | Intelligent **10-second offline detection**. Automatically marks device as offline if no timestamp update is received. |
| **Robust Offline UI** | When offline, the dashboard applies a **blur/grayscale effect** and fails safe by zeroing out sensitive sensor values. |
| **Real-Time Clock** | Digital clock in the header synchronized with local time. |
| **Dynamic Alerts** | Instant toast notifications for Door Open, Overload (>400kg), and High Temperature (>45°C). |
| **Glassmorphism UI** | Modern, premium design with dark/light mode support and smooth Framer Motion animations. |

## 🚀 Quick Start

1. **Clone and Install**:
```bash
npm install
```

2. **Configure Environment**:
Create a `.env.local` file with your Firebase Database URL:
```env
VITE_FIREBASE_DATABASE_URL=https://real-time-engine-can-default-rtdb.asia-southeast1.firebasedatabase.app/
```

3. **Run Development Server**:
```bash
npm run dev
```

4. **Simulate Data (Testing)**:
To see the dashboard in action without hardware, run the simulation script:
```bash
npm run write-firebase
```

## 📡 Firebase Data Structure

The system expects the following JSON structure at the `vehicle` root in your Realtime Database:

```json
{
  "timestamp": 1711311000000,
  "sensors": {
    "temperature": 28.5,
    "load": 120,
    "fuel": 85,
    "gas": 42,
    "humidity": 65,
    "tilt": 0.5,
    "door": 0
  },
  "gps": {
    "fix": 1,
    "satellites": 8,
    "lat": 16.506,
    "lng": 80.648
  }
}
```

## 🚨 Alert Thresholds

| Alert | Condition | Visual Indicator |
|---|---|---|
| 🚪 Door Open | `door === 1` | Orange Toast + Card Glow |
| ⚖️ Overload | `load > 400 kg` | Red Toast + Pulsing Alert |
| 🌡️ High Temp | `temperature > 45°C` | Amber Toast + Warning Icon |

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS v3, Framer Motion (Animations)
- **Backend**: Firebase Realtime Database
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Charting**: Recharts
- **Mapping**: Leaflet / React-Leaflet

## ☁️ Deployment

Built for speed and easy deployment to **Vercel** or **Netlify**. Ensure the `VITE_FIREBASE_DATABASE_URL` is configured in your CI/CD environment variables.

---
*Created for Real-Time Engine, Load and Vehicle Health Monitoring System using CAN and IoT.*
