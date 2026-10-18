import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import { useLang } from "../lib/i18n";
import { useAuth } from "../lib/auth";
import { APP_STORE_URL } from "./AppStoreBadge";

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
      <header
        className="z-20 shadow-[0_2px_24px_rgba(29,78,216,0.28)]"
        style={{ background: "linear-gradient(180deg, #2f6af0, #1d4ed8)" }}
      >
        <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-3 px-4 sm:px-6">
          <Link to="/" className="flex shrink-0 items-center" aria-label="Maydan home">
            <img src="/assets/img/wordmark_white.svg" alt="Maydan" className="hidden h-11 w-auto sm:block" />
            <img src="/assets/img/logo_white.svg" alt="Maydan" className="h-9 w-9 sm:hidden" />
          </Link>

          {/* Primary nav: pills on desktop, icon row on mobile */}
          <nav className="mx-auto flex items-center gap-1 overflow-x-auto rounded-full sm:gap-1.5">
            {ITEMS.map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                end={it.end}
                className={({ isActive }) =>
                  `navlink flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-[14.5px] font-bold sm:px-4 ${
                    isActive
                      ? "bg-white text-electric shadow-sm"
                      : "text-white/85 hover:bg-white/15 hover:text-white"
                  }`
                }
              >
                <svg
                  width="19"
                  height="19"
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
              </NavLink>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            {/* The landing page has the full badge; every other page gets this
                so the app is never more than one click away. Hidden on narrow
                screens, where the header has no room to spare. */}
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="navlink hidden items-center gap-1.5 rounded-full border border-white/35 px-3 py-1.5 text-[13px] font-bold text-white hover:bg-white/15 xl:inline-flex"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M16.37 12.78c.02-2.3 1.88-3.4 1.96-3.45-1.07-1.56-2.73-1.78-3.32-1.8-1.41-.14-2.76.83-3.48.83-.72 0-1.83-.81-3.01-.79-1.55.02-2.98.9-3.78 2.29-1.61 2.79-.41 6.92 1.15 9.18.76 1.11 1.67 2.35 2.86 2.3 1.15-.04 1.58-.74 2.97-.74 1.39 0 1.78.74 2.99.72 1.24-.02 2.02-1.12 2.78-2.24.88-1.28 1.24-2.52 1.26-2.59-.03-.01-2.41-.93-2.44-3.69zM14.1 5.95c.63-.77 1.06-1.83.94-2.9-.91.04-2.01.61-2.67 1.37-.59.67-1.1 1.76-.96 2.79 1.01.08 2.05-.52 2.69-1.26z" />
              </svg>
              {ar ? "حمّل التطبيق" : "Get the app"}
            </a>
            <button
              onClick={toggle}
              className="navlink rounded-full border border-white/35 px-3 py-1.5 text-[13px] font-bold text-white hover:bg-white/15"
              aria-label="Toggle language"
            >
              {ar ? "EN" : "ع"}
            </button>

            {user ? (
              <Link
                to="/profile"
                aria-label={ar ? "الملف" : "Profile"}
                className={`navlink flex h-9 w-9 items-center justify-center rounded-full bg-white text-[14px] font-black text-electric ${
                  onProfile ? "ring-2 ring-white ring-offset-2 ring-offset-electric-bright" : ""
                }`}
              >
                {(user.displayName?.[0] ?? user.phoneNumber?.slice(-2) ?? "M").toUpperCase()}
              </Link>
            ) : (
              <Link
                to="/signin"
                className="btn !bg-white !px-4 !py-2 !text-[13.5px] !text-electric hover:!bg-white/90"
              >
                {ar ? "تسجيل الدخول" : "Sign in"}
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
