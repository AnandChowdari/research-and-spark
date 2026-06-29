import { createFileRoute, Link } from "@tanstack/react-router";
import { simplePlans, precisePlans } from "@/lib/data";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — flow/studio" },
      { name: "description", content: "Transparent pricing for video plans, custom productions, and AI conversion systems." },
      { property: "og:title", content: "Pricing — flow/studio" },
      { property: "og:description", content: "Transparent pricing for content and AI conversion systems." },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          ░ pricing — all of it, no asterisks
        </p>
        <h1 className="mt-4 font-display text-5xl font-bold leading-[1.02] tracking-tight md:text-7xl">
          Honest pricing. <span className="text-primary">Pick your pace.</span>
        </h1>

        <h2 className="mt-20 font-display text-3xl font-bold tracking-tight">Video — monthly retainers</h2>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {[
            { name: "Simple", tagline: "Fast turnaround. Strong fundamentals.", plans: simplePlans },
            { name: "Precise", tagline: "Cinematic. Strategic. Founder-led.", plans: precisePlans, highlight: true },
          ].map((t) => (
            <div key={t.name} className={`rounded-2xl border bg-card p-8 ${t.highlight ? "border-primary/50" : "border-border"}`}>
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

        <h2 className="mt-20 font-display text-3xl font-bold tracking-tight">Custom productions</h2>
        <div className="mt-8 rounded-2xl border border-border bg-gradient-to-br from-secondary/60 to-card p-8 md:p-10">
          <div className="grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-center">
            <div>
              <h3 className="font-display text-2xl font-bold leading-tight md:text-3xl">
                SaaS animations, product launches, branding
              </h3>
              <p className="mt-3 text-muted-foreground">Bespoke scope. Fixed-fee or milestone-based. We'll quote after a 30-min call.</p>
            </div>
            <div className="text-right">
              <div className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">starts from</div>
              <div className="mt-1 font-display text-5xl font-bold text-primary">₹26,000</div>
            </div>
          </div>
        </div>

        <h2 className="mt-20 font-display text-3xl font-bold tracking-tight">AI conversion systems</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            { name: "Spark", price: "₹45k / mo", features: ["1 funnel", "WhatsApp automation", "Basic analytics"] },
            { name: "Engine", price: "₹95k / mo", features: ["3 funnels", "Voice agent + chatbot", "CRM + calendar sync", "Weekly reports"], highlight: true },
            { name: "Empire", price: "Custom", features: ["Unlimited funnels", "Multi-region voice", "Custom integrations", "Dedicated pod"] },
          ].map((t) => (
            <div key={t.name} className={`rounded-2xl border bg-card p-8 ${t.highlight ? "border-primary/50" : "border-border"}`}>
              <h3 className="font-display text-2xl font-bold">{t.name}</h3>
              <div className="mt-2 font-mono text-2xl text-foreground">{t.price}</div>
              <ul className="mt-6 space-y-2">
                {t.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <span className="size-1.5 rounded-full bg-primary" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-4 text-base font-semibold text-primary-foreground">
            Book a discovery call →
          </Link>
        </div>
      </div>
    </section>
  );
}
