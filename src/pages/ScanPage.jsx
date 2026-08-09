/**
 * ScanPage.jsx
 * ─────────────────────────────────────────────────────────────────
 * Domain Enumeration / Attack Surface Scan page.
 *
 * Renders the DomainScanner component inside the dashboard layout
 * with a live backend connectivity status indicator.
 * ─────────────────────────────────────────────────────────────────
 */

import { useState, useEffect } from 'react';
import { Radar, Activity } from 'lucide-react';

import DomainScanner  from '../components/DomainScanner';
import domainService  from '../services/domainService';

/**
 * BackendStatusBadge
 * Shows whether the Render backend is reachable.
 * Pings /health on mount; shows live/offline status.
 */
function BackendStatusBadge() {
  const [state, setState] = useState('checking'); // 'checking' | 'online' | 'offline'

  useEffect(() => {
    let cancelled = false;
    domainService.healthCheck()
      .then(() => { if (!cancelled) setState('online'); })
      .catch(() => { if (!cancelled) setState('offline'); });
    return () => { cancelled = true; };
  }, []);

  if (state === 'checking') {
    return (
      <div className="live-badge" style={{ opacity: 0.6 }}>
        <span className="dot" style={{ background: 'var(--text-muted)' }} />
        Checking backend…
      </div>
    );
  }

  if (state === 'online') {
    return (
      <div className="live-badge">
        <span className="dot" />
        Backend online
      </div>
    );
  }

  return (
    <div className="live-badge" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--critical)' }}>
      <span className="dot" style={{ background: 'var(--critical)', animationName: 'none' }} />
      Backend offline — Render may be cold-starting
    </div>
  );
}

/**
 * ScanPage Component
 */
export default function ScanPage() {
  return (
    <div className="page-content">

      {/* ══ Page Header ═════════════════════════════════════════ */}
      <div className="page-header">
        <div className="page-header__left">
          <h1 className="page-header__title">
            Domain <span>Enumeration</span>
          </h1>
          <div className="page-header__subtitle">
            <BackendStatusBadge />
            Discover subdomains, IPs, certificates, open ports and more
          </div>
        </div>
      </div>

      {/* ══ How It Works card ═══════════════════════════════════ */}
      <div className="panel" style={{ marginBottom: 24, animationDelay: '0.05s' }}>
        <div className="panel__header">
          <div className="panel__title">
            <div
              className="panel__title-icon"
              style={{ background: 'rgba(139,92,246,0.1)', color: 'var(--accent-purple)' }}
            >
              <Radar size={14} />
            </div>
            Attack Surface Discovery
          </div>
        </div>
        <div className="panel__body">
          <div className="scan-how-it-works">
            {[
              { step: '1', label: 'Enter Domain',       desc: 'Provide a root domain (e.g. example.com)' },
              { step: '2', label: 'Backend Scans',       desc: 'FastAPI pipeline runs enumeration collectors' },
              { step: '3', label: 'Results Displayed',   desc: 'Assets grouped by type — subdomains, IPs, certs…' },
            ].map(({ step, label, desc }) => (
              <div className="how-step" key={step}>
                <div className="how-step__num">{step}</div>
                <div>
                  <div className="how-step__label">{label}</div>
                  <div className="how-step__desc">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ Scanner Panel ═══════════════════════════════════════ */}
      <div className="panel" style={{ animationDelay: '0.1s' }}>
        <div className="panel__header">
          <div className="panel__title">
            <div
              className="panel__title-icon"
              style={{ background: 'rgba(6,182,212,0.1)', color: 'var(--accent-cyan)' }}
            >
              <Activity size={14} />
            </div>
            Domain Scanner
          </div>
        </div>
        <div className="panel__body">
          <DomainScanner />
        </div>
      </div>

      {/* Bottom spacer */}
      <div style={{ height: 40 }} />
    </div>
  );
}
