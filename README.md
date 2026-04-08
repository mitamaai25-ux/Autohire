# AutoHiree

AutoHiree is a professional AI-built website concept that combines the best experience patterns of a freelance marketplace and a professional network.

## Product Direction
- **Marketplace workflow (Upwork-style):** Discover and apply to project contracts and full-time roles.
- **Professional graph (LinkedIn-style):** Engage through activity feed updates, endorsements, and network-driven hiring.
- **AI matching layer:** Pair companies and talent faster using skill + fit signals.

## Pages
- `index.html`: Public product website for hiring teams and talent.
- `about.html`: Dedicated About AutoHiree page with mission, problems solved, and core modules.
- `freelancer-dashboard.html`: Dedicated freelancer dashboard page.
- `client-dashboard.html`: Dedicated client dashboard page.
- `feed-dashboard.html`: Social-style feed dashboard page with posting and engagement cards.
- `talent-network.html`: Dedicated talent network page.
- `admin.html`: Local admin portal for login, lead tracking, and community project publishing.

## Current Prototype Features
- Role-based **Prototype Navigator** on the homepage so users can quickly jump to Talent, Client, Feed, or Admin flows.
- Includes a **UI Path** block showing a minimal React + Material UI import starter.
- Featured jobs marketplace cards.
- Professional activity feed and career graph insights.
- Connected dashboards on the main page: Onboarding and Client, with a dedicated Freelancer page.
- Talent profile showcase section.
- Company hiring request form and talent network signup form.
- Admin-managed project sync on the homepage.

## Run locally
Open `index.html` directly in your browser.

### Recommended walkthrough order
1. `index.html` → use the **Prototype Navigator** section.
2. `feed-dashboard.html` → explore discovery + community activity.
3. `freelancer-dashboard.html` or `client-dashboard.html` depending on role.
4. `admin.html` to review form submissions and manage projects.

## Backend (optional local demo)
A simple Express backend is included for local API experimentation.

```bash
npm install
npm start
```
