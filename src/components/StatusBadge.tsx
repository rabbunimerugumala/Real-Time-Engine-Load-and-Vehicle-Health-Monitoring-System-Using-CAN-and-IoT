import React from 'react';
import { motion } from 'framer-motion';

interface StatusBadgeProps {
  online: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ online }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex items-center justify-center">
        {online && (
          <span className="absolute inline-flex h-3 w-3 rounded-full bg-success-400 opacity-75 animate-ping" />
        )}
        <span
          className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
            online ? 'bg-success-500' : 'bg-danger-500'
          }`}
        />
      </div>
      <motion.span
        key={online ? 'online' : 'offline'}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className={`text-sm font-semibold ${
          online
            ? 'text-success-600 dark:text-success-400'
            : 'text-danger-500 dark:text-danger-400'
        }`}
      >
        {online ? 'Online' : 'Offline'}
      </motion.span>
    </div>
  );
};

export default StatusBadge;
