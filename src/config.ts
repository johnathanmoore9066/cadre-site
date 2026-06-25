// Single source of truth for site-wide content + the launch flag.
// Flip DOWNLOAD_READY to true when the desktop app ships to swap the waitlist
// for real download buttons (DOWNLOADS) — that's the only change needed.

export const SITE = {
  name: "Cadre",
  wordmark: "Cadre",
  suffix: ".source",
  tagline: "HR judgment, on your machine.",
  description:
    "Cadre is a local-first HR copilot. It reads resumes, drafts interview questions, builds your forms, and pressure-tests a termination — entirely on your computer. Nothing leaves the building.",
  url: "https://cadre.source",
};

// --- Launch state -----------------------------------------------------------
export const DOWNLOAD_READY = false;

// When DOWNLOAD_READY is true, point these at the GitHub Release assets.
export const DOWNLOADS = {
  mac: "",
  windows: "",
};

// Waitlist capture. Leave empty for a client-only thank-you state; drop in a
// Formspree / Buttondown / serverless endpoint URL to actually collect emails.
export const WAITLIST_ENDPOINT = "";

export const PLATFORMS = "macOS 12+ · Windows 10+";

// --- Tools (Modules section) ------------------------------------------------
export const MODULES = [
  {
    n: "01",
    name: "Resume gap analysis",
    line: "See what's genuinely missing against the role — blind-screened, and deliberately score-free.",
    tag: "HIRE",
  },
  {
    n: "02",
    name: "Interview the interviewer",
    line: "Capture what the hiring manager has seen work and fail, then generate questions that probe the real gaps.",
    tag: "PROBE",
  },
  {
    n: "03",
    name: "Compare candidates",
    line: "Rank a shortlist by gap surface area, with the arithmetic shown — never an opaque AI score.",
    tag: "DECIDE",
  },
  {
    n: "04",
    name: "Forms",
    line: "Describe a form in plain English; Cadre builds it, then reviews the filled copy for problems.",
    tag: "DOCUMENT",
  },
  {
    n: "05",
    name: "Termination advisor",
    line: "Map a situation onto your policy and the law. Always defers the final call to counsel.",
    tag: "EXIT",
  },
];

export const STEPS = [
  {
    n: "1",
    title: "Download Cadre",
    body: "One installer. macOS or Windows. No account, no sign-up.",
  },
  {
    n: "2",
    title: "Add your Anthropic key",
    body: "Paste it once in Settings. You pay Anthropic directly — Cadre adds no markup and never sees your data.",
  },
  {
    n: "3",
    title: "Start working",
    body: "Drop in a job and a resume. Cadre does the analysis locally, on your machine.",
  },
];

export const TRUST = [
  "Local SQLite database",
  "Blind screening by default",
  "No score, ever",
  "Defers to counsel",
  "Powered by Claude",
  "No accounts · No telemetry",
];
