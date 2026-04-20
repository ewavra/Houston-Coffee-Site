"use client";

interface ScoreBarProps {
  label: string;
  value: number | null;
  max?: number;
}

function ScoreBar({ label, value, max = 5 }: ScoreBarProps) {
  if (value === null || value === undefined) return null;
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-28 text-stone-500 shrink-0">{label}</span>
      <div className="flex-1 bg-stone-100 rounded-full h-1.5">
        <div
          className="bg-stone-700 h-1.5 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-8 text-right text-stone-600 font-medium">{value}</span>
    </div>
  );
}

function WiFiBadge({ value }: { value: string | null }) {
  if (!value) return null;
  const lower = value.toLowerCase();
  if (lower.startsWith("yes")) return <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">WiFi</span>;
  if (lower.startsWith("maybe")) return <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">WiFi?</span>;
  return null;
}

export default function CoffeeCard({
  shop,
  rank,
  mode,
  isExpanded,
  onToggle,
}: {
  shop: any;
  rank: number;
  mode: any;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const score = shop.rankScore;
  const isForward = shop.overview?.split(":")[0] || "";

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
      {/* Card Header */}
      <button
        onClick={onToggle}
        className="w-full text-left px-5 py-4 flex items-start gap-4 hover:bg-stone-50 transition-colors cursor-pointer"
      >
        {/* Rank Number */}
        <div className="text-3xl font-bold text-stone-200 w-10 shrink-0 leading-none pt-1">
          {rank}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="font-semibold text-base leading-tight">{shop.name}</h2>
              <p className="text-xs text-stone-400 mt-0.5">{shop.area} · {shop.address}</p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xl font-bold text-stone-800">{score.toFixed(1)}</div>
              <div className="text-xs text-stone-400">{mode.label}</div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {isForward.includes("Coffee") && (
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Coffee Forward</span>
            )}
            {isForward.includes("Food") && (
              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">Food Forward</span>
            )}
            <WiFiBadge value={shop.wifi} />
            {shop.scores.outlets >= 4 && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Great Outlets</span>
            )}
            {shop.scores.seating >= 4.5 && (
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Lots of Seating</span>
            )}
          </div>
        </div>

        <div className="text-stone-300 shrink-0 pt-1">
          {isExpanded ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          )}
        </div>
      </button>

      {/* Expanded Detail */}
      {isExpanded && (
        <div className="px-5 pb-5 border-t border-stone-100">
          <p className="text-sm text-stone-600 mt-4 mb-5 leading-relaxed">{shop.overview}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
            <ScoreBar label="Vibe Check" value={shop.scores.vibeCheck} />
            <ScoreBar label="Coffee Quality" value={shop.scores.coffeeQuality} />
            <ScoreBar label="Coffee Selection" value={shop.scores.coffeeSelection} />
            <ScoreBar label="Customer Service" value={shop.scores.customerService} />
            <ScoreBar label="Noise Level" value={shop.scores.noiseLevel} />
            <ScoreBar label="Lighting" value={shop.scores.lighting} />
            <ScoreBar label="Seating" value={shop.scores.seating} />
            <ScoreBar label="Outlets" value={shop.scores.outlets} />
            <ScoreBar label="Parking" value={shop.scores.parking} />
          </div>
        </div>
      )}
    </div>
  );
}
