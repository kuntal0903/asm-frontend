/**
 * App.jsx
 * ─────────────────────────────────────────────────────────────────
 * Root application component for ASM Shield Dashboard.
 *
 * Manages:
 * - Sidebar collapsed / mobile-open state
 * - Active page / navigation routing
 * - Global export handler (plug in your API here)
 *
 * Component hierarchy:
 *   App
 *   ├── Sidebar
 *   ├── (mobile) Sidebar overlay
 *   └── MainWrapper
 *       ├── Topbar
 *       └── Router → <Dashboard /> | <SettingsPage /> | <PlaceholderPage />
 * ─────────────────────────────────────────────────────────────────
 */

import { useState, useCallback } from 'react';

import Sidebar         from './components/Sidebar';
import Topbar          from './components/Topbar';
import Dashboard       from './pages/Dashboard';
import SettingsPage    from './pages/SettingsPage';
import ScanPage        from './pages/ScanPage';
import PlaceholderPage from './pages/PlaceholderPage';

import api, { ApiError } from './services/api';

// ── Styles ────────────────────────────────────────────────────────
import './styles/layout.css';
import './styles/components.css';
import './styles/dashboard.css';
import './styles/settings.css';
import './styles/scanner.css';

/**
 * Simple client-side router.
 * Returns the correct page component for a given page ID.
 */
function PageRouter({ activePage, onExport, onVulnClick }) {
  if (activePage === 'dashboard') {
    return <Dashboard onExport={onExport} onVulnClick={onVulnClick} />;
  }
  if (activePage === 'settings') {
    return <SettingsPage />;
  }
  if (activePage === 'scan') {
    return <ScanPage />;
  }
  return <PlaceholderPage pageId={activePage} />;
}

/**
 * App — Root component
 */
export default function App() {
  // ── Layout State ─────────────────────────────────────────────
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen,       setMobileOpen]       = useState(false);

  // ── Navigation State ──────────────────────────────────────────
  const [activePage, setActivePage] = useState('dashboard');

  // ── Handlers ─────────────────────────────────────────────────
  const handleToggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  const handleMobileToggle = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  const handleNavigate = useCallback((pageId) => {
    setActivePage(pageId);
    setMobileOpen(false); // close mobile drawer on nav
  }, []);

  /**
   * handleExport
   * ─────────────────────────────────────────────────────────────
   * ── BACKEND INTEGRATION POINT ──
   * Replace the simulated delay below with your real API call:
   *
   *   const response = await fetch(`/api/v1/assets/export?format=${format}`, {
   *     method: 'GET',
   *     headers: {
   *       'Authorization': `Bearer ${yourAuthToken}`,
   *       'Content-Type':  'application/json',
   *     },
   *   });
   *
   *   if (!response.ok) throw new Error('Export failed');
   *
   *   const blob     = await response.blob();
   *   const url      = URL.createObjectURL(blob);
   *   const anchor   = document.createElement('a');
   *   anchor.href     = url;
   *   anchor.download = `asset-report-${Date.now()}.${format}`;
   *   anchor.click();
   *   URL.revokeObjectURL(url);
   */
  const handleExport = useCallback(async (format) => {
    console.log(`[ASM] Export requested — format: ${format}`);
    try {
      // Real API call — downloads the asset report in the requested format
      const blob = await api.get(`/api/v1/assets/export?format=${format}`);
      if (blob instanceof Blob) {
        const url    = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href     = url;
        anchor.download = `asset-report-${Date.now()}.${format}`;
        anchor.click();
        URL.revokeObjectURL(url);
      } else {
        // Endpoint may not exist yet — graceful fallback
        console.warn('[ASM] Export endpoint returned non-blob response:', blob);
      }
    } catch (err) {
      // Endpoint may not exist yet on backend — log and continue
      if (err instanceof ApiError && (err.status === 404 || err.status === 0)) {
        console.warn('[ASM] Export endpoint not yet implemented on backend.');
      } else {
        console.error('[ASM] Export failed:', err.message);
      }
    }
    console.log(`[ASM] Export handler complete`);
  }, []);

  const handleVulnClick = useCallback((vuln) => {
    console.log('[ASM] Vulnerability selected:', vuln);
    // TODO: open detail drawer / navigate to vuln detail page
  }, []);

  return (
    <div className="app-layout">

      {/* ── Sidebar ────────────────────────────────────────────── */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={handleToggleSidebar}
        activePage={activePage}
        onNavigate={handleNavigate}
      />

      {/* ── Mobile Overlay ─────────────────────────────────────── */}
      <div
        className={`sidebar-overlay ${mobileOpen ? 'visible' : ''}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* ── Main Content Area ──────────────────────────────────── */}
      <div className={`main-wrapper ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>

        {/* Topbar */}
        <Topbar
          activePage={activePage}
          onMobileToggle={handleMobileToggle}
        />

        {/* Page Router */}
        <PageRouter
          activePage={activePage}
          onExport={handleExport}
          onVulnClick={handleVulnClick}
        />
      </div>
    </div>
  );
}
