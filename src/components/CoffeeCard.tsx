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
    <div className="flex items-center gap-2 text-xs font-sans">
      <span className="w-28 shrink-0" style={{ color: "var(--muted)" }}>{label}</span>
      <div className="flex-1 rounded-full h-1.5" style={{ background: "var(--card-border)" }}>
        <div
          className="h-1.5 rounded-full transition-all"
          style={{ width: `${pct}%`, background: "var(--accent)" }}
        />
      </div>
      <span className="w-8 text-right font-semibold" style={{ color: "var(--foreground)" }}>{value}</span>
    </div>
  );
}

function ScoreGauge({ score }: { score: number }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(score / 5, 1);
  const dash = pct * circumference;

  return (
    <div className="relative w-16 h-16 shrink-0">
      <svg className="w-16 h-16 -rotate-90" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={radius} fill="none" stroke="var(--card-border)" strokeWidth="5" />
        <circle
          cx="36" cy="36" r={radius} fill="none"
          stroke="var(--accent)" strokeWidth="5"
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-base font-bold leading-none" style={{ color: "var(--accent)", fontFamily: "var(--font-playfair)" }}>
          {score.toFixed(1)}
        </span>
      </div>
    </div>
  );
}

function WiFiBadge({ value }: { value: string | null }) {
  if (!value) return null;
  const lower = value.toLowerCase();
  if (lower.startsWith("yes")) return <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-2 py-0.5 rounded-full font-sans">WiFi</span>;
  if (lower.startsWith("maybe")) return <span className="text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 px-2 py-0.5 rounded-full font-sans">WiFi?</span>;
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
    <div
      className="rounded-2xl border shadow-sm overflow-hidden transition-colors"
      style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
    >
      <button
        onClick={onToggle}
        className="w-full text-left px-5 py-4 flex items-center gap-4 transition-colors cursor-pointer hover:opacity-90"
      >
        {/* Rank Number */}
        <div
          className="text-4xl font-bold w-10 shrink-0 leading-none text-right"
          style={{ fontFamily: "var(--font-playfair)", color: "var(--card-border)" }}
        >
          {rank}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h2 className="font-serif font-bold text-base leading-tight" style={{ color: "var(--foreground)" }}>{shop.name}</h2>
          <p className="text-xs mt-0.5 font-sans" style={{ color: "var(--muted)" }}>{shop.area} · {shop.address}</p>

          <div className="flex flex-wrap gap-1.5 mt-2">
            {isForward.includes("Coffee") && (
              <span className="text-xs px-2 py-0.5 rounded-full font-sans" style={{ background: "var(--accent-light)", color: "var(--accent)" }}>Coffee Forward</span>
            )}
            {isForward.includes("Food") && (
              <span className="text-xs bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300 px-2 py-0.5 rounded-full font-sans">Food Forward</span>
            )}
            <WiFiBadge value={shop.wifi} />
            {shop.scores.outlets >= 4 && (
              <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-2 py-0.5 rounded-full font-sans">Great Outlets</span>
            )}
            {shop.scores.seating >= 4.5 && (
              <span className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 px-2 py-0.5 rounded-full font-sans">Lots of Seating</span>
            )}
          </div>
        </div>

        {/* Score Gauge */}
        <div className="flex flex-col items-center gap-0.5 shrink-0">
          <ScoreGauge score={score} />
          <span className="text-xs font-sans" style={{ color: "var(--muted)" }}>{mode.label}</span>
        </div>

        <div className="shrink-0" style={{ color: "var(--card-border)" }}>
          {isExpanded ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="px-5 pb-5" style={{ borderTop: "1px solid var(--card-border)" }}>
          <p className="text-sm mt-4 mb-5 leading-relaxed font-sans" style={{ color: "var(--muted)" }}>{shop.overview}</p>
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
