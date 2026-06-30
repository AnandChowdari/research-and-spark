import { motion } from "motion/react";
import { Play } from "lucide-react";
import { reels } from "@/lib/data";

/**
 * Looping reel "preview" gallery. Each card is a CSS/SVG mock of a video player —
 * scrubber animates, waveform pulses — no real video assets needed.
 */
export function ReelGallery() {
  const row1 = [...reels, ...reels];
  return (
    <section className="relative overflow-hidden border-y border-border bg-background py-20 lg:py-28">
      <div className="mx-auto mb-12 max-w-7xl px-5 lg:px-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          The reel wall
        </p>
        <h2 className="mt-3 max-w-3xl font-display text-4xl font-semibold tracking-[-0.02em] md:text-5xl">
          What "edited by Flogrit" actually looks like.
        </h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          A live wall of shipped edits — hooks, cuts, color, motion. Hover any reel to pause and peek.
        </p>
      </div>

      {/* Marquee row */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
        <div className="marquee-track flex w-max gap-5 pl-5">
          {row1.map((r, i) => (
            <ReelCard key={`${r.id}-${i}`} reel={r} />
          ))}
        </div>
      </div>

      {/* Static grid below */}
      <div className="mx-auto mt-14 grid max-w-7xl gap-5 px-5 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {reels.slice(0, 4).map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
          >
            <ReelCard reel={r} large />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function ReelCard({ reel, large = false }: { reel: (typeof reels)[number]; large?: boolean }) {
  const w = large ? "w-full" : "w-[260px]";
  const h = large ? "aspect-[9/14]" : "h-[360px] w-[260px]";
  return (
    <div
      className={`hover-glow group relative ${w} ${h} shrink-0 overflow-hidden rounded-2xl border border-border bg-card`}
      style={{
        background: `linear-gradient(160deg, oklch(0.25 0.06 ${reel.hue}) 0%, oklch(0.16 0.04 ${reel.hue}) 60%, var(--ink) 100%)`,
      }}
    >
      {/* fake film grain */}
      <div
        className="absolute inset-0 opacity-20 mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
        }}
      />

      {/* abstract subject */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="h-40 w-40 rounded-full blur-3xl"
          style={{
            background: `oklch(0.7 0.2 ${reel.hue} / 0.55)`,
            animation: "pulse-glow 3.6s ease-in-out infinite",
          }}
        />
      </div>

      {/* play badge */}
      <div className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/40 text-primary backdrop-blur-md transition-transform group-hover:scale-110">
        <Play size={14} fill="currentColor" />
      </div>

      {/* meta */}
      <div className="absolute inset-x-0 bottom-0 p-4">
        <div className="mb-3 flex items-end gap-1 h-8">
          {Array.from({ length: 28 }).map((_, i) => (
            <span
              key={i}
              className="block w-[3px] origin-bottom rounded-sm bg-primary/70"
              style={{
                height: `${20 + ((i * 31) % 80)}%`,
                animation: `wave-bar ${1.2 + (i % 5) * 0.18}s ease-in-out infinite`,
                animationDelay: `${(i % 7) * 0.07}s`,
              }}
            />
          ))}
        </div>

        {/* scrubber */}
        <div className="relative h-[3px] overflow-hidden rounded-full bg-white/15">
          <span
            className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-primary"
            style={{ animation: "scrubber 6s linear infinite" }}
          />
        </div>

        <div className="mt-3 flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-white/70">
          <span>{reel.client}</span>
          <span>{reel.watch}</span>
        </div>
        <p className="mt-1 font-display text-sm font-semibold text-white">{reel.title}</p>
        <p className="font-mono text-[10px] text-white/60">{reel.views} views</p>
      </div>
    </div>
  );
}
