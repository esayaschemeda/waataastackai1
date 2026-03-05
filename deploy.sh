#!/bin/bash
# =============================================
# StackAI — One-Command Deploy Script
# Run: chmod +x deploy.sh && ./deploy.sh
# =============================================

set -e  # Exit on any error

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}╔══════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     StackAI — Deployment Script      ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════╝${NC}"
echo ""

# ── Step 1: Check prerequisites ─────────────
echo -e "${YELLOW}[1/6] Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
  echo -e "${RED}✗ Node.js not found. Install from nodejs.org${NC}"; exit 1
fi
if ! command -v npm &> /dev/null; then
  echo -e "${RED}✗ npm not found. Install from nodejs.org${NC}"; exit 1
fi
if ! command -v git &> /dev/null; then
  echo -e "${RED}✗ Git not found. Install from git-scm.com${NC}"; exit 1
fi
echo -e "${GREEN}✓ Node $(node -v), npm $(npm -v), git ready${NC}"

# ── Step 2: Build frontend ───────────────────
echo ""
echo -e "${YELLOW}[2/6] Building frontend...${NC}"
cd frontend
npm install --silent
npm run build
echo -e "${GREEN}✓ Frontend built → frontend/dist/${NC}"
cd ..

# ── Step 3: Git init / commit ────────────────
echo ""
echo -e "${YELLOW}[3/6] Preparing Git repository...${NC}"

if [ ! -d ".git" ]; then
  git init
  echo -e "${GREEN}✓ Git repository initialized${NC}"
else
  echo -e "${GREEN}✓ Git repository already exists${NC}"
fi

git add -A
git commit -m "🚀 StackAI production deploy $(date '+%Y-%m-%d %H:%M')" 2>/dev/null || echo -e "${YELLOW}  Nothing new to commit${NC}"

# ── Step 4: Push to GitHub ───────────────────
echo ""
echo -e "${YELLOW}[4/6] GitHub setup...${NC}"
echo ""
echo -e "  ${BLUE}Go to: https://github.com/new${NC}"
echo -e "  Create a repo named: ${YELLOW}stackai-platform${NC}"
echo -e "  Keep it ${YELLOW}private${NC} (recommended)"
echo ""
read -p "  Paste your GitHub repo URL (e.g. https://github.com/yourname/stackai-platform): " REPO_URL

if [ -z "$REPO_URL" ]; then
  echo -e "${RED}✗ No URL provided. Skipping GitHub push.${NC}"
else
  git remote remove origin 2>/dev/null || true
  git remote add origin "$REPO_URL"
  git branch -M main
  git push -u origin main
  echo -e "${GREEN}✓ Code pushed to GitHub!${NC}"
fi

# ── Step 5: Deploy frontend to Netlify ───────
echo ""
echo -e "${YELLOW}[5/6] Deploy Frontend → Netlify${NC}"
echo ""
echo -e "  ${BLUE}Option A (Drag & Drop — Fastest):${NC}"
echo -e "  1. Open ${YELLOW}https://app.netlify.com${NC}"
echo -e "  2. Drag the ${YELLOW}frontend/dist/${NC} folder onto the Netlify dashboard"
echo -e "  3. Your site goes live instantly ✅"
echo ""
echo -e "  ${BLUE}Option B (GitHub Auto-Deploy — Recommended):${NC}"
echo -e "  1. Open ${YELLOW}https://app.netlify.com/start${NC}"
echo -e "  2. Click 'Import from Git' → Connect GitHub"
echo -e "  3. Select ${YELLOW}stackai-platform${NC} repo"
echo -e "  4. Set: Base dir = ${YELLOW}frontend${NC}"
echo -e "  5. Set: Build cmd = ${YELLOW}npm run build${NC}"
echo -e "  6. Set: Publish dir = ${YELLOW}frontend/dist${NC}"
echo -e "  7. Click Deploy ✅"
echo ""
read -p "  Enter your Netlify URL once deployed (e.g. https://stackai.netlify.app): " NETLIFY_URL

# ── Step 6: Deploy backend to Railway ────────
echo ""
echo -e "${YELLOW}[6/6] Deploy Backend → Railway${NC}"
echo ""
echo -e "  ${BLUE}Steps:${NC}"
echo -e "  1. Open ${YELLOW}https://railway.app${NC} → Sign in with GitHub"
echo -e "  2. Click ${YELLOW}New Project → Deploy from GitHub repo${NC}"
echo -e "  3. Select ${YELLOW}stackai-platform${NC} → set root to ${YELLOW}/backend${NC}"
echo -e "  4. Add these environment variables in Railway dashboard:"
echo ""
echo -e "     ${YELLOW}NODE_ENV${NC}             = production"
echo -e "     ${YELLOW}FRONTEND_URL${NC}         = ${NETLIFY_URL:-https://your-app.netlify.app}"
echo -e "     ${YELLOW}DATABASE_URL${NC}         = (from Supabase)"
echo -e "     ${YELLOW}JWT_SECRET${NC}           = (64-char random string)"
echo -e "     ${YELLOW}ANTHROPIC_API_KEY${NC}    = sk-ant-..."
echo -e "     ${YELLOW}STRIPE_SECRET_KEY${NC}    = sk_live_..."
echo -e "     ${YELLOW}PAYSTACK_SECRET_KEY${NC}  = sk_live_..."
echo -e "     ${YELLOW}RESEND_API_KEY${NC}       = re_..."
echo ""
echo -e "  5. Railway auto-deploys! Copy your Railway URL."
echo -e "  6. Add it to Netlify env vars as ${YELLOW}VITE_API_URL${NC}"

# ── Done! ─────────────────────────────────────
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║         🎉 StackAI Deploy Complete!          ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${BLUE}Platform URLs:${NC}"
echo -e "  Frontend:    ${NETLIFY_URL:-<your netlify URL>}"
echo -e "  Admin:       ${NETLIFY_URL:-<your netlify URL>}/#/admin"
echo -e "  Affiliate:   ${NETLIFY_URL:-<your netlify URL>}/#/affiliate"
echo -e "  Mobile App:  ${NETLIFY_URL:-<your netlify URL>}/#/mobile"
echo -e "  Certs:       ${NETLIFY_URL:-<your netlify URL>}/#/certificates"
echo ""
echo -e "  ${BLUE}Next steps:${NC}"
echo -e "  1. Set up Supabase DB: ${YELLOW}https://supabase.com${NC}"
echo -e "  2. Run DB schema: paste ${YELLOW}backend/db/schema.sql${NC} in Supabase SQL editor"
echo -e "  3. Configure webhooks in Stripe & Paystack dashboards"
echo -e "  4. Test full flow: register → enroll → pay → learn"
echo ""
