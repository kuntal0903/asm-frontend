/**
 * ExportCard.jsx
 * ─────────────────────────────────────────────────────────────────
 * Prominent CTA card for exporting asset reports.
 * - Click handler placeholder for backend HTTP requests
 * - Format selector (CSV, JSON, PDF)
 * - Animated border scan line on hover
 * - Shows last export timestamp
 * ─────────────────────────────────────────────────────────────────
 */

import { useState } from 'react';
import {
  Download,
  FileText,
  Clock,
  CheckCircle,
  Loader,
  Table,
  FileJson,
  FileType,
} from 'lucide-react';

const FORMATS = [
  { id: 'csv',  label: 'CSV',  icon: Table },
  { id: 'json', label: 'JSON', icon: FileJson },
  { id: 'pdf',  label: 'PDF',  icon: FileType },
];

/**
 * ExportCard Component
 *
 * @param {Object}   props
 * @param {Function} props.onExport  - Async callback: (format) => Promise<void>
 *                                     Replace with your actual API call, e.g.:
 *                                     fetch('/api/export?format=csv', { method: 'POST' })
 */
export default function ExportCard({ onExport }) {
  const [activeFormat, setActiveFormat] = useState('csv');
  const [status, setStatus]             = useState('idle'); // 'idle' | 'loading' | 'success'

  /**
   * handleExport
   * ─────────────────────────────────────────────────────────────
   * Calls the onExport prop (your backend integration point).
   * Manages loading / success UI state automatically.
   *
   * ── BACKEND INTEGRATION ──────────────────────────────────────
   * Replace the onExport prop implementation in Dashboard.jsx:
   *
   *   const handleExport = async (format) => {
   *     const response = await fetch(`/api/v1/assets/export?format=${format}`, {
   *       method: 'GET',
   *       headers: { Authorization: `Bearer ${token}` },
   *     });
   *     const blob = await response.blob();
   *     const url  = URL.createObjectURL(blob);
   *     const a    = document.createElement('a');
   *     a.href     = url;
   *     a.download = `asset-report.${format}`;
   *     a.click();
   *   };
   */
  const handleExport = async () => {
    setStatus('loading');
    try {
      // ── Plug in your actual API call here ───────────────────
      await (onExport ? onExport(activeFormat) : fakeExport());
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      console.error('Export failed:', err);
      setStatus('idle');
    }
  };

  // Simulated delay for demo purposes — remove when using real API
  const fakeExport = () =>
    new Promise((res) => setTimeout(res, 1800));

  const getButtonContent = () => {
    if (status === 'loading') return { icon: <Loader size={16} className="spin" />, label: 'Generating…' };
    if (status === 'success') return { icon: <CheckCircle size={16} />,            label: 'Downloaded!' };
    return { icon: <Download size={16} />, label: `Export ${activeFormat.toUpperCase()}` };
  };

  const { icon: btnIcon, label: btnLabel } = getButtonContent();

  return (
    <div
      className="export-card"
      role="region"
      aria-label="Asset Report Export"
    >
      {/* ── Info Section ─────────────────────────────────────── */}
      <div className="export-card__info">
        <h3>
          <FileText size={18} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle', color: 'var(--accent-cyan)' }} />
          Asset Report
        </h3>
        <p>
          Export a full snapshot of your attack surface — assets, vulnerabilities,
          risk scores, and remediation status.
        </p>

        <div className="export-card__meta">
          <div className="export-card__meta-item">
            <CheckCircle size={12} color="var(--low)" />
            1,284 Assets Included
          </div>
          <div className="export-card__meta-item">
            <Clock size={12} />
            Last export: 2h ago
          </div>
          <div className="export-card__meta-item">
            <FileText size={12} />
            Estimated: 2.4 MB
          </div>
        </div>
      </div>

      {/* ── CTA Section ──────────────────────────────────────── */}
      <div className="export-card__cta">
        {/* Export Button */}
        <button
          id="export-report-btn"
          className="export-btn"
          onClick={handleExport}
          disabled={status === 'loading'}
          aria-label={`Export asset report as ${activeFormat.toUpperCase()}`}
        >
          {btnIcon}
          <span>{btnLabel}</span>
        </button>

        {/* Format Pills */}
        <div className="export-card__format-options" role="group" aria-label="Export format">
          {FORMATS.map((fmt) => {
            const FmtIcon = fmt.icon;
            return (
              <button
                key={fmt.id}
                id={`format-pill-${fmt.id}`}
                className={`format-pill ${activeFormat === fmt.id ? 'active' : ''}`}
                onClick={() => setActiveFormat(fmt.id)}
                aria-pressed={activeFormat === fmt.id}
              >
                {fmt.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
