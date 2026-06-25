# Waitlist email wiring — setup

The code is done. The form posts to `/api/waitlist` (a Vercel serverless
function in `src/pages/api/waitlist.ts`), which emails you each signup via
Resend. You just need to install the deps, plug in a Resend key, and deploy.

## 1. Install the new dependencies (local)

```
npm install @astrojs/vercel resend
```

This adds the Vercel adapter + Resend SDK to `package.json` and updates the
lockfile. Both must be committed so Vercel installs them on deploy.

## 2. Test locally — no key needed yet

```
npm run dev
```

Submit the form. With no `RESEND_API_KEY` set, the endpoint logs the signup to
your terminal (`[waitlist] No RESEND_API_KEY set — would notify ...`) and
returns success. This proves the whole flow works before any email is involved.

## 3. Create a Resend account + API key

1. Sign up at https://resend.com — **use johnathanmoore@elementfusion.org**.
   This matters: until you verify a domain (step 5), Resend's default sender
   (`onboarding@resend.dev`) will only deliver to *your Resend account's own
   email*. Signing up with the elementfusion address means test emails reach
   the inbox you already confirmed is live.
2. Create an API key at https://resend.com/api-keys. Copy it (starts with `re_`).

## 4. Add env vars in Vercel, then redeploy

In your Vercel project → **Settings → Environment Variables**, add:

| Name | Value | Required? |
|------|-------|-----------|
| `RESEND_API_KEY` | your `re_...` key | Yes |
| `WAITLIST_TO` | `johnathanmoore@elementfusion.org` | Optional (this is the default) |
| `WAITLIST_FROM` | leave unset for now | Optional |

Commit and push (`package.json`, the lockfile, and the new/changed source
files). Vercel auto-deploys. Submit the live form — the email should land in
your inbox, with **reply-to set to the person who signed up**, so you can reply
once to send them the download link.

## 5. (Recommended) Verify cadresource.org for a real sender

`onboarding@resend.dev` is test-only and capped to your own inbox. To send from
your own domain and to anyone:

1. Go to https://resend.com/domains → add `cadresource.org`.
2. Add the DKIM/SPF DNS records Resend shows you. If your domain's DNS is on
   Vercel: **Vercel → your domain → DNS**. Otherwise add them at your registrar.
3. Wait for Resend to show the domain as **Verified**.
4. Set `WAITLIST_FROM=Cadre <waitlist@cadresource.org>` in Vercel and redeploy.

## Notes

- Local secrets go in a `.env` file (already gitignored). See `.env.example`.
- The form has a hidden honeypot field; bot submissions are dropped silently.
- Test addresses for simulating events without hurting sender reputation:
  `delivered@resend.dev`, `bounced@resend.dev`.
- When the app ships: set `DOWNLOAD_READY = true` in `src/config.ts` and fill in
  `DOWNLOADS` — that swaps the waitlist for real download buttons.
