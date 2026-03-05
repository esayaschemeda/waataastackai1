# StackAI — Complete Deployment Guide

## 📁 Project Structure

```
stackai-platform/
├── frontend/                 ← React app (deploys to Netlify)
│   ├── src/
│   │   ├── main.jsx          ← Entry point
│   │   ├── Router.jsx        ← Page router
│   │   ├── App.jsx           ← Main platform + login
│   │   ├── AdminApp.jsx      ← Admin dashboard
│   │   ├── CertificateGenerator.jsx
│   │   ├── AffiliateSystem.jsx
│   │   ├── MobileApp.jsx
│   │   └── api.js            ← API client
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── backend/                  ← Node.js API (deploys to Railway)
│   ├── server.js
│   ├── routes/               ← auth, courses, payments, ai, admin
│   ├── middleware/auth.js
│   ├── db/schema.sql         ← Run this in Supabase first!
│   ├── services/email.js
│   └── .env.example
├── netlify.toml              ← Netlify config
├── deploy.sh                 ← Mac/Linux deploy script
├── deploy.bat                ← Windows deploy script
└── README.md
```

## 🌐 Live Page Routes

| URL | Page |
|-----|------|
| `yourapp.netlify.app/` | Main platform + Login |
| `yourapp.netlify.app/#/admin` | Admin dashboard |
| `yourapp.netlify.app/#/affiliate` | Affiliate system |
| `yourapp.netlify.app/#/certificates` | Certificate generator |
| `yourapp.netlify.app/#/mobile` | Mobile app preview |

---

## 🚀 DEPLOYMENT — Step by Step

### STEP 1 — Set up Database (Supabase, free)

1. Go to **https://supabase.com** → Create free account
2. Click **New Project** → name it `stackai` → choose nearest region
3. Wait ~2 minutes for project to be ready
4. Go to **SQL Editor** → New query
5. Paste the entire contents of `backend/db/schema.sql`
6. Click **Run** → all tables are created ✅
7. Go to **Settings → Database** → copy the **Connection String (URI)**
   - Looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`
8. Save this — you'll need it in Step 3

---

### STEP 2 — Push to GitHub

```bash
# In the stackai-platform/ folder:
git init
git add -A
git commit -m "Initial StackAI deploy"

# Create a new repo at https://github.com/new
# Then connect it:
git remote add origin https://github.com/YOUR_USERNAME/stackai-platform.git
git branch -M main
git push -u origin main
```

---

### STEP 3 — Deploy Backend to Railway

1. Go to **https://railway.app** → Sign up with GitHub (free)
2. Click **New Project → Deploy from GitHub repo**
3. Select your `stackai-platform` repo
4. Railway asks for root directory → type: **`backend`**
5. Click **Add Variables** and add ALL of these:

```
NODE_ENV            = production
FRONTEND_URL        = https://your-app.netlify.app   ← add after Step 4
DATABASE_URL        = postgresql://...               ← from Supabase Step 1
JWT_SECRET          = (run: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
ANTHROPIC_API_KEY   = sk-ant-...                    ← console.anthropic.com
STRIPE_SECRET_KEY   = sk_live_...                   ← dashboard.stripe.com
STRIPE_WEBHOOK_SECRET = whsec_...                   ← after setting up webhook
PAYSTACK_SECRET_KEY = sk_live_...                   ← dashboard.paystack.com
RESEND_API_KEY      = re_...                        ← resend.com
```

6. Railway auto-deploys → you'll get a URL like `stackai-api.railway.app`
7. Test it: visit `https://stackai-api.railway.app/health` → should return `{"status":"ok"}`

---

### STEP 4 — Deploy Frontend to Netlify

**Option A — Drag & Drop (fastest, 2 minutes):**
```bash
cd frontend
npm install
npm run build
# Drag the frontend/dist/ folder to https://app.netlify.com
```

**Option B — GitHub Auto-Deploy (recommended):**
1. Go to **https://app.netlify.com** → Add new site → Import from Git
2. Connect GitHub → select `stackai-platform`
3. Set these build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
4. Add environment variable: `VITE_API_URL` = `https://stackai-api.railway.app/api`
5. Click **Deploy** ✅

Your site is live at `https://random-name.netlify.app`
→ Rename it in Site Settings to something like `stackai.netlify.app`

---

### STEP 5 — Set up Payments

**Stripe webhooks:**
1. Go to https://dashboard.stripe.com → Developers → Webhooks
2. Add endpoint: `https://stackai-api.railway.app/api/payments/stripe/webhook`
3. Select event: `checkout.session.completed`
4. Copy signing secret → add to Railway as `STRIPE_WEBHOOK_SECRET`

**Paystack webhooks:**
1. Go to https://dashboard.paystack.com → Settings → API Keys & Webhooks
2. Webhook URL: `https://stackai-api.railway.app/api/payments/paystack/webhook`

---

### STEP 6 — Run DB Schema

In Supabase SQL Editor, run `backend/db/schema.sql` if you haven't yet.
Then create your first admin user:

```sql
INSERT INTO users (name, email, password_hash, role, plan)
VALUES ('Admin', 'admin@yourdomain.com', 'TEMP', 'admin', 'enterprise');
```

Then reset the password via the app's forgot password flow.

---

### STEP 7 — Final checks

- [ ] Visit your Netlify URL — platform loads ✅
- [ ] Register a test account ✅
- [ ] Check email arrives (Resend dashboard) ✅
- [ ] Visit `/#/admin` → enter admin password ✅
- [ ] Test a Stripe payment (use card `4242 4242 4242 4242`) ✅
- [ ] Check Railway logs — no errors ✅

---

## 💰 Cost Summary (All Free to Start)

| Service | Free Tier | When to upgrade |
|---------|-----------|----------------|
| Netlify | 100GB/month, unlimited deploys | $19/mo at scale |
| Railway | $5 credit/month | ~$10-20/mo |
| Supabase | 500MB DB, 50K monthly users | $25/mo |
| Resend | 3,000 emails/month | $20/mo |
| Anthropic | Pay per token | ~$0.003/chat |
| Stripe | No monthly fee | 2.9% + $0.30/txn |
| Paystack | No monthly fee | 1.5% + ₦100/txn |

**Total to launch: $0**

---

## 🔗 Quick Links

- Supabase: https://supabase.com
- Railway: https://railway.app
- Netlify: https://netlify.com
- Anthropic: https://console.anthropic.com
- Stripe: https://dashboard.stripe.com
- Paystack: https://dashboard.paystack.com
- Resend: https://resend.com
