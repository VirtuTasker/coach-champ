# Coach Champ AI — Phone/Browser-Only Setup Guide

No laptop needed. Everything below works from a phone browser. We use
**GitHub Codespaces** — a free, full code editor that runs in your browser
on GitHub's own servers — to avoid the problem of manually uploading
nested folders.

Follow every step in order.

---

## STAGE 1 — Create a GitHub account

1. Go to **github.com** on your phone browser → Sign up (free).
2. Verify your email.

---

## STAGE 2 — Create an empty repository

1. Tap the **+** icon (top right) → **New repository**.
2. Name it `coach-champ`.
3. Leave it **Public** or **Private**, your choice (Private is fine and free).
4. Tap **Create repository**. Leave it empty — don't add a README.

---

## STAGE 3 — Upload the zip file into the repository

1. On your new empty repository page, tap **"uploading an existing file"**
   (GitHub shows this link on an empty repo's page).
2. Tap to browse files, select `coach-champ-ai-v2.zip` from your phone.
3. Scroll down, tap **Commit changes**.

You now have one zip file sitting inside your GitHub repository. We will
unzip it properly using Codespaces in the next stage — don't worry that
it's still zipped.

---

## STAGE 4 — Open Codespaces (your in-browser computer)

1. On your repository page, tap the green **`<> Code`** button.
2. Tap the **Codespaces** tab → **Create codespace on main**.
3. Wait about 30–60 seconds. A full code editor opens in your browser,
   with a terminal at the bottom — this is a real computer running in
   the cloud, free for personal use within generous monthly limits.

---

## STAGE 5 — Unzip and push the real project files

In the terminal at the bottom of Codespaces, type each line below,
pressing Enter after each one:

```
unzip coach-champ-ai-v2.zip -d coach-champ
mv coach-champ/* coach-champ/.[^.]* . 2>/dev/null
rm -rf coach-champ coach-champ-ai-v2.zip
git add .
git commit -m "Add Coach Champ AI project"
git push
```

Refresh your repository page — you should now see all the real project
folders (`src`, `public`, etc.) instead of just a zip file.

---

## STAGE 6 — Create your accounts and collect your keys

Open each of these in your phone browser, sign up, and copy the key shown.
Keep a notes app open to paste each one as you go.

| # | Service | What to do | What you copy |
|---|---|---|---|
| A | **neon.tech** | Sign up free → New Project named "coach-champ" | Connection string starting `postgresql://` |
| B | **dashboard.clerk.com** | Sign up → New Application "Coach Champ AI" → API Keys | Publishable key + Secret key |
| C | **console.anthropic.com** | Sign up → add payment method → API Keys → Create Key | Key starting `sk-ant-` |
| D | **elevenlabs.io** | Sign up → Profile Settings → API Keys; pick a voice in Voice Library, copy its Voice ID | API key + Voice ID |
| E | **dashboard.razorpay.com** | Sign up → Settings → API Keys → Generate **Test Keys** | Key ID + Key Secret |

(Razorpay webhook secret comes later, in Stage 9 — skip for now.)

---

## STAGE 7 — Create the database tables (no terminal needed)

1. Go to your Neon project → find the **SQL Editor** tab in their dashboard.
2. Open the file `DATABASE_SETUP.sql` in this project (in Codespaces, or
   just view it on the GitHub repo page).
3. Copy its entire contents.
4. Paste into Neon's SQL Editor → click **Run**.
5. You should see a success message — this created all 7 tables your app needs.

---

## STAGE 8 — Deploy to Vercel

1. Go to **vercel.com** → Sign up using your GitHub account (this auto-connects them).
2. Tap **Add New Project** → select your `coach-champ` repository → Import.
3. Before tapping Deploy: tap **Environment Variables** and add each of
   these one at a time (name on the left, your real key on the right —
   copy the names exactly from `.env.example` in the project):
   ```
   DATABASE_URL
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
   CLERK_SECRET_KEY
   ANTHROPIC_API_KEY
   ELEVENLABS_API_KEY
   ELEVENLABS_VOICE_ID
   RAZORPAY_KEY_ID
   RAZORPAY_KEY_SECRET
   RAZORPAY_WEBHOOK_SECRET   (use any placeholder text for now, e.g. "temp" — update in Stage 9)
   NEXT_PUBLIC_RAZORPAY_KEY_ID   (same value as RAZORPAY_KEY_ID)
   ```
4. Tap **Deploy**. Wait 1–2 minutes.
5. You'll get a live link like `coach-champ.vercel.app` — open it, you
   should see the Coach Champ landing page, live on the internet.

---

## STAGE 9 — Connect your subdomain (ai.chhotechamps.in)

1. In Vercel: your project → **Settings → Domains** → type
   `ai.chhotechamps.in` → Add.
2. Vercel shows you a DNS record (usually a CNAME) to add.
3. Go to wherever chhotechamps.in's DNS is managed (your domain registrar
   or cPanel, accessible via browser) → add that exact record.
4. Wait 10–60 minutes → visit `ai.chhotechamps.in`.
5. Now go back to Razorpay → Settings → Webhooks → Add Webhook:
   - URL: `https://ai.chhotechamps.in/api/webhooks/razorpay`
   - Events: `payment.captured`, `order.paid`, `payment.failed`
   - Copy the webhook secret shown → go back to Vercel → Environment
     Variables → update `RAZORPAY_WEBHOOK_SECRET` with the real value →
     redeploy (Vercel has a one-tap "Redeploy" button).

---

## STAGE 10 — Before letting real customers in

- [ ] Switch Razorpay from Test Keys to Live Keys once your KYC is approved.
- [ ] Have a lawyer review `/privacy` and `/terms` pages — they're starter
      templates, not final legal documents.
- [ ] Test the full flow yourself: sign up → onboarding → chat → upgrade.
- [ ] Set spending alerts on your Anthropic and ElevenLabs accounts so
      usage can't surprise-bill you.

---

## What needs YOUR manual input vs. what's automatic

**You manually provide (one-time, during setup):**
- Every API key in Stage 6 → pasted into Vercel Environment Variables (Stage 8)
- The DNS record for your subdomain (Stage 9)
- The Razorpay webhook secret, after creating the webhook (Stage 9)

**Fully automatic, no action needed from you:**
- All TypeScript compiling and backend logic — Vercel builds and runs this itself
- The chat AI calls, voice generation, payment verification — all just work once the keys above are correctly entered
- Future code pushes — if I ever update the code, pushing it to your same GitHub repo makes Vercel auto-redeploy on its own.

## If you ever need to update a key later
Go to Vercel → your project → Settings → Environment Variables → edit the
value → tap **Redeploy**. No code changes needed for key updates, ever.
