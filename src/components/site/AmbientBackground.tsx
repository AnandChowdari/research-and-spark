/**
 * Fixed, full-viewport ambient layer: subtle aurora blobs + film grain.
 * pointer-events disabled, never blocks clicks.
 */
export function AmbientBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* base vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% -10%, color-mix(in oklab, var(--color-lime) 6%, transparent), transparent 60%), radial-gradient(80% 60% at 100% 100%, color-mix(in oklab, var(--color-purple) 8%, transparent), transparent 70%)",
        }}
      />
      {/* drifting lime blob */}
      <div
        className="absolute -top-40 -left-40 h-[60vmin] w-[60vmin] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--color-lime) 22%, transparent) 0%, transparent 70%)",
          animation: "aurora-drift 22s ease-in-out infinite",
        }}
      />
      {/* drifting purple blob */}
      <div
        className="absolute -bottom-40 -right-40 h-[70vmin] w-[70vmin] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--color-purple) 26%, transparent) 0%, transparent 70%)",
          animation: "aurora-drift-2 28s ease-in-out infinite",
        }}
      />
      {/* grain */}
      <div
        className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.7'/></svg>\")",
        }}
      />
      {/* faint grid */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in oklab, var(--color-cream) 30%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--color-cream) 30%, transparent) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
    </div>
  );
}
