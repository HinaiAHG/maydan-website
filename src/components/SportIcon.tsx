import type { Sport } from "../lib/types";

/**
 * The ball for a sport, drawn to survive being small.
 *
 * These render at 12 to 13 pixels on map pins and card pills, where any glyph
 * built from thin detail turns to mush. So the football is the iconic bit of a
 * football and nothing else: a filled centre panel with spokes running to the
 * rim, which reads as a ball even when the shape itself is only a few pixels
 * across. The padel ball is the same circle with the two seams that tell it
 * apart, and nothing more.
 *
 * Both take their colour from the text colour around them, so one glyph works
 * on a white pin, a blue pin and a dark translucent pill.
 */
export function SportIcon({ sport, size = 13 }: { sport: Sport; size?: number }) {
  const padel = sport === "padel";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="shrink-0"
    >
      <circle cx="12" cy="12" r="9" />
      {padel ? (
        // Two seams curving the length of the ball.
        <>
          <path d="M5.6 5.6c2.6 2 2.6 10.8 0 12.8" />
          <path d="M18.4 5.6c-2.6 2-2.6 10.8 0 12.8" />
        </>
      ) : (
        <>
          {/* The centre panel, filled so it survives being shrunk: a solid
              shape reads at sizes where a thin outline has nothing left. */}
          <path
            d="M12 8.7l3.14 2.28-1.2 3.69h-3.88l-1.2-3.69z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          {/* Spokes from each corner of the panel out to the rim. */}
          <path d="M12 8.7V3.1M15.14 10.98l5.32-1.73M13.94 14.67l3.28 4.52M10.06 14.67l-3.28 4.52M8.86 10.98L3.54 9.25" />
        </>
      )}
    </svg>
  );
}
