#!/bin/bash
# ╔═══════════════════════════════════════════════════════════════╗
# ║  Silicon Siddhanta — One-Click Deploy Script                  ║
# ║  Choose your preferred hosting platform                       ║
# ╚═══════════════════════════════════════════════════════════════╝

echo "🪐 Silicon Siddhanta — Deploy Landing Page"
echo "==========================================="
echo ""
echo "Choose deployment method:"
echo "  1) Netlify (recommended - free, custom domain)"
echo "  2) Vercel (free, fast CDN)"
echo "  3) Surge.sh (instant, no signup needed)"
echo "  4) GitHub Pages (if you have a repo)"
echo "  5) Local preview server"
echo ""
read -p "Enter choice (1-5): " choice

case $choice in
  1)
    echo "→ Deploying to Netlify..."
    echo "  If not installed: npm install -g netlify-cli"
    npx netlify-cli deploy --prod --dir=.
    ;;
  2)
    echo "→ Deploying to Vercel..."
    echo "  If not installed: npm install -g vercel"
    npx vercel --prod
    ;;
  3)
    echo "→ Deploying to Surge.sh..."
    echo "  If not installed: npm install -g surge"
    npx surge . silicon-siddhanta.surge.sh
    ;;
  4)
    echo "→ For GitHub Pages:"
    echo "  1. Create a repo: gh repo create silicon-siddhanta --public"
    echo "  2. Push this folder: git init && git add . && git commit -m 'deploy'"
    echo "  3. git push -u origin main"
    echo "  4. Enable Pages in repo Settings → Pages → Deploy from main"
    echo "  Your URL: https://<username>.github.io/silicon-siddhanta/"
    ;;
  5)
    echo "→ Starting local preview on http://localhost:3000"
    npx serve -s . -l 3000
    ;;
  *)
    echo "Invalid choice. Run again."
    ;;
esac
