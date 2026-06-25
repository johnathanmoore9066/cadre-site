import type { APIRoute } from "astro";
import { Resend } from "resend";

// This route runs on-demand (a Vercel serverless function), NOT at build time.
// Without this line Astro would prerender it to a static file and the POST
// handler would never execute in production.
export const prerender = false;

// Simple, permissive email shape check. The browser already validates; this is
// the real gate, because anyone can POST to this endpoint directly.
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// Read at runtime from the environment (set these in Vercel → Settings → Env
// Vars). Defaults keep the flow working even if a var is missing.
//   WAITLIST_TO   — where signups are emailed.
//   WAITLIST_FROM — sender; MUST be on a domain you've verified in Resend.
//                   onboarding@resend.dev is Resend's shared test sender and
//                   only delivers to YOUR Resend account email. After verifying
//                   cadresource.org, set this to e.g. "Cadre <waitlist@cadresource.org>".
const TO = process.env.WAITLIST_TO || "johnathanmoore@elementfusion.org";
const FROM = process.env.WAITLIST_FROM || "Cadre <onboarding@resend.dev>";

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const POST: APIRoute = async ({ request }) => {
  // 1. Parse defensively — never assume the body is valid JSON.
  let data: { email?: unknown; company?: unknown };
  try {
    data = await request.json();
  } catch {
    return json(400, { error: "Expected a JSON body." });
  }

  // 2. Honeypot. `company` is a hidden field no human sees. If it's filled,
  //    it's almost certainly a bot: pretend success (so it doesn't retry) but
  //    never send the email.
  if (typeof data.company === "string" && data.company.trim() !== "") {
    return json(200, { ok: true });
  }

  // 3. Validate the email server-side.
  const email = typeof data.email === "string" ? data.email.trim() : "";
  if (!email || !EMAIL_RE.test(email)) {
    return json(400, { error: "A valid email is required." });
  }

  // 4. No API key (e.g. local dev without secrets) → log instead of sending so
  //    you can exercise the whole flow, then return success.
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log(`[waitlist] No RESEND_API_KEY set — would notify ${TO}: ${email}`);
    return json(200, { ok: true });
  }

  // 5. Send the notification. The Resend SDK returns { data, error } rather
  //    than throwing on API errors, so we check `error`. The try/catch only
  //    guards against network-level failures.
  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email, // reply straight to the signup to send their download link
      subject: `New Cadre waitlist signup: ${email}`,
      text: `${email} asked to be notified when Cadre ships.`,
    });
    if (error) {
      console.error("[waitlist] Resend error:", error);
      return json(502, { error: "Could not send the notification." });
    }
  } catch (err) {
    console.error("[waitlist] Unexpected error:", err);
    return json(500, { error: "Something went wrong." });
  }

  return json(200, { ok: true });
};
