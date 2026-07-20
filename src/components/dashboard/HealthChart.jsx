// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
// } from "recharts";

// const data = [
//   { time: "10:00", latency: 120 },
//   { time: "10:05", latency: 140 },
//   { time: "10:10", latency: 110 },
//   { time: "10:15", latency: 160 },
//   { time: "10:20", latency: 130 },
//   { time: "10:25", latency: 170 },
//   { time: "10:30", latency: 150 },
// ];

// export default function HealthChart() {
//   return (
//     <div className="bg-white rounded-2xl shadow p-6">
//       <h2 className="text-xl font-semibold mb-4">Service Response Time</h2>

//       <ResponsiveContainer width="100%" height={300}>
//         <LineChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="time" />
//           <YAxis />
//           <Tooltip />
//           <Line
//             type="monotone"
//             dataKey="latency"
//             stroke="#2563eb"
//             strokeWidth={3}
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }
  
// D:\Ai_Monitoring_Platform\ai-monitoring-ui\src\components\dashboard\HealthChart.jsx

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  ComposedChart,
  ReferenceLine,
} from "recharts";
import { Activity, TrendingUp, TrendingDown, Clock, Zap, AlertCircle } from "lucide-react";
import { useState } from "react";

const data = [
  { time: "10:00", latency: 120, cpu: 45, memory: 62 },
  { time: "10:05", latency: 140, cpu: 52, memory: 68 },
  { time: "10:10", latency: 110, cpu: 38, memory: 55 },
  { time: "10:15", latency: 160, cpu: 68, memory: 78 },
  { time: "10:20", latency: 130, cpu: 48, memory: 65 },
  { time: "10:25", latency: 170, cpu: 72, memory: 82 },
  { time: "10:30", latency: 150, cpu: 55, memory: 70 },
  { time: "10:35", latency: 125, cpu: 42, memory: 60 },
  { time: "10:40", latency: 145, cpu: 58, memory: 72 },
  { time: "10:45", latency: 135, cpu: 46, memory: 64 },
];

const metrics = [
  { key: "latency", label: "Latency (ms)", color: "#6366f1", strokeColor: "#818cf8" },
  { key: "cpu", label: "CPU Usage (%)", color: "#f59e0b", strokeColor: "#fbbf24" },
  { key: "memory", label: "Memory Usage (%)", color: "#22c55e", strokeColor: "#4ade80" },
];

