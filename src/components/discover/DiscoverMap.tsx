import { useEffect } from "react";
import { APIProvider, AdvancedMarker, Map, Marker, useMap } from "@vis.gl/react-google-maps";
import { mapId, mapsKey } from "../../lib/firebase";
import { hasRate, omr } from "../../lib/data";
import { SportIcon } from "../SportIcon";
import type { Pitch } from "../../lib/types";

const MUSCAT = { lat: 23.588, lng: 58.3829 };

/** Pans to the selected pitch whenever the selection changes. */
function PanToSelection({ pitch }: { pitch: Pitch | null }) {
  const map = useMap();
  useEffect(() => {
    if (map && pitch) map.panTo({ lat: pitch.latitude, lng: pitch.longitude });
  }, [map, pitch]);
  return null;
}

export function DiscoverMap({
  pitches,
  selectedId,
  hoveredId,
  onSelect,
}: {
  pitches: Pitch[];
  selectedId: string | null;
  hoveredId: string | null;
  onSelect: (id: string) => void;
}) {
  const selected = pitches.find((p) => p.id === selectedId) ?? null;

  return (
    <APIProvider apiKey={mapsKey}>
      <Map
        defaultCenter={MUSCAT}
        defaultZoom={11.5}
        mapId={mapId || undefined}
        colorScheme="LIGHT"
        gestureHandling="greedy"
        disableDefaultUI
        zoomControl
        className="h-full w-full"
      >
        <PanToSelection pitch={selected} />
        {pitches.map((p) => {
          const active = p.id === selectedId || p.id === hoveredId;
          // Price-bubble markers need a Map ID; fall back to classic pins.
          return mapId ? (
            <AdvancedMarker
              key={p.id}
              position={{ lat: p.latitude, lng: p.longitude }}
              zIndex={active ? 2 : 1}
              onClick={() => onSelect(p.id)}
            >
              {/* A price bubble needs a price. Most venues in the directory are
                  listings with none, and 100 bubbles reading "On request" is a
                  wall of text, so those become a compact pin showing which
                  sport is there instead. */}
              <div
                className={`flex cursor-pointer items-center justify-center rounded-full border font-bold transition-transform ${
                  hasRate(p.pricePerHour) ? "px-2.5 py-1 text-[11px]" : "h-7 w-7"
                } ${
                  active
                    ? "scale-110 border-transparent bg-electric text-white shadow-[0_4px_14px_rgba(37,99,235,0.45)]"
                    : "border-electric/30 bg-white text-electric shadow-[0_2px_10px_rgba(13,27,50,0.14)]"
                }`}
                title={p.name}
              >
                {hasRate(p.pricePerHour) ? (
                  omr(p.pricePerHour)
                ) : (
                  <SportIcon sport={p.sport} size={16} />
                )}
              </div>
            </AdvancedMarker>
          ) : (
            <Marker
              key={p.id}
              position={{ lat: p.latitude, lng: p.longitude }}
              zIndex={active ? 2 : 1}
              onClick={() => onSelect(p.id)}
              title={p.name}
              label={
                hasRate(p.pricePerHour)
                  ? {
                      text: String(Math.round(p.pricePerHour)),
                      color: "#ffffff",
                      fontSize: "11px",
                      fontWeight: "700",
                    }
                  : undefined
              }
            />
          );
        })}
      </Map>
    </APIProvider>
  );
}
