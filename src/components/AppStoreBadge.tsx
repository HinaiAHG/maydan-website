import { useLang } from "../lib/i18n";

/**
 * Where the iPhone app lives.
 *
 * No storefront in the path, so the link opens in whichever country the person
 * is actually signed into. Hardcoding /om/ sends everyone else to a page that
 * tells them the app is unavailable in their region, which is not true.
 */
export const APP_STORE_URL = "https://apps.apple.com/app/id6782310524";

type Tone = "dark" | "light";

/**
 * The App Store download button.
 *
 * Drawn rather than served as Apple's PNG badge: the real badge only ships in a
 * fixed set of locales and raster sizes, and it sits badly next to the site's
 * own buttons. This matches Apple's wording and lockup, scales cleanly, and
 * flips for Arabic like everything else here.
 */
export function AppStoreBadge({ tone = "dark" }: { tone?: Tone }) {
  const { ar } = useLang();
  const dark = tone === "dark";

  return (
    <a
      href={APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ar ? "حمّل ميدان من App Store" : "Download Maydan on the App Store"}
      className={`inline-flex items-center gap-3 rounded-2xl px-5 py-2.5 transition ${
        dark
          ? "bg-ink text-white hover:bg-ink/90"
          : "bg-white text-ink shadow-sm hover:bg-white/90"
      }`}
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="shrink-0">
        <path d="M16.37 12.78c.02-2.3 1.88-3.4 1.96-3.45-1.07-1.56-2.73-1.78-3.32-1.8-1.41-.14-2.76.83-3.48.83-.72 0-1.83-.81-3.01-.79-1.55.02-2.98.9-3.78 2.29-1.61 2.79-.41 6.92 1.15 9.18.76 1.11 1.67 2.35 2.86 2.3 1.15-.04 1.58-.74 2.97-.74 1.39 0 1.78.74 2.99.72 1.24-.02 2.02-1.12 2.78-2.24.88-1.28 1.24-2.52 1.26-2.59-.03-.01-2.41-.93-2.44-3.69zM14.1 5.95c.63-.77 1.06-1.83.94-2.9-.91.04-2.01.61-2.67 1.37-.59.67-1.1 1.76-.96 2.79 1.01.08 2.05-.52 2.69-1.26z" />
      </svg>
      <span className="text-start leading-tight">
        <span className={`block text-[11px] font-semibold ${dark ? "text-white/70" : "text-muted"}`}>
          {ar ? "حمّله من" : "Download on the"}
        </span>
        <span className="block text-[17px] font-black tracking-tight">App Store</span>
      </span>
    </a>
  );
}
