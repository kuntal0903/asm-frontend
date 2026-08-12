/**
 * ThreatModal.jsx
 * ─────────────────────────────────────────────────────────────────
 * Detail modal for viewing threat intelligence items.
 * Allows acknowledging threats, blocking malicious IPs, and copying IOCs.
 * ─────────────────────────────────────────────────────────────────
 */

import { useState } from 'react';
import {
  X, Copy, Check, AlertOctagon, Terminal
} from 'lucide-react';

export default function ThreatModal({ threat, onClose }) {
  const [acknowledged, setAcknowledged] = useState(false);
  const [ipBlocked, setIpBlocked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  if (!threat) return null;

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCopyIoc = () => {
    navigator.clipboard.writeText(`IOC: ${threat.title} - ${threat.desc}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBlockIp = () => {
    setIpBlocked(true);
    showToast('Firewall GeoBlock Rule Added for IOC IPs');
  };

  const handleAcknowledge = () => {
    setAcknowledged(true);
    showToast('Threat item acknowledged by Security Operations');
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
        aria-label={`Threat details for ${threat.title}`}
        aria-modal="true"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '620px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-hover)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8), var(--glow-red)',
          zIndex: 301,
          padding: '24px',
          color: 'var(--text-primary)',
          animation: 'scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {toastMsg && (
          <div
            style={{
              position: 'absolute',
              top: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--low)',
              color: 'var(--low)',
              padding: '6px 16px',
              borderRadius: 99,
              fontSize: 12,
              fontWeight: 600,
              boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
              zIndex: 310,
            }}
          >
            ✓ {toastMsg}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 'var(--radius-md)',
                background: threat.iconBg || 'rgba(239,68,68,0.15)',
                color: threat.iconColor || 'var(--critical)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <AlertOctagon size={24} />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Threat Intelligence Feed · {threat.time || 'Live'}
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>{threat.title}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close dialog"
            style={{
              background: 'var(--bg-raised)',
              border: '1px solid var(--border)',
              borderRadius: 6,
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              cursor: 'pointer',
            }}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ background: 'var(--bg-raised)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', marginBottom: 20 }}>
          <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 6, color: 'var(--text-primary)' }}>Threat Advisory Summary</h4>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{threat.desc}</p>
        </div>

        <div style={{ marginBottom: 20 }}>
          <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Terminal size={14} color="var(--neon-cyan)" /> Observed Indicators of Compromise (IOCs)
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontFamily: 'monospace', fontSize: 12 }}>
            <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 6, border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
              <span>IP Address Range: 185.220.101.0/24</span>
              <span style={{ color: 'var(--critical)' }}>Malicious C2</span>
            </div>
            <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 6, border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
              <span>SHA256: 4f82a901c8723b...</span>
              <span style={{ color: 'var(--high)' }}>AsyncRAT Variant</span>
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 16,
            borderTop: '1px solid var(--border)',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <button onClick={handleCopyIoc} className="btn btn--ghost" style={{ fontSize: 12 }}>
            {copied ? <Check size={14} color="var(--low)" /> : <Copy size={14} />}
            {copied ? 'Copied IOCs' : 'Copy IOC Data'}
          </button>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={handleBlockIp}
              disabled={ipBlocked}
              className="btn btn--ghost"
              style={{ fontSize: 12, color: ipBlocked ? 'var(--low)' : 'var(--critical)' }}
            >
              {ipBlocked ? '✓ IP Blocked' : '🚫 Block Malicious IPs'}
            </button>

            <button
              onClick={handleAcknowledge}
              disabled={acknowledged}
              className="btn btn--primary"
              style={{ fontSize: 12 }}
            >
              {acknowledged ? '✓ Acknowledged' : 'Acknowledge Threat'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
