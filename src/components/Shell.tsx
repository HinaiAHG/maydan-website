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
      {/*
        A translucent white bar closed by a hairline, not a saturated slab.
        The old header painted the brand colour across the full width, which
        made every page look like an advert for itself and left the blue with
        nothing to say when it appeared on something you could actually press.
      */}
      <header className="glass-top z-20">
        <div className="mx-auto flex h-12 max-w-[1400px] items-center gap-6 px-4 sm:px-6">
          {/* The square mark plus the name, rather than the lockup wordmark.
              That wordmark is 4:1, so at any height a 48px header can carry,
              its M is about 13 pixels wide and collapses into two bars and a
              dot. The mark reads at 22px because it is drawn square. */}
          <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="Maydan home">
            <img src="/assets/img/logo_electric_blue.svg" alt="" className="h-[22px] w-[22px]" />
            <span className="text-[17px] font-semibold tracking-[-0.02em] text-ink">Maydan</span>
          </Link>

          {/* Plain links. Current is carried by weight and opacity, so nothing
              needs a box drawn around it. */}
          <nav className="mx-auto flex items-center gap-1 overflow-x-auto sm:gap-2">
            {ITEMS.map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                end={it.end}
                className="whitespace-nowrap rounded-lg px-2.5 py-1.5 sm:px-3"
              >
                {({ isActive }) => (
                  <span data-current={isActive} className="navlink flex items-center gap-1.5">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
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

          <div className="flex shrink-0 items-center gap-3">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="navlink hidden items-center gap-1.5 lg:inline-flex"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M16.37 12.78c.02-2.3 1.88-3.4 1.96-3.45-1.07-1.56-2.73-1.78-3.32-1.8-1.41-.14-2.76.83-3.48.83-.72 0-1.83-.81-3.01-.79-1.55.02-2.98.9-3.78 2.29-1.61 2.79-.41 6.92 1.15 9.18.76 1.11 1.67 2.35 2.86 2.3 1.15-.04 1.58-.74 2.97-.74 1.39 0 1.78.74 2.99.72 1.24-.02 2.02-1.12 2.78-2.24.88-1.28 1.24-2.52 1.26-2.59-.03-.01-2.41-.93-2.44-3.69zM14.1 5.95c.63-.77 1.06-1.83.94-2.9-.91.04-2.01.61-2.67 1.37-.59.67-1.1 1.76-.96 2.79 1.01.08 2.05-.52 2.69-1.26z" />
              </svg>
              {ar ? "حمّل التطبيق" : "Get the app"}
            </a>

            <button onClick={toggle} className="navlink" aria-label="Toggle language">
              {ar ? "EN" : "ع"}
            </button>

            {user ? (
              <Link
                to="/profile"
                aria-label={ar ? "الملف" : "Profile"}
                className={`flex h-7 w-7 items-center justify-center rounded-full bg-electric text-[12px] font-semibold text-white ${
                  onProfile ? "ring-2 ring-electric/25" : ""
                }`}
              >
                {(user.displayName?.[0] ?? user.phoneNumber?.slice(-2) ?? "M").toUpperCase()}
              </Link>
            ) : (
              <Link to="/signin" className="btn btn-primary !px-4 !py-1.5 !text-[13.5px]">
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
