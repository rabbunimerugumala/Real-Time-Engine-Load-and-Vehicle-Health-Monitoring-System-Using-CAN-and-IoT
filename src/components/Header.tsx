import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Wifi, WifiOff, Car } from 'lucide-react';
import StatusBadge from './StatusBadge';

interface HeaderProps {
  vehicleId: string;
  online: boolean;
  lastUpdated: number | null;
  isDark: boolean;
  onToggleTheme: () => void;
}

function formatLastUpdated(timestamp: number | null): string {
  if (!timestamp) return 'Never';
  const diff = Math.floor((Date.now() - timestamp) / 1000);
  if (diff < 5) return 'Just now';
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return new Date(timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

const Header: React.FC<HeaderProps> = ({
  vehicleId,
  online,
  lastUpdated,
  isDark,
  onToggleTheme,
}) => {
  return (
    <header className="glass sticky top-0 z-40 border-b border-slate-200 dark:border-gray-800 px-4 py-3 md:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Brand + Vehicle ID */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex-shrink-0 w-9 h-9 gradient-blue rounded-xl flex items-center justify-center shadow-sm">
            <Car className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-bold text-gray-900 dark:text-white truncate leading-tight">
              RabbuniDrive
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-mono truncate">
                {vehicleId || 'VEHICLE_01'}
              </span>
              {online ? (
                <Wifi className="w-3 h-3 text-success-500 flex-shrink-0" />
              ) : (
                <WifiOff className="w-3 h-3 text-danger-400 flex-shrink-0" />
              )}
            </div>
          </div>
        </div>

        {/* Center: Status + Last Updated */}
        <div className="hidden sm:flex flex-col items-center gap-0.5">
          <StatusBadge online={online} />
          <span className="text-[11px] text-gray-400 dark:text-gray-500">
            Updated: {formatLastUpdated(lastUpdated)}
          </span>
        </div>

        {/* Right: Theme toggle */}
        <motion.button
          onClick={onToggleTheme}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="flex-shrink-0 w-9 h-9 rounded-xl bg-slate-100 dark:bg-gray-800 flex items-center justify-center border border-slate-200 dark:border-gray-700 transition-colors hover:bg-slate-200 dark:hover:bg-gray-700"
          aria-label="Toggle dark mode"
        >
          <motion.div
            key={isDark ? 'moon' : 'sun'}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {isDark ? (
              <Sun className="w-4.5 h-4.5 text-yellow-400" />
            ) : (
              <Moon className="w-4.5 h-4.5 text-gray-600" />
            )}
          </motion.div>
        </motion.button>
      </div>

      {/* Mobile: status row */}
      <div className="sm:hidden flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-gray-800">
        <StatusBadge online={online} />
        <span className="text-[11px] text-gray-400 dark:text-gray-500">
          Updated: {formatLastUpdated(lastUpdated)}
        </span>
      </div>
    </header>
  );
};

export default Header;
