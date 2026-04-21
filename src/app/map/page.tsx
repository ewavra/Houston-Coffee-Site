"use client";

import { useState, useMemo } from "react";
import { APIProvider, Map, AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps";
import { coffeeShops, rankingModes, computeScore } from "@/data/coffeeShops";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!;
const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID!;

function scoreToColor(score: number): string {
  if (score >= 4.2) return "#92400e";
  if (score >= 3.5) return "#d97706";
  if (score >= 2.5) return "#ca8a04";
  return "#a8a29e";
}

function scoreToSize(score: number): number {
  return Math.round(18 + (score / 5) * 16);
}

function MarkerDot({ score }: { score: number }) {
  const size = scoreToSize(score);
  const color = scoreToColor(score);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        border: "2.5px solid white",
        boxShadow: "0 1px 4px rgba(0,0,0,0.35)",
        cursor: "pointer",
      }}
    />
  );
}

export default function MapPage() {
  const [modeId, setModeId] = useState("ethan");
  const [selected, setSelected] = useState<string | null>(null);
  const activeMode = rankingModes.find((m) => m.id === modeId)!;

  const ranked = useMemo(() => {
    return coffeeShops
      .filter((s) => s.lat && s.lng)
      .map((shop) => ({ ...shop, rankScore: computeScore(shop, activeMode) }))
      .sort((a, b) => b.rankScore - a.rankScore);
  }, [modeId, activeMode]);

  const selectedShop = ranked.find((s) => s.name === selected);

  return (
    <main className="flex flex-col h-screen" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      {/* Top Bar */}
      <header className="bg-stone-900 text-stone-50 px-4 py-3 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-stone-400 hover:text-stone-200 transition-colors text-sm font-sans">
            ← Rankings
          </Link>
          <span className="text-stone-600">|</span>
          <h1 className="font-serif text-lg font-bold">Houston Coffee Map</h1>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {rankingModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setModeId(mode.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer font-sans ${
                modeId === mode.id ? "text-white" : "text-stone-400 hover:text-stone-200"
              }`}
              style={modeId === mode.id ? { background: "var(--accent)" } : { background: "#292524" }}
            >
              {mode.label}
            </button>
          ))}
          <ThemeToggle />
        </div>
      </header>

      {/* Legend */}
      <div
        className="px-4 py-2 flex items-center gap-4 text-xs font-sans shrink-0 border-b flex-wrap"
        style={{ background: "var(--card)", borderColor: "var(--card-border)", color: "var(--muted)" }}
      >
        <span className="font-medium" style={{ color: "var(--foreground)" }}>Score:</span>
        {[
          { color: "#92400e", label: "4.2+" },
          { color: "#d97706", label: "3.5–4.2" },
          { color: "#ca8a04", label: "2.5–3.5" },
          { color: "#a8a29e", label: "Below 2.5" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full border-2 border-white shadow-sm" style={{ background: color }} />
            <span>{label}</span>
          </div>
        ))}
        <span>· Larger circle = higher score · Click a pin for details</span>
      </div>

      {/* Map */}
      <div className="flex-1">
        <APIProvider apiKey={API_KEY}>
          <Map
            defaultCenter={{ lat: 29.762, lng: -95.393 }}
            defaultZoom={12}
            mapId={MAP_ID}
            style={{ width: "100%", height: "100%" }}
            gestureHandling="greedy"
          >
            {ranked.map((shop) => (
              <AdvancedMarker
                key={shop.name}
                position={{ lat: shop.lat, lng: shop.lng }}
                title={shop.name}
                onClick={() => setSelected(shop.name === selected ? null : shop.name)}
              >
                <MarkerDot score={shop.rankScore} />
              </AdvancedMarker>
            ))}

            {selected && selectedShop && (
              <InfoWindow
                position={{ lat: selectedShop.lat, lng: selectedShop.lng }}
                onCloseClick={() => setSelected(null)}
                pixelOffset={[0, -scoreToSize(selectedShop.rankScore) / 2 - 4]}
              >
                <div style={{ fontFamily: "sans-serif", maxWidth: 240, padding: 4 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 4 }}>
                    <strong style={{ fontSize: 13, lineHeight: 1.3, color: "#1c1917" }}>{selectedShop.name}</strong>
                    <span style={{ fontSize: 16, fontWeight: 700, color: scoreToColor(selectedShop.rankScore), flexShrink: 0 }}>
                      {selectedShop.rankScore.toFixed(1)}
                    </span>
                  </div>
                  <p style={{ fontSize: 11, color: "#78716c", marginBottom: 6 }}>{selectedShop.area} · {selectedShop.address}</p>
                  <p style={{ fontSize: 11, color: "#57534e", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {selectedShop.overview}
                  </p>
                  <div style={{ marginTop: 8, display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {selectedShop.wifi?.toLowerCase().startsWith("yes") && (
                      <span style={{ background: "#dcfce7", color: "#15803d", fontSize: 10, padding: "2px 8px", borderRadius: 999 }}>WiFi</span>
                    )}
                    {(selectedShop.scores.outlets ?? 0) >= 4 && (
                      <span style={{ background: "#dbeafe", color: "#1d4ed8", fontSize: 10, padding: "2px 8px", borderRadius: 999 }}>Great Outlets</span>
                    )}
                    {(selectedShop.scores.seating ?? 0) >= 4.5 && (
                      <span style={{ background: "#f3e8ff", color: "#7e22ce", fontSize: 10, padding: "2px 8px", borderRadius: 999 }}>Lots of Seating</span>
                    )}
                  </div>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
      </div>
    </main>
  );
}
