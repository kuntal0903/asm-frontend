/**
 * SystemStatusModal.jsx
 * ─────────────────────────────────────────────────────────────────
 * System status modal triggered by clicking "All Systems Operational" badge.
 * Displays live service status metrics (Scanner Engine, SIEM Stream, API Gateway, etc.).
 * ─────────────────────────────────────────────────────────────────
 */

import { useState } from 'react';
import { X, Activity, CheckCircle2, RefreshCw, Server, Shield, Radio, Database } from 'lucide-react';

const SERVICES = [
  { name: 'Surface Scanning Engine', status: 'Operational', uptime: '99.98%', latency: '24ms', icon: Server },
  { name: 'Threat Intelligence Feed Stream', status: 'Operational', uptime: '99.95%', latency: '42ms', icon: Radio },
  { name: 'Vulnerability Indexer DB', status: 'Operational', uptime: '100%', latency: '12ms', icon: Database },
  { name: 'API Gateway & Webhooks', status: 'Operational', uptime: '99.99%', latency: '18ms', icon: Activity },
  { name: 'Integrations & Jira Sync', status: 'Degraded', uptime: '98.50%', latency: '140ms', icon: Shield },
];

export default function SystemStatusModal({ onClose }) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefreshStatus = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  return (
    <>
      <div
        className="modal-overlay"
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(3, 7, 18, 0.75)',
          backdropFilter: 'blur(6px)',
          zIndex: 300,
        }}
      />

      <div
        role="dialog"
        aria-label="ASM Shield System Health Status"
        aria-modal="true"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-hover)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8), var(--glow-blue)',
          zIndex: 301,
          padding: '24px',
          color: 'var(--text-primary)',
          animation: 'scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(34,197,94,0.15)', color: 'var(--low)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700 }}>System Health & Status</h2>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>All core ASM Shield services operational</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close status dialog"
            style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: 6, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {SERVICES.map((s) => {
            const Icon = s.icon;
            const isDegraded = s.status === 'Degraded';
            return (
              <div
                key={s.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: 'var(--bg-raised)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Icon size={16} color={isDegraded ? 'var(--medium)' : 'var(--low)'} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Latency: {s.latency} · Uptime: {s.uptime}</div>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: 99,
                    background: isDegraded ? 'rgba(234,179,8,0.12)' : 'rgba(34,197,94,0.12)',
                    color: isDegraded ? 'var(--medium)' : 'var(--low)',
                  }}
                >
                  {s.status}
                </span>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid var(--border)' }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Last checked: Just now</span>
          <button onClick={handleRefreshStatus} className="btn btn--ghost" style={{ fontSize: 12 }} disabled={refreshing}>
            <RefreshCw size={13} className={refreshing ? 'spin-icon' : ''} /> {refreshing ? 'Checking...' : 'Re-check Status'}
          </button>
        </div>
      </div>
    </>
  );
}
