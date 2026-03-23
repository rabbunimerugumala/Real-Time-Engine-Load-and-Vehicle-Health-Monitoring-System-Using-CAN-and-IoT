import React from 'react';
import type { Variants } from 'framer-motion';
import { motion } from 'framer-motion';

interface SensorCardProps {
  label: string;
  value: string | number;
  unit: string;
  icon: React.ReactNode;
  description?: string;
  status?: 'normal' | 'warning' | 'danger';
  accent?: string; // Tailwind gradient class or color
  index?: number;
}

const statusStyles = {
  normal: 'bg-white dark:bg-gray-900 border-slate-100 dark:border-gray-800',
  warning: 'bg-warning-400/10 dark:bg-warning-500/10 border-warning-400/30 dark:border-warning-500/30',
  danger: 'bg-danger-400/10 dark:bg-danger-500/10 border-danger-400/30 dark:border-danger-500/30',
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.07,
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

const SensorCard: React.FC<SensorCardProps> = ({
  label,
  value,
  unit,
  icon,
  description,
  status = 'normal',
  accent = 'gradient-blue',
  index = 0,
}) => {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={`rounded-2xl border p-4 shadow-sm flex flex-col gap-3 cursor-default transition-colors duration-300 ${statusStyles[status]}`}
    >
      {/* Icon Bubble + Label */}
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 ${accent} rounded-xl flex items-center justify-center shadow-sm text-white flex-shrink-0`}>
          {icon}
        </div>
        {status !== 'normal' && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              status === 'warning'
                ? 'bg-warning-400/20 text-warning-600 dark:text-warning-400'
                : 'bg-danger-400/20 text-danger-600 dark:text-danger-400'
            }`}
          >
            {status === 'warning' ? '⚠ WARN' : '🔴 ALERT'}
          </motion.span>
        )}
      </div>

      {/* Value */}
      <div>
        <div className="flex items-end gap-1 leading-none">
          <motion.span
            key={String(value)}
            initial={{ opacity: 0.5, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight"
          >
            {typeof value === 'number' ? value : value}
          </motion.span>
          <span className="text-sm text-gray-400 dark:text-gray-500 mb-0.5 font-medium">{unit}</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium uppercase tracking-wide">
          {label}
        </p>
      </div>

      {/* Optional description / sub-info */}
      {description && (
        <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{description}</p>
      )}
    </motion.div>
  );
};

export default SensorCard;
