import posthog from "posthog-js";

// Client-side PostHog setup. Next.js runs this file in the browser before
// hydration, so it is the canonical place to initialize posthog-js in the
// App Router (do not also mount a PostHogProvider — one init path only).
//
// `defaults` at "2025-05-24" or later sets `capture_pageview` to
// "history_change", so $pageview is captured on every App Router navigation,
// not only on a full page load.
const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost =
  process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

if (posthogKey) {
  posthog.init(posthogKey, {
    api_host: posthogHost,
    defaults: "2026-08-30",
    debug: process.env.NODE_ENV === "development",
  });
} else if (process.env.NODE_ENV === "development") {
  // Fail loudly in development so a missing key is obvious, but keep the app
  // working. In production this stays a no-op.
  console.error(
    "NEXT_PUBLIC_POSTHOG_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_KEY is configured",
  );
}
