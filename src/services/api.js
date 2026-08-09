/**
 * api.js
 * ─────────────────────────────────────────────────────────────────
 * Core API service layer for ASM Shield Dashboard.
 *
 * RESPONSIBILITIES:
 *   - Reads backend base URL from environment variable VITE_API_URL
 *   - Provides typed HTTP helpers: get(), post(), put(), delete()
 *   - Handles response parsing and error normalisation
 *   - Adds Content-Type headers to all requests
 *
 * USAGE:
 *   import api from './api';
 *   const data = await api.post('/api/v1/domain/scan', { domain });
 *
 * ENVIRONMENT:
 *   VITE_API_URL must be set in .env (see .env.example)
 * ─────────────────────────────────────────────────────────────────
 */

// ── Base URL ──────────────────────────────────────────────────────
// Reads from Vite environment variable — never hardcoded.
const BASE_URL = import.meta.env.VITE_API_URL;

if (!BASE_URL) {
  console.error(
    '[ASM API] VITE_API_URL is not set. ' +
    'Create a .env file with VITE_API_URL=https://your-backend.onrender.com'
  );
}

// ── Timeout helper ────────────────────────────────────────────────
const DEFAULT_TIMEOUT_MS = 120_000; // 2 min — scans can take time

function withTimeout(promise, ms = DEFAULT_TIMEOUT_MS) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(
        () => reject(new ApiError(
          'Request timed out. The backend may be starting up ' +
          '(Render free tier spins down after inactivity). ' +
          'Please retry in ~30 seconds.',
          408
        )),
        ms
      )
    ),
  ]);
}

// ── Custom error class ────────────────────────────────────────────
export class ApiError extends Error {
  /**
   * @param {string} message   Human-readable error message
   * @param {number} status    HTTP status code (or synthetic like 408/0)
   * @param {any}    data      Parsed response body (if available)
   */
  constructor(message, status = 0, data = null) {
    super(message);
    this.name   = 'ApiError';
    this.status = status;
    this.data   = data;
  }
}

// ── Internal fetch wrapper ────────────────────────────────────────
async function request(method, path, body = null, options = {}) {
  const url = `${BASE_URL}${path}`;

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...options.headers,
  };

  const init = {
    method,
    headers,
    ...(body !== null ? { body: JSON.stringify(body) } : {}),
  };

  let response;

  try {
    response = await withTimeout(fetch(url, init), options.timeout);
  } catch (err) {
    // Network error or timeout
    if (err instanceof ApiError) throw err;
    throw new ApiError(
      `Network error — cannot reach backend (${BASE_URL}). ` +
      'Check your internet connection or VITE_API_URL.',
      0
    );
  }

  // Parse JSON body (best-effort)
  let data = null;
  const contentType = response.headers.get('Content-Type') || '';
  if (contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    try {
      data = await response.blob();
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    // Extract human-readable message from FastAPI error format
    const detail =
      data?.detail ||
      data?.message ||
      data?.error ||
      `HTTP ${response.status} ${response.statusText}`;

    throw new ApiError(
      typeof detail === 'string' ? detail : JSON.stringify(detail),
      response.status,
      data
    );
  }

  return data;
}

// ── Public API ────────────────────────────────────────────────────
const api = {
  /**
   * GET request
   * @param {string} path    e.g. '/api/v1/domain/scan/abc-123'
   * @param {object} options Additional fetch options
   */
  get(path, options = {}) {
    return request('GET', path, null, options);
  },

  /**
   * POST request
   * @param {string} path    e.g. '/api/v1/domain/scan'
   * @param {object} body    Request body (will be JSON-serialised)
   * @param {object} options Additional fetch options
   */
  post(path, body, options = {}) {
    return request('POST', path, body, options);
  },

  /**
   * PUT request
   */
  put(path, body, options = {}) {
    return request('PUT', path, body, options);
  },

  /**
   * DELETE request
   */
  delete(path, options = {}) {
    return request('DELETE', path, null, options);
  },

  /** Exposes the configured base URL for debugging */
  get baseUrl() {
    return BASE_URL;
  },
};

export default api;
