# Activating Dila — Kemissa's Executive Assistant

Dila runs as a Supabase Edge Function. The frontend (Cloudflare) sends chat
messages to Supabase, which calls the Anthropic API (Claude) and returns
Dila's response. This guide walks through every step.

---

## Prerequisites

You need three things before starting:

1. **Your Supabase project** — already set up (you have `VITE_SUPABASE_URL`)
2. **An Anthropic API key** — get one at https://console.anthropic.com/settings/keys
3. **The Supabase CLI** — installed on your machine

---

## Step 1: Get an Anthropic API Key

1. Go to https://console.anthropic.com
2. Sign in (or create an account)
3. Navigate to **Settings → API Keys**
4. Click **Create Key**
5. Name it something like `dila-kemissa`
6. Copy the key — it starts with `sk-ant-api03-...`
7. Save it somewhere safe (you won't see it again)

**Billing:** Dila uses `claude-sonnet-4-20250514`. Typical cost is ~$0.01–0.05
per conversation turn. Add a spending limit under **Settings → Billing → Limits**
to stay in control.

---

## Step 2: Install the Supabase CLI

### Option A — npm (recommended since your project uses npm)

```bash
npm install -g supabase
```

### Option B — Homebrew (macOS)

```bash
brew install supabase/tap/supabase
```

Verify it's installed:

```bash
supabase --version
```

You should see something like `1.x.x`.

---

## Step 3: Log in to Supabase CLI

```bash
supabase login
```

This opens your browser. Sign in with the same account you use for the
Supabase dashboard. The CLI stores a token locally — you only do this once.

---

## Step 4: Link the CLI to your project

You need your **project reference ID**. Find it at:

**Supabase Dashboard → Project Settings → General → Reference ID**

It looks like `abcdefghijklmnopqrst` (20 characters).

```bash
cd /Users/fernandadrien/Desktop/kemi-continuum
supabase link --project-ref YOUR_PROJECT_REF
```

It will ask for your **database password** (the one you set when creating the
Supabase project). If you forgot it, you can reset it in:

**Dashboard → Project Settings → Database → Database Password → Reset**

---

## Step 5: Set the Anthropic API key as a secret

This stores your key securely in Supabase's vault. It is NOT exposed to the
frontend or stored in your code.

```bash
supabase secrets set ANTHROPIC_API_KEY=sk-ant-api03-YOUR_FULL_KEY_HERE
```

Verify it was saved:

```bash
supabase secrets list
```

You should see `ANTHROPIC_API_KEY` in the list (the value is hidden).

**Note:** Two other secrets — `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` —
are automatically available to all Edge Functions. You do NOT need to set them.

---

## Step 6: Deploy the Edge Function

From the project root:

```bash
supabase functions deploy ea-chat
```

Expected output:

```
Deploying function ea-chat...
Function ea-chat deployed successfully.
```

The function is now live at:

```
https://YOUR_PROJECT_REF.supabase.co/functions/v1/ea-chat
```

---

## Step 7: Verify the deployment

### Quick test from terminal

```bash
curl -X POST \
  https://YOUR_PROJECT_REF.supabase.co/functions/v1/ea-chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -d '{"messages":[{"role":"user","content":"Hello Dila, are you working?"}]}'
```

If everything is set up correctly, you'll get a JSON response like:

```json
{"reply":"Hello! I'm Dila, Kemissa's executive assistant. Yes, I'm up and running..."}
```

If you get `Unauthorized`, it means the auth token is invalid — that's expected
with just the anon key. The real test is from the dashboard (next step).

### Test from the dashboard

1. Open the ops dashboard: `http://localhost:8080?ops=1` (local) or `admin.kemissa.com` (production)
2. Log in
3. Click the **Dila** link in the sidebar, or click the chat bubble in the bottom-right corner
4. Type "Hello" and send
5. Dila should respond within a few seconds

---

## Step 8: Deploy the frontend to Cloudflare

If you haven't already pushed the latest code:

```bash
git add -A
git commit -m "Add Dila executive assistant"
git push origin main
```

Then deploy:

```bash
npm run deploy
```

No Cloudflare environment variable changes are needed — the frontend already
knows the Supabase URL and the edge function path is derived from it
automatically.

---

## Troubleshooting

### "Dila isn't connected yet" message in the chat

The edge function isn't deployed or isn't reachable.

- Run `supabase functions list` — is `ea-chat` listed?
- Run `supabase functions deploy ea-chat` again
- Check `supabase secrets list` — is `ANTHROPIC_API_KEY` present?

### "Anthropic API error 401"

Your API key is invalid or expired.

- Go to https://console.anthropic.com/settings/keys
- Create a new key
- Run `supabase secrets set ANTHROPIC_API_KEY=sk-ant-api03-NEW_KEY`
- Redeploy: `supabase functions deploy ea-chat`

### "Anthropic API error 429"

Rate limited. Either:
- You're sending too many requests — wait a minute and retry
- Your Anthropic account has no credits — add billing at https://console.anthropic.com/settings/billing

### CORS errors in the browser console

The edge function already handles CORS. If you see CORS errors:

- Make sure you deployed the latest version: `supabase functions deploy ea-chat`
- Check that `VITE_SUPABASE_URL` in your `.env.local` matches the project

### Tasks/reminders aren't saving

The database tables might not exist yet. Run the migration SQL in Supabase:

1. Go to **Dashboard → SQL Editor → New query**
2. Paste the contents of `supabase/migrations/20260420_ea_tables.sql`
3. Click **Run**
4. You should see "Success. No rows returned."

### Edge function logs

To see what Dila is doing behind the scenes:

```bash
supabase functions logs ea-chat --tail
```

This streams live logs — useful for debugging tool calls, Anthropic API
errors, or auth issues.

---

## Architecture summary

```
Browser (Cloudflare)
  │
  │  POST /functions/v1/ea-chat
  │  Authorization: Bearer <user JWT>
  │  Body: { messages: [...] }
  │
  ▼
Supabase Edge Function (ea-chat)
  │
  │  1. Verify user JWT
  │  2. Send messages + tools to Claude API
  │  3. If Claude calls a tool → execute against Supabase DB
  │  4. Loop until Claude returns a text response
  │  5. Return { reply: "..." }
  │
  ├──► Anthropic API (Claude claude-sonnet-4-20250514)
  │
  └──► Supabase Database
       ├── ea_tasks
       ├── ea_reminders
       ├── ea_invoice_drafts
       ├── ea_health_checks
       ├── ea_alert_configs
       └── clients (read-only, for context)
```

---

## What Dila can do once activated

| Capability | Example prompt |
|---|---|
| Customer service | "Draft a response to a client asking about our retainer packages" |
| Sourcing | "Find Italian wool suppliers for a client who needs winter suits" |
| Email triage | "Here are my 5 latest emails: [paste]. Triage them." |
| Task management | "Create a task to follow up with Sarah next Tuesday, high priority" |
| Reminders | "Remind me to call the fabric supplier tomorrow at 3pm" |
| Invoice prep | "Draft an invoice for Maria: 3 styling sessions at $500 each" |
| Recommendations | "What would you recommend for a tech executive attending Davos?" |
| Site monitoring | "Check if kemissa.com is up" |
| Alerts | "Alert the team that the website is down" |
