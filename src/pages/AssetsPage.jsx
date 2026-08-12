/**
 * AssetsPage.jsx
 * ─────────────────────────────────────────────────────────────────
 * Asset Inventory Management Page.
 * Full interactive asset table with search, category filtering,
 * risk badges, IP addresses, OS indicators, export, and "Add Asset" dialog.
 * ─────────────────────────────────────────────────────────────────
 */

import { useState, useMemo } from 'react';
import { Search, Download, Plus, X } from 'lucide-react';

const MOCK_ASSETS = [
  { id: 'ast-01', name: 'mail.corp.internal', ip: '10.0.4.15', type: 'Server', os: 'Ubuntu 22.04 LTS', risk: 'Critical', vulns: 5, status: 'Online' },
  { id: 'ast-02', name: 'ws-group-policy-01', ip: '10.0.12.88', type: 'Workstation', os: 'Windows Server 2022', risk: 'Critical', vulns: 3, status: 'Online' },
  { id: 'ast-03', name: 'api.prod.svc', ip: '104.21.44.181', type: 'Cloud Instance', os: 'Debian 11 (Container)', risk: 'High', vulns: 8, status: 'Online' },
  { id: 'ast-04', name: 'remote-access-01', ip: '198.51.100.45', type: 'Gateway', os: 'OpenVPN Appliance', risk: 'Critical', vulns: 2, status: 'Online' },
  { id: 'ast-05', name: 'citrix-gw.corp', ip: '198.51.100.12', type: 'Gateway', os: 'Citrix ADC 13.1', risk: 'High', vulns: 4, status: 'Online' },
  { id: 'ast-06', name: 'ci.devops.internal', ip: '10.0.9.33', type: 'Server', os: 'RHEL 8.4', risk: 'High', vulns: 6, status: 'Online' },
  { id: 'ast-07', name: 'vpn-gateway.corp', ip: '198.51.100.90', type: 'Gateway', os: 'Ivanti Connect Secure', risk: 'Medium', vulns: 1, status: 'Online' },
  { id: 'ast-08', name: 'db-cluster-master', ip: '10.0.2.100', type: 'Database', os: 'PostgreSQL 14 / Linux', risk: 'Safe', vulns: 0, status: 'Online' },
  { id: 'ast-09', name: 'stage-k8s-worker-01', ip: '10.0.18.5', type: 'Kubernetes Host', os: 'Alpine / Docker', risk: 'Medium', vulns: 2, status: 'Online' },
  { id: 'ast-10', name: 'legacy-app-04.old', ip: '10.0.88.12', type: 'Server', os: 'Windows Server 2012', risk: 'Critical', vulns: 12, status: 'Offline' },
];

