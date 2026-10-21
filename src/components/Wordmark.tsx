/*
 * The Maydan mark and lockup.
 *
 * Composed here rather than used from logo_*.svg / wordmark_*.svg, for three
 * reasons. Those files set "aydan" in Arial, so the brand name rendered in a
 * typeface the brand does not use. The wordmark's canvas is 800 wide with the
 * artwork ending near 400, so at any height a header can carry, the M came out
 * about 13px across and collapsed into two bars and a dot. And the mark was
 * drawn far lighter than the Winco weights it sits beside: its stems measured
 * 14% of its height where the type's are near 22%, and its own diagonals were
 * thinner again, only 42% of its stems.
 *
 * The path below keeps the outer silhouette of the original exactly (stems at
 * ±160, apex at -20), which is the part you recognise, and moves only the
 * inner edges. That is how a letterform is emboldened. The diagonals are set
 * at 82% of the stems rather than equal to them, because a diagonal of the
 * same measure reads heavier than a vertical.
 */

/** Stems at 22% of the mark's height, to sit with Winco's heavy weights. */
const MARK_PATH = "M-160-180V180H-82V-12L0 70L82 -12V180H160V-180L0-20Z";
const DOT_CY = 130;
const DOT_R = 40;
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
      {/* A touch of air after the mark: the M's right leg is a flat stem, so
          set solid against the a it reads as one jammed letterform. */}
      <span className="ms-[0.08em] tracking-[-0.01em]">aydan</span>
      <span className="sr-only">Maydan</span>
    </span>
  );
}
