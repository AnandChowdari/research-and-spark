import { createFileRoute, Link } from "@tanstack/react-router";
import { contentServices, simplePlans, precisePlans } from "@/lib/data";
import { motion } from "motion/react";
import { ArrowRight, Film, Sparkles, Zap } from "lucide-react";

const icons = [Film, Sparkles, Zap];

export const Route = createFileRoute("/services/content")({
  head: () => ({
    meta: [
      { title: "Video, content & branding — flow/studio" },
      {
        name: "description",
        content:
          "Short-form, long-form, ad creative and brand systems. The studio side that earns reach for your business.",
      },
      { property: "og:title", content: "Video, content & branding — flow/studio" },
      {
        property: "og:description",
        content: "Hook-first editing, content strategy, and brand work that turns scroll into pipeline.",
      },
    ],
  }),
  component: ContentPage,
});

function ContentPage() {
  return (
    <>
      <section className="border-b border-border bg-background grain">
        <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            ░ pillar — content & reach
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-5xl font-bold leading-[1.02] tracking-tight md:text-6xl lg:text-7xl">
            We're a <span className="text-primary">video-first</span> studio for founders who refuse to be invisible.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            We obsess over the first 1.5 seconds. We test 12 hooks before publishing one. We treat retention like revenue. Because it is.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/contact" className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
              Book a content audit →
            </Link>
            <Link to="/work" className="rounded-full border border-border px-5 py-3 text-sm font-semibold hover:bg-secondary">
              See shipped work
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-secondary/15">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-5 md:grid-cols-3">
            {contentServices.map((s, i) => {
              const Icon = icons[i] ?? Film;
              return (
                <motion.div
                  key={s.slug}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.06 }}
                  className="rounded-2xl border border-border bg-card p-8"
                >
                  <div className="grid size-11 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Icon size={20} />
                  </div>
                  <h2 className="mt-6 font-display text-2xl font-bold">{s.title}</h2>
                  <p className="mt-3 text-muted-foreground">{s.blurb}</p>
                  <ul className="mt-5 space-y-2 border-t border-border pt-5">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-2 text-sm">
                        <ArrowRight size={12} className="text-primary" /> {b}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">Plans</h2>
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {[
              { name: "Simple", tagline: "Fast turnaround. Strong fundamentals.", plans: simplePlans },
              { name: "Precise", tagline: "Cinematic. Strategic. Founder-led.", plans: precisePlans, highlight: true },
            ].map((t) => (
              <div
                key={t.name}
                className={`rounded-2xl border bg-card p-8 ${t.highlight ? "border-primary/50" : "border-border"}`}
              >
                <h3 className="font-display text-2xl font-bold">{t.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t.tagline}</p>
                <ul className="mt-6 divide-y divide-border">
                  {t.plans.map((p) => (
                    <li key={p.label} className="flex items-baseline justify-between py-4">
                      <div>
                        <div className="font-medium">{p.label}</div>
                        <div className="font-mono text-xs text-muted-foreground">{p.videos} videos · {p.per}</div>
                      </div>
                      <div className="font-mono text-xl">{p.price}</div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
