/**
 * SettingsPage.jsx
 * ─────────────────────────────────────────────────────────────────
 * Full Settings page for ASM Shield Dashboard.
 *
 * Sections:
 *  1. Profile          — Display name, email, bio, avatar
 *  2. Security         — 2FA, password, session management
 *  3. API Keys         — Generate, revoke, copy API tokens
 *  4. Integrations     — SIEM, SOAR, ticketing, cloud connectors
 *  5. Scan Schedule    — Frequency & target configuration
 *  6. Notifications    — Channels, thresholds, alert rules
 *  7. Appearance       — Theme, density, timezone
 *  8. Team             — User management, roles, invites
 *  9. Danger Zone      — Data purge, account actions
 *
 * Each section is a self-contained sub-component for easy maintenance.
 * Backend integration points are clearly marked with comments.
 * ─────────────────────────────────────────────────────────────────
 */

import { useState, useCallback } from 'react';
import {
  User, Shield, Key, Plug, Calendar, Bell, Palette,
  Users, AlertTriangle, Check, Copy, RefreshCw, Plus,
  Trash2, Eye, EyeOff, Mail, MessageSquare, Link2, Globe,
  Clock, ChevronRight, LogOut, Download, Cpu,
} from 'lucide-react';

import '../styles/settings.css';

/* ═══════════════════════════════════════════════════════════════════
   SECTION NAVIGATION CONFIG
═══════════════════════════════════════════════════════════════════ */
const NAV_SECTIONS = [
  { group: 'ACCOUNT',  items: [
    { id: 'profile',      label: 'Profile',       icon: User },
    { id: 'security',     label: 'Security',      icon: Shield },
    { id: 'api-keys',     label: 'API Keys',      icon: Key },
  ]},
  { group: 'PLATFORM', items: [
    { id: 'integrations', label: 'Integrations',  icon: Plug },
    { id: 'scan',         label: 'Scan Schedule', icon: Calendar },
    { id: 'notifications',label: 'Notifications', icon: Bell },
  ]},
  { group: 'SYSTEM',   items: [
    { id: 'appearance',   label: 'Appearance',    icon: Palette },
    { id: 'team',         label: 'Team',          icon: Users },
    { id: 'danger',       label: 'Danger Zone',   icon: AlertTriangle },
  ]},
];

/* ═══════════════════════════════════════════════════════════════════
   SUB-COMPONENTS — each maps to a settings section
═══════════════════════════════════════════════════════════════════ */

