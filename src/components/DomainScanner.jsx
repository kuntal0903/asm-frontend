/**
 * DomainScanner.jsx
 * ─────────────────────────────────────────────────────────────────
 * Domain Enumeration Scanner Component
 *
 * Handles the full scan lifecycle:
 *   1. Domain input & validation (client-side)
 *   2. POST /api/v1/domain/scan  → get scan_id or immediate results
 *   3. Polls GET /api/v1/domain/scan/{id} until completed/failed
 *   4. Fetches GET /api/v1/domain/scan/{id}/report for full results
 *   5. Renders discovered assets grouped by type
 *
 * States: idle → loading → scanning (polling) → success | error
 * ─────────────────────────────────────────────────────────────────
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  Search, Globe, Server, Shield, Wifi, FileText,
  AlertTriangle, CheckCircle, Loader, RefreshCw,
  ChevronDown, ChevronUp, X, Activity,
} from 'lucide-react';

import domainService from '../services/domainService';
import { ApiError } from '../services/api';

// ── Constants ─────────────────────────────────────────────────────
const POLL_INTERVAL_MS = 4000;   // how often to poll scan status
const MAX_POLL_ATTEMPTS = 60;    // 60 × 4s = 4 min max wait

// Map backend AssetType enum → display label + icon component
const ASSET_TYPE_META = {
  root_domain:    { label: 'Root Domain',      icon: Globe },
  subdomain:      { label: 'Subdomains',        icon: Globe },
  ip_address:     { label: 'IP Addresses',      icon: Server },
  dns_record:     { label: 'DNS Records',        icon: Wifi },
  nameserver:     { label: 'Name Servers',       icon: Server },
  mail_server:    { label: 'Mail Servers',       icon: Server },
  certificate:    { label: 'Certificates',       icon: Shield },
  open_port:      { label: 'Open Ports',         icon: Activity },
  service:        { label: 'Services',           icon: Activity },
  http_header:    { label: 'HTTP Headers',       icon: FileText },
  technology:     { label: 'Technologies',       icon: FileText },
  cloud_provider: { label: 'Cloud Providers',    icon: Globe },
  cdn_provider:   { label: 'CDN Providers',      icon: Globe },
  waf:            { label: 'WAF Detected',       icon: Shield },
  admin_portal:   { label: 'Admin Portals',      icon: Shield },
  login_portal:   { label: 'Login Portals',      icon: Shield },
  staging_env:    { label: 'Staging Environments', icon: Server },
  api_endpoint:   { label: 'API Endpoints',      icon: Activity },
};

// ── Sub-component: AssetGroup ─────────────────────────────────────
function AssetGroup({ type, assets }) {
  const [open, setOpen] = useState(true);
  const meta = ASSET_TYPE_META[type] || { label: type, icon: Globe };
  const Icon = meta.icon;

  return (
    <div className="asset-group">
      <button
        className="asset-group__header"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        id={`asset-group-${type}`}
      >
        <div className="asset-group__title">
          <div className="asset-group__icon">
            <Icon size={13} />
          </div>
          <span>{meta.label}</span>
          <span className="asset-group__count">{assets.length}</span>
        </div>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {open && (
        <div className="asset-group__body">
          {assets.map((asset, idx) => (
            <div className="asset-row" key={asset.id || `${type}-${idx}`}>
              <span className="asset-row__value">{asset.value || asset.data || JSON.stringify(asset)}</span>
              {asset.lifecycle_status && (
                <span className={`asset-status asset-status--${asset.lifecycle_status}`}>
                  {asset.lifecycle_status}
                </span>
              )}
              {asset.metadata?.ip && (
                <span className="asset-row__meta">{asset.metadata.ip}</span>
              )}
              {asset.metadata?.port && (
                <span className="asset-row__meta">:{asset.metadata.port}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Sub-component: ScanResults ────────────────────────────────────
function ScanResults({ report }) {
  if (!report) return null;

  // Group assets by type
  const assets = report.assets || [];
  const grouped = {};
  for (const asset of assets) {
    const key = asset.asset_type || 'unknown';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(asset);
  }

  const totalAssets = assets.length;
  const summary = report.summary || {};

  return (
    <div className="scan-results" id="scan-results-panel">
      {/* Summary banner */}
      <div className="scan-summary">
        <div className="scan-summary__item">
          <span className="scan-summary__value">{totalAssets}</span>
          <span className="scan-summary__label">Total Assets</span>
        </div>
        <div className="scan-summary__item">
          <span className="scan-summary__value" style={{ color: 'var(--low)' }}>
            {grouped.subdomain?.length || 0}
          </span>
          <span className="scan-summary__label">Subdomains</span>
        </div>
        <div className="scan-summary__item">
          <span className="scan-summary__value" style={{ color: 'var(--accent-blue)' }}>
            {grouped.ip_address?.length || 0}
          </span>
          <span className="scan-summary__label">IPs</span>
        </div>
        <div className="scan-summary__item">
          <span className="scan-summary__value" style={{ color: 'var(--accent-purple)' }}>
            {grouped.certificate?.length || 0}
          </span>
          <span className="scan-summary__label">Certificates</span>
        </div>
        <div className="scan-summary__item">
          <span className="scan-summary__value" style={{ color: 'var(--medium)' }}>
            {grouped.open_port?.length || 0}
          </span>
          <span className="scan-summary__label">Open Ports</span>
        </div>
      </div>

      {/* Asset groups */}
      <div className="asset-groups">
        {Object.entries(grouped).length === 0 ? (
          <div className="scan-empty">
            <Globe size={32} style={{ opacity: 0.3 }} />
            <p>No assets discovered for this domain.</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              The domain may be private or have limited external footprint.
            </p>
          </div>
        ) : (
          Object.entries(grouped).map(([type, typeAssets]) => (
            <AssetGroup key={type} type={type} assets={typeAssets} />
          ))
        )}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────
