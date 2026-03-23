import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { HistoryPoint } from '../types/vehicle';

interface ChartsProps {
  history: HistoryPoint[];
  isDark: boolean;
}

const gridColor = (dark: boolean) => (dark ? '#1f2937' : '#f1f5f9');
const axisColor = (dark: boolean) => (dark ? '#6b7280' : '#94a3b8');
const tooltipStyle = (dark: boolean) => ({
  backgroundColor: dark ? '#1f2937' : '#ffffff',
  border: `1px solid ${dark ? '#374151' : '#e2e8f0'}`,
  borderRadius: '12px',
  color: dark ? '#f9fafb' : '#111827',
  fontSize: '12px',
  padding: '8px 12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
});

const Charts: React.FC<ChartsProps> = ({ history, isDark }) => {
  const hasData = history.length > 0;

  if (!hasData) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {['Temperature Trend', 'Load Trend'].map((title) => (
          <div key={title} className="card p-4">
            <p className="text-sm font-bold text-gray-900 dark:text-white mb-4">{title}</p>
            <div className="h-48 flex items-center justify-center text-gray-400 dark:text-gray-600 text-sm">
              Waiting for data…
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Temperature Area Chart */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-white">Temperature Trend</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Last {history.length} readings • °C</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
            <span className="text-base">🌡️</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={history} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor(isDark)} />
            <XAxis
              dataKey="time"
              tick={{ fill: axisColor(isDark), fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: axisColor(isDark), fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              domain={[0, 80]}
            />
            <Tooltip
              contentStyle={tooltipStyle(isDark)}
              formatter={(val: unknown) => [`${(val as number).toFixed(1)}°C`, 'Temp']}
              labelStyle={{ fontWeight: 600 }}
            />
            <ReferenceLine y={45} stroke="#f97316" strokeDasharray="4 2" strokeWidth={1.5} label={{ value: 'WARN', fill: '#f97316', fontSize: 9, position: 'insideTopLeft' }} />
            <Area
              type="monotone"
              dataKey="temperature"
              stroke="#ef4444"
              strokeWidth={2}
              fill="url(#tempGrad)"
              dot={false}
              activeDot={{ r: 4, fill: '#ef4444' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Load Bar Chart */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-white">Load Trend</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Last {history.length} readings • kg</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
            <span className="text-base">⚖️</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={history} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="loadGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor(isDark)} />
            <XAxis
              dataKey="time"
              tick={{ fill: axisColor(isDark), fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: axisColor(isDark), fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              domain={[0, 600]}
            />
            <Tooltip
              contentStyle={tooltipStyle(isDark)}
              formatter={(val: unknown) => [`${(val as number).toFixed(0)} kg`, 'Load']}
              labelStyle={{ fontWeight: 600 }}
            />
            <ReferenceLine y={400} stroke="#f97316" strokeDasharray="4 2" strokeWidth={1.5} label={{ value: 'MAX', fill: '#f97316', fontSize: 9, position: 'insideTopLeft' }} />
            <Bar
              dataKey="load"
              fill="url(#loadGrad)"
              radius={[4, 4, 0, 0]}
              maxBarSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Charts;
