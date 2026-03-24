import { useState, useEffect, useRef, useCallback } from 'react';
import { ref, onValue } from 'firebase/database';
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
        const val = snapshot.val();
        if (val) {
          // Robust mapping with default values as requested
          const structuredData: VehicleData = {
            timestamp: val.timestamp || Date.now(),
            online: val.online || false,
            sensors: {
              temperature: val.sensors?.temperature ?? 0,
              load: val.sensors?.load ?? 0,
              fuel: val.sensors?.fuel ?? 0,
              gas: val.sensors?.gas ?? 0,
              humidity: val.sensors?.humidity ?? 0,
              tilt: val.sensors?.tilt ?? 0,
              door: val.sensors?.door ?? 0,
            },
            gps: {
              fix: val.gps?.fix ?? false,
              satellites: val.gps?.satellites ?? 0,
              lat: val.gps?.lat ?? 0,
              lng: val.gps?.lng ?? 0,
            },
          };

          setData(structuredData);
          handleAlerts(structuredData);

          // Update history ring buffer
          const timeLabel = new Date(structuredData.timestamp).toLocaleTimeString('en-IN', {
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
                temperature: parseFloat(structuredData.sensors.temperature.toFixed(1)),
                load: parseFloat(structuredData.sensors.load.toFixed(0)),
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
