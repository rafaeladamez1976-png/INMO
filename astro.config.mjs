// @ts-check
import { defineConfig } from 'astro/config';

export const SITIO =
  process.env.SITIO_PUBLICO ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:4322');

export default defineConfig({
  site: SITIO,
  server: { port: 4322 },
  build: { inlineStylesheets: 'auto' },
});
