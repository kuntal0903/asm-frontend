/**
 * ThreatFeed.jsx
 * ─────────────────────────────────────────────────────────────────
 * Live threat intelligence feed panel.
 * - Color-coded threat category icons
 * - Timestamp display
 * - Expandable descriptions
 * ─────────────────────────────────────────────────────────────────
 */

import { AlertTriangle, Globe, Zap, Bug, Eye, Lock } from 'lucide-react';

/** Mock threat feed data — replace with API response */
const MOCK_THREATS = [
  {
    id: 1,
    icon: Globe,
    iconColor: 'var(--critical)',
    iconBg:    'rgba(239, 68, 68, 0.12)',
    title:     'Ransomware Campaign Detected',
    desc:      'LockBit 3.0 affiliate observed targeting financial sector with exposed RDP endpoints.',
    time:      '4m ago',
  },
  {
    id: 2,
    icon: Zap,
    iconColor: 'var(--high)',
    iconBg:    'rgba(249, 115, 22, 0.12)',
    title:     'Zero-Day Exploit in Wild',
    desc:      'PoC for CVE-2024-21413 (Outlook RCE) published on exploit-db. Patch immediately.',
    time:      '18m ago',
  },
  {
    id: 3,
    icon: Eye,
    iconColor: 'var(--accent-purple)',
    iconBg:    'rgba(139, 92, 246, 0.12)',
    title:     'APT29 Spearphishing Wave',
    desc:      'Cozy Bear targeting government contractors. Phishing domains spoofing corp email.',
    time:      '1h ago',
  },
  {
    id: 4,
    icon: Bug,
    iconColor: 'var(--medium)',
    iconBg:    'rgba(234, 179, 8, 0.12)',
    title:     'Malware: AsyncRAT Variant',
    desc:      'New AsyncRAT variant using Discord C2. 3 internal hosts flagged by EDR.',
    time:      '2h ago',
  },
  {
    id: 5,
    icon: Lock,
    iconColor: 'var(--accent-blue)',
    iconBg:    'rgba(59, 130, 246, 0.12)',
    title:     'Credential Stuffing Attempt',
    desc:      '14,200 login attempts against VPN portal from 87 unique IPs. GeoBlock triggered.',
    time:      '3h ago',
  },
];

/**
 * ThreatFeed Component
 *
 * @param {Object}    props
 * @param {Array}     props.threats     - Array of threat objects (falls back to mock)
 * @param {Function}  props.onItemClick - (threat) => callback when item clicked
 */
export default function ThreatFeed({ threats, onItemClick }) {
  const items = threats || MOCK_THREATS;

  return (
    <div>
      {items.map((threat) => {
        const Icon = threat.icon;
        return (
          <div
            key={threat.id}
            className="threat-item"
            onClick={() => onItemClick && onItemClick(threat)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onItemClick && onItemClick(threat)}
            aria-label={threat.title}
          >
            {/* Icon */}
            <div
              className="threat-item__icon"
              style={{ background: threat.iconBg, color: threat.iconColor }}
            >
              <Icon size={16} />
            </div>

            {/* Content */}
            <div className="threat-item__content">
              <div className="threat-item__title">{threat.title}</div>
              <div className="threat-item__desc">{threat.desc}</div>
            </div>

            {/* Timestamp */}
            <div className="threat-item__time">{threat.time}</div>
          </div>
        );
      })}
    </div>
  );
}
