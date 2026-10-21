import { SportIcon } from "../SportIcon";
import { courtNoun } from "../pitch/helpers";
import { useLang } from "../../lib/i18n";
import type { Pitch } from "../../lib/types";




/** The app stores accent colors as a number (0xRRGGBB). */
function accentColor(hex: number): string {
  return `#${(hex & 0xffffff).toString(16).padStart(6, "0")}`;
}


export function PitchCard({
  pitch,
  selected,
  onClick,
  onHover,
}: {
  pitch: Pitch;
  selected: boolean;
  onClick: () => void;
  onHover: (hovering: boolean) => void;
}) {
  const { ar } = useLang();
  const pro = pitch.tier === "pro";
  const padel = pitch.sport === "padel";

  const courts = pitch.courts.length;
  const subtitle = [
    [pitch.area, pitch.city].filter(Boolean).join(", "),
    courts > 0 ? `${courts} ${courtNoun(pitch.sport, ar, courts !== 1)}` : "",
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      className={`photo-card block w-full text-start ${
        selected ? "ring-2 ring-electric ring-offset-2" : "card-hover"
      }`}
    >
      {/* The card is the photograph, as it is in the app: the name, the place
          and the rating sit on it over a scrim, with no white block beneath
          explaining the picture. */}
      <div className="relative aspect-[16/10] w-full">
        {pitch.imageURL ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${pitch.imageURL})` }}
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ backgroundColor: accentColor(pitch.accentHex) }}
          >
            <img
              src="/assets/img/watermark_white.svg"
              alt=""
              className="pointer-events-none absolute -top-4 -end-6 h-32 w-32 opacity-20"
            />
          </div>
        )}
        <div className="scrim" />

        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
          <span className="photo-pill">
            <SportIcon sport={pitch.sport} size={13} />
            {padel ? (ar ? "بادل" : "Padel") : ar ? "كرة القدم" : "Football"}
          </span>
          <span className="photo-pill">
            {pro ? (ar ? "قابل للحجز" : "Book now") : ar ? "اتصل للحجز" : "Call to book"}
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
          <div className="min-w-0">
            <h3 className="truncate text-[22px] font-extrabold tracking-[-0.02em] text-white">
              {pitch.name}
            </h3>
            {subtitle && (
              <p className="mt-0.5 truncate text-[14px] font-medium text-white/85">{subtitle}</p>
            )}
          </div>
          {pitch.rating > 0 && (
            <span className="flex shrink-0 items-center gap-1.5 pb-1 text-white">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.3 6.2 20.4l1.1-6.5L2.6 9.3l6.5-.9z" />
              </svg>
              <span className="text-[15px] font-extrabold">{pitch.rating.toFixed(1)}</span>
              {pitch.reviewCount > 0 && (
                <span className="text-[13px] font-medium text-white/70">({pitch.reviewCount})</span>
              )}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
