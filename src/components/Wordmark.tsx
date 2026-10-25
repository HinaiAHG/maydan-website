/*
 * The Maydan mark and lockup.
 *
 * The path below is the brand mark exactly as public/assets/img/logo_electric_blue.svg
 * draws it: stems at ±160, apex at -20, dot at (0, 120) r38. It is not redrawn
 * here and should not be. An earlier version of this file emboldened it to
 * match the weight of the type beside it, which was the wrong way round: the
 * mark is the fixed thing and the type is what should move.
 *
 * It is still composed in React rather than used straight from the SVG files,
 * for two reasons that have nothing to do with weight. Those files set "aydan"
 * in Arial, so the brand name rendered in a typeface the brand does not use.
 * And the wordmark's canvas is 800 wide with the artwork ending near 400, so at
 * any height a header can carry, the M came out about 13px across and collapsed
 * into two bars and a dot.
 */

/** The mark as drawn in the brand asset. Do not re-weight it. */
const MARK_PATH =
  "M-160-180L-160 180L-110 180L-110-100L0-10L110-100L110 180L160 180L160-180L0-20Z";
const DOT_CY = 120;
const DOT_R = 38;
const VIEW_BOX = "-160 -180 320 360";

/** The M on its own, for places with no room for the full name. */
export function MaydanMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox={VIEW_BOX} className={className} fill="currentColor" role="img" aria-label="Maydan">
      <path d={MARK_PATH} />
      <circle cx="0" cy={DOT_CY} r={DOT_R} />
    </svg>
  );
}

/** The full lockup: the mark is the M, and "aydan" finishes the word. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    /* dir="ltr" because a logo is not text: in Arabic the flow would put the
       mark after the letters and the brand would read "aydanM". */
    <span
      dir="ltr"
      translate="no"
      className={`inline-flex items-center leading-none ${className}`}
    >
      <svg
        viewBox={VIEW_BOX}
        /* Centring an em-tall box in a 1em line puts the mark's feet well
           below the baseline. Lifted so the M sits on the same line as the
           letters that follow it. */
        className="h-[0.9em] w-auto -translate-y-[0.07em]"
        fill="currentColor"
        aria-hidden
      >
        <path d={MARK_PATH} />
        <circle cx="0" cy={DOT_CY} r={DOT_R} />
      </svg>
      {/*
        The letters set their own weight rather than inheriting it. The mark's
        stems are 14% of its height; Winco's heavy weights are near 22%, so an
        extrabold "aydan" next to it reads as two different logos jammed
        together. Every caller passes font-extrabold for the surrounding
        context, and the lockup has to be immune to that. Regular is the weight
        that sits level with the mark.

        A touch of air after the mark too: the M's right leg is a flat stem, so
        set solid against the a it reads as one jammed letterform.
      */}
      <span className="ms-[0.08em] font-normal tracking-[-0.005em]">aydan</span>
      <span className="sr-only">Maydan</span>
    </span>
  );
}
