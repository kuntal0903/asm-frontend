/**
 * AlertsPage.jsx
 * ─────────────────────────────────────────────────────────────────
 * Security Event Alerts Hub Page.
 * Interactive alerts log with status toggles, severity filters,
 * bulk mark as read/resolve actions, and toast feedback.
 * ─────────────────────────────────────────────────────────────────
 */

import { useState } from 'react';
import { ShieldAlert, X, Check, Trash2, Filter } from 'lucide-react';

const INITIAL_ALERTS = [
  { id: 'alt-1', severity: 'critical', title: 'Critical RCE Vulnerability Confirmed', asset: 'mail.corp.internal', time: '5m ago', status: 'Active', desc: 'CVE-2024-21413 confirmed on mail gateway. Immediate patch required.' },
  { id: 'alt-2', severity: 'critical', title: 'Auth Bypass Attempt Detected', asset: 'remote-access-01', time: '18m ago', status: 'Active', desc: 'CVE-2024-1709 exploitation traffic targeted port 443.' },
  { id: 'alt-3', severity: 'high', title: 'Brute Force / Credential Stuffing', asset: 'vpn-gateway.corp', time: '1h ago', status: 'Investigating', desc: '14,200 failed attempts from 87 unique IPs. GeoBlock active.' },
  { id: 'alt-4', severity: 'high', title: 'Unmanaged Port 3389 Exposed', asset: '10.12.4.87', time: '3h ago', status: 'Active', desc: 'RDP port exposed publicly without network ACL policy.' },
  { id: 'alt-5', severity: 'medium', title: 'SSL Certificate Expiring in 7 Days', asset: 'api.prod.svc', time: '5h ago', status: 'Resolved', desc: 'Auto-renewal ticket submitted for production SSL certificate.' },
];

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [filterSev, setFilterSev] = useState('All');
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleResolveAlert = (id) => {
    setAlerts(alerts.map((a) => (a.id === id ? { ...a, status: 'Resolved' } : a)));
    showToast('Alert marked as resolved');
  };

  const handleClearAlert = (id) => {
    setAlerts(alerts.filter((a) => a.id !== id));
    showToast('Alert dismissed');
  };

  const handleClearAll = () => {
    setAlerts([]);
    showToast('All alerts cleared');
  };

  const filtered = alerts.filter((a) => filterSev === 'All' || a.severity === filterSev.toLowerCase());

  return (
    <div className="page-content">
      {toastMsg && (
        <div style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 500, background: 'var(--bg-elevated)', border: '1px solid var(--low)', color: 'var(--low)', padding: '12px 20px', borderRadius: 'var(--radius-md)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', fontSize: 13, fontWeight: 600 }}>
          ✓ {toastMsg}
        </div>
      )}

      <div className="page-header">
        <div className="page-header__left">
          <h1 className="page-header__title">
            Security <span>Alerts</span>
          </h1>
          <p className="page-header__subtitle">
            Real-time security event notifications, escalations, and incident response tracking.
          </p>
        </div>

        {alerts.length > 0 && (
          <button className="btn btn--ghost" onClick={handleClearAll} aria-label="Clear all security alerts">
            <Trash2 size={14} /> Clear All Alerts
          </button>
        )}
      </div>

      <div className="panel" style={{ marginBottom: 20, padding: 16 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Filter size={14} style={{ color: 'var(--text-muted)' }} />
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Filter Severity:</span>
          {['All', 'Critical', 'High', 'Medium'].map((sev) => (
            <button
              key={sev}
              className={`panel__action-btn ${filterSev === sev ? 'active' : ''}`}
              onClick={() => setFilterSev(sev)}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      <div className="panel" style={{ padding: 0 }}>
        {filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
            No security alerts to display.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filtered.map((alt) => (
              <div
                key={alt.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 16,
                  borderBottom: '1px solid var(--border)',
                  background: alt.status === 'Resolved' ? 'rgba(255,255,255,0.01)' : 'var(--bg-surface)',
                  opacity: alt.status === 'Resolved' ? 0.65 : 1,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: alt.severity === 'critical' ? 'rgba(239,68,68,0.15)' : 'rgba(249,115,22,0.15)',
                      color: alt.severity === 'critical' ? 'var(--critical)' : 'var(--high)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <ShieldAlert size={18} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className={`severity-badge severity-badge--${alt.severity}`}>{alt.severity}</span>
                      <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>{alt.title}</span>
                      <span className="mono" style={{ fontSize: 11, color: 'var(--neon-blue)' }}>{alt.asset}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{alt.desc}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{alt.time}</span>
                  {alt.status !== 'Resolved' ? (
                    <button className="btn btn--ghost" style={{ fontSize: 11, padding: '4px 10px' }} onClick={() => handleResolveAlert(alt.id)}>
                      <Check size={12} color="var(--low)" /> Mark Resolved
                    </button>
                  ) : (
                    <span style={{ fontSize: 11, color: 'var(--low)', fontWeight: 700 }}>✓ Resolved</span>
                  )}
                  <button onClick={() => handleClearAlert(alt.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} aria-label="Dismiss alert">
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