export default function DomainScanner() {
  const [domain,   setDomain]   = useState('');
  const [status,   setStatus]   = useState('idle');     // idle | loading | scanning | success | error
  const [message,  setMessage]  = useState('');         // status label text
  const [error,    setError]    = useState(null);       // error message string
  const [scanId,   setScanId]   = useState(null);
  const [report,   setReport]   = useState(null);
  const [progress, setProgress] = useState(0);

  const pollRef       = useRef(null);
  const pollCountRef  = useRef(0);

  // Cleanup on unmount
  useEffect(() => () => clearInterval(pollRef.current), []);

  // ── Validation ──────────────────────────────────────────────
  const validateDomain = (raw) => {
    const trimmed = raw.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
    if (!trimmed) return { valid: false, reason: 'Please enter a domain name.' };
    // Basic domain regex — backend validates rigorously anyway
    const re = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/;
    if (!re.test(trimmed)) return { valid: false, reason: `"${trimmed}" doesn't look like a valid domain.` };
    return { valid: true, clean: trimmed };
  };

  // ── Polling ─────────────────────────────────────────────────
  const stopPolling = useCallback(() => {
    clearInterval(pollRef.current);
    pollRef.current = null;
    pollCountRef.current = 0;
  }, []);

  const pollScanStatus = useCallback((id) => {
    stopPolling();
    pollCountRef.current = 0;

    pollRef.current = setInterval(async () => {
      pollCountRef.current += 1;

      if (pollCountRef.current > MAX_POLL_ATTEMPTS) {
        stopPolling();
        setStatus('error');
        setError('Scan is taking too long. Please check again later or retry.');
        return;
      }

      try {
        const statusData = await domainService.getScanStatus(id);
        const scanStatus = statusData?.status || statusData?.data?.status;
        const prog       = statusData?.progress || statusData?.data?.progress || 0;

        setProgress(Math.round(prog));
        setMessage(`Scanning… ${Math.round(prog)}% complete`);

        if (scanStatus === 'completed') {
          stopPolling();
          // Fetch the full report
          try {
            const fullReport = await domainService.getScanReport(id);
            setReport(fullReport?.data || fullReport);
            setStatus('success');
            setMessage('');
          } catch (reportErr) {
            // If report endpoint fails, use the status response data as fallback
            setReport(statusData?.data || statusData);
            setStatus('success');
            setMessage('');
          }
        } else if (scanStatus === 'failed') {
          stopPolling();
          setStatus('error');
          setError(statusData?.message || statusData?.data?.message || 'Scan failed on the backend.');
        }
        // 'running' | 'pending' — keep polling
      } catch (pollErr) {
        stopPolling();
        setStatus('error');
        setError(pollErr instanceof ApiError ? pollErr.message : 'Lost connection while polling scan status.');
      }
    }, POLL_INTERVAL_MS);
  }, [stopPolling]);

  // ── Submit handler ───────────────────────────────────────────
  const handleScan = useCallback(async () => {
    setError(null);
    setReport(null);
    setScanId(null);
    setProgress(0);

    const { valid, reason, clean } = validateDomain(domain);
    if (!valid) {
      setError(reason);
      return;
    }

    setStatus('loading');
    setMessage('Connecting to backend…');

    try {
      const result = await domainService.initiateScan(clean);

      // Backend may return the result immediately OR return a scan_id for async
      const id         = result?.scan_id || result?.data?.scan_id || result?.id;
      const scanStatus = result?.status   || result?.data?.status;
      const assets     = result?.assets   || result?.data?.assets;

      if (assets !== undefined) {
        // Synchronous response — results already in the payload
        setReport(result?.data || result);
        setStatus('success');
        setMessage('');
        return;
      }

      if (id) {
        setScanId(id);
        const scanSt = typeof scanStatus === 'string' ? scanStatus : '';

        if (scanSt === 'completed') {
          // Already done — fetch report
          const fullReport = await domainService.getScanReport(id);
          setReport(fullReport?.data || fullReport);
          setStatus('success');
          setMessage('');
        } else {
          // Async — poll
          setStatus('scanning');
          setMessage('Scan started. Polling for results…');
          pollScanStatus(id);
        }
      } else {
        // Unexpected response shape — treat as success with raw data
        setReport(result);
        setStatus('success');
        setMessage('');
      }
    } catch (err) {
      setStatus('error');
      setError(
        err instanceof ApiError
          ? err.message
          : 'An unexpected error occurred. Please try again.'
      );
    }
  }, [domain, pollScanStatus]);

  const handleReset = useCallback(() => {
    stopPolling();
    setStatus('idle');
    setError(null);
    setReport(null);
    setScanId(null);
    setProgress(0);
    setMessage('');
    setDomain('');
  }, [stopPolling]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && status === 'idle') handleScan();
  };

  // ── Render helpers ───────────────────────────────────────────
  const isLoading = status === 'loading' || status === 'scanning';

  return (
    <div className="domain-scanner" id="domain-scanner">
      {/* ── Input row ─────────────────────────────────────── */}
      <div className="scanner-input-row">
        <div className="scanner-input-wrap">
          <Search size={16} className="scanner-input-icon" />
          <input
            id="domain-input"
            className="scanner-input"
            type="text"
            placeholder="Enter domain to scan (e.g. example.com)"
            value={domain}
            onChange={e => setDomain(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            aria-label="Domain to scan"
            autoComplete="off"
            spellCheck={false}
          />
          {domain && !isLoading && (
            <button
              className="scanner-input-clear"
              onClick={() => setDomain('')}
              aria-label="Clear input"
            >
              <X size={13} />
            </button>
          )}
        </div>

        <button
          id="scan-btn"
          className="btn btn--primary scanner-btn"
          onClick={handleScan}
          disabled={isLoading || !domain.trim()}
          aria-label="Start domain scan"
        >
          {isLoading
            ? <><Loader size={14} className="spin" /> Scanning…</>
            : <><Search size={14} /> Scan Domain</>
          }
        </button>

        {(status === 'success' || status === 'error') && (
          <button
            id="reset-scan-btn"
            className="btn btn--ghost scanner-btn"
            onClick={handleReset}
            aria-label="Reset scanner"
          >
            <RefreshCw size={14} />
            Reset
          </button>
        )}
      </div>

      {/* ── Status messages ──────────────────────────────── */}
      {status === 'idle' && (
        <div className="scanner-hint">
          <Activity size={13} style={{ opacity: 0.5 }} />
          Ready to scan — enter a domain and press <kbd>Scan Domain</kbd> or hit <kbd>Enter</kbd>
        </div>
      )}

      {isLoading && (
        <div className="scanner-status scanner-status--loading">
          <Loader size={14} className="spin" />
          <div className="scanner-status__content">
            <span>{message || 'Scanning domain…'}</span>
            {status === 'scanning' && progress > 0 && (
              <div className="scanner-progress">
                <div
                  className="scanner-progress__bar"
                  style={{ width: `${progress}%` }}
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="scanner-status scanner-status--error" role="alert">
          <AlertTriangle size={16} />
          <span>{error}</span>
        </div>
      )}

      {status === 'success' && (
        <div className="scanner-status scanner-status--success">
          <CheckCircle size={16} />
          <span>
            Scan complete for <strong>{report?.domain || domain}</strong>
            {scanId && <span className="scan-id-badge"> · ID: {scanId.slice(0, 8)}…</span>}
          </span>
        </div>
      )}

      {/* ── Results ──────────────────────────────────────── */}
      {status === 'success' && <ScanResults report={report} />}
    </div>
  );
}
