/**
 * domainService.js
 * ─────────────────────────────────────────────────────────────────
 * Domain-module API calls for ASM Shield Dashboard.
 *
 * Backend endpoints (from modules/domain/routes.py):
 *   POST  /api/v1/domain/scan            → initiate scan
 *   GET   /api/v1/domain/scan/{id}       → get scan status
 *   GET   /api/v1/domain/scan/{id}/assets → list discovered assets
 *   GET   /api/v1/domain/scan/{id}/report → full JSON report
 *   GET   /health                        → backend health check
 *
 * All functions return the parsed JSON body or throw ApiError.
 * ─────────────────────────────────────────────────────────────────
 */

import api from './api';

const DOMAIN_BASE = '/api/v1/domain';

const domainService = {
  /**
   * initiateScan
   * ─────────────────────────────────────────────────────────────
   * Starts a domain enumeration scan.
   *
   * @param  {string}  domain  Target domain, e.g. 'example.com'
   * @returns {Promise<object>} Scan initiation response
   *   { scan_id, domain, status, message, ... }
   */
  initiateScan(domain) {
    return api.post(`${DOMAIN_BASE}/scan`, { domain });
  },

  /**
   * getScanStatus
   * ─────────────────────────────────────────────────────────────
   * Polls the status of an in-progress or completed scan.
   *
   * @param  {string}  scanId  The scan UUID returned by initiateScan
   * @returns {Promise<object>} Scan status object
   *   { scan_id, domain, status, progress, started_at, ... }
   */
  getScanStatus(scanId) {
    return api.get(`${DOMAIN_BASE}/scan/${scanId}`);
  },

  /**
   * getScanAssets
   * ─────────────────────────────────────────────────────────────
   * Returns a paginated list of discovered assets for a scan.
   *
   * @param  {string}  scanId   The scan UUID
   * @param  {string}  [type]   Optional AssetType filter
   * @param  {number}  [page=1]
   * @param  {number}  [limit=50]
   * @returns {Promise<object>}
   */
  getScanAssets(scanId, type = null, page = 1, limit = 50) {
    const params = new URLSearchParams({ page, limit });
    if (type) params.append('asset_type', type);
    return api.get(`${DOMAIN_BASE}/scan/${scanId}/assets?${params}`);
  },

  /**
   * getScanReport
   * ─────────────────────────────────────────────────────────────
   * Retrieves the full JSON report for a completed scan.
   * This is the same rich object returned immediately when the
   * scan completes synchronously.
   *
   * @param  {string}  scanId  The scan UUID
   * @returns {Promise<object>} Full DomainReportSchema object
   */
  getScanReport(scanId) {
    return api.get(`${DOMAIN_BASE}/scan/${scanId}/report`);
  },

  /**
   * healthCheck
   * ─────────────────────────────────────────────────────────────
   * Pings the backend health endpoint to check reachability.
   *
   * @returns {Promise<object>} { status: 'ok', version, module }
   */
  healthCheck() {
    return api.get('/health');
  },
};

export default domainService;
