/**
 * VulnerabilitiesPage.jsx
 * ─────────────────────────────────────────────────────────────────
 * Vulnerability Management Page.
 * Full interactive table, severity quick tabs, CVSS filter slider,
 * status filter, export CSV, and row click modal opening.
 * ─────────────────────────────────────────────────────────────────
 */

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import VulnerabilityTable from '../components/VulnerabilityTable';
import VulnerabilityModal from '../components/VulnerabilityModal';

export default function VulnerabilitiesPage() {
  const [selectedVuln, setSelectedVuln] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedSev, setSelectedSev] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filters = useMemo(() => ({
    severity: selectedSev === 'all' ? [] : [selectedSev],
    status: selectedStatus === 'all' ? [] : [selectedStatus],
    minCvss: 0,
    asset: search,
    patch: [],
  }), [selectedSev, selectedStatus, search]);

  return (
    <div className="page-content">
      {/* Header */}
      <div className="page-header">
        <div className="page-header__left">
          <h1 className="page-header__title">
            Vulnerability <span>Management</span>
          </h1>
          <p className="page-header__subtitle">
            Track, prioritize, assign, and remediate security vulnerabilities across all assets.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="panel" style={{ marginBottom: 20, padding: 16 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', flex: '1 1 260px' }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="s-input"
              placeholder="Search CVE ID or Asset name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 34, width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            {['all', 'critical', 'high', 'medium'].map((sev) => (
              <button
                key={sev}
                className={`panel__action-btn ${selectedSev === sev ? 'active' : ''}`}
                onClick={() => setSelectedSev(sev)}
                style={{ textTransform: 'capitalize' }}
              >
                {sev}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Status:</span>
            <select className="s-select" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="mitigated">Mitigated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vulnerabilities Table Panel */}
      <div className="panel" style={{ padding: 0 }}>
        <VulnerabilityTable
          filters={filters}
          onRowClick={(vuln) => setSelectedVuln(vuln)}
        />
      </div>

      {/* Detail Modal */}
      {selectedVuln && (
        <VulnerabilityModal
          vuln={selectedVuln}
          onClose={() => setSelectedVuln(null)}
        />
      )}
    </div>
  );
}
