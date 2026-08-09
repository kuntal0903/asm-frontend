/**
 * Topbar.jsx
 * ─────────────────────────────────────────────────────────────────
 * Sticky top navigation bar for the ASM Dashboard.
 * - Real-time clock display
 * - Breadcrumb path
 * - Global search
 * - Notification bell (with unread dot)
 * - User avatar/profile
 * ─────────────────────────────────────────────────────────────────
 */

import { useState, useEffect } from 'react';
import { Search, Bell, Settings, Menu } from 'lucide-react';

/**
 * Topbar Component
 *
 * @param {Object}   props
 * @param {string}   props.activePage      - Current page ID for breadcrumb
 * @param {Function} props.onMobileToggle  - Callback to toggle mobile sidebar overlay
 */
export default function Topbar({ activePage, onMobileToggle }) {
  // ── Real-time clock ──────────────────────────────────────────
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) =>
    date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

  // ── Map page ID to display label ─────────────────────────────
  const PAGE_LABELS = {
    dashboard:       'Dashboard',
    assets:          'Asset Inventory',
    vulnerabilities: 'Vulnerabilities',
    threats:         'Threat Intelligence',
    scan:            'Domain Scan',
    alerts:          'Alerts',
    settings:        'Settings',
  };

  return (
    <header className="topbar" role="banner">
      {/* ── Left: Hamburger (mobile) + Breadcrumb ─────────────── */}
      <div className="flex-gap-md">
        {/* Mobile menu toggle */}
        <button
          className="topbar__icon-btn"
          onClick={onMobileToggle}
          aria-label="Toggle sidebar"
          style={{ display: 'none' }}  /* hidden on desktop; CSS shows on mobile */
          id="mobile-menu-btn"
        >
          <Menu size={16} />
        </button>

        <nav className="topbar__breadcrumb" aria-label="Breadcrumb">
          <span className="text-muted">ASM Shield</span>
          <span className="sep">/</span>
          <span>{PAGE_LABELS[activePage] || 'Dashboard'}</span>
        </nav>
      </div>

      {/* ── Right: Search + Actions ──────────────────────────── */}
      <div className="topbar__actions">
        {/* Global Search */}
        <div className="topbar__search" role="search">
          <Search size={14} />
          <input
            type="text"
            placeholder="Search assets, CVEs, IPs…"
            aria-label="Global search"
            id="global-search"
          />
          <span style={{ fontSize: 10, opacity: 0.4, fontFamily: 'monospace' }}>⌘K</span>
        </div>

        {/* Notification Bell */}
        <button
          className="topbar__icon-btn"
          aria-label="Notifications (3 unread)"
          id="notifications-btn"
        >
          <Bell size={16} />
          <span className="notif-dot" aria-hidden="true" />
        </button>

        {/* Settings */}
        <button
          className="topbar__icon-btn"
          aria-label="Settings"
          id="topbar-settings-btn"
        >
          <Settings size={16} />
        </button>

        {/* Real-time Clock */}
        <div className="topbar__time" aria-label="Current time">
          {formatTime(time)}
        </div>

        {/* User Avatar */}
        <div
          className="topbar__avatar"
          role="button"
          aria-label="User profile"
          tabIndex={0}
          id="user-profile-btn"
        >
          AD
        </div>
      </div>
    </header>
  );
}
