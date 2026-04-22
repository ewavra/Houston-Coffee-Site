import Link from "next/link";
import Image from "next/image";

const faqs = [
  {
    q: "Who am I?",
    a: "My name is Ethan, and I am unemployed here in Houston. Like most people, I drink coffee every day.",
  },
  {
    q: "Why did I make this?",
    a: "I figured people needed another online opinion in their lives.",
  },
  {
    q: "What are your qualifications?",
    a: null,
  },
  {
    q: "How is everything ranked?",
    a: "All rankings are made while sitting inside of the coffee shop. I do not revise rankings when I get home.",
  },
  {
    q: "Need to contact me?",
    a: "Suggestion box at the bottom of the rankings.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      <header className="bg-stone-900 text-stone-50 px-6 py-8">
        <Link href="/" className="text-stone-400 hover:text-stone-200 text-sm font-sans transition-colors">
          ← Back to Rankings
        </Link>
        <h1 className="font-serif text-4xl font-bold mt-3">About Ethan</h1>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-14 flex flex-col md:flex-row gap-10">
        {/* Photo */}
        <div className="w-full md:w-1/2 shrink-0 rounded-2xl overflow-hidden shadow-md self-start" style={{ border: "1px solid var(--card-border)", position: "relative", aspectRatio: "4/5", marginTop: "-1.5rem" }}>
          <Image
            src="/about-hero.jpg"
            alt="Two people looking out over White Sands at sunset"
            fill
            className="object-cover object-center"
          />
        </div>

        {/* FAQs */}
        <div className="flex-1 space-y-10">
          {faqs.map(({ q, a }) => (
            <div key={q}>
              <h2 className="font-serif text-lg font-bold mb-2" style={{ color: "var(--foreground)" }}>{q}</h2>
              <div className="w-8 h-px mb-3" style={{ background: "var(--accent)" }} />
              {a ? (
                <p className="text-sm font-sans leading-relaxed" style={{ color: "var(--muted)" }}>{a}</p>
              ) : (
                <p className="text-sm font-sans italic" style={{ color: "var(--card-border)" }}>—</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-stone-900 text-stone-500 text-center text-xs py-6 font-sans">
        Built with ☕ by Ethan · Houston, TX
      </footer>
    </main>
  );
}