export default function HealthChart() {
  const [selectedMetric, setSelectedMetric] = useState("latency");
  const [timeRange, setTimeRange] = useState("1h");

  const currentMetric = metrics.find(m => m.key === selectedMetric) || metrics[0];

  // Calculate stats
  const values = data.map(d => d[selectedMetric]);
  const currentValue = values[values.length - 1] || 0;
  const avgValue = values.reduce((a, b) => a + b, 0) / values.length || 0;
  const maxValue = Math.max(...values) || 0;
  const minValue = Math.min(...values) || 0;

  const getStatusColor = () => {
    if (selectedMetric === "latency") {
      if (currentValue > 150) return "text-red-600";
      if (currentValue > 120) return "text-yellow-600";
      return "text-emerald-600";
    }
    if (selectedMetric === "cpu" || selectedMetric === "memory") {
      if (currentValue > 70) return "text-red-600";
      if (currentValue > 50) return "text-yellow-600";
      return "text-emerald-600";
    }
    return "text-gray-600";
  };

  const getStatusLabel = () => {
    if (selectedMetric === "latency") {
      if (currentValue > 150) return "High Latency";
      if (currentValue > 120) return "Elevated";
      return "Optimal";
    }
    if (selectedMetric === "cpu" || selectedMetric === "memory") {
      if (currentValue > 70) return "High Usage";
      if (currentValue > 50) return "Moderate";
      return "Normal";
    }
    return "Normal";
  };

  const getStatusIcon = () => {
    if (selectedMetric === "latency") {
      if (currentValue > 150) return <AlertCircle className="w-4 h-4 text-red-600" />;
      if (currentValue > 120) return <TrendingUp className="w-4 h-4 text-yellow-600" />;
      return <CheckCircle className="w-4 h-4 text-emerald-600" />;
    }
    if (selectedMetric === "cpu" || selectedMetric === "memory") {
      if (currentValue > 70) return <AlertCircle className="w-4 h-4 text-red-600" />;
      if (currentValue > 50) return <TrendingUp className="w-4 h-4 text-yellow-600" />;
      return <CheckCircle className="w-4 h-4 text-emerald-600" />;
    }
    return <Activity className="w-4 h-4 text-gray-600" />;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-lg">
          <p className="text-xs font-medium text-gray-500 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-3 py-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-sm text-gray-600">{entry.name}</span>
              <span className="text-sm font-semibold text-gray-900">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 rounded-xl border border-indigo-200">
            <Activity className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Performance Metrics</h2>
            <p className="text-xs text-gray-500">Real-time service monitoring</p>
          </div>
        </div>

        {/* Metric Selector */}
        <div className="flex items-center gap-2">
          {metrics.map((metric) => (
            <button
              key={metric.key}
              onClick={() => setSelectedMetric(metric.key)}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                ${selectedMetric === metric.key
                  ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                  : "bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100"
                }
              `}
            >
              {metric.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        <div className="bg-gray-50 rounded-xl p-3">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[10px] text-gray-500">Current</span>
          </div>
          <p className={`text-lg font-bold ${getStatusColor()}`}>{currentValue}</p>
          <p className="text-[10px] text-gray-400">{currentMetric.label.split(' ')[0]}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[10px] text-gray-500">Average</span>
          </div>
          <p className="text-lg font-bold text-gray-900">{avgValue.toFixed(1)}</p>
          <p className="text-[10px] text-gray-400">Last 45 min</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[10px] text-gray-500">Peak</span>
          </div>
          <p className="text-lg font-bold text-red-600">{maxValue}</p>
          <p className="text-[10px] text-gray-400">Maximum</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3">
          <div className="flex items-center gap-1.5">
            <TrendingDown className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[10px] text-gray-500">Minimum</span>
          </div>
          <p className="text-lg font-bold text-emerald-600">{minValue}</p>
          <p className="text-[10px] text-gray-400">Minimum</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3">
          <div className="flex items-center gap-1.5">
            {getStatusIcon()}
            <span className="text-[10px] text-gray-500">Status</span>
          </div>
          <p className={`text-sm font-semibold ${getStatusColor()}`}>{getStatusLabel()}</p>
          <p className="text-[10px] text-gray-400">Current state</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <defs>
              <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={currentMetric.color} stopOpacity={0.2} />
                <stop offset="95%" stopColor={currentMetric.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis 
              dataKey="time" 
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              axisLine={{ stroke: '#e2e8f0' }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              axisLine={{ stroke: '#e2e8f0' }}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine 
              y={avgValue} 
              stroke="#94a3b8" 
              strokeDasharray="4 4"
              strokeWidth={1}
              label={{ 
                value: `Avg: ${avgValue.toFixed(1)}`, 
                fill: '#94a3b8', 
                fontSize: 9,
                position: 'right'
              }}
            />
            <Area
              type="monotone"
              dataKey={selectedMetric}
              stroke={currentMetric.color}
              strokeWidth={0}
              fill="url(#colorMetric)"
            />
            <Line
              type="monotone"
              dataKey={selectedMetric}
              stroke={currentMetric.color}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ 
                r: 5, 
                fill: currentMetric.color,
                stroke: 'white',
                strokeWidth: 2
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentMetric.color }} />
            {currentMetric.label}
          </span>
          <span className="text-gray-200">|</span>
          <span>Avg: {avgValue.toFixed(1)}</span>
          <span className="text-gray-200">|</span>
          <span>Peak: {maxValue}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 rounded-lg">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] text-emerald-700 font-medium">Live</span>
          </div>
          <span className="text-[10px] text-gray-400">Auto-refresh</span>
        </div>
      </div>
    </div>
  );
}  