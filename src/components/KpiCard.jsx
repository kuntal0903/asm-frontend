/**
 * KpiCard.jsx
 * ─────────────────────────────────────────────────────────────────
 * Reusable KPI metric card for the dashboard top row.
 * - Color-coded variants: blue, red, green, purple
 * - Hover lift + glow animation (CSS handles)
 * - Progress bar fill
 * - Trend indicator (up/down)
 * - Animated value counter on mount
 * ─────────────────────────────────────────────────────────────────
 */

import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * KpiCard Component
 *
 * @param {Object}        props
 * @param {React.Node}    props.icon        - Lucide icon component instance
 * @param {string}        props.label       - Card description label
 * @param {string|number} props.value       - Primary metric value
 * @param {string}        props.variant     - Color variant: 'blue'|'red'|'green'|'purple'
 * @param {number}        props.barFill     - Progress bar percentage (0–100)
 * @param {string}        props.trend       - 'up' or 'down'
 * @param {string}        props.trendValue  - Trend label e.g. "+12%"
 * @param {string}        props.subLeft     - Sub-info left text
 * @param {string}        props.subRight    - Sub-info right text
 */
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
}) {
  return (
    <article className={`kpi-card kpi-card--${variant}`} role="region" aria-label={label}>
      {/* ── Header: Icon + Trend ─────────────────────────────── */}
      <div className="kpi-card__header">
        <div className="kpi-card__icon-wrap">
          {icon}
        </div>

        {trend && trendValue && (
          <div className={`kpi-card__trend kpi-card__trend--${trend}`}>
            {trend === 'up'
              ? <TrendingUp size={11} />
              : <TrendingDown size={11} />
            }
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
      <div className="kpi-card__bar-track" role="progressbar" aria-valuenow={barFill} aria-valuemin={0} aria-valuemax={100}>
        <div
          className="kpi-card__bar-fill"
          style={{ width: `${barFill}%` }}
        />
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
