import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLang } from "../lib/i18n";
import { fetchPitches } from "../lib/data";
import { firebaseReady } from "../lib/firebase";
import type { Pitch } from "../lib/types";
import { AppStoreBadge, APP_STORE_URL } from "../components/AppStoreBadge";
import { Wordmark } from "../components/Wordmark";
import { PitchCard } from "../components/discover/PitchCard";
import { SportIcon } from "../components/SportIcon";

/*
 * Home.
 *
 * Built from the venues that are actually in the directory, not from invented
 * screenshots of the product. The old page opened on a mocked-up "Booking
 * confirmed" card and a fake join code, then ran five alternating feature
 * sections around drawn diagrams of things the app does. None of it was true,
 * and a page whose every image is a guess at the product reads like a guess at
 * the product.
 *
 * So the hero is a real court in Muscat, the counts are counted, and the cards
 * lower down are the same cards Discover uses, showing the same venues. If the
 * directory changes, this page changes with it.
 */

const T = {
  heroTitle: { en: "Every pitch and court in Muscat", ar: "كل ملاعب مسقط" },
  heroSub: {
    en: "Football pitches and padel courts, with prices, photos and who to call. Find a game in seconds.",
    ar: "ملاعب كرة قدم وملاعب بادل، بالأسعار والصور ومن تتصل به. اعثر على مباراة خلال ثوانٍ.",
  },
  explore: { en: "Explore venues", ar: "استكشف الملاعب" },
  askAI: { en: "Ask Maydan AI", ar: "اسأل ميدان AI" },
  venues: { en: "venues", ar: "ملعب" },
  football: { en: "football pitches", ar: "ملعب كرة قدم" },
  padel: { en: "padel courts", ar: "ملعب بادل" },
  areas: { en: "areas across Oman", ar: "منطقة في عُمان" },

  nearby: { en: "In the directory now", ar: "في الدليل الآن" },
  nearbySub: {
    en: "Real venues, real photos, straight from the same database as the app.",
    ar: "ملاعب حقيقية وصور حقيقية، من نفس قاعدة بيانات التطبيق.",
  },
  seeAll: { en: "See all venues", ar: "شاهد كل الملاعب" },

  appTitle: { en: "Take it with you", ar: "خذه معك" },
  appSub: {
    en: "The iPhone app does everything this does, plus bookings in your pocket, a six-digit code to split the cost with your team, and live football scores.",
    ar: "تطبيق الآيفون يقوم بكل ما يقوم به هذا، إضافة إلى الحجوزات في جيبك، ورمز من ستة أرقام لتقسيم التكلفة مع فريقك، ونتائج كرة القدم المباشرة.",
  },
  free: { en: "Free on iPhone, in English and Arabic.", ar: "مجاناً على الآيفون، بالعربية والإنجليزية." },

  rights: { en: "Maydan. All rights reserved.", ar: "ميدان. جميع الحقوق محفوظة." },
  privacy: { en: "Privacy", ar: "الخصوصية" },
  terms: { en: "Terms", ar: "الشروط" },
  support: { en: "Support", ar: "الدعم" },
  download: { en: "Get the app", ar: "حمّل التطبيق" },
};

