import { useState, useEffect, useRef, useCallback } from 'react';
import { ref, onValue, set } from 'firebase/database';
import toast from 'react-hot-toast';
import { db } from '../firebase/config';
import type { VehicleData, HistoryPoint } from '../types/vehicle';

const MAX_HISTORY = 30;

const DOOR_TOAST_ID = 'door-alert';
const OVERLOAD_TOAST_ID = 'overload-alert';
const TEMP_TOAST_ID = 'temp-alert';

export function useVehicleData() {
  const [data, setData] = useState<VehicleData | null>(null);
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const prevAlertsRef = useRef({ door: false, overload: false, temp: false });

  const handleAlerts = useCallback((vehicle: VehicleData) => {
    const { sensors } = vehicle;
    const prev = prevAlertsRef.current;

    // Door open alert
    if (sensors.door === 1 && !prev.door) {
      toast('🚪 Vehicle door is open!', {
        id: DOOR_TOAST_ID,
        icon: '🚪',
        style: {
          background: '#f97316',
          color: '#fff',
          fontWeight: '600',
          borderRadius: '12px',
        },
        duration: 4000,
      });
    }

    // Overload alert (> 400 kg)
    if (sensors.load > 400 && !prev.overload) {
      toast(`⚖️ Overload detected! ${sensors.load.toFixed(0)} kg`, {
        id: OVERLOAD_TOAST_ID,
        icon: '⚠️',
        style: {
          background: '#dc2626',
          color: '#fff',
          fontWeight: '600',
          borderRadius: '12px',
        },
        duration: 5000,
      });
    }

    // High temperature alert (> 45°C)
    if (sensors.temperature > 45 && !prev.temp) {
      toast(`🌡️ High temperature! ${sensors.temperature.toFixed(1)}°C`, {
        id: TEMP_TOAST_ID,
        icon: '🔥',
        style: {
          background: '#b45309',
          color: '#fff',
          fontWeight: '600',
          borderRadius: '12px',
        },
        duration: 5000,
      });
    }

    prevAlertsRef.current = {
      door: sensors.door === 1,
      overload: sensors.load > 400,
      temp: sensors.temperature > 45,
    };
  }, []);

  useEffect(() => {
    const vehicleRef = ref(db, 'vehicle');

    const unsubscribe = onValue(
      vehicleRef,
      (snapshot) => {
        const val = snapshot.val() as VehicleData | null;
        if (val) {
          setData(val);
          handleAlerts(val);

          // Update history ring buffer
          const timeLabel = new Date(val.timestamp).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          });

          setHistory((prev) => {
            const next = [
              ...prev,
              {
                time: timeLabel,
                temperature: parseFloat(val.sensors.temperature.toFixed(1)),
                load: parseFloat(val.sensors.load.toFixed(0)),
              },
            ];
            return next.slice(-MAX_HISTORY);
          });
        }
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [handleAlerts]);

  return { data, history, loading, error };
}

// ── Mock data generator ─────────────────────────────────────────────────────
// Call this when VITE_USE_MOCK=true. It writes random sensor values to Firebase
// every 2 seconds, simulating an ESP32 device.

let mockIntervalId: ReturnType<typeof setInterval> | null = null;

export function startMockUpdates() {
  if (mockIntervalId) return;

  // Base GPS near Vijayawada, AP
  const BASE_LAT = 16.506;
  const BASE_LNG = 80.648;
  let step = 0;

  const push = async () => {
    step++;
    const temp = 28 + 20 * Math.sin(step * 0.15) + (Math.random() - 0.5) * 4;
    const load = 150 + 300 * Math.abs(Math.sin(step * 0.08)) + (Math.random() - 0.5) * 30;
    const fuel = Math.max(5, 80 - step * 0.3 + (Math.random() - 0.5) * 2);
    const tilt = (Math.random() - 0.5) * 12;
    const gforce = 0.8 + Math.random() * 2.2;
    const door = step % 25 === 0 ? 1 : 0; // briefly open every 25 ticks

    await set(ref(db, 'vehicle'), {
      id: 'VEHICLE_01',
      online: true,
      timestamp: Date.now(),
      sensors: {
        temperature: parseFloat(temp.toFixed(1)),
        load: parseFloat(load.toFixed(0)),
        fuel: parseFloat(fuel.toFixed(1)),
        tilt: parseFloat(tilt.toFixed(2)),
        gforce: parseFloat(gforce.toFixed(2)),
        door,
      },
      location: {
        lat: BASE_LAT + step * 0.0002,
        lng: BASE_LNG + step * 0.0003,
      },
    });
  };

  push().catch(console.error);
  mockIntervalId = setInterval(() => push().catch(console.error), 2000);
}

export function stopMockUpdates() {
  if (mockIntervalId) {
    clearInterval(mockIntervalId);
    mockIntervalId = null;
  }
}
