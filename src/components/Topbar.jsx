/**
 * Topbar.jsx
 * ─────────────────────────────────────────────────────────────────
 * Sticky top navigation bar for the ASM Dashboard.
 * - Real-time clock with 12h/24h toggle on click
 * - Interactive breadcrumb navigation
 * - Global search with live popup results + ⌘K keyboard shortcut
 * - Notification bell (with unread dot)
 * - Settings icon
 * - User avatar with profile dropdown popover
 * ─────────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useRef } from 'react';
import { Search, Bell, Settings, Menu, User, LogOut, ShieldCheck } from 'lucide-react';

const SEARCH_DATABASE = [
  { type: 'Asset', title: 'mail.corp.internal', desc: '10.0.4.15 · Critical Risk', route: 'assets' },
  { type: 'Asset', title: 'api.prod.svc', desc: '104.21.44.181 · High Risk', route: 'assets' },
  { type: 'CVE', title: 'CVE-2024-21413', desc: 'MS Outlook RCE · CVSS 9.8', route: 'vulnerabilities' },
  { type: 'CVE', title: 'CVE-2024-1709', desc: 'ConnectWise Auth Bypass · CVSS 10.0', route: 'vulnerabilities' },
  { type: 'Domain', title: 'acme-corp.com', desc: 'Domain Scan · Score 88/100', route: 'domain-scan' },
  { type: 'Threat', title: 'Ransomware Campaign Detected', desc: 'LockBit 3.0 Feed', route: 'threats' },
];

export default function Topbar({ activePage, onMobileToggle, onNavigate, onNotifToggle, notifOpen }) {
  const [time, setTime] = useState(new Date());
  const [use24Hour, setUse24Hour] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ⌘K / Ctrl+K keyboard listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const formatTime = (date) =>
    date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: !use24Hour,
    });

  const PAGE_LABELS = {
    dashboard: 'Dashboard',
    assets: 'Asset Inventory',
    vulnerabilities: 'Vulnerabilities',
    threats: 'Threat Intelligence',
    'domain-scan': 'Domain Scan',
    alerts: 'Alerts',
    settings: 'Settings',
  };

  const filteredSearch = searchQuery.trim()
    ? SEARCH_DATABASE.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.desc.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSearchResultClick = (route) => {
    setSearchQuery('');
    setSearchFocused(false);
    if (onNavigate) onNavigate(route);
  };

  return (
    <header className="topbar" role="banner" style={{ position: 'relative' }}>
      {/* ── Left: Hamburger (mobile) + Breadcrumb ─────────────── */}
      <div className="flex-gap-md">
        <button
          className="topbar__icon-btn"
          onClick={onMobileToggle}
          aria-label="Toggle sidebar"
          style={{ display: 'none' }}
          id="mobile-menu-btn"
        >
          <Menu size={16} />
        </button>

        <nav className="topbar__breadcrumb" aria-label="Breadcrumb">
          <span
            className="text-muted"
            style={{ cursor: 'pointer' }}
            onClick={() => onNavigate && onNavigate('dashboard')}
            title="Go to Dashboard"
          >
            ASM Shield
          </span>
          <span className="sep">/</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
            {PAGE_LABELS[activePage] || 'Dashboard'}
          </span>
        </nav>
      </div>

      {/* ── Right: Search + Actions ──────────────────────────── */}
      <div className="topbar__actions">
        {/* Global Search with Live Results */}
        <div
          className="topbar__search"
          role="search"
          style={{ position: 'relative' }}
        >
          <Search size={14} />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search assets, CVEs, IPs…"
            aria-label="Global search"
            id="global-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
          />
          <span style={{ fontSize: 10, opacity: 0.4, fontFamily: 'monospace' }}>⌘K</span>

          {/* Search Dropdown Results */}
          {searchFocused && searchQuery.trim() && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                left: 0,
                right: 0,
                minWidth: '320px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-hover)',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 16px 40px rgba(0,0,0,0.7), var(--glow-blue)',
                zIndex: 400,
                padding: '8px 0',
              }}
            >
              <div style={{ padding: '6px 14px', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Search Results ({filteredSearch.length})
              </div>
              {filteredSearch.length === 0 ? (
                <div style={{ padding: '12px 14px', fontSize: 12, color: 'var(--text-muted)' }}>
                  No matching assets or CVEs found.
                </div>
              ) : (
                filteredSearch.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSearchResultClick(item.route)}
                    style={{
                      padding: '8px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      borderBottom: '1px solid var(--border)',
                      transition: 'background 0.15s',
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{item.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{item.desc}</div>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: 'rgba(59,130,246,0.12)', color: 'var(--neon-blue)' }}>
                      {item.type}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <button
          className={`topbar__icon-btn ${notifOpen ? 'active' : ''}`}
          aria-label="Notifications (3 unread)"
          aria-expanded={notifOpen}
          id="notifications-btn"
          onClick={onNotifToggle}
          style={notifOpen ? { background: 'rgba(59,130,246,0.15)', borderColor: 'rgba(59,130,246,0.4)', color: 'var(--neon-blue)' } : {}}
        >
          <Bell size={16} />
          {!notifOpen && <span className="notif-dot" aria-hidden="true" />}
        </button>

        {/* Settings */}
        <button
          className={`topbar__icon-btn ${activePage === 'settings' ? 'active' : ''}`}
          aria-label="Settings"
          id="topbar-settings-btn"
          onClick={() => onNavigate && onNavigate('settings')}
          style={activePage === 'settings' ? { background: 'rgba(59,130,246,0.15)', borderColor: 'rgba(59,130,246,0.4)', color: 'var(--neon-blue)' } : {}}
        >
          <Settings size={16} />
        </button>

        {/* Real-time Clock (Clickable to toggle 12h/24h) */}
        <div
          className="topbar__time"
          aria-label="Current time — Click to toggle 12h/24h format"
          title="Click to toggle 12h / 24h format"
          onClick={() => setUse24Hour(!use24Hour)}
          style={{ cursor: 'pointer', userSelect: 'none' }}
        >
          {formatTime(time)}
        </div>

        {/* User Avatar with Profile Popover */}
        <div style={{ position: 'relative' }}>
          <div
            className="topbar__avatar"
            role="button"
            aria-label="User profile menu"
            tabIndex={0}
            id="user-profile-btn"
            onClick={() => setProfileOpen(!profileOpen)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setProfileOpen(!profileOpen)}
            title="User Profile Menu"
            style={{ cursor: 'pointer' }}
          >
            AD
          </div>

          {/* Profile Dropdown */}
          {profileOpen && (
            <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 399 }} onClick={() => setProfileOpen(false)} />
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 10px)',
                  right: 0,
                  width: 230,
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-hover)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 16px 40px rgba(0,0,0,0.8), var(--glow-blue)',
                  zIndex: 400,
                  padding: 12,
                  animation: 'scaleUp 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 10, borderBottom: '1px solid var(--border)', marginBottom: 8 }}>
                  <div className="topbar__avatar" style={{ width: 34, height: 34, fontSize: 12 }}>AD</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Alex Dawson</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Security Lead (Admin)</div>
                  </div>
                </div>

                <button
                  onClick={() => { setProfileOpen(false); if (onNavigate) onNavigate('settings'); }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 10px',
                    fontSize: 12,
                    color: 'var(--text-primary)',
                    background: 'none',
                    border: 'none',
                    borderRadius: 6,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                  className="btn--ghost"
                >
                  <User size={14} /> Profile & Account Settings
                </button>

                <button
                  onClick={() => { setProfileOpen(false); if (onNavigate) onNavigate('settings'); }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 10px',
                    fontSize: 12,
                    color: 'var(--text-primary)',
                    background: 'none',
                    border: 'none',
                    borderRadius: 6,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                  className="btn--ghost"
                >
                  <ShieldCheck size={14} color="var(--low)" /> Security & MFA Active
                </button>

                <div style={{ height: 1, background: 'var(--border)', margin: '6px 0' }} />

                <button
                  onClick={() => setProfileOpen(false)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 10px',
                    fontSize: 12,
                    color: 'var(--critical)',
                    background: 'none',
                    border: 'none',
                    borderRadius: 6,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                  className="btn--ghost"
                >
                  <LogOut size={14} /> Lock Session
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
