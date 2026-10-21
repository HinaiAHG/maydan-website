import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import { useLang } from "../lib/i18n";
import { useAuth } from "../lib/auth";
import { APP_STORE_URL } from "./AppStoreBadge";
import { Wordmark } from "./Wordmark";

const ICONS = {
  // simple line icons (24x24 paths)
  home: "M3 10.5L12 3l9 7.5M5 9.5V20a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V9.5",
  discover: "M12 2C7.6 2 4 5.6 4 10c0 5.2 8 12 8 12s8-6.8 8-12c0-4.4-3.6-8-8-8zm0 11a3 3 0 110-6 3 3 0 010 6z",
  bookings: "M7 2v3M17 2v3M3 8h18M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z",
  ai: "M3 6a1 1 0 011-1h16a1 1 0 011 1v10a1 1 0 01-1 1H7l-4 4V6zM8 9.5h8M8 12.5h5",
  owner: "M4 20V10M10 20V4M16 20v-8M22 20H2",
} as const;

type Item = { to: string; icon: keyof typeof ICONS; en: string; ar: string; end?: boolean };

const ITEMS: Item[] = [
  { to: "/", icon: "home", en: "Home", ar: "الرئيسية", end: true },
  { to: "/discover", icon: "discover", en: "Discover", ar: "اكتشف" },
  { to: "/bookings", icon: "bookings", en: "Bookings", ar: "الحجوزات" },
  { to: "/ai", icon: "ai", en: "Maydan AI", ar: "ميدان AI" },
  { to: "/owner", icon: "owner", en: "Owner", ar: "لوحة المالك" },
];

export function Shell() {
  const { ar, toggle } = useLang();
  const { user } = useAuth();
  const location = useLocation();
  const onProfile = location.pathname.startsWith("/profile");

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      {/*
        A translucent white bar closed by a hairline, not a saturated slab.
        The old header painted the brand colour across the full width, which
        made every page look like an advert for itself and left the blue with
        nothing to say when it appeared on something you could actually press.
      */}
      {/*
        The app's header is not a bar: it is the wordmark with controls grouped
        into white capsules floating on the page. Carried over so the two
        products read as one.
      */}
      <header className="glass-top z-20">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-4 px-4 sm:px-6">
          <Link
            to="/"
            className="flex shrink-0 items-center text-[22px] font-extrabold text-electric"
            aria-label="Maydan home"
          >
            <Wordmark />
          </Link>

          <nav className="header-pill mx-auto flex overflow-x-auto">
            {ITEMS.map((it) => (
              <NavLink key={it.to} to={it.to} end={it.end}>
                {({ isActive }) => (
                  <span
                    data-current={isActive}
                    className="navlink flex items-center gap-2 whitespace-nowrap"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d={ICONS[it.icon]} />
                    </svg>
                    <span className="hidden lg:inline">{ar ? it.ar : it.en}</span>
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="header-pill flex shrink-0">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="navlink hidden items-center gap-1.5 lg:inline-flex"
              title={ar ? "حمّل التطبيق" : "Get the app"}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M16.37 12.78c.02-2.3 1.88-3.4 1.96-3.45-1.07-1.56-2.73-1.78-3.32-1.8-1.41-.14-2.76.83-3.48.83-.72 0-1.83-.81-3.01-.79-1.55.02-2.98.9-3.78 2.29-1.61 2.79-.41 6.92 1.15 9.18.76 1.11 1.67 2.35 2.86 2.3 1.15-.04 1.58-.74 2.97-.74 1.39 0 1.78.74 2.99.72 1.24-.02 2.02-1.12 2.78-2.24.88-1.28 1.24-2.52 1.26-2.59-.03-.01-2.41-.93-2.44-3.69zM14.1 5.95c.63-.77 1.06-1.83.94-2.9-.91.04-2.01.61-2.67 1.37-.59.67-1.1 1.76-.96 2.79 1.01.08 2.05-.52 2.69-1.26z" />
              </svg>
              {ar ? "التطبيق" : "App"}
            </a>

            <button onClick={toggle} className="navlink" aria-label="Toggle language">
              {ar ? "EN" : "ع"}
            </button>

            {user ? (
              <Link
                to="/profile"
                aria-label={ar ? "الملف" : "Profile"}
                className={`flex h-9 w-9 items-center justify-center rounded-full text-[14px] font-extrabold ${
                  onProfile ? "bg-electric text-white" : "bg-surface-2 text-ink"
                }`}
              >
                {(user.displayName?.[0] ?? user.phoneNumber?.slice(-2) ?? "M").toUpperCase()}
              </Link>
            ) : (
              <Link to="/signin" className="navlink" data-current="true">
                {ar ? "دخول" : "Sign in"}
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="min-w-0 flex-1 overflow-y-auto scroll-thin">
        <Outlet />
      </main>
    </div>
  );
}
