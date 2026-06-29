import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — flow/studio" },
      { name: "description", content: "A two-pillar studio for founders: content that earns attention, systems that convert it." },
      { property: "og:title", content: "About — flow/studio" },
      { property: "og:description", content: "We don't run campaigns. We build flows that compound." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <section className="border-b border-border bg-background grain">
        <div className="mx-auto max-w-4xl px-5 py-24 lg:px-8 lg:py-32">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">░ about</p>
          <h1 className="mt-4 font-display text-5xl font-bold leading-[1.02] tracking-tight md:text-6xl lg:text-7xl">
            We don't run campaigns. We build <span className="text-primary">flows that compound.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-muted-foreground">
            flow/studio started because too many founders were stuck between two broken halves: an agency making pretty videos that no one converted, and a "growth hacker" running ads into a leaky funnel.
          </p>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            We do both halves under one roof, so neither blames the other.
          </p>
        </div>
      </section>

      <section className="border-b border-border bg-secondary/15">
        <div className="mx-auto max-w-5xl px-5 py-20 lg:px-8 lg:py-24">
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">The manifesto</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {[
              ["Retention is revenue.", "Watch time, dwell time, response time — these are the numbers we manage. Vanity gets retired in week one."],
              ["Hooks beat budgets.", "A great first second outperforms a 10× ad spend on a bad creative. Every time."],
              ["No silos.", "Editors sit next to automation engineers. Brief once, ship once, measure once."],
              ["Speed beats polish.", "Ship in 7 days, iterate weekly. The cleanest plan is worthless if it takes a quarter to launch."],
              ["Own your audience.", "We optimise for owned channels — email, WhatsApp, your CRM. Rented attention is borrowed time."],
              ["Honest numbers.", "If a campaign tanked, we say so. If it ripped, the dashboard says so. The work earns the next month."],
            ].map(([h, b]) => (
              <div key={h} className="rounded-2xl border border-border bg-card p-7">
                <h3 className="font-display text-xl font-bold">{h}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto max-w-4xl px-5 py-20 lg:px-8 lg:py-24">
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">The studio</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              { v: "8", l: "in the studio" },
              { v: "3 yrs", l: "average client tenure" },
              { v: "36+", l: "shipped this quarter" },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl border border-border bg-card p-7">
                <div className="font-mono text-4xl text-primary">{s.v}</div>
                <div className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
          <Link to="/contact" className="mt-12 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
            Come work with us →
          </Link>
        </div>
      </section>
    </>
  );
}