export default function HomePage() {
  const { ar } = useLang();
  const navigate = useNavigate();
  const [pitches, setPitches] = useState<Pitch[]>([]);

  useEffect(() => {
    if (!firebaseReady) return;
    let alive = true;
    fetchPitches()
      .then((p) => alive && setPitches(p))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const stats = useMemo(() => {
    const areas = new Set(pitches.map((p) => p.area).filter(Boolean));
    return {
      total: pitches.length,
      football: pitches.filter((p) => p.sport === "football").length,
      padel: pitches.filter((p) => p.sport === "padel").length,
      areas: areas.size,
    };
  }, [pitches]);

  /** The hero image is a real venue: best rated, with a photo, padel first
      because those courts photograph better than an empty five-a-side cage. */
  const hero = useMemo(() => {
    const withPhotos = pitches.filter((p) => p.imageURL);
    if (withPhotos.length === 0) return null;
    return [...withPhotos].sort((a, b) => {
      const sport = (p: Pitch) => (p.sport === "padel" ? 1 : 0);
      return sport(b) - sport(a) || b.rating - a.rating;
    })[0];
  }, [pitches]);

  /** A spread worth showing: best rated with photos, both sports represented. */
  const featured = useMemo(() => {
    const rank = (list: Pitch[]) =>
      [...list].filter((p) => p.imageURL).sort((a, b) => b.rating - a.rating);
    // Over-select, because the hero is dropped from this list and would
    // otherwise leave a hole in the grid.
    const padel = rank(pitches.filter((p) => p.sport === "padel")).slice(0, 4);
    const football = rank(pitches.filter((p) => p.sport === "football")).slice(0, 4);
    const mixed: Pitch[] = [];
    for (let i = 0; i < 4; i += 1) {
      if (football[i]) mixed.push(football[i]);
      if (padel[i]) mixed.push(padel[i]);
    }
    return mixed.filter((p) => p.id !== hero?.id).slice(0, 6);
  }, [pitches, hero]);

  return (
    <div>
      {/* ---------- Hero: a real court, not a drawing of one ---------- */}
      <section className="mx-auto w-full max-w-[1400px] px-4 pt-4 sm:px-6">
        <div className="photo-card relative min-h-[460px] sm:min-h-[540px]">
          {hero?.imageURL ? (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${hero.imageURL})` }}
            />
          ) : (
            <div className="absolute inset-0 bg-electric" />
          )}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.25) 100%)",
            }}
          />
          <div className="relative flex min-h-[460px] flex-col justify-end p-6 sm:min-h-[540px] sm:p-10">
            <h1 className="max-w-3xl text-[38px] font-extrabold leading-[1.05] tracking-[-0.025em] text-white sm:text-[58px]">
              {ar ? T.heroTitle.ar : T.heroTitle.en}
            </h1>
            <p className="mt-4 max-w-xl text-[16px] text-white/85 sm:text-[18px]">
              {ar ? T.heroSub.ar : T.heroSub.en}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link to="/discover" className="btn btn-primary">
                {ar ? T.explore.ar : T.explore.en}
              </Link>
              <Link
                to="/ai"
                className="btn !bg-white/15 !text-white backdrop-blur-sm hover:!bg-white/25"
              >
                {ar ? T.askAI.ar : T.askAI.en}
              </Link>
            </div>
            {hero && (
              <p className="mt-6 text-[13px] font-medium text-white/60">
                {hero.name}
                {hero.area ? ` · ${hero.area}` : ""}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ---------- Counted, not claimed ---------- */}
      {stats.total > 0 && (
        <section className="mx-auto w-full max-w-[1400px] px-4 pt-8 sm:px-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat value={stats.total} label={ar ? T.venues.ar : T.venues.en} />
            <Stat
              value={stats.football}
              label={ar ? T.football.ar : T.football.en}
              icon={<SportIcon sport="football" size={16} />}
            />
            <Stat
              value={stats.padel}
              label={ar ? T.padel.ar : T.padel.en}
              icon={<SportIcon sport="padel" size={16} />}
            />
            <Stat value={stats.areas} label={ar ? T.areas.ar : T.areas.en} />
          </div>
        </section>
      )}

      {/* ---------- The same cards Discover uses, the same venues ---------- */}
      {featured.length > 0 && (
        <section className="mx-auto w-full max-w-[1400px] px-4 pt-14 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-[30px] font-extrabold tracking-[-0.02em] sm:text-[36px]">
                {ar ? T.nearby.ar : T.nearby.en}
              </h2>
              <p className="mt-2 max-w-xl text-[15px] text-muted">
                {ar ? T.nearbySub.ar : T.nearbySub.en}
              </p>
            </div>
            <Link to="/discover" className="btn btn-ghost">
              {ar ? T.seeAll.ar : T.seeAll.en}
            </Link>
          </div>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <PitchCard
                key={p.id}
                pitch={p}
                selected={false}
                onClick={() => navigate(`/pitch/${p.id}`)}
                onHover={() => {}}
              />
            ))}
          </div>
        </section>
      )}

      {/* ---------- The app ---------- */}
      <section className="mx-auto w-full max-w-[1400px] px-4 py-16 sm:px-6">
        <div className="card card-bordered flex flex-col items-start gap-8 p-7 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h2 className="text-[28px] font-extrabold tracking-[-0.02em] sm:text-[34px]">
              {ar ? T.appTitle.ar : T.appTitle.en}
            </h2>
            <p className="mt-3 text-[16px] text-muted">{ar ? T.appSub.ar : T.appSub.en}</p>
            <p className="mt-2 text-[14px] text-faint">{ar ? T.free.ar : T.free.en}</p>
          </div>
          <AppStoreBadge />
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-4 px-4 py-9 sm:flex-row sm:px-6">
          <div className="flex items-center gap-3">
            <Wordmark className="text-[17px] font-extrabold text-electric" />
            <p className="text-[13px] text-faint">
              © {new Date().getFullYear()} {ar ? T.rights.ar : T.rights.en}
            </p>
          </div>
          <nav className="flex items-center gap-5 text-[14px] font-bold text-muted">
            <Link to="/privacy" className="hover:text-electric">
              {ar ? T.privacy.ar : T.privacy.en}
            </Link>
            <Link to="/terms" className="hover:text-electric">
              {ar ? T.terms.ar : T.terms.en}
            </Link>
            <Link to="/support" className="hover:text-electric">
              {ar ? T.support.ar : T.support.en}
            </Link>
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-electric"
            >
              {ar ? T.download.ar : T.download.en}
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}

function Stat({
  value,
  label,
  icon,
}: {
  value: number;
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-[16px] bg-surface-2 p-5">
      <div className="flex items-center gap-2 text-electric">
        {icon}
        <span className="text-[32px] font-extrabold leading-none tracking-[-0.02em]">
          {value}
        </span>
      </div>
      <p className="mt-2 text-[14px] font-medium text-muted">{label}</p>
    </div>
  );
}