export default function AssetsPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [assets, setAssets] = useState(MOCK_ASSETS);
  const [newAsset, setNewAsset] = useState({ name: '', ip: '', type: 'Server', os: 'Linux' });
  const [toastMsg, setToastMsg] = useState(null);

  const filteredAssets = useMemo(() => {
    return assets.filter((a) => {
      const matchSearch =
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.ip.includes(search) ||
        a.os.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === 'All' || a.type === typeFilter;
      const matchRisk = riskFilter === 'All' || a.risk === riskFilter;
      return matchSearch && matchType && matchRisk;
    });
  }, [assets, search, typeFilter, riskFilter]);

  const handleExportCsv = () => {
    const header = 'Asset ID,Name,IP Address,Type,OS,Risk Level,Vulnerabilities,Status\n';
    const rows = filteredAssets
      .map((a) => `${a.id},${a.name},${a.ip},${a.type},"${a.os}",${a.risk},${a.vulns},${a.status}`)
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'asset-inventory.csv';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleAddAssetSubmit = (e) => {
    e.preventDefault();
    if (!newAsset.name || !newAsset.ip) return;
    const created = {
      id: `ast-${assets.length + 1}`,
      name: newAsset.name,
      ip: newAsset.ip,
      type: newAsset.type,
      os: newAsset.os,
      risk: 'Safe',
      vulns: 0,
      status: 'Online',
    };
    setAssets([created, ...assets]);
    setAddModalOpen(false);
    setNewAsset({ name: '', ip: '', type: 'Server', os: 'Linux' });
    showToast(`Asset "${created.name}" added successfully`);
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="page-content">
      {toastMsg && (
        <div style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 500, background: 'var(--bg-elevated)', border: '1px solid var(--low)', color: 'var(--low)', padding: '12px 20px', borderRadius: 'var(--radius-md)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', fontSize: 13, fontWeight: 600 }}>
          ✓ {toastMsg}
        </div>
      )}

      {/* Header */}
      <div className="page-header">
        <div className="page-header__left">
          <h1 className="page-header__title">
            Asset <span>Inventory</span>
          </h1>
          <p className="page-header__subtitle">
            Browse, search, and monitor all {assets.length} discovered assets across your infrastructure.
          </p>
        </div>

        <div className="flex-gap-md">
          <button className="btn btn--ghost" onClick={handleExportCsv} aria-label="Export asset inventory CSV">
            <Download size={14} /> Export CSV
          </button>
          <button className="btn btn--primary" onClick={() => setAddModalOpen(true)} aria-label="Add new asset">
            <Plus size={14} /> Add Asset
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="panel" style={{ marginBottom: 20, padding: 16 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 260px' }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="s-input"
              placeholder="Search asset name, IP, OS..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 34, width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Type:</span>
            <select className="s-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="All">All Types</option>
              <option value="Server">Server</option>
              <option value="Workstation">Workstation</option>
              <option value="Gateway">Gateway</option>
              <option value="Cloud Instance">Cloud Instance</option>
              <option value="Database">Database</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Risk:</span>
            <select className="s-select" value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)}>
              <option value="All">All Risks</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Safe">Safe</option>
            </select>
          </div>
        </div>
      </div>

      {/* Assets Table */}
      <div className="panel" style={{ padding: 0 }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="vuln-table">
            <thead>
              <tr>
                <th>Asset Name</th>
                <th>IP Address</th>
                <th>Category</th>
                <th>OS / Technology</th>
                <th>Risk Level</th>
                <th>Vulnerabilities</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((a) => (
                <tr key={a.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{a.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{a.id}</div>
                  </td>
                  <td>
                    <span className="mono" style={{ color: 'var(--neon-blue)', fontSize: 12 }}>{a.ip}</span>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{a.type}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{a.os}</td>
                  <td>
                    <span className={`severity-badge severity-badge--${a.risk.toLowerCase()}`}>{a.risk}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: 12, fontWeight: 700, color: a.vulns > 0 ? 'var(--critical)' : 'var(--low)' }}>
                      {a.vulns} Vuln{a.vulns !== 1 ? 's' : ''}
                    </span>
                  </td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: a.status === 'Online' ? 'var(--low)' : 'var(--text-muted)' }}>
                      <span className="status-dot" style={{ background: a.status === 'Online' ? 'var(--low)' : 'var(--text-muted)' }} />
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Asset Modal */}
      {addModalOpen && (
        <>
          <div className="modal-overlay" onClick={() => setAddModalOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(3,7,18,0.75)', zIndex: 300 }} />
          <div role="dialog" aria-label="Add Asset" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '90%', maxWidth: '480px', background: 'var(--bg-surface)', border: '1px solid var(--border-hover)', borderRadius: 'var(--radius-lg)', zIndex: 301, padding: 24, boxShadow: 'var(--glow-blue)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Add New Asset to Monitoring</h3>
              <button onClick={() => setAddModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={16} /></button>
            </div>

            <form onSubmit={handleAddAssetSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Hostname / FQDN</label>
                <input className="s-input" placeholder="e.g. app-server-01.corp" value={newAsset.name} onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })} required style={{ width: '100%' }} />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>IP Address</label>
                <input className="s-input" placeholder="e.g. 10.0.15.42" value={newAsset.ip} onChange={(e) => setNewAsset({ ...newAsset, ip: e.target.value })} required style={{ width: '100%' }} />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Category</label>
                <select className="s-select" value={newAsset.type} onChange={(e) => setNewAsset({ ...newAsset, type: e.target.value })} style={{ width: '100%' }}>
                  <option value="Server">Server</option>
                  <option value="Workstation">Workstation</option>
                  <option value="Gateway">Gateway</option>
                  <option value="Cloud Instance">Cloud Instance</option>
                  <option value="Database">Database</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>OS / Platform</label>
                <input className="s-input" placeholder="e.g. Ubuntu 22.04" value={newAsset.os} onChange={(e) => setNewAsset({ ...newAsset, os: e.target.value })} style={{ width: '100%' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button type="button" className="btn btn--ghost" onClick={() => setAddModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn--primary">Save Asset</button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
