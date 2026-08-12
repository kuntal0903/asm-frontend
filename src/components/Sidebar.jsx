/**
 * Sidebar.jsx
 * ─────────────────────────────────────────────────────────────────
 * Collapsible side navigation bar for the ASM Dashboard.
 * - Collapsible with icon-only mode + tooltips
 * - Active state highlight + animated left-bar indicator
 * - Section groupings, badge counts, and live status indicator
 * - Accessible keyboard navigation & status detail modal trigger
 * ─────────────────────────────────────────────────────────────────
 */

import { useState } from 'react';
import {
  LayoutDashboard,
  Database,
  ShieldAlert,
  Radar,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  Activity,
  Bell,
} from 'lucide-react';
import SystemStatusModal from './SystemStatusModal';

/**
 * Navigation item configuration.
 */
const NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    section: 'MAIN',
  },
  {
    id: 'assets',
    label: 'Asset Inventory',
    icon: Database,
  },
  {
    id: 'vulnerabilities',
    label: 'Vulnerabilities',
    icon: ShieldAlert,
    badge: 14,
    section: 'SECURITY',
  },
  {
    id: 'threats',
    label: 'Threat Intelligence',
    icon: Radar,
  },
  {
    id: 'domain-scan',
    label: 'Domain Scan',
    icon: Activity,
  },
  {
    id: 'alerts',
    label: 'Alerts',
    icon: Bell,
    badge: 3,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    section: 'SYSTEM',
  },
];

export default function Sidebar({ collapsed, onToggle, activePage, onNavigate }) {
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  return (
    <>
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        {/* ── Collapse Toggle Button ──────────────────────────────── */}
        <button
          className="sidebar__toggle"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>

        {/* ── Logo / Brand ────────────────────────────────────────── */}
        <div
          className="sidebar__logo"
          onClick={() => onNavigate('dashboard')}
          role="button"
          tabIndex={0}
          aria-label="ASM Shield — Navigate to Dashboard"
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onNavigate('dashboard')}
          style={{ cursor: 'pointer' }}
        >
          <div className="sidebar__logo-icon">
            <Shield size={18} color="white" strokeWidth={2.5} />
          </div>
          <div className="sidebar__logo-text">
            <h2>ASM SHIELD</h2>
            <span>Attack Surface Mgmt</span>
          </div>
        </div>

        {/* ── Navigation Items ────────────────────────────────────── */}
        <nav className="sidebar__nav" role="navigation" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <div key={item.id}>
                {item.section && <div className="sidebar__section-label">{item.section}</div>}

                <div
                  id={`nav-${item.id}`}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  data-tooltip={item.label}
                  onClick={() => onNavigate(item.id)}
                  role="button"
                  tabIndex={0}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={item.label}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onNavigate(item.id)}
                >
                  <div className="nav-item__icon">
                    <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
                  </div>
                  <span className="nav-item__label">{item.label}</span>
                  {item.badge && <span className="nav-item__badge">{item.badge}</span>}
                </div>
              </div>
            );
          })}
        </nav>

        {/* ── Footer — System Status ───────────────────────────────── */}
        <div className="sidebar__footer">
          <div
            className="sidebar__status"
            onClick={() => setStatusModalOpen(true)}
            role="button"
            tabIndex={0}
            aria-label="View system status details"
            title="Click to view detailed system health"
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setStatusModalOpen(true)}
            style={{ cursor: 'pointer' }}
          >
            <div className="sidebar__status-dot" />
            <span className="sidebar__status-text">All Systems Operational</span>
          </div>
        </div>
      </aside>

      {statusModalOpen && <SystemStatusModal onClose={() => setStatusModalOpen(false)} />}
    </>
  );
}
