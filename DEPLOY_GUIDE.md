# Silicon Siddhanta — Public Deployment Guide

## What You're Deploying

The `deploy/` folder contains your self-contained landing page:

| File | Purpose |
|------|---------|
| `index.html` | Full landing page (HTML + CSS + JS, self-contained) |
| `netlify.toml` | Netlify config with security headers |
| `vercel.json` | Vercel routing config |
| `deploy.sh` | Interactive one-click deploy script |

---

## Option 1: Netlify Drop (Fastest — No CLI Needed)

**Time: 30 seconds | No signup required for first deploy**

1. Open browser → go to **https://app.netlify.com/drop**
2. Drag the entire `deploy/` folder onto the page
3. Your site goes live instantly at a URL like `https://random-name-12345.netlify.app`
4. (Optional) Click "Claim this site" → sign up → set custom subdomain like `silicon-siddhanta.netlify.app`

**Result:** Free HTTPS URL, global CDN, persists until you delete it.

---

## Option 2: Vercel (CLI Deploy)

**Time: 2 minutes | Requires Node.js**

```bash
# Step 1 — Install Vercel CLI
npm install -g vercel

# Step 2 — Navigate to deploy folder
cd path/to/Silicone\ Siddhanta/deploy

# Step 3 — Deploy (follow prompts, select defaults)
vercel --prod

# Step 4 — Copy your URL from the output
# Example: https://silicon-siddhanta.vercel.app
```

---

## Option 3: Surge.sh (Instant, Terminal-Only)

**Time: 1 minute | No signup needed**

```bash
# Step 1 — Install Surge
npm install -g surge

# Step 2 — Deploy with custom subdomain
cd path/to/Silicone\ Siddhanta/deploy
surge . silicon-siddhanta.surge.sh

# Step 3 — Enter email when prompted (first time only)
# Your URL: https://silicon-siddhanta.surge.sh
```

---

## Option 4: GitHub Pages (Best for Long-Term)

**Time: 5 minutes | Requires GitHub account**

```bash
# Step 1 — Create a new repo
cd path/to/Silicone\ Siddhanta/deploy
git init
git add .
git commit -m "Silicon Siddhanta landing page"

# Step 2 — Push to GitHub
gh repo create silicon-siddhanta --public --source=. --push

# Step 3 — Enable Pages
gh api repos/{owner}/silicon-siddhanta/pages \
  -X POST -f source.branch=main -f source.path=/
```

**Result:** `https://<your-username>.github.io/silicon-siddhanta/`

---

## Option 5: One-Click Script

```bash
cd path/to/Silicone\ Siddhanta/deploy
chmod +x deploy.sh
./deploy.sh
```

Follow the interactive menu to pick your platform.

---

## Option 6: Local Preview (Before Deploying)

```bash
cd path/to/Silicone\ Siddhanta/deploy
npx serve -s . -l 3000
# Open http://localhost:3000 in your browser
```

Or simply double-click `index.html` to open it directly in your browser.

---

## Recommended Path

**For quick sharing:** Option 1 (Netlify Drop) — drag, drop, done.
**For production:** Option 4 (GitHub Pages) — version controlled, free, permanent.

---

## File Inventory — Complete Silicon Siddhanta Deliverables

### Core App Components (JSX)
| File | Lines | Description |
|------|-------|-------------|
| `silicon_siddhanta_app.jsx` | 973 | Unified app: Astrology + Vastu + Breathing floater |
| `vastu_crosscheck.jsx` | 1,484 | Vastu Purusha Mandala 9x9 cross-check engine |
| `breathing_simulator.jsx` | 817 | Standalone boltable Pranayama simulator |
| `silicon_siddhanta_ui.jsx` | — | South Indian chart renderer + UI components |
| `multi_method_predictions.jsx` | — | KP + Parashari + Nadi prediction engine |
| `auspicious_windows.jsx` | — | Muhurta/Panchang window calculator |
| `brajesh_gautam_chatbot.jsx` | — | Brajesh Gautam method chatbot |
| `settings_panel.jsx` | — | User profile/settings management |
| `vedic_theme.js` | — | Vedic Mystic StyleKit design tokens |

### Landing Page & Deploy
| File | Description |
|------|-------------|
| `index.html` | Self-contained showcase landing page |
| `deploy/` | Ready-to-deploy folder with configs |
| `DEPLOY_GUIDE.md` | This file — deployment instructions |

### Python Engine
| File | Description |
|------|-------------|
| `parashari.py` | Parashari BPHS calculation engine |
| `kp_system.py` | KP System sub-lord calculations |
| `nadi_system.py` | Nadi Jyotish transit engine |
| `kcil_system.py` | Krishnamurti Cuspal Interlinks |
| `prediction_engine.py` | Multi-method prediction pipeline |
