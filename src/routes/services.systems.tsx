import { createFileRoute, Link } from "@tanstack/react-router";
import { systemsServices } from "@/lib/data";
import { motion } from "motion/react";
import { Bot, MessageSquare, Mic, Search, Globe, Target } from "lucide-react";

const icons = [Target, Bot, MessageSquare, Mic, Search, Globe];

export const Route = createFileRoute("/services/systems")({
  head: () => ({
    meta: [
      { title: "AI systems, ads & sites — flow/studio" },
      {
        name: "description",
        content:
          "Meta ads, AI automations, voice agents, SEO and websites. The conversion side that turns reach into booked calls.",
      },
      { property: "og:title", content: "AI systems, ads & sites — flow/studio" },
      {
        property: "og:description",
        content: "From ads to automated messages to booked calls. The system that catches every signal.",
      },
    ],
  }),
  component: SystemsPage,
});

function SystemsPage() {
  return (
    <>
      <section className="border-b border-border bg-background grain">
        <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            ░ pillar — conversion systems
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-5xl font-bold leading-[1.02] tracking-tight md:text-6xl lg:text-7xl">
            A <span className="text-primary">24/7 system</span> that captures every lead — before they go cold.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            We wire ads, AI agents, your CRM, calendar, and site into one pipeline. A like in the morning is a booked call by lunch.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/contact" className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
              Book a systems audit →
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-secondary/15">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {systemsServices.map((s, i) => {
              const Icon = icons[i] ?? Bot;
              return (
                <motion.div
                  key={s.slug}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.05 }}
                  className="rounded-2xl border border-border bg-card p-7"
                >
                  <div className="grid size-10 place-items-center rounded-lg bg-accent/15 text-accent-foreground">
                    <Icon size={18} />
                  </div>
                  <h2 className="mt-5 font-display text-xl font-bold">{s.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{s.blurb}</p>
                  <ul className="mt-4 space-y-1 border-t border-border pt-4">
                    {s.bullets.map((b) => (
                      <li key={b} className="text-xs text-foreground/80">— {b}</li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
