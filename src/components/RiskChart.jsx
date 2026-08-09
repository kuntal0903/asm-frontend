/**
 * RiskChart.jsx
 * ─────────────────────────────────────────────────────────────────
 * Vulnerability trend area chart using Recharts.
 * Shows critical / high / medium trends over 7 days.
 * - Custom tooltip with dark theme
 * - Animated line reveal on mount
 * - Responsive container
 * ─────────────────────────────────────────────────────────────────
 */

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

/** Mock trend data — replace with API response */
const MOCK_DATA = [
  { day: 'Aug 2',  critical: 12, high: 28, medium: 41 },
  { day: 'Aug 3',  critical: 15, high: 31, medium: 38 },
  { day: 'Aug 4',  critical: 11, high: 27, medium: 44 },
  { day: 'Aug 5',  critical: 18, high: 34, medium: 52 },
  { day: 'Aug 6',  critical: 14, high: 29, medium: 48 },
  { day: 'Aug 7',  critical: 22, high: 38, medium: 55 },
  { day: 'Aug 8',  critical: 19, high: 35, medium: 51 },
];

/** Custom dark-mode tooltip */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div style={{
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border-hover)',
      borderRadius: 'var(--radius-md)',
      padding: '12px 16px',
      fontSize: 12,
      boxShadow: 'var(--glow-blue)',
    }}>
      <p style={{ color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600 }}>{label}</p>
      {payload.map((p) => (
        <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, display: 'inline-block' }} />
          <span style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{p.name}:</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 700, marginLeft: 'auto' }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
};

/**
 * RiskChart Component
 *
 * @param {Object}  props
 * @param {Array}   props.data  - Chart data array (falls back to mock)
 */
export default function RiskChart({ data }) {
  const chartData = data || MOCK_DATA;

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart
        data={chartData}
        margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
      >
        {/* Gradient Definitions */}
        <defs>
          <linearGradient id="gradCritical" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="gradHigh" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#f97316" stopOpacity={0.30} />
            <stop offset="95%" stopColor="#f97316" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="gradMedium" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#eab308" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#eab308" stopOpacity={0.02} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />

        <XAxis
          dataKey="day"
          tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />

        <Tooltip content={<CustomTooltip />} />

        <Legend
          wrapperStyle={{ fontSize: 11, paddingTop: 12, color: 'var(--text-secondary)' }}
          formatter={(value) => (
            <span style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{value}</span>
          )}
        />

        <Area type="monotone" dataKey="medium"   stroke="#eab308" strokeWidth={1.5} fill="url(#gradMedium)"   dot={false} />
        <Area type="monotone" dataKey="high"     stroke="#f97316" strokeWidth={1.5} fill="url(#gradHigh)"     dot={false} />
        <Area type="monotone" dataKey="critical" stroke="#ef4444" strokeWidth={2}   fill="url(#gradCritical)" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
