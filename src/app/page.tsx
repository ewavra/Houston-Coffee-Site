"use client";

import { useState, useMemo } from "react";
import { coffeeShops, rankingModes, computeScore, areas, recentlyReviewed } from "@/data/coffeeShops";
import CoffeeCard from "@/components/CoffeeCard";
import RecommendForm from "@/components/RecommendForm";
import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";

export default function Home() {
  const [modeId, setModeId] = useState("ethan");
  const [selectedArea, setSelectedArea] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const activeMode = rankingModes.find((m) => m.id === modeId)!;

  const ranked = useMemo(() => {
    let shops = [...coffeeShops];
    if (selectedArea !== "All") {
      shops = shops.filter((s) => s.area === selectedArea);
    }
    const sorted = shops
      .map((shop) => ({ ...shop, rankScore: computeScore(shop, activeMode) }))
      .sort((a, b) => b.rankScore - a.rankScore);

    // Assign tie-aware ranks
    let pos = 1;
    return sorted.map((shop, idx) => {
      if (idx > 0 && shop.rankScore !== sorted[idx - 1].rankScore) {
        pos = idx + 1;
      }
      const isTied = sorted.filter((s) => s.rankScore === shop.rankScore).length > 1;
      return { ...shop, rankLabel: isTied ? `T${pos}` : `${pos}` };
    });
  }, [modeId, selectedArea, activeMode]);

  return (
    <main className="min-h-screen" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      {/* Header */}
      <header className="relative bg-stone-900 text-stone-50 py-14 px-6 text-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/header.jpg')", opacity: 0.18 }}
        />
        <div className="relative z-10">
          <p className="text-amber-400 text-xs tracking-[0.25em] uppercase mb-3 font-sans">Houston, Texas</p>
          <h1 className="font-serif text-5xl font-bold tracking-tight mb-3">Houston Coffee Rankings</h1>
          <div className="w-12 h-px bg-amber-500 mx-auto mb-4" />
          <p className="text-stone-400 max-w-md mx-auto text-sm font-sans leading-relaxed">
            Every shop personally visited and rated by Ethan. Filter by what matters to you.
          </p>
        </div>
      </header>

      {/* Ranking Mode Selector */}
      <section
        className="sticky top-0 z-10 border-b shadow-sm"
        style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
      >
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap gap-2 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {rankingModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setModeId(mode.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer font-sans ${
                  modeId === mode.id
                    ? "text-white"
                    : "text-stone-600 dark:text-stone-300 hover:opacity-80"
                }`}
                style={
                  modeId === mode.id
                    ? { background: "var(--accent)" }
                    : { background: "var(--accent-light)" }
                }
              >
                {mode.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/map"
              className="px-4 py-1.5 rounded-full text-sm font-medium font-sans border transition-colors hover:opacity-80"
              style={{ borderColor: "var(--accent)", color: "var(--accent)" }}
            >
              Map View
            </Link>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="text-sm rounded-lg px-3 py-1.5 focus:outline-none font-sans border"
              style={{
                background: "var(--card)",
                color: "var(--foreground)",
                borderColor: "var(--card-border)",
              }}
            >
              <option value="All">All Neighborhoods</option>
              {areas.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
            <ThemeToggle />
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 pb-2">
          <p className="text-xs font-sans" style={{ color: "var(--muted)" }}>{activeMode.description}</p>
        </div>
      </section>

      {/* Recently Reviewed */}
      {(() => {
        const shop = coffeeShops.find((s) => s.name === recentlyReviewed[0]);
        if (!shop) return null;
        return (
          <section className="max-w-5xl mx-auto px-4 pt-8 pb-2">
            <div
              className="rounded-2xl border px-5 py-4 flex items-center gap-4"
              style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
            >
              <span
                className="text-xs font-sans font-semibold px-2 py-0.5 rounded-full shrink-0"
                style={{ background: "var(--accent-light)", color: "var(--accent)" }}
              >
                Latest Review
              </span>
              <div className="flex-1 min-w-0">
                <span className="font-serif font-bold text-sm" style={{ color: "var(--foreground)" }}>{shop.name}</span>
                <span className="text-xs font-sans ml-2" style={{ color: "var(--muted)" }}>{shop.area}</span>
              </div>
              <span className="font-serif font-bold text-lg shrink-0" style={{ color: "var(--accent)" }}>
                {shop.scores.vibeCheck?.toFixed(1) ?? "—"}
              </span>
            </div>
          </section>
        );
      })()}

      {/* Shop List */}
      <section className="max-w-5xl mx-auto px-4 py-8 space-y-4">
        {ranked.map((shop) => (
          <CoffeeCard
            key={shop.name}
            shop={shop}
            rank={shop.rankLabel}
            mode={activeMode}
            isExpanded={expandedId === shop.name}
            onToggle={() => setExpandedId(expandedId === shop.name ? null : shop.name)}
          />
        ))}
      </section>

      {/* Recommend a Shop */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="pt-10" style={{ borderTop: "1px solid var(--card-border)" }}>
          <h2 className="font-serif text-2xl font-bold mb-1">Recommend a Shop</h2>
          <p className="text-sm mb-6 font-sans" style={{ color: "var(--muted)" }}>
            Know a Houston coffee shop Ethan should try? Send it his way.
          </p>
          <RecommendForm />
        </div>
      </section>

      <footer className="bg-stone-900 text-stone-500 text-center text-xs py-6 font-sans">
        Built with ☕ by Ethan · Houston, TX
      </footer>
    </main>
  );
}
