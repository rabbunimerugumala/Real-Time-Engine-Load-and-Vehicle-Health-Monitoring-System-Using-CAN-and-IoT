import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Thermometer, Weight, Fuel, DoorOpen, DoorClosed, Activity, Navigation, Droplets, Wind } from 'lucide-react';
import Header from '../components/Header';
import SensorCard from '../components/SensorCard';
import MapView from '../components/MapView';
import Charts from '../components/Charts';
import { useVehicleData } from '../hooks/useVehicleData';

interface DashboardProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

function getSensorStatus(key: string, value: number): 'normal' | 'warning' | 'danger' {
  if (key === 'temperature') {
    if (value > 50) return 'danger';
    if (value > 45) return 'warning';
  }
  if (key === 'load') {
    if (value > 450) return 'danger';
    if (value > 400) return 'warning';
  }
  if (key === 'fuel') {
    if (value < 10) return 'danger';
    if (value < 20) return 'warning';
  }
  return 'normal';
}

function FuelBar({ value }: { value: number }) {
  const pct = Math.min(100, Math.max(0, value));
  const color = pct < 10 ? 'bg-danger-500' : pct < 25 ? 'bg-warning-400' : 'bg-success-500';
  return (
    <div className="w-full h-1.5 bg-slate-100 dark:bg-gray-800 rounded-full overflow-hidden mt-1">
      <motion.div
        className={`h-full rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
    </div>
  );
}

const Dashboard: React.FC<DashboardProps> = ({ isDark, onToggleTheme }) => {
  const { data, history, loading, error, isOnline } = useVehicleData();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-gray-950">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
          className="w-10 h-10 rounded-full border-4 border-accent-200 border-t-accent-500"
        />
        <p className="text-sm text-gray-400 dark:text-gray-500">Connecting to vehicle…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-slate-50 dark:bg-gray-950 px-6 text-center">
        <span className="text-4xl">⚠️</span>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Connection Error</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">{error}</p>
        <p className="text-xs text-gray-400 dark:text-gray-600">Check your Firebase credentials in .env.local</p>
      </div>
    );
  }

  const sensors = data?.sensors;
  const gps = data?.gps ?? { lat: 16.506, lng: 80.648, fix: false, satellites: 0 };

  const sensorCards = [
    {
      key: 'temperature',
      label: 'Temperature',
      value: sensors ? sensors.temperature.toFixed(1) : '--',
      unit: '°C',
      icon: <Thermometer className="w-5 h-5" />,
      accent: 'gradient-orange',
      status: getSensorStatus('temperature', sensors?.temperature ?? 0),
    },
    {
      key: 'load',
      label: 'Load / Weight',
      value: sensors ? sensors.load.toFixed(0) : '--',
      unit: 'kg',
      icon: <Weight className="w-5 h-5" />,
      accent: 'gradient-blue',
      status: getSensorStatus('load', sensors?.load ?? 0),
    },
    {
      key: 'fuel',
      label: 'Fuel Level',
      value: sensors ? sensors.fuel.toFixed(0) : '--',
      unit: '%',
      icon: <Fuel className="w-5 h-5" />,
      accent: 'gradient-green',
      status: getSensorStatus('fuel', sensors?.fuel ?? 100),
      description: sensors ? <FuelBar value={sensors.fuel} /> : undefined,
    },
    {
      key: 'gas',
      label: 'Gas Level',
      value: sensors ? sensors.gas.toFixed(0) : '--',
      unit: '%',
      icon: <Wind className="w-5 h-5" />,
      accent: 'gradient-purple',
      status: 'normal' as const,
    },
    {
      key: 'humidity',
      label: 'Humidity',
      value: sensors ? sensors.humidity.toFixed(0) : '--',
      unit: '%',
      icon: <Droplets className="w-5 h-5" />,
      accent: 'gradient-blue',
      status: 'normal' as const,
    },
    {
      key: 'door',
      label: 'Door Status',
      value: sensors?.door === 1 ? 'Open' : 'Closed',
      unit: '',
      icon: sensors?.door === 1
        ? <DoorOpen className="w-5 h-5" />
        : <DoorClosed className="w-5 h-5" />,
      accent: sensors?.door === 1 ? 'gradient-orange' : 'gradient-green',
      status: sensors?.door === 1 ? 'warning' as const : 'normal' as const,
    },
    {
      key: 'tilt',
      label: 'Tilt Angle',
      value: sensors ? sensors.tilt.toFixed(1) : '--',
      unit: '°',
      icon: <Navigation className="w-5 h-5" />,
      accent: 'gradient-purple',
      status: 'normal' as const,
    },
    {
      key: 'satellites',
      label: 'GPS Satellites',
      value: gps.satellites.toString(),
      unit: '',
      icon: <Activity className="w-5 h-5" />,
      accent: 'gradient-green',
      status: gps.fix && isOnline ? 'normal' as const : 'warning' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-300">
      <Header
        online={isOnline}
        isDark={isDark}
        onToggleTheme={onToggleTheme}
      />

      <main className={`max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6 transition-all duration-500 ${!isOnline ? 'grayscale-[0.5] opacity-80' : ''}`}>
        {/* Offline Banner */}
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-danger-500/10 border border-danger-500/20 rounded-2xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">📡</span>
              <div>
                <h3 className="text-sm font-bold text-danger-600 dark:text-danger-400">Device Offline</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">No heartbeat detected for over 10 seconds. Showing last known state (safe values).</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Sensor Cards Grid ─────────────────────────────── */}
        <section className={!isOnline ? 'blur-[1px]' : ''}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Live Sensors
            </h2>
            {!isOnline && <span className="text-[10px] bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-500">No Pulse</span>}
          </div>
          <AnimatePresence>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {sensorCards.map((card, i) => (
                <SensorCard
                  key={card.key}
                  label={card.label}
                  value={card.value}
                  unit={card.unit}
                  icon={card.icon}
                  accent={card.accent}
                  status={card.status}
                  description={typeof card.description === 'object' ? undefined : card.description}
                  index={i}
                />
              ))}
            </div>
          </AnimatePresence>

          {/* Fuel bar below sensor grid on its own row */}
          {sensors && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="mt-3 card p-4 flex items-center gap-4"
            >
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex-shrink-0">⛽ Fuel</span>
              <div className="flex-1">
                <div className="w-full h-3 bg-slate-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      sensors.fuel < 10 ? 'bg-danger-500' : sensors.fuel < 25 ? 'bg-warning-400' : 'bg-success-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, sensors.fuel)}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>
              <span className={`text-sm font-bold flex-shrink-0 ${
                sensors.fuel < 10 ? 'text-danger-500' : sensors.fuel < 25 ? 'text-warning-500' : 'text-success-500'
              }`}>
                {sensors.fuel.toFixed(0)}%
              </span>
            </motion.div>
          )}
        </section>

        {/* ── Map ───────────────────────────────────────────── */}
        <section className={!isOnline || !gps.fix ? 'opacity-60 blur-[2px]' : ''}>
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
            Live Location {!gps.fix && '— No GPS Signal'}
          </h2>
          <MapView
            lat={gps.lat}
            lng={gps.lng}
            vehicleId="Real-Time Vehicle Monitoring"
            online={isOnline && gps.fix}
          />
        </section>

        {/* ── Charts ────────────────────────────────────────── */}
        <section className={!isOnline ? 'opacity-50' : ''}>
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
            Data Trends
          </h2>
          <Charts history={history} isDark={isDark} />
        </section>

        {/* Footer */}
        <footer className="text-center text-xs text-gray-300 dark:text-gray-700 py-4">
          Real-Time Vehicle Monitoring © {new Date().getFullYear()} · ESP32 + Firebase + React
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;
