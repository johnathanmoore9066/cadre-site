// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// https://astro.build/config
// The Vercel adapter lets individual routes run on-demand (as serverless
// functions) while every other page stays static. We only need it for the
// waitlist API at src/pages/api/waitlist.ts, which opts in with
// `export const prerender = false`. Everything else is still prerendered.
// Docs: https://docs.astro.build/en/guides/integrations-guide/vercel/
export default defineConfig({
  adapter: vercel(),
});
