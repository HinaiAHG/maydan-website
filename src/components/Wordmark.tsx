/**
 * The Maydan lockup: the mark is the M, and "aydan" finishes the word.
 *
 * Composed here rather than used from wordmark_*.svg, for two reasons. That
 * file sets "aydan" in Arial, so the brand name rendered in a typeface the
 * brand does not use. And its canvas is 800 wide with the artwork ending
 * around 400, so at any height a header can carry, the M came out about 13
 * pixels across and collapsed into two bars and a dot.
 *
 * Drawn from the mark's own path with a viewBox cropped to it, so the M scales
 * with the text instead of with a mostly empty canvas. It takes its colour
 * from `currentColor`, so one component works on any ground.
 */
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
        viewBox="-160 -180 320 360"
        /* Centring an em-tall box in a 1em line puts the mark's feet well
           below the baseline. Lifted so the M sits on the same line as the
           letters that follow it. */
        className="h-[0.9em] w-auto -translate-y-[0.07em]"
        fill="currentColor"
        aria-hidden
      >
        <path d="M-160-180v360h50v-280l110 90 110-90v280h50v-360L0-20Z" />
        <circle cx="0" cy="120" r="38" />
      </svg>
      {/* A touch of air after the mark: the M's right leg is a flat stem, so
          set solid against the a it reads as one jammed letterform. */}
      <span className="ms-[0.08em] tracking-[-0.01em]">aydan</span>
      <span className="sr-only">Maydan</span>
    </span>
  );
}
