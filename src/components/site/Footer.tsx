import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold">
              <span className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 7h12M9 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              flow/studio
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              We create a flow of attention to leads for your business. Content that earns reach, systems that convert it.
            </p>
            <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Hyderabad · IN
            </p>
          </div>

          <FooterCol title="Studio" links={[
            ["Content", "/services/content"],
            ["Systems", "/services/systems"],
            ["Pricing", "/pricing"],
          ]} />
          <FooterCol title="Proof" links={[
            ["Work", "/work"],
            ["About", "/about"],
          ]} />
          <FooterCol title="Get in" links={[
            ["Contact", "/contact"],
            ["Book a call", "/contact"],
          ]} />
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} flow/studio. All rights reserved.</p>
          <p className="font-mono uppercase tracking-[0.2em]">attention → leads → systems</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">{title}</h4>
      <ul className="mt-4 space-y-2">
        {links.map(([label, to]) => (
          <li key={label}>
            <Link to={to} className="text-sm text-foreground/90 transition-colors hover:text-primary">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
