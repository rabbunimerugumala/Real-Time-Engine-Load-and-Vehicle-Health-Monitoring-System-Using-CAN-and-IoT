import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Thermometer, Weight, Fuel, DoorOpen, DoorClosed, Activity, Navigation } from 'lucide-react';
import Header from '../components/Header';
import SensorCard from '../components/SensorCard';
import MapView from '../components/MapView';
import Charts from '../components/Charts';
import { useVehicleData, startMockUpdates, stopMockUpdates } from '../hooks/useVehicleData';

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

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const Dashboard: React.FC<DashboardProps> = ({ isDark, onToggleTheme }) => {
  const { data, history, loading, error } = useVehicleData();

  useEffect(() => {
    if (USE_MOCK) {
      startMockUpdates();
      return () => stopMockUpdates();
    }
  }, []);

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
  const location = data?.location ?? { lat: 16.506, lng: 80.648 };
  const online = data?.online ?? false;

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
      key: 'gforce',
      label: 'G-Force',
      value: sensors ? sensors.gforce.toFixed(2) : '--',
      unit: 'g',
      icon: <Activity className="w-5 h-5" />,
      accent: 'gradient-blue',
      status: (sensors?.gforce ?? 0) > 2.5 ? 'warning' as const : 'normal' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-300">
      <Header
        vehicleId={data?.id ?? 'VEHICLE_01'}
        online={online}
        lastUpdated={data?.timestamp ?? null}
        isDark={isDark}
        onToggleTheme={onToggleTheme}
      />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
        {/* Mock mode banner */}
        {USE_MOCK && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2.5 bg-accent-500/10 border border-accent-400/20 rounded-xl px-4 py-2.5"
          >
            <span className="text-base">🤖</span>
            <p className="text-xs font-medium text-accent-700 dark:text-accent-300">
              <strong>Mock Mode Active</strong> — Live simulated data from the built-in generator. Set{' '}
              <code className="font-mono bg-accent-500/10 px-1 rounded">VITE_USE_MOCK=false</code> and add your Firebase credentials to use real hardware.
            </p>
          </motion.div>
        )}

        {/* ── Sensor Cards Grid ─────────────────────────────── */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
            Live Sensors
          </h2>
          <AnimatePresence>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
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
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
            Live Location
          </h2>
          <MapView
            lat={location.lat}
            lng={location.lng}
            vehicleId={data?.id ?? 'VEHICLE_01'}
            online={online}
          />
        </section>

        {/* ── Charts ────────────────────────────────────────── */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
            Data Trends
          </h2>
          <Charts history={history} isDark={isDark} />
        </section>

        {/* Footer */}
        <footer className="text-center text-xs text-gray-300 dark:text-gray-700 py-4">
          RabbuniDrive © {new Date().getFullYear()} · ESP32 + Firebase + React
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;