/** ── 1. Profile ─────────────────────────────────────────────────── */
function ProfileSection({ onSave }) {
  const [form, setForm] = useState({
    displayName: 'Alex Dawson',
    email: 'alex.dawson@corp.internal',
    role: 'Security Engineer',
    bio: 'Lead security engineer managing the enterprise attack surface monitoring programme.',
    timezone: 'Asia/Kolkata',
  });

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="settings-section" id="settings-profile">
      <div className="settings-section__header">
        <div className="settings-section__icon" style={{ background: 'rgba(139,92,246,0.12)', color: 'var(--accent-purple)' }}>
          <User size={16} />
        </div>
        <div className="settings-section__titles">
          <h3>Profile</h3>
          <p>Manage your personal account details and display preferences</p>
        </div>
      </div>

      <div className="settings-section__body">
        {/* Avatar */}
        <div className="profile-avatar-section">
          <div className="profile-avatar-large">AD</div>
          <div className="profile-avatar-info">
            <h4>Alex Dawson</h4>
            <p>Profile photo is auto-generated from your initials</p>
            <button className="btn btn--ghost" style={{ fontSize: 12, padding: '6px 14px' }} id="upload-avatar-btn">
              Upload Photo
            </button>
          </div>
        </div>

        {/* Name */}
        <div className="field-row">
          <div className="field-label">Display Name<span>Shown across the dashboard</span></div>
          <input id="settings-display-name" className="s-input" value={form.displayName}
            onChange={e => update('displayName', e.target.value)} />
        </div>

        {/* Email */}
        <div className="field-row">
          <div className="field-label">Email Address<span>Used for login and notifications</span></div>
          <input id="settings-email" className="s-input" type="email" value={form.email}
            onChange={e => update('email', e.target.value)} />
        </div>

        {/* Role / Title */}
        <div className="field-row">
          <div className="field-label">Job Title<span>Displayed on team roster</span></div>
          <input id="settings-role" className="s-input" value={form.role}
            onChange={e => update('role', e.target.value)} />
        </div>

        {/* Bio */}
        <div className="field-row">
          <div className="field-label">Bio<span>Short description (optional)</span></div>
          <textarea id="settings-bio" className="s-textarea" value={form.bio}
            onChange={e => update('bio', e.target.value)} />
        </div>

        {/* Timezone */}
        <div className="field-row">
          <div className="field-label">Timezone<span>Used for all timestamps</span></div>
          <select id="settings-timezone" className="s-select" value={form.timezone}
            onChange={e => update('timezone', e.target.value)}>
            {['Asia/Kolkata','UTC','America/New_York','America/Los_Angeles','Europe/London','Europe/Paris','Asia/Tokyo','Australia/Sydney'].map(tz => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
        </div>

        <div className="settings-footer">
          <button className="btn btn--ghost" id="cancel-profile-btn">Cancel</button>
          <button className="btn btn--primary" id="save-profile-btn" onClick={onSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

/** ── 2. Security ─────────────────────────────────────────────────── */
function SecuritySection({ onSave }) {
  const [showOldPwd, setShowOldPwd]  = useState(false);
  const [showNewPwd, setShowNewPwd]  = useState(false);
  const [mfa,        setMfa]         = useState(true);
  const [ssoEnabled, setSsoEnabled]  = useState(false);
  const [ipLock,     setIpLock]      = useState(false);
  const [auditLog,   setAuditLog]    = useState(true);

  return (
    <div className="settings-section" id="settings-security">
      <div className="settings-section__header">
        <div className="settings-section__icon" style={{ background: 'rgba(59,130,246,0.12)', color: 'var(--accent-blue)' }}>
          <Shield size={16} />
        </div>
        <div className="settings-section__titles">
          <h3>Security</h3>
          <p>Password, multi-factor authentication, and session controls</p>
        </div>
      </div>

      <div className="settings-section__body">
        {/* Change Password */}
        <div className="field-row">
          <div className="field-label">Current Password</div>
          <div style={{ position: 'relative' }}>
            <input id="settings-old-password" className="s-input" type={showOldPwd ? 'text' : 'password'}
              placeholder="Enter current password" style={{ paddingRight: 40 }} />
            <button onClick={() => setShowOldPwd(v => !v)}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              {showOldPwd ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        <div className="field-row">
          <div className="field-label">New Password<span>Min 12 chars, mixed case + symbol</span></div>
          <div style={{ position: 'relative' }}>
            <input id="settings-new-password" className="s-input" type={showNewPwd ? 'text' : 'password'}
              placeholder="Enter new password" style={{ paddingRight: 40 }} />
            <button onClick={() => setShowNewPwd(v => !v)}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              {showNewPwd ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        <div className="settings-divider" />

        {/* MFA Toggle */}
        <label className="toggle-row" htmlFor="toggle-mfa" id="mfa-toggle-row">
          <div className="toggle-row__info">
            <div className="toggle-row__label">Multi-Factor Authentication (TOTP)</div>
            <div className="toggle-row__desc">Require a one-time code in addition to your password</div>
          </div>
          <label className="toggle">
            <input id="toggle-mfa" type="checkbox" checked={mfa} onChange={e => setMfa(e.target.checked)} />
            <div className="toggle__track" />
            <div className="toggle__thumb" />
          </label>
        </label>

        {/* SSO Toggle */}
        <label className="toggle-row" htmlFor="toggle-sso" id="sso-toggle-row">
          <div className="toggle-row__info">
            <div className="toggle-row__label">Single Sign-On (SAML / OIDC)</div>
            <div className="toggle-row__desc">Authenticate via your corporate identity provider</div>
          </div>
          <label className="toggle">
            <input id="toggle-sso" type="checkbox" checked={ssoEnabled} onChange={e => setSsoEnabled(e.target.checked)} />
            <div className="toggle__track" />
            <div className="toggle__thumb" />
          </label>
        </label>

        {/* IP Allow-list Toggle */}
        <label className="toggle-row" htmlFor="toggle-iplock" id="iplock-toggle-row">
          <div className="toggle-row__info">
            <div className="toggle-row__label">IP Allow-list Enforcement</div>
            <div className="toggle-row__desc">Restrict login to trusted IP ranges only</div>
          </div>
          <label className="toggle">
            <input id="toggle-iplock" type="checkbox" checked={ipLock} onChange={e => setIpLock(e.target.checked)} />
            <div className="toggle__track" />
            <div className="toggle__thumb" />
          </label>
        </label>

        {/* Audit Log Toggle */}
        <label className="toggle-row" htmlFor="toggle-audit" id="audit-toggle-row">
          <div className="toggle-row__info">
            <div className="toggle-row__label">Security Audit Logging</div>
            <div className="toggle-row__desc">Log all login events, exports, and config changes</div>
          </div>
          <label className="toggle">
            <input id="toggle-audit" type="checkbox" checked={auditLog} onChange={e => setAuditLog(e.target.checked)} />
            <div className="toggle__track" />
            <div className="toggle__thumb" />
          </label>
        </label>

        {/* Session timeout */}
        <div className="field-row">
          <div className="field-label">Session Timeout<span>Auto-logout after inactivity</span></div>
          <select id="settings-session-timeout" className="s-select">
            {['15 minutes','30 minutes','1 hour','4 hours','8 hours','Never'].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>

        <div className="settings-footer">
          <button className="btn btn--ghost" id="revoke-sessions-btn">
            <LogOut size={13} /> Revoke All Sessions
          </button>
          <button className="btn btn--primary" id="save-security-btn" onClick={onSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

/** ── 3. API Keys ──────────────────────────────────────────────────── */
function ApiKeysSection({ onSave }) {
  const [masked, setMasked] = useState(true);
  const [copied, setCopied] = useState(null);

  const MOCK_KEYS = [
    { id: 'k1', name: 'Production API Key',    value: 'asm_sk_prod_a8f2c9d1e4b7...',  created: '2024-06-01', lastUsed: '2m ago',  scopes: ['read', 'write', 'export'] },
    { id: 'k2', name: 'CI/CD Integration Key', value: 'asm_sk_ci_3e6f1a8b5c9d...', created: '2024-05-12', lastUsed: '1h ago',  scopes: ['read'] },
    { id: 'k3', name: 'SIEM Connector Key',    value: 'asm_sk_siem_7b4e2f9c1d8a...', created: '2024-04-30', lastUsed: '4d ago',  scopes: ['read', 'stream'] },
  ];

  const handleCopy = (id, value) => {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="settings-section" id="settings-api-keys">
      <div className="settings-section__header">
        <div className="settings-section__icon" style={{ background: 'rgba(6,182,212,0.12)', color: 'var(--accent-cyan)' }}>
          <Key size={16} />
        </div>
        <div className="settings-section__titles">
          <h3>API Keys</h3>
          <p>Generate and manage tokens for programmatic access to the ASM API</p>
        </div>
      </div>

      <div className="settings-section__body">
        {/* Key list */}
        {MOCK_KEYS.map(key => (
          <div className="api-key-row" key={key.id}>
            <div className="api-key-row__info">
              <div className="api-key-row__name">{key.name}</div>
              <div className="api-key-row__value">
                {masked ? key.value.replace(/[a-z0-9]/gi, '•').slice(0, 28) + '••••' : key.value}
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                {key.scopes.map(s => (
                  <span key={s} style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 99,
                    background: 'rgba(59,130,246,0.1)', color: 'var(--accent-blue)', border: '1px solid rgba(59,130,246,0.2)',
                    letterSpacing: '0.06em', textTransform: 'uppercase' }}>{s}</span>
                ))}
                <span style={{ fontSize: 10, color: 'var(--text-muted)', marginLeft: 4, fontFamily: 'monospace' }}>
                  · Last used {key.lastUsed}
                </span>
              </div>
            </div>

            <div className="api-key-row__meta">
              <button id={`copy-key-${key.id}`}
                className="btn btn--ghost" style={{ padding: '6px 10px', fontSize: 11 }}
                onClick={() => handleCopy(key.id, key.value)}
                aria-label="Copy API key"
              >
                {copied === key.id ? <Check size={13} color="var(--low)" /> : <Copy size={13} />}
              </button>
              <button id={`revoke-key-${key.id}`}
                className="btn btn--danger" style={{ padding: '6px 10px', fontSize: 11 }}
                aria-label="Revoke API key"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}

        <div className="settings-footer">
          <button className="btn btn--ghost" id="toggle-mask-btn" onClick={() => setMasked(v => !v)}>
            {masked ? <Eye size={13} /> : <EyeOff size={13} />}
            {masked ? 'Reveal Keys' : 'Mask Keys'}
          </button>
          {/* ── BACKEND: POST /api/v1/keys to generate a new key ── */}
          <button className="btn btn--primary" id="generate-api-key-btn" onClick={onSave}>
            <Plus size={13} /> Generate New Key
          </button>
        </div>
      </div>
    </div>
  );
}

/** ── 4. Integrations ─────────────────────────────────────────────── */
function IntegrationsSection() {
  const INTEGRATIONS = [
    { id: 'splunk',      name: 'Splunk SIEM',      emoji: '🔍', desc: 'Stream events and findings to Splunk Enterprise or Cloud.',        status: 'connected' },
    { id: 'jira',        name: 'Jira',             emoji: '🎯', desc: 'Auto-create tickets for new critical vulnerabilities.',            status: 'connected' },
    { id: 'pagerduty',   name: 'PagerDuty',        emoji: '📟', desc: 'Trigger on-call alerts when critical findings are detected.',      status: 'warning' },
    { id: 'slack',       name: 'Slack',            emoji: '💬', desc: 'Post real-time alerts and digest summaries to channels.',          status: 'connected' },
    { id: 'aws',         name: 'AWS Security Hub', emoji: '☁️', desc: 'Sync findings with AWS Security Hub for unified visibility.',     status: 'disconnected' },
    { id: 'crowdstrike', name: 'CrowdStrike',      emoji: '🦅', desc: 'Pull endpoint telemetry and host vulnerability data.',            status: 'disconnected' },
    { id: 'servicenow',  name: 'ServiceNow',       emoji: '🔧', desc: 'Create and update ITSM incidents via the Now Platform.',          status: 'disconnected' },
    { id: 'tenable',     name: 'Tenable.io',       emoji: '🔬', desc: 'Import Nessus scan results and asset data automatically.',       status: 'connected' },
    { id: 'teams',       name: 'Microsoft Teams',  emoji: '🟦', desc: 'Send alert digests and approval requests to Teams channels.',     status: 'disconnected' },
  ];

  return (
    <div className="settings-section" id="settings-integrations">
      <div className="settings-section__header">
        <div className="settings-section__icon" style={{ background: 'rgba(34,197,94,0.1)', color: 'var(--low)' }}>
          <Plug size={16} />
        </div>
        <div className="settings-section__titles">
          <h3>Integrations</h3>
          <p>Connect ASM Shield to your security stack, ticketing systems, and cloud platforms</p>
        </div>
      </div>

      <div className="settings-section__body">
        <div className="integrations-grid">
          {INTEGRATIONS.map(intg => (
            <div
              key={intg.id}
              id={`integration-card-${intg.id}`}
              className={`integration-card integration-card--${intg.status}`}
            >
              <div className="integration-card__header">
                <div className="integration-card__logo"
                  style={{ background: 'var(--bg-elevated)', fontSize: 22 }}>
                  {intg.emoji}
                </div>
                <span className={`integration-status-badge integration-status-badge--${intg.status}`}>
                  {intg.status === 'warning' ? '⚠ Warning' : intg.status}
                </span>
              </div>
              <div>
                <div className="integration-card__name">{intg.name}</div>
                <div className="integration-card__desc">{intg.desc}</div>
              </div>
              <div className="integration-card__action">
                {intg.status === 'connected' ? (
                  <>
                    <button id={`configure-${intg.id}`} className="integration-btn">Configure</button>
                    {/* ── BACKEND: DELETE /api/v1/integrations/:id ── */}
                    <button id={`disconnect-${intg.id}`} className="integration-btn integration-btn--disconnect">Disconnect</button>
                  </>
                ) : intg.status === 'warning' ? (
                  <>
                    <button id={`repair-${intg.id}`} className="integration-btn integration-btn--connect">Repair</button>
                    <button id={`disconnect-warn-${intg.id}`} className="integration-btn integration-btn--disconnect">Remove</button>
                  </>
                ) : (
                  /* ── BACKEND: POST /api/v1/integrations/:id/connect ── */
                  <button id={`connect-${intg.id}`} className="integration-btn integration-btn--connect" style={{ flex: 'none', width: '100%' }}>
                    + Connect
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** ── 5. Scan Schedule ────────────────────────────────────────────── */
function ScanScheduleSection({ onSave }) {
  const [freq, setFreq]       = useState('daily');
  const [scanTime, setScanTime] = useState('02:00');
  const [scanDepth, setScanDepth] = useState('standard');
  const [agentless, setAgentless] = useState(true);

  const FREQS = [
    { id: 'continuous', label: 'Continuous',  desc: 'Scan every 15 min' },
    { id: 'hourly',     label: 'Hourly',       desc: 'Full scan each hour' },
    { id: 'daily',      label: 'Daily',        desc: 'Once per day (recommended)' },
    { id: 'weekly',     label: 'Weekly',       desc: 'Every Sunday at 02:00' },
    { id: 'monthly',    label: 'Monthly',      desc: 'First day of each month' },
    { id: 'manual',     label: 'Manual Only',  desc: 'Triggered via UI or API' },
  ];

  return (
    <div className="settings-section" id="settings-scan">
      <div className="settings-section__header">
        <div className="settings-section__icon" style={{ background: 'rgba(234,179,8,0.1)', color: 'var(--medium)' }}>
          <Calendar size={16} />
        </div>
        <div className="settings-section__titles">
          <h3>Scan Schedule</h3>
          <p>Configure automated asset discovery and vulnerability scan frequency</p>
        </div>
      </div>

      <div className="settings-section__body">
        {/* Frequency picker */}
        <div>
          <div className="section-title" style={{ marginBottom: 12 }}>Scan Frequency</div>
          <div className="schedule-grid">
            {FREQS.map(f => (
              <div
                key={f.id}
                id={`freq-${f.id}`}
                className={`schedule-card ${freq === f.id ? 'selected' : ''}`}
                onClick={() => setFreq(f.id)}
                role="radio"
                aria-checked={freq === f.id}
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setFreq(f.id)}
              >
                <div className="schedule-card__check">
                  {freq === f.id && <Check size={10} color="white" />}
                </div>
                <div className="schedule-card__freq">{f.label}</div>
                <div className="schedule-card__desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Start time */}
        <div className="field-row">
          <div className="field-label">Scan Start Time<span>UTC time for scheduled scans</span></div>
          <input id="settings-scan-time" className="s-input" type="time" value={scanTime}
            onChange={e => setScanTime(e.target.value)} style={{ fontFamily: 'JetBrains Mono, monospace' }} />
        </div>

        {/* Scan depth */}
        <div className="field-row">
          <div className="field-label">Scan Depth<span>Trade-off between speed and coverage</span></div>
          <select id="settings-scan-depth" className="s-select" value={scanDepth}
            onChange={e => setScanDepth(e.target.value)}>
            <option value="light">Light — Port scan + banner grab</option>
            <option value="standard">Standard — Full service enumeration (recommended)</option>
            <option value="deep">Deep — Full vuln check + auth probing</option>
          </select>
        </div>

        {/* Scan targets */}
        <div className="field-row">
          <div className="field-label">Target Scope<span>CIDR ranges or domain patterns</span></div>
          <textarea id="settings-scan-targets" className="s-textarea"
            defaultValue={"10.0.0.0/8\n172.16.0.0/12\n192.168.0.0/16\n*.corp.internal"}
            style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }} />
        </div>

        {/* Agentless toggle */}
        <label className="toggle-row" htmlFor="toggle-agentless" id="agentless-toggle-row">
          <div className="toggle-row__info">
            <div className="toggle-row__label">Agentless Scanning</div>
            <div className="toggle-row__desc">Scan without deploying agents — uses network-level discovery only</div>
          </div>
          <label className="toggle">
            <input id="toggle-agentless" type="checkbox" checked={agentless} onChange={e => setAgentless(e.target.checked)} />
            <div className="toggle__track" />
            <div className="toggle__thumb" />
          </label>
        </label>

        <div className="settings-footer">
          {/* ── BACKEND: POST /api/v1/scans/trigger to run immediately ── */}
          <button className="btn btn--ghost" id="run-scan-now-btn">
            <Cpu size={13} /> Run Scan Now
          </button>
          {/* ── BACKEND: PUT /api/v1/settings/schedule ── */}
          <button className="btn btn--primary" id="save-scan-btn" onClick={onSave}>Save Schedule</button>
        </div>
      </div>
    </div>
  );
}

/** ── 6. Notifications ────────────────────────────────────────────── */
function NotificationsSection({ onSave }) {
  const [channels, setChannels] = useState({ email: true, slack: true, webhook: false, pagerduty: false });
  const [digest, setDigest] = useState(true);
  const [criticalOnly, setCriticalOnly] = useState(false);
  const [thresholds, setThresholds] = useState({ critical: 80, high: 60, medium: 40 });

  const toggleChannel = (ch) => setChannels(c => ({ ...c, [ch]: !c[ch] }));
  const updateThreshold = (k, v) => setThresholds(t => ({ ...t, [k]: v }));

  const CHANNELS = [
    { id: 'email',     label: 'Email',     icon: Mail },
    { id: 'slack',     label: 'Slack',     icon: MessageSquare },
    { id: 'webhook',   label: 'Webhook',   icon: Link2 },
    { id: 'pagerduty', label: 'PagerDuty', icon: Globe },
  ];

  return (
    <div className="settings-section" id="settings-notifications">
      <div className="settings-section__header">
        <div className="settings-section__icon" style={{ background: 'rgba(249,115,22,0.1)', color: 'var(--high)' }}>
          <Bell size={16} />
        </div>
        <div className="settings-section__titles">
          <h3>Notifications</h3>
          <p>Configure alert channels, thresholds, and digest preferences</p>
        </div>
      </div>

      <div className="settings-section__body">
        {/* Channels */}
        <div>
          <div className="section-title" style={{ marginBottom: 12 }}>Alert Channels</div>
          <div className="channel-list">
            {CHANNELS.map(ch => {
              const Icon = ch.icon;
              return (
                <div
                  key={ch.id}
                  id={`channel-pill-${ch.id}`}
                  className={`channel-pill ${channels[ch.id] ? 'active' : ''}`}
                  onClick={() => toggleChannel(ch.id)}
                  role="checkbox"
                  aria-checked={channels[ch.id]}
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && toggleChannel(ch.id)}
                >
                  <span className="channel-pill__dot" />
                  <Icon size={13} />
                  {ch.label}
                </div>
              );
            })}
          </div>
        </div>

        {/* Email recipient */}
        {channels.email && (
          <div className="field-row">
            <div className="field-label">Alert Email<span>Separate multiple with commas</span></div>
            <input id="settings-alert-email" className="s-input"
              defaultValue="sec-team@corp.internal, alex.dawson@corp.internal"
              placeholder="security@example.com" />
          </div>
        )}

        {/* Webhook URL */}
        {channels.webhook && (
          <div className="field-row">
            <div className="field-label">Webhook URL<span>POST JSON payload on each alert</span></div>
            <input id="settings-webhook-url" className="s-input"
              placeholder="https://hooks.example.com/asm-alerts"
              style={{ fontFamily: 'monospace', fontSize: 12 }} />
          </div>
        )}

        <div className="settings-divider" />

        {/* Severity thresholds */}
        <div>
          <div className="section-title" style={{ marginBottom: 14 }}>Alert Severity Thresholds</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { key: 'critical', label: 'Critical', color: 'var(--critical)', cls: 'critical' },
              { key: 'high',     label: 'High',     color: 'var(--high)',     cls: 'high' },
              { key: 'medium',   label: 'Medium',   color: 'var(--medium)',   cls: 'medium' },
            ].map(({ key, label, color, cls }) => (
              <div className="threshold-item" key={key}>
                <div className="threshold-item__label" style={{ color }}>{label}</div>
                <input
                  id={`threshold-${key}`}
                  type="range" min={0} max={100}
                  value={thresholds[key]}
                  onChange={e => updateThreshold(key, Number(e.target.value))}
                  className={`threshold-slider threshold-slider--${cls}`}
                  style={{ '--val': `${thresholds[key]}%` }}
                />
                <div className="threshold-item__value" style={{ color }}>{thresholds[key]}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="settings-divider" />

        {/* Digest toggle */}
        <label className="toggle-row" htmlFor="toggle-digest" id="digest-toggle-row">
          <div className="toggle-row__info">
            <div className="toggle-row__label">Daily Security Digest</div>
            <div className="toggle-row__desc">Receive a morning summary email of the past 24h findings</div>
          </div>
          <label className="toggle">
            <input id="toggle-digest" type="checkbox" checked={digest} onChange={e => setDigest(e.target.checked)} />
            <div className="toggle__track" />
            <div className="toggle__thumb" />
          </label>
        </label>

        {/* Critical only toggle */}
        <label className="toggle-row" htmlFor="toggle-critical-only" id="critical-only-toggle-row">
          <div className="toggle-row__info">
            <div className="toggle-row__label">Critical Alerts Only</div>
            <div className="toggle-row__desc">Suppress High / Medium / Low notifications to reduce noise</div>
          </div>
          <label className="toggle">
            <input id="toggle-critical-only" type="checkbox" checked={criticalOnly} onChange={e => setCriticalOnly(e.target.checked)} />
            <div className="toggle__track" />
            <div className="toggle__thumb" />
          </label>
        </label>

        <div className="settings-footer">
          {/* ── BACKEND: POST /api/v1/notifications/test ── */}
          <button className="btn btn--ghost" id="test-notification-btn">Send Test Alert</button>
          <button className="btn btn--primary" id="save-notifications-btn" onClick={onSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

/** ── 7. Appearance ───────────────────────────────────────────────── */
function AppearanceSection({ onSave }) {
  const [density, setDensity]         = useState('comfortable');
  const [dateFormat, setDateFormat]   = useState('YYYY-MM-DD');
  const [animations, setAnimations]   = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="settings-section" id="settings-appearance">
      <div className="settings-section__header">
        <div className="settings-section__icon" style={{ background: 'rgba(139,92,246,0.1)', color: 'var(--accent-purple)' }}>
          <Palette size={16} />
        </div>
        <div className="settings-section__titles">
          <h3>Appearance</h3>
          <p>Customize the visual density, layout, and date formats</p>
        </div>
      </div>

      <div className="settings-section__body">
        {/* Theme — always dark in this app */}
        <div className="field-row">
          <div className="field-label">Theme<span>Colour scheme for the UI</span></div>
          <select id="settings-theme" className="s-select" defaultValue="dark">
            <option value="dark">Dark (default)</option>
            <option value="darker">Darker / OLED Black</option>
            <option value="midnight">Midnight Blue</option>
          </select>
        </div>

        {/* Density */}
        <div className="field-row">
          <div className="field-label">Data Density<span>Controls table row spacing</span></div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['compact', 'comfortable', 'spacious'].map(d => (
              <button
                key={d}
                id={`density-${d}`}
                className={`panel__action-btn ${density === d ? 'active' : ''}`}
                onClick={() => setDensity(d)}
                style={{ flex: 1, textTransform: 'capitalize' }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Date format */}
        <div className="field-row">
          <div className="field-label">Date Format</div>
          <select id="settings-date-format" className="s-select" value={dateFormat}
            onChange={e => setDateFormat(e.target.value)}>
            <option value="YYYY-MM-DD">2026-08-08 (ISO 8601)</option>
            <option value="MM/DD/YYYY">08/08/2026 (US)</option>
            <option value="DD/MM/YYYY">08/08/2026 (EU)</option>
            <option value="relative">Relative (2h ago)</option>
          </select>
        </div>

        {/* Animations */}
        <label className="toggle-row" htmlFor="toggle-animations" id="animations-toggle-row">
          <div className="toggle-row__info">
            <div className="toggle-row__label">UI Animations</div>
            <div className="toggle-row__desc">Card lift effects, fade-ins and transitions</div>
          </div>
          <label className="toggle">
            <input id="toggle-animations" type="checkbox" checked={animations} onChange={e => setAnimations(e.target.checked)} />
            <div className="toggle__track" />
            <div className="toggle__thumb" />
          </label>
        </label>

        {/* Default sidebar open */}
        <label className="toggle-row" htmlFor="toggle-sidebar-default" id="sidebar-default-toggle-row">
          <div className="toggle-row__info">
            <div className="toggle-row__label">Expanded Sidebar by Default</div>
            <div className="toggle-row__desc">Start with the full sidebar or the collapsed icon view</div>
          </div>
          <label className="toggle">
            <input id="toggle-sidebar-default" type="checkbox" checked={sidebarOpen} onChange={e => setSidebarOpen(e.target.checked)} />
            <div className="toggle__track" />
            <div className="toggle__thumb" />
          </label>
        </label>

        <div className="settings-footer">
          <button className="btn btn--primary" id="save-appearance-btn" onClick={onSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

/** ── 8. Team ─────────────────────────────────────────────────────── */
function TeamSection() {
  const TEAM = [
    { id: 'u1', initials: 'AD', name: 'Alex Dawson',   email: 'alex.dawson@corp.internal',    role: 'admin',    status: 'active', joined: '2024-01-15', color: '#8b5cf6' },
    { id: 'u2', initials: 'PK', name: 'Priya Kumar',   email: 'priya.kumar@corp.internal',   role: 'analyst',  status: 'active', joined: '2024-02-10', color: '#3b82f6' },
    { id: 'u3', initials: 'JL', name: 'James Lin',     email: 'james.lin@corp.internal',     role: 'analyst',  status: 'active', joined: '2024-03-22', color: '#06b6d4' },
    { id: 'u4', initials: 'SR', name: 'Sofia Reyes',   email: 'sofia.reyes@corp.internal',   role: 'readonly', status: 'active', joined: '2024-05-01', color: '#f97316' },
    { id: 'u5', initials: 'MB', name: 'Marcus Brown',  email: 'marcus.brown@corp.internal',  role: 'viewer',   status: 'pending', joined: '2024-08-01', color: '#eab308' },
  ];

  return (
    <div className="settings-section" id="settings-team">
      <div className="settings-section__header">
        <div className="settings-section__icon" style={{ background: 'rgba(59,130,246,0.1)', color: 'var(--accent-blue)' }}>
          <Users size={16} />
        </div>
        <div className="settings-section__titles">
          <h3>Team</h3>
          <p>Manage users, roles, and access permissions</p>
        </div>
      </div>

      <div className="settings-section__body">
        <table className="team-table" role="table" aria-label="Team members">
          <thead>
            <tr>
              <th>Member</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {TEAM.map(user => (
              <tr key={user.id}>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar" style={{ background: user.color }}>{user.initials}</div>
                    <div>
                      <div className="user-name">{user.name}</div>
                      <div className="user-email">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`role-badge role-badge--${user.role}`}>{user.role}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className={`status-dot status-dot--${user.status === 'active' ? 'live' : 'warning'}`} />
                    <span style={{ fontSize: 12, textTransform: 'capitalize' }}>{user.status}</span>
                  </div>
                </td>
                <td>
                  <span className="mono" style={{ fontSize: 11 }}>{user.joined}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button id={`edit-user-${user.id}`} className="btn btn--ghost"
                      style={{ padding: '4px 10px', fontSize: 11 }} aria-label="Edit user role">
                      Edit
                    </button>
                    {user.id !== 'u1' && (
                      /* ── BACKEND: DELETE /api/v1/team/:userId ── */
                      <button id={`remove-user-${user.id}`} className="btn btn--danger"
                        style={{ padding: '4px 10px', fontSize: 11 }} aria-label="Remove user">
                        <Trash2 size={11} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="settings-footer">
          {/* ── BACKEND: POST /api/v1/team/invite ── */}
          <button className="btn btn--primary" id="invite-user-btn">
            <Plus size={13} /> Invite Member
          </button>
        </div>
      </div>
    </div>
  );
}

/** ── 9. Danger Zone ─────────────────────────────────────────────── */
function DangerZoneSection() {
  return (
    <div className="settings-section settings-section--danger" id="settings-danger">
      <div className="settings-section__header">
        <div className="settings-section__icon" style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--critical)' }}>
          <AlertTriangle size={16} />
        </div>
        <div className="settings-section__titles">
          <h3 style={{ color: 'var(--critical)' }}>Danger Zone</h3>
          <p>Irreversible and destructive actions — proceed with caution</p>
        </div>
      </div>

      <div className="settings-section__body">
        {/* Purge scan data */}
        <div className="danger-row">
          <div className="danger-row__info">
            <h4>Purge Historical Scan Data</h4>
            <p>Permanently delete all scan results older than 90 days. This cannot be undone.</p>
          </div>
          <button id="purge-scan-data-btn" className="btn btn--danger"
            style={{ flexShrink: 0 }} aria-label="Purge historical scan data">
            <Trash2 size={13} /> Purge Data
          </button>
        </div>

        {/* Export all data */}
        <div className="danger-row">
          <div className="danger-row__info">
            <h4>Export All Platform Data</h4>
            <p>Download a full archive of your assets, findings, and configuration as a ZIP.</p>
          </div>
          {/* ── BACKEND: GET /api/v1/export/full-archive ── */}
          <button id="export-all-data-btn" className="btn btn--ghost"
            style={{ flexShrink: 0 }} aria-label="Export all data">
            <Download size={13} /> Export Archive
          </button>
        </div>

        {/* Reset all settings */}
        <div className="danger-row">
          <div className="danger-row__info">
            <h4>Reset All Settings to Defaults</h4>
            <p>Restore all configuration, notification rules, and schedule settings to factory defaults.</p>
          </div>
          <button id="reset-settings-btn" className="btn btn--danger"
            style={{ flexShrink: 0 }} aria-label="Reset all settings">
            <RefreshCw size={13} /> Reset Settings
          </button>
        </div>

        {/* Delete account */}
        <div className="danger-row" style={{ borderColor: 'rgba(239,68,68,0.3)' }}>
          <div className="danger-row__info">
            <h4 style={{ color: 'var(--critical)' }}>Delete Organisation Account</h4>
            <p>Permanently delete this organisation and all associated data. This action is irreversible.</p>
          </div>
          {/* ── BACKEND: DELETE /api/v1/org — requires re-auth ── */}
          <button id="delete-account-btn" className="btn btn--danger"
            style={{ flexShrink: 0, background: 'rgba(239,68,68,0.2)', borderColor: 'rgba(239,68,68,0.5)' }}
            aria-label="Delete organisation account">
            <Trash2 size={13} /> Delete Org
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN SETTINGS PAGE
═══════════════════════════════════════════════════════════════════ */

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');
  const [showToast,     setShowToast]     = useState(false);

  /** Shared save handler — shows success toast */
  const handleSave = useCallback(() => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    // ── BACKEND: each section passes its own endpoint ──
  }, []);

  /** Scroll section into view */
  const scrollTo = (id) => {
    setActiveSection(id);
    document.getElementById(`settings-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="page-content">
      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className="page-header">
        <div className="page-header__left">
          <h1 className="page-header__title">
            Platform <span>Settings</span>
          </h1>
          <div className="page-header__subtitle">
            Manage account, security, integrations, and system preferences
          </div>
        </div>
      </div>

      {/* ── Two-column layout ───────────────────────────────────── */}
      <div className="settings-layout">

        {/* ── LEFT: sticky section nav ────────────────────────── */}
        <nav className="settings-nav" aria-label="Settings sections">
          {NAV_SECTIONS.map(group => (
            <div key={group.group}>
              <div className="settings-nav__group-label">{group.group}</div>
              {group.items.map(item => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    id={`settings-nav-${item.id}`}
                    className={`settings-nav__item ${activeSection === item.id ? 'active' : ''}`}
                    onClick={() => scrollTo(item.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && scrollTo(item.id)}
                    aria-current={activeSection === item.id ? 'true' : undefined}
                  >
                    <Icon size={15} />
                    {item.label}
                    <ChevronRight size={12} style={{ marginLeft: 'auto', opacity: 0.4 }} />
                  </div>
                );
              })}
            </div>
          ))}
        </nav>

        {/* ── RIGHT: settings sections ────────────────────────── */}
        <div className="settings-content">
          <ProfileSection       onSave={handleSave} />
          <SecuritySection      onSave={handleSave} />
          <ApiKeysSection       onSave={handleSave} />
          <IntegrationsSection  />
          <ScanScheduleSection  onSave={handleSave} />
          <NotificationsSection onSave={handleSave} />
          <AppearanceSection    onSave={handleSave} />
          <TeamSection          />
          <DangerZoneSection    />
        </div>
      </div>

      {/* ── Save Toast ───────────────────────────────────────────── */}
      {showToast && (
        <div className="save-toast" role="status" aria-live="polite">
          <Check size={15} />
          Settings saved successfully
        </div>
      )}
    </div>
  );
}
