import { Link } from "@tanstack/react-router";
import { useFlow } from "@/lib/flow";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Nav() {
  const { flow, setFlow, hasChosen } = useFlow();
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/services/content", label: "Content" },
    { to: "/services/systems", label: "Systems" },
    { to: "/work", label: "Work" },
    { to: "/pricing", label: "Pricing" },
    { to: "/about", label: "About" },
  ] as const;

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold tracking-tight">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 7h12M9 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          flow<span className="text-primary">/</span>studio
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {hasChosen && (
            <button
              onClick={() => setFlow(flow === "A" ? "B" : "A")}
              className={cn(
                "hidden items-center gap-1.5 rounded-full border border-border bg-secondary/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground md:inline-flex",
              )}
              title="Switch which problem leads the page"
            >
              <span className="size-1.5 rounded-full bg-primary" />
              flow {flow.toLowerCase()} · swap
            </button>
          )}
          <Link
            to="/contact"
            className="hidden rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02] md:inline-block"
          >
            Book a call
          </Link>
          <button
            className="grid h-9 w-9 place-items-center rounded-md border border-border text-foreground md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-3">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground"
            >
              Book a call
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
