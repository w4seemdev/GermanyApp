/**
 * The site origin, resolved once.
 *
 * WHY THIS EXISTS: `process.env.NEXT_PUBLIC_SITE_URL ?? fallback` looks correct
 * and is not. `??` only substitutes for null and undefined, so an environment
 * variable that is DEFINED BUT EMPTY - the normal result of adding a key in a
 * CI dashboard and leaving the value blank - passes straight through as ''.
 * `new URL('')` then throws, and because metadataBase and the sitemap are
 * evaluated during prerendering, the whole build dies with a bare
 * "TypeError: Invalid URL" at the collecting-page-data step.
 *
 * That is exactly how the first Vercel deploy of this project failed.
 *
 * So: treat empty and whitespace as missing, validate by parsing, and fall back
 * rather than crash. Returning `.origin` also normalises away a trailing slash,
 * which otherwise produces `https://host//de` in the sitemap.
 */

const FALLBACK_ORIGIN = 'https://zukunftservice.de';

function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw === undefined || raw.length === 0) return FALLBACK_ORIGIN;

  try {
    return new URL(raw).origin;
  } catch {
    // A malformed value must not take the build down. Prefer a wrong-but-valid
    // origin over no site at all; the canonical tags can be corrected later.
    return FALLBACK_ORIGIN;
  }
}

/** Absolute origin, no trailing slash. Safe to interpolate and to pass to URL. */
export const SITE_URL = resolveSiteUrl();
