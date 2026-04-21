"use client";

import { useState, useMemo } from "react";
import { coffeeShops, rankingModes, computeScore, areas } from "@/data/coffeeShops";
import CoffeeCard from "@/components/CoffeeCard";
import RecommendForm from "@/components/RecommendForm";

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
    return shops
      .map((shop) => ({ ...shop, rankScore: computeScore(shop, activeMode) }))
      .sort((a, b) => b.rankScore - a.rankScore);
  }, [modeId, selectedArea, activeMode]);

  return (
    <main className="min-h-screen" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      {/* Header */}
      <header className="bg-stone-900 text-stone-50 py-14 px-6 text-center">
        <p className="text-amber-400 text-xs tracking-[0.25em] uppercase mb-3 font-sans">Houston, Texas</p>
        <h1 className="font-serif text-5xl font-bold tracking-tight mb-3">Houston Coffee Rankings</h1>
        <div className="w-12 h-px bg-amber-500 mx-auto mb-4" />
        <p className="text-stone-400 max-w-md mx-auto text-sm font-sans leading-relaxed">
          Every shop personally visited and rated by Ethan. Filter by what matters to you.
        </p>
      </header>

      {/* Ranking Mode Selector */}
      <section className="sticky top-0 z-10 bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap gap-2 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {rankingModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setModeId(mode.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer font-sans ${
                  modeId === mode.id
                    ? "text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
                style={modeId === mode.id ? { background: "var(--accent)" } : {}}
              >
                {mode.label}
              </button>
            ))}
          </div>
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="text-sm border border-stone-300 rounded-lg px-3 py-1.5 bg-white text-stone-700 focus:outline-none font-sans"
          >
            <option value="All">All Neighborhoods</option>
            {areas.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
        <div className="max-w-5xl mx-auto px-4 pb-2">
          <p className="text-xs text-stone-400 font-sans">{activeMode.description}</p>
        </div>
      </section>

      {/* Shop List */}
      <section className="max-w-5xl mx-auto px-4 py-8 space-y-4">
        {ranked.map((shop, idx) => (
          <CoffeeCard
            key={shop.name}
            shop={shop}
            rank={idx + 1}
            mode={activeMode}
            isExpanded={expandedId === shop.name}
            onToggle={() => setExpandedId(expandedId === shop.name ? null : shop.name)}
          />
        ))}
      </section>

      {/* Recommend a Shop */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="border-t border-stone-200 pt-10">
          <h2 className="font-serif text-2xl font-bold mb-1">Recommend a Shop</h2>
          <p className="text-stone-500 text-sm mb-6 font-sans">
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
