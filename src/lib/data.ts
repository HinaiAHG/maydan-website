import { collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "./firebase";
import type { Pitch, Sport } from "./types";

const num = (v: unknown, fallback = 0) => (typeof v === "number" ? v : Number(v) || fallback);

/** Firestore Timestamp (or millis, or {seconds}) to epoch millis. */
function toMillis(v: unknown): number {
  if (v instanceof Timestamp) return v.toMillis();
  if (typeof v === "number") return v;
  if (v && typeof v === "object" && "seconds" in v) {
    const t = v as { seconds: unknown; nanoseconds?: unknown };
    return num(t.seconds) * 1000 + Math.floor(num(t.nanoseconds) / 1e6);
  }
  return 0;
}

/** Where each sport's venues live. Both are public per Firestore rules. */
const COLLECTIONS: { collection: string; sport: Sport }[] = [
  { collection: "pitches", sport: "football" },
  { collection: "padelVenues", sport: "padel" },
];

/**
 * Reads every venue, football and padel, as one list.
 *
 * The two collections have the same shape, so they map through the same
 * function and are told apart only by the `sport` each row carries. A padel
 * collection that is missing or empty must not take the football list down
 * with it, so the reads settle independently.
 */
export async function fetchPitches(): Promise<Pitch[]> {
  const d = db();
  if (!d) return [];
  const results = await Promise.allSettled(
    COLLECTIONS.map(async ({ collection: name, sport }) => {
      const snap = await getDocs(collection(d, name));
      return snap.docs.map((doc) => mapPitch(doc.id, doc.data() as Record<string, unknown>, sport));
    })
  );
  const failed = results.filter((r) => r.status === "rejected");
  const venues = results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
  // Only shout when nothing at all came back; one list loading is still useful.
  if (venues.length === 0 && failed.length > 0) {
    throw (failed[0] as PromiseRejectedResult).reason;
  }
  return venues;
}

function mapPitch(docId: string, x: Record<string, unknown>, sport: Sport): Pitch {
    return {
      id: (x.id as string) ?? docId,
      sport,
      name: (x.name as string) ?? "",
      area: (x.area as string) ?? "",
      city: (x.city as string) ?? "",
      surface: String(x.surface ?? ""),
      size: String(x.size ?? ""),
      pricePerHour: num(x.pricePerHour),
      rating: num(x.rating),
      reviewCount: num(x.reviewCount),
      tier: String(x.tier ?? ""),
      amenities: Array.isArray(x.amenities) ? (x.amenities as unknown[]).map(String) : [],
      phone: (x.phone as string) ?? "",
      isIndoor: Boolean(x.isIndoor),
      latitude: num(x.latitude),
      longitude: num(x.longitude),
      distanceKm: num(x.distanceKm),
      accentHex: num(x.accentHex, 0x2563eb),
      imageURL: (x.imageURL as string) ?? null,
      courts: Array.isArray(x.courts)
        ? (x.courts as Record<string, unknown>[]).map((c) => ({
            id: (c.id as string) ?? crypto.randomUUID(),
            name: (c.name as string) ?? "",
            attributes: Array.isArray(c.attributes) ? (c.attributes as unknown[]).map(String) : [],
            pricePerHour: num(c.pricePerHour),
            size: c.size ? String(c.size) : undefined,
            isAvailable: c.isAvailable === undefined ? undefined : Boolean(c.isAvailable),
          }))
        : [],
      slots: Array.isArray(x.slots)
        ? (x.slots as Record<string, unknown>[]).map((s) => ({
            id: (s.id as string) ?? crypto.randomUUID(),
            startMs: toMillis(s.start),
            endMs: toMillis(s.end),
            isAvailable: Boolean(s.isAvailable),
            price: num(s.price),
          }))
        : [],
      ownerUid: (x.ownerUid as string) ?? null,
    } satisfies Pitch;
}

/** OMR price formatter matching the app (1 decimal). */
export function omr(v: number): string {
  return `OMR ${v.toFixed(1)}`;
}

/**
 * Whether the directory lists what a venue charges.
 *
 * Off for now: most venues in the list are directory entries whose rates were
 * never confirmed with the owner, and a price a player turns up with and is
 * then charged something else is worse than no price at all. Flip this back to
 * true once the rates are verified and every surface starts quoting again.
 *
 * This covers the player-facing listing only. An owner always sees the real
 * rate for their own venue, and a booking always shows what is actually being
 * paid; hiding either would be hiding somebody's own money from them.
 */
export const SHOW_VENUE_PRICES = false;

/**
 * A venue's hourly rate, as the directory is willing to state it.
 *
 * Returns "Coming soon" while prices are held back, and otherwise the rate, or
 * "On request" when the venue genuinely has none. ("OMR 0.0" reads as free,
 * which is the kind of wrong that gets someone turned away at the gate.)
 */
export function rate(v: number, ar = false): string {
  if (!SHOW_VENUE_PRICES) return ar ? "قريباً" : "Coming soon";
  if (!Number.isFinite(v) || v <= 0) return ar ? "عند الطلب" : "On request";
  return omr(v);
}

/** Whether a rate should be drawn as a figure (with a "/ hr" after it). */
export function hasRate(v: number): boolean {
  return SHOW_VENUE_PRICES && Number.isFinite(v) && v > 0;
}
