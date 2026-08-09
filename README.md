# 🛡️ ASM Shield — Attack Surface Management Dashboard

<div align="center">

![ASM Shield](https://img.shields.io/badge/ASM-Shield-0d1626?style=for-the-badge&logo=shield&logoColor=60a5fa)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)

**A professional dark-mode cybersecurity dashboard for monitoring your attack surface in real time.**

[Features](#-features) · [Quick Start](#-quick-start) · [Project Structure](#-project-structure) · [Backend Integration](#-backend-integration) · [Screenshots](#-screenshots)

</div>

---

## ✨ Features

- 🔍 **Attack Surface Overview** — KPI cards for Total Assets, Critical/High Risks, Health Score, and Total Vulnerabilities
- 📊 **Risk Trend Chart** — 7-day area chart showing Critical / High / Medium vulnerability trends (Recharts)
- 🚨 **Threat Intelligence Feed** — Live threat items with severity-coded icons and timestamps
- 📋 **Vulnerability Table** — Sortable table with CVE IDs, CVSS scores, severity badges, and status indicators
- 📤 **Export Module** — One-click CSV / JSON / PDF asset report export with loading state
- ⚙️ **Full Settings Page** — 9 sections: Profile, Security (MFA/SSO), API Keys, Integrations (Splunk, Jira, Slack…), Scan Schedule, Notifications, Appearance, Team, Danger Zone
- 📱 **Fully Responsive** — Works on desktop, tablet, and mobile
- 🎨 **Dark Cybersecurity Theme** — Deep navy, neon blue/cyan accents, glows, micro-animations

---

## ⚡ Quick Start

### Prerequisites

Make sure you have the following installed:

| Tool | Minimum Version | Check |
|------|----------------|-------|
| [Node.js](https://nodejs.org/) | v18+ | `node -v` |
| npm | v9+ | `npm -v` |

> **Note:** Git is optional — you can download the project as a ZIP from GitHub.

---

### 1. Clone the Repository

```bash
git clone https://github.com/kuntal0903/asm-frontend.git
cd asm-frontend
```

**Or download as ZIP:**
1. Click the green **`< > Code`** button on GitHub
2. Select **Download ZIP**
3. Extract the folder and open it in your terminal

---

### 2. Install Dependencies

```bash
npm install
```

This installs:
- `react` + `react-dom` — UI framework
- `lucide-react` — Icon library
- `recharts` — Chart library
- `vite` + `@vitejs/plugin-react` — Build tooling

---

### 3. Start the Development Server

```bash
npm run dev
```

Open your browser and go to:

```
http://localhost:5173
```

The app hot-reloads automatically whenever you save a file. ✅

---

### 4. Build for Production

When you're ready to deploy:

```bash
npm run build
```

This creates an optimized `dist/` folder. Serve it with any static host:

```bash
npm run preview        # Preview the production build locally
```

---

## 📁 Project Structure

```
asm-frontend/
├── index.html                    # HTML entry point (SEO meta tags included)
├── package.json                  # Dependencies & scripts
├── vite.config.js                # Vite configuration
│
└── src/
    ├── main.jsx                  # React app entry point
    ├── App.jsx                   # Root component + client-side router
    ├── index.css                 # Global design tokens (CSS variables)
    ├── App.css                   # App-level styles
    │
    ├── components/               # Reusable UI components
    │   ├── Sidebar.jsx           # Collapsible nav sidebar with badges
    │   ├── Topbar.jsx            # Sticky topbar with clock & search
    │   ├── KpiCard.jsx           # Metric card (blue/red/green/purple)
    │   ├── ExportCard.jsx        # Export CTA card with format picker
    │   ├── VulnerabilityTable.jsx# Sortable vulnerability table
    │   ├── ThreatFeed.jsx        # Live threat intelligence feed
    │   └── RiskChart.jsx         # Recharts area chart (risk trends)
    │
    ├── pages/                    # Page-level components
    │   ├── Dashboard.jsx         # Main attack surface overview page
    │   ├── SettingsPage.jsx      # Full settings page (9 sections)
    │   └── PlaceholderPage.jsx   # Stub for other nav routes
    │
    └── styles/                   # Component-scoped CSS files
        ├── layout.css            # Sidebar + Topbar styles
        ├── components.css        # Cards, table, panels, badges
        ├── dashboard.css         # Page layout + responsive breakpoints
        └── settings.css          # Settings page styles
```

---

## 🔌 Backend Integration

All data-fetching points use **mock data by default** and fall back gracefully. Replace each with your API call:

### KPI Cards — `src/pages/Dashboard.jsx`
```js
// Replace the KPI_CARDS array values:
const response = await fetch('/api/v1/dashboard/kpis', {
  headers: { Authorization: `Bearer ${token}` }
});
const data = await response.json();
```

### Export Button — `src/App.jsx` → `handleExport()`
```js
const handleExport = async (format) => {
  const response = await fetch(`/api/v1/assets/export?format=${format}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  const blob = await response.blob();
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `asset-report.${format}`;
  a.click();
};
```

### Vulnerability Table — `src/components/VulnerabilityTable.jsx`
```jsx
// Pass data as a prop from your API call:
<VulnerabilityTable data={apiResponse.vulnerabilities} />
```

### Threat Feed — `src/components/ThreatFeed.jsx`
```jsx
<ThreatFeed threats={apiResponse.threats} />
```

### Risk Chart — `src/components/RiskChart.jsx`
```jsx
<RiskChart data={apiResponse.trendData} />
// Expected format: [{ day: 'Aug 8', critical: 19, high: 35, medium: 51 }]
```

### Settings Save — `src/pages/SettingsPage.jsx`
```js
// Each section has a backend comment above the save button, e.g.:
await fetch('/api/v1/user/profile',   { method: 'PUT',    body: JSON.stringify(form) });
await fetch('/api/v1/settings/schedule', { method: 'PUT', body: JSON.stringify(schedule) });
await fetch('/api/v1/team/invite',    { method: 'POST',   body: JSON.stringify({ email }) });
```

---

## 🎨 Design System

All design tokens are CSS variables in `src/index.css`:

```css
--bg-base:       #060b14   /* Page background        */
--bg-surface:    #0d1626   /* Cards, sidebar          */
--accent-blue:   #3b82f6   /* Primary accent          */
--accent-cyan:   #06b6d4   /* Secondary accent        */
--critical:      #ef4444   /* Critical severity       */
--high:          #f97316   /* High severity           */
--medium:        #eab308   /* Medium severity         */
--low:           #22c55e   /* Low / healthy           */
```

---

## 📱 Responsive Breakpoints

| Breakpoint | Layout |
|---|---|
| `> 1200px` | Full 4-column KPI grid, 2-col chart layout |
| `768–1200px` | 2-column KPI grid |
| `< 768px` | Single column, sidebar becomes a slide-in overlay |
| `< 480px` | Full single-column stack |

---

## 🗺️ Navigation Pages

| Sidebar Item | Status | Route ID |
|---|---|---|
| Dashboard | ✅ Full page | `dashboard` |
| Asset Inventory | 🔧 Stub — ready for backend | `assets` |
| Vulnerabilities | 🔧 Stub — ready for backend | `vulnerabilities` |
| Threat Intelligence | 🔧 Stub — ready for backend | `threats` |
| Alerts | 🔧 Stub — ready for backend | `alerts` |
| Settings | ✅ Full page | `settings` |

To add a new page, add an entry to `NAV_ITEMS` in `Sidebar.jsx` and a matching route in `App.jsx`.

---

## 🛠️ Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server at `localhost:5173` |
| `npm run build` | Build optimized production bundle to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run oxlint for code quality checks |

---

## 📦 Dependencies

| Package | Version | Purpose |
|---|---|---|
| `react` | ^19 | UI framework |
| `react-dom` | ^19 | DOM rendering |
| `lucide-react` | ^1.30 | Icon library |
| `recharts` | ^3.10 | Chart components |
| `vite` | ^8 | Build tool & dev server |
| `@vitejs/plugin-react` | ^6 | React fast refresh |

---

## 📄 License

MIT © [kuntal0903](https://github.com/kuntal0903)

---

<div align="center">
Built with ❤️ using React + Vite · Dark mode only · No tracking
</div>
