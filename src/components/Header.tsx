import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Car } from 'lucide-react';
import StatusBadge from './StatusBadge';

interface HeaderProps {
  online: boolean;
  isDark: boolean;
  onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({
  online,
  isDark,
  onToggleTheme,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="glass sticky top-0 z-40 border-b border-slate-200 dark:border-gray-800 px-4 py-3 md:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Brand & Clock */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex-shrink-0 w-8 h-8 gradient-blue rounded-lg flex items-center justify-center shadow-sm">
            <Car className="w-4.5 h-4.5 text-white" />
          </div>
          <div className="flex flex-col min-w-0">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white truncate leading-tight tracking-tight">
              Real-Time Vehicle Monitoring
            </h1>
            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500">
              {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
            </span>
          </div>
        </div>

        {/* Right: Status & Theme toggle */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <StatusBadge online={online} />
          </div>
          
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
      </div>

      {/* Mobile: status row */}
      <div className="sm:hidden flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-gray-800">
        <StatusBadge online={online} />
        <span className="text-[11px] text-gray-400 dark:text-gray-500">
          Sync Active
        </span>
      </div>
    </header>
  );
};

export default Header;
