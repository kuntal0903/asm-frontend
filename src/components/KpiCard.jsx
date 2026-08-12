/**
 * KpiCard.jsx
 * ─────────────────────────────────────────────────────────────────
 * Reusable KPI metric card for the dashboard top row.
 * - Color-coded variants: blue, red, green, purple
 * - Accessible button interaction & keyboard support
 * - Hover lift + glow animation
 * - Progress bar fill & trend indicators
 * ─────────────────────────────────────────────────────────────────
 */

import { TrendingUp, TrendingDown } from 'lucide-react';

export default function KpiCard({
  icon,
  label,
  value,
  variant = 'blue',
  barFill = 50,
  trend,
  trendValue,
  subLeft,
  subRight,
  onClick,
}) {
  return (
    <article
      className={`kpi-card kpi-card--${variant}`}
      role="button"
      tabIndex={0}
      aria-label={`${label}: ${value}`}
      onClick={onClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick && onClick(e)}
      title={`Click to view breakdown for ${label}`}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {/* ── Header: Icon + Trend ─────────────────────────────── */}
      <div className="kpi-card__header">
        <div className="kpi-card__icon-wrap">{icon}</div>

        {trend && trendValue && (
          <div className={`kpi-card__trend kpi-card__trend--${trend}`}>
            {trend === 'up' ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {trendValue}
          </div>
        )}
      </div>

      {/* ── Main Value ───────────────────────────────────────── */}
      <div className="kpi-card__value" aria-label={`${label}: ${value}`}>
        {value}
      </div>
      <div className="kpi-card__label">{label}</div>

      {/* ── Progress Bar ─────────────────────────────────────── */}
      <div
        className="kpi-card__bar-track"
        role="progressbar"
        aria-valuenow={barFill}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="kpi-card__bar-fill" style={{ width: `${barFill}%` }} />
      </div>

      {/* ── Sub Info ─────────────────────────────────────────── */}
      {(subLeft || subRight) && (
        <div className="kpi-card__sub">
          <span>{subLeft}</span>
          <span>{subRight}</span>
        </div>
      )}
    </article>
  );
}
