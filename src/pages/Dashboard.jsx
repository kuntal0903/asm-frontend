/**
 * Dashboard.jsx
 * ─────────────────────────────────────────────────────────────────
 * Main dashboard page — assembles all components into the complete
 * Attack Surface Overview view.
 *
 * Component tree:
 *   Dashboard
 *   ├── Page Header
 *   ├── KPI Cards (x4)
 *   ├── Export CTA Card
 *   ├── Risk Trend Chart  +  Threat Intelligence Feed
 *   └── Vulnerability Table
 * ─────────────────────────────────────────────────────────────────
 */

import {
  Server, ShieldX, HeartPulse, Bug,
  RefreshCw, Filter, SlidersHorizontal,
} from 'lucide-react';

import KpiCard            from '../components/KpiCard';
import ExportCard         from '../components/ExportCard';
import VulnerabilityTable from '../components/VulnerabilityTable';
import ThreatFeed         from '../components/ThreatFeed';
import RiskChart          from '../components/RiskChart';

/* ── KPI Card configuration ─────────────────────────────────────── */
const KPI_CARDS = [
  {
    icon:       <Server size={20} />,
    label:      'Total Assets',
    value:      '1,284',
    variant:    'blue',
    barFill:    72,
    trend:      'up',
    trendValue: '+8.4%',
    subLeft:    '928 online',
    subRight:   '356 offline',
  },
  {
    icon:       <ShieldX size={20} />,
    label:      'Critical / High Risks',
    value:      '147',
    variant:    'red',
    barFill:    65,
    trend:      'up',
    trendValue: '+14',
    subLeft:    '42 Critical',
    subRight:   '105 High',
  },
  {
    icon:       <HeartPulse size={20} />,
    label:      'Health Score',
    value:      '71%',
    variant:    'green',
    barFill:    71,
    trend:      'down',
    trendValue: '-3pts',
    subLeft:    'Target: 90%',
    subRight:   '↓ Degrading',
  },
  {
    icon:       <Bug size={20} />,
    label:      'Total Vulnerabilities',
    value:      '2,831',
    variant:    'purple',
    barFill:    83,
    trend:      'up',
    trendValue: '+121',
    subLeft:    '1,842 unpatched',
    subRight:   '7d avg fix',
  },
];

/**
 * Dashboard Component
 *
 * @param {Object}   props
 * @param {Function} props.onExport   - Async export callback: (format) => Promise<void>
 * @param {Function} props.onVulnClick - Callback when a vulnerability row is clicked
 */
export default function Dashboard({ onExport, onVulnClick }) {
  return (
    <div className="page-content">

      {/* ══ Page Header ═══════════════════════════════════════════ */}
      <div className="page-header">
        <div className="page-header__left">
          <h1 className="page-header__title">
            Attack Surface <span>Overview</span>
          </h1>
          <div className="page-header__subtitle">
            <div className="live-badge">
              <span className="dot" />
              Live
            </div>
            Monitoring 1,284 assets · Last scan: 6 minutes ago
          </div>
        </div>

        {/* Action buttons */}
        <div className="page-header__actions">
          <button className="btn btn--ghost" id="filter-btn" aria-label="Filter">
            <Filter size={14} />
            Filter
          </button>
          <button className="btn btn--ghost" id="configure-btn" aria-label="Configure view">
            <SlidersHorizontal size={14} />
            Configure
          </button>
          <button className="btn btn--primary" id="refresh-btn" aria-label="Refresh scan data">
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>
      </div>

      {/* ══ KPI Metric Cards ══════════════════════════════════════ */}
      <div className="kpi-grid">
        {KPI_CARDS.map((card) => (
          <KpiCard key={card.label} {...card} />
        ))}
      </div>

      {/* ══ Export / Asset Report CTA ════════════════════════════ */}
      <ExportCard onExport={onExport} />

      {/* ── Spacer ─────────────────────────────────────────────── */}
      <div style={{ height: 28 }} />

      {/* ══ Risk Trend Chart + Threat Feed ════════════════════════ */}
      <div className="dashboard-grid-3col">

        {/* ── Risk Vulnerability Trend ─── */}
        <div className="panel" style={{ animationDelay: '0.1s' }}>
          <div className="panel__header">
            <div className="panel__title">
              <div
                className="panel__title-icon"
                style={{ background: 'rgba(59,130,246,0.1)', color: 'var(--accent-blue)' }}
              >
                <Bug size={14} />
              </div>
              Vulnerability Trend
            </div>
            <div className="panel__actions">
              {['7d', '30d', '90d'].map((r) => (
                <button
                  key={r}
                  id={`range-${r}`}
                  className={`panel__action-btn ${r === '7d' ? 'active' : ''}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="panel__body">
            <RiskChart />
          </div>
        </div>

        {/* ── Threat Intelligence Feed ─── */}
        <div className="panel" style={{ animationDelay: '0.15s' }}>
          <div className="panel__header">
            <div className="panel__title">
              <div
                className="panel__title-icon"
                style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--critical)' }}
              >
                <ShieldX size={14} />
              </div>
              Threat Intelligence
            </div>
            <div className="panel__actions">
              <div className="live-badge" style={{ fontSize: 9, padding: '3px 8px' }}>
                <span className="dot" style={{ width: 5, height: 5 }} />
                Live Feed
              </div>
            </div>
          </div>
          <div className="panel__body">
            <ThreatFeed />
          </div>
        </div>
      </div>

      {/* ══ Vulnerability Table ═══════════════════════════════════ */}
      <div className="panel" style={{ animationDelay: '0.2s' }}>
        <div className="panel__header">
          <div className="panel__title">
            <div
              className="panel__title-icon"
              style={{ background: 'rgba(249,115,22,0.1)', color: 'var(--high)' }}
            >
              <ShieldX size={14} />
            </div>
            Recent Vulnerabilities
            <span style={{
              fontSize: 10, background: 'rgba(239,68,68,0.12)', color: 'var(--critical)',
              padding: '2px 8px', borderRadius: 99, fontWeight: 700,
            }}>
              42 CRITICAL
            </span>
          </div>
          <div className="panel__actions">
            <button className="panel__action-btn" id="vuln-filter-btn">Filter</button>
            <button className="panel__action-btn" id="vuln-export-btn">Export</button>
          </div>
        </div>
        <div className="panel__body" style={{ padding: 0 }}>
          <VulnerabilityTable onRowClick={onVulnClick} />
        </div>
      </div>

      {/* Bottom spacer */}
      <div style={{ height: 40 }} />
    </div>
  );
}
