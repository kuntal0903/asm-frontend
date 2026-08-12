/**
 * ThreatsPage.jsx
 * ─────────────────────────────────────────────────────────────────
 * Threat Intelligence Hub Page.
 * Real-time IOC feeds, adversary intelligence, threat detail popup,
 * category filters, and block action triggers.
 * ─────────────────────────────────────────────────────────────────
 */

import { useState } from 'react';
import { Radar, ShieldAlert } from 'lucide-react';
import ThreatFeed from '../components/ThreatFeed';
import ThreatModal from '../components/ThreatModal';

export default function ThreatsPage() {
  const [selectedThreat, setSelectedThreat] = useState(null);

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header__left">
          <h1 className="page-header__title">
            Threat <span>Intelligence</span>
          </h1>
          <p className="page-header__subtitle">
            Real-time global adversary profiling, IOC feeds, zero-day alerts, and ransomware threat tracking.
          </p>
        </div>
      </div>

      <div className="dashboard-grid-3col">
        <div className="panel" style={{ gridColumn: 'span 2' }}>
          <div className="panel__header">
            <div className="panel__title">
              <Radar size={16} color="var(--neon-blue)" /> Active Global Threat Feed
            </div>
          </div>
          <div className="panel__body">
            <ThreatFeed onItemClick={(threat) => setSelectedThreat(threat)} />
          </div>
        </div>

        <div className="panel">
          <div className="panel__header">
            <div className="panel__title">
              <ShieldAlert size={16} color="var(--critical)" /> Threat Categories
            </div>
          </div>
          <div className="panel__body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: 12, background: 'var(--bg-raised)', borderRadius: 8, border: '1px solid var(--border)' }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--critical)' }}>Ransomware Campaigns</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>LockBit 3.0, BlackCat, Akira targeting exposed services.</div>
            </div>

            <div style={{ padding: 12, background: 'var(--bg-raised)', borderRadius: 8, border: '1px solid var(--border)' }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--high)' }}>Zero-Day Exploitation</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>Active PoC exploits for Outlook, ScreenConnect & Ivanti VPNs.</div>
            </div>

            <div style={{ padding: 12, background: 'var(--bg-raised)', borderRadius: 8, border: '1px solid var(--border)' }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--accent-purple)' }}>State-Sponsored APTs</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>APT29 (Cozy Bear) spearphishing and credential harvesting waves.</div>
            </div>
          </div>
        </div>
      </div>

      {selectedThreat && (
        <ThreatModal
          threat={selectedThreat}
          onClose={() => setSelectedThreat(null)}
        />
      )}
    </div>
  );
}
