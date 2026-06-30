"use client";
import { useEffect, useRef, useState, useMemo } from "react";
import { motion, useAnimationFrame, useMotionValue, useSpring } from "motion/react";

/**
 * The Flogrit "Growth Engine".
 * An always-alive ambient system: curved fiber paths, premium nodes,
 * floating UI fragments, a branching lime pulse that turns attention
 * into a customer. No labels — feeling first.
 */

const VB_W = 820;
const VB_H = 640;

// Node positions in viewBox space
const N = {
  intake: { x: 70, y: 280, r: 18 },
  signal: { x: 220, y: 200, r: 22 },
  route: { x: 360, y: 300, r: 26 },
  core: { x: 520, y: 290, r: 46 }, // central processing
  bFollow: { x: 640, y: 170, r: 16 },
  bCRM: { x: 680, y: 290, r: 16 },
  bSched: { x: 640, y: 410, r: 16 },
  outcome: { x: 770, y: 300, r: 22 },
} as const;

type NKey = keyof typeof N;

// Segments — each is a cubic bezier between two nodes
type Seg = { id: string; from: NKey; to: NKey; d: string; branch?: "main" | "follow" | "crm" | "sched" | "merge" | "tail" };

const SEGMENTS: Seg[] = [
  { id: "s1", from: "intake", to: "signal", d: `M ${N.intake.x} ${N.intake.y} C 130 220, 160 170, ${N.signal.x} ${N.signal.y}`, branch: "main" },
  { id: "s2", from: "signal", to: "route", d: `M ${N.signal.x} ${N.signal.y} C 260 260, 310 320, ${N.route.x} ${N.route.y}`, branch: "main" },
  { id: "s3", from: "route", to: "core", d: `M ${N.route.x} ${N.route.y} C 410 280, 460 280, ${N.core.x} ${N.core.y}`, branch: "main" },
  { id: "f1", from: "core", to: "bFollow", d: `M ${N.core.x} ${N.core.y} C 560 220, 600 180, ${N.bFollow.x} ${N.bFollow.y}`, branch: "follow" },
  { id: "f2", from: "core", to: "bCRM", d: `M ${N.core.x} ${N.core.y} C 580 290, 630 290, ${N.bCRM.x} ${N.bCRM.y}`, branch: "crm" },
  { id: "f3", from: "core", to: "bSched", d: `M ${N.core.x} ${N.core.y} C 560 360, 600 410, ${N.bSched.x} ${N.bSched.y}`, branch: "sched" },
  { id: "m1", from: "bFollow", to: "outcome", d: `M ${N.bFollow.x} ${N.bFollow.y} C 700 200, 760 250, ${N.outcome.x} ${N.outcome.y}`, branch: "merge" },
  { id: "m2", from: "bCRM", to: "outcome", d: `M ${N.bCRM.x} ${N.bCRM.y} C 720 290, 760 290, ${N.outcome.x} ${N.outcome.y}`, branch: "merge" },
  { id: "m3", from: "bSched", to: "outcome", d: `M ${N.bSched.x} ${N.bSched.y} C 700 400, 760 350, ${N.outcome.x} ${N.outcome.y}`, branch: "merge" },
  // tail bleeds downward off-canvas → next section
  { id: "tail", from: "outcome", to: "outcome", d: `M ${N.outcome.x} ${N.outcome.y} C 790 400, 740 520, 710 ${VB_H}`, branch: "tail" },
];

// Pulse journey: ordered list of segments. After core we run all 3 branches in parallel,
// then a merge segment, then tail.
type Phase =
  | { kind: "single"; segId: string }
  | { kind: "parallel"; segs: string[]; mergeSegs: string[] }
  | { kind: "tail"; segId: string };

const JOURNEY: Phase[] = [
  { kind: "single", segId: "s1" },
  { kind: "single", segId: "s2" },
  { kind: "single", segId: "s3" },
  { kind: "parallel", segs: ["f1", "f2", "f3"], mergeSegs: ["m1", "m2", "m3"] },
  { kind: "tail", segId: "tail" },
];

// Floating UI fragments — abstract, unlabelled
const FRAGMENTS = [
  // calendar grid
  {
    x: 90, y: 90, w: 110, h: 70,
    render: (
      <g>
        <rect width="110" height="70" rx="10" />
        <line x1="0" y1="20" x2="110" y2="20" strokeOpacity="0.25" />
        {[0, 1, 2, 3, 4].map((c) => (
          <line key={c} x1={c * 22 + 11} y1="20" x2={c * 22 + 11} y2="70" strokeOpacity="0.18" />
        ))}
        {[
          [1, 1], [3, 0], [2, 2], [4, 1],
        ].map(([c, r], i) => (
          <rect key={i} x={c * 22 + 4} y={28 + r * 14} width="14" height="8" rx="2" fillOpacity="0.6" />
        ))}
      </g>
    ),
  },
  // chart sparkline
  {
    x: 600, y: 60, w: 150, h: 78,
    render: (
      <g>
        <rect width="150" height="78" rx="10" />
        <path d="M 10 60 L 30 50 L 50 55 L 70 35 L 90 40 L 110 22 L 140 18" fill="none" strokeOpacity="0.9" />
        <circle cx="140" cy="18" r="3" />
        <line x1="10" y1="68" x2="140" y2="68" strokeOpacity="0.15" />
      </g>
    ),
  },
  // message bubbles
  {
    x: 60, y: 470, w: 130, h: 90,
    render: (
      <g>
        <rect width="130" height="90" rx="10" />
        <rect x="10" y="14" width="70" height="16" rx="8" fillOpacity="0.5" />
        <rect x="50" y="36" width="70" height="16" rx="8" fillOpacity="0.35" />
        <rect x="10" y="58" width="58" height="14" rx="7" fillOpacity="0.5" />
      </g>
    ),
  },
  // contact card
  {
    x: 620, y: 470, w: 140, h: 80,
    render: (
      <g>
        <rect width="140" height="80" rx="10" />
        <circle cx="22" cy="40" r="12" fillOpacity="0.5" />
        <rect x="42" y="26" width="80" height="10" rx="3" fillOpacity="0.45" />
        <rect x="42" y="44" width="60" height="8" rx="3" fillOpacity="0.3" />
      </g>
    ),
  },
  // tiny status pill
  {
    x: 310, y: 70, w: 92, h: 32,
    render: (
      <g>
        <rect width="92" height="32" rx="16" />
        <circle cx="14" cy="16" r="4" fillOpacity="0.95" />
        <rect x="26" y="12" width="54" height="8" rx="4" fillOpacity="0.45" />
      </g>
    ),
  },
];

function distance(ax: number, ay: number, bx: number, by: number) {
  const dx = ax - bx, dy = ay - by;
  return Math.sqrt(dx * dx + dy * dy);
}

export function HeroFlowAnimation() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Refs for all path elements so we can measure them
  const pathRefs = useRef<Record<string, SVGPathElement | null>>({});
  const pathLens = useRef<Record<string, number>>({});

  // Pulse renderers — primary + 3 ghosts for branches
  const pulseRef = useRef<SVGCircleElement | null>(null);
  const ghostRefs = useRef<(SVGCircleElement | null)[]>([null, null, null]);

  // Node glow boost map (driven by motion values per node)
  const glowRefs = useRef<Record<string, SVGCircleElement | null>>({});

  // Cursor awareness
  const cursor = useRef({ x: -9999, y: -9999, active: false });
  const cursorX = useMotionValue(-9999);
  const cursorY = useMotionValue(-9999);
  useSpring(cursorX, { stiffness: 80, damping: 20 });
  useSpring(cursorY, { stiffness: 80, damping: 20 });

  // Wash trigger (after outcome arrival)
  const [washTick, setWashTick] = useState(0);

  // Reduced motion?
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const fn = () => setReduced(m.matches);
    m.addEventListener?.("change", fn);
    return () => m.removeEventListener?.("change", fn);
  }, []);

  // Measure paths after mount
  useEffect(() => {
    for (const seg of SEGMENTS) {
      const el = pathRefs.current[seg.id];
      if (el) pathLens.current[seg.id] = el.getTotalLength();
    }
  }, []);

  // Visibility — pause when offscreen
  const visibleRef = useRef(true);
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const io = new IntersectionObserver(([e]) => {
      visibleRef.current = e?.isIntersecting ?? true;
    });
    io.observe(wrap);
    return () => io.disconnect();
  }, []);

  // Journey state
  const phaseIdx = useRef(0);
  const phaseT = useRef(0); // 0..1 within current phase
  const lastTimeRef = useRef<number | null>(null);
  // For paused breath between cycles
  const restRef = useRef(0);

  // Node arrival memory (which nodes have been triggered in current phase)
  const triggeredRef = useRef<Set<string>>(new Set());

  const triggerNode = (key: NKey) => {
    const el = glowRefs.current[key];
    if (!el) return;
    // Use Web Animations API for a one-shot glow lift — no per-frame work.
    el.animate(
      [
        { opacity: el.getAttribute("data-rest") ?? "0.18", transform: "scale(1)" },
        { opacity: "0.55", transform: "scale(1.06)" },
        { opacity: el.getAttribute("data-rest") ?? "0.18", transform: "scale(1)" },
      ],
      { duration: 900, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
    );
  };

  const triggerWash = () => {
    setWashTick((n) => n + 1);
  };

  useAnimationFrame((time) => {
    if (!visibleRef.current || reduced) return;
    const last = lastTimeRef.current ?? time;
    const dt = Math.min(64, time - last); // clamp
    lastTimeRef.current = time;

    if (restRef.current > 0) {
      restRef.current -= dt;
      return;
    }

    const phase = JOURNEY[phaseIdx.current];
    // 5.5s per single seg, parallel a bit faster
    const dur = phase.kind === "parallel" ? 2600 : phase.kind === "tail" ? 2200 : 1900;
    phaseT.current += dt / dur;

    const place = (seg: SVGPathElement | null, t: number, target: SVGCircleElement | null) => {
      if (!seg || !target) return;
      const len = pathLens.current[seg.id ? seg.id : ""] ?? seg.getTotalLength();
      const tt = Math.max(0, Math.min(1, t));
      const pt = seg.getPointAtLength(tt * len);
      target.setAttribute("cx", String(pt.x));
      target.setAttribute("cy", String(pt.y));
    };

    if (phase.kind === "single") {
      const segEl = pathRefs.current[phase.segId];
      place(segEl, phaseT.current, pulseRef.current);
      // hide ghosts
      ghostRefs.current.forEach((g) => g && (g.style.opacity = "0"));

      // Node trigger on arrival
      const seg = SEGMENTS.find((s) => s.id === phase.segId)!;
      if (phaseT.current >= 1 && !triggeredRef.current.has(seg.to)) {
        triggeredRef.current.add(seg.to);
        triggerNode(seg.to);
      }
    } else if (phase.kind === "parallel") {
      // primary pulse hides; ghosts go down each branch then continue along merges
      if (pulseRef.current) pulseRef.current.style.opacity = "0";
      const halves = phaseT.current; // 0..1 — 0..0.5 traverse branch, 0.5..1 traverse merge
      phase.segs.forEach((segId, i) => {
        const ghost = ghostRefs.current[i];
        if (!ghost) return;
        ghost.style.opacity = "0.85";
        const localT = halves * 2;
        if (localT <= 1) {
          place(pathRefs.current[segId], localT, ghost);
          const seg = SEGMENTS.find((s) => s.id === segId)!;
          if (localT >= 0.98 && !triggeredRef.current.has(seg.to + ":branch")) {
            triggeredRef.current.add(seg.to + ":branch");
            triggerNode(seg.to);
          }
        } else {
          const mergeId = phase.mergeSegs[i];
          place(pathRefs.current[mergeId], localT - 1, ghost);
        }
      });
    } else if (phase.kind === "tail") {
      // Restore primary pulse
      if (pulseRef.current) pulseRef.current.style.opacity = "1";
      ghostRefs.current.forEach((g) => g && (g.style.opacity = "0"));
      place(pathRefs.current[phase.segId], phaseT.current, pulseRef.current);
    }

    if (phaseT.current >= 1) {
      phaseT.current = 0;
      // outcome arrival triggers between merge and tail
      if (phase.kind === "parallel") {
        triggeredRef.current.add("outcome");
        triggerNode("outcome");
        triggerWash();
      }
      phaseIdx.current = (phaseIdx.current + 1) % JOURNEY.length;
      if (phaseIdx.current === 0) {
        triggeredRef.current.clear();
        restRef.current = 1100; // small breath between journeys
      }
    }
  });

  // Cursor handlers
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    // map client → viewBox
    const vx = ((e.clientX - rect.left) / rect.width) * VB_W;
    const vy = ((e.clientY - rect.top) / rect.height) * VB_H;
    cursor.current = { x: vx, y: vy, active: true };
    cursorX.set(vx);
    cursorY.set(vy);

    // Boost node rest glow if near
    (Object.keys(N) as NKey[]).forEach((k) => {
      const n = N[k];
      const d = distance(vx, vy, n.x, n.y);
      const el = glowRefs.current[k];
      if (!el) return;
      const rest = parseFloat(el.getAttribute("data-rest") ?? "0.18");
      const lift = Math.max(0, 1 - d / 140) * 0.25;
      el.style.opacity = String(rest + lift);
    });
  };
  const onLeave = () => {
    cursor.current.active = false;
    cursorX.set(-9999);
    cursorY.set(-9999);
    (Object.keys(N) as NKey[]).forEach((k) => {
      const el = glowRefs.current[k];
      if (!el) return;
      const rest = el.getAttribute("data-rest") ?? "0.18";
      el.style.opacity = rest;
    });
  };

  const breathPhases = useMemo(
    () => (Object.keys(N) as NKey[]).map(() => Math.random() * 6),
    [],
  );

  return (
    <div
      ref={wrapRef}
      className="relative h-full w-full"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      aria-hidden="true"
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 h-full w-full overflow-visible"
      >
        <defs>
          <radialGradient id="coreFill" cx="50%" cy="45%" r="65%">
            <stop offset="0%" stopColor="oklch(0.92 0.22 124)" stopOpacity="0.45" />
            <stop offset="55%" stopColor="oklch(0.66 0.16 295)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="oklch(0.16 0 0)" stopOpacity="1" />
          </radialGradient>

          <radialGradient id="nodeFill" cx="50%" cy="40%" r="70%">
            <stop offset="0%" stopColor="oklch(0.32 0.04 124)" stopOpacity="1" />
            <stop offset="100%" stopColor="oklch(0.16 0 0)" stopOpacity="1" />
          </radialGradient>

          <radialGradient id="haloLime" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.92 0.22 124)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="oklch(0.92 0.22 124)" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="oklch(0.92 0.22 124)" stopOpacity="0.05">
              <animate attributeName="offset" values="-0.2;0.8" dur="14s" repeatCount="indefinite" />
            </stop>
            <stop offset="30%" stopColor="oklch(0.92 0.22 124)" stopOpacity="0.55">
              <animate attributeName="offset" values="0.0;1.0" dur="14s" repeatCount="indefinite" />
            </stop>
            <stop offset="60%" stopColor="oklch(0.66 0.16 295)" stopOpacity="0.4">
              <animate attributeName="offset" values="0.3;1.2" dur="14s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="oklch(0.66 0.16 295)" stopOpacity="0.05" />
          </linearGradient>

          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" />
          </filter>

          {/* Tiny ellipse for core particle orbits */}
          <path id="coreOrbit" d={`M ${N.core.x - 28} ${N.core.y} a 28 16 0 1 0 56 0 a 28 16 0 1 0 -56 0`} />
          <path id="coreOrbit2" d={`M ${N.core.x - 20} ${N.core.y} a 20 30 -30 1 0 40 0 a 20 30 -30 1 0 -40 0`} />
        </defs>

        {/* Subtle technical texture — faint grid behind the system */}
        <g opacity="0.06">
          {Array.from({ length: 14 }).map((_, i) => (
            <line key={`gh${i}`} x1="0" y1={i * 48} x2={VB_W} y2={i * 48} stroke="oklch(0.92 0.22 124)" strokeWidth="0.5" />
          ))}
          {Array.from({ length: 18 }).map((_, i) => (
            <line key={`gv${i}`} x1={i * 48} y1="0" x2={i * 48} y2={VB_H} stroke="oklch(0.92 0.22 124)" strokeWidth="0.5" />
          ))}
        </g>

        {/* Floating UI fragments — drift slowly */}
        {FRAGMENTS.map((f, i) => (
          <motion.g
            key={`frag-${i}`}
            initial={false}
            animate={{
              x: [f.x, f.x + (i % 2 ? -4 : 4), f.x],
              y: [f.y, f.y + (i % 2 ? 5 : -5), f.y],
            }}
            transition={{ duration: 8 + i * 1.4, ease: "easeInOut", repeat: Infinity }}
          >
            <g
              transform={`translate(0 0)`}
              fill="oklch(0.22 0 0)"
              stroke="oklch(0.92 0.22 124)"
              strokeOpacity="0.22"
              strokeWidth="0.8"
            >
              {/* base card */}
              <g opacity="0.85">{f.render}</g>
            </g>
          </motion.g>
        ))}

        {/* Connection lines */}
        <g
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth="1.4"
          strokeLinecap="round"
          style={{
            transition: "opacity 1200ms cubic-bezier(0.22, 1, 0.36, 1)",
            opacity: 0.85,
          }}
        >
          {SEGMENTS.map((s) => (
            <path
              key={s.id}
              ref={(el) => {
                pathRefs.current[s.id] = el;
              }}
              d={s.d}
              opacity={s.branch === "tail" ? 0.45 : 1}
            />
          ))}
        </g>

        {/* Wash overlay — synchronized glow on arrival */}
        <g key={washTick} fill="none" stroke="oklch(0.92 0.22 124)" strokeWidth="2" strokeLinecap="round" opacity="0">
          <animate attributeName="opacity" values="0;0.55;0" dur="2.1s" begin="0s" fill="freeze" />
          {SEGMENTS.filter((s) => s.branch !== "tail").map((s) => (
            <path key={s.id + "wash"} d={s.d} />
          ))}
        </g>

        {/* Nodes */}
        {(Object.keys(N) as NKey[]).map((k, i) => {
          const n = N[k];
          const isCore = k === "core";
          const restGlow = isCore ? 0.32 : 0.2;
          return (
            <motion.g
              key={k}
              initial={false}
              animate={{
                scale: [1, 1.012, 1],
              }}
              transition={{
                duration: 7 + (breathPhases[i] || 0),
                ease: "easeInOut",
                repeat: Infinity,
                delay: i * 0.4,
              }}
              style={{ transformOrigin: `${n.x}px ${n.y}px`, transformBox: "fill-box" } as React.CSSProperties}
            >
              {/* Outer halo (glow boost target) */}
              <circle
                ref={(el) => {
                  glowRefs.current[k] = el;
                }}
                data-rest={String(restGlow)}
                cx={n.x}
                cy={n.y}
                r={n.r * 2.2}
                fill="url(#haloLime)"
                style={{
                  opacity: restGlow,
                  transition: "opacity 600ms cubic-bezier(0.22, 1, 0.36, 1)",
                  transformOrigin: `${n.x}px ${n.y}px`,
                }}
              />
              {/* Body */}
              <circle
                cx={n.x}
                cy={n.y}
                r={n.r}
                fill={isCore ? "url(#coreFill)" : "url(#nodeFill)"}
                stroke="oklch(0.92 0.22 124)"
                strokeOpacity={isCore ? 0.55 : 0.32}
                strokeWidth="1"
              />
              {/* Inner ring */}
              <circle
                cx={n.x}
                cy={n.y}
                r={n.r - 5}
                fill="none"
                stroke="oklch(1 0 0)"
                strokeOpacity="0.08"
              />
              {/* Lime highlight arc */}
              <path
                d={`M ${n.x - n.r * 0.7} ${n.y - n.r * 0.55} A ${n.r} ${n.r} 0 0 1 ${n.x + n.r * 0.7} ${n.y - n.r * 0.55}`}
                fill="none"
                stroke="oklch(0.92 0.22 124)"
                strokeOpacity="0.45"
                strokeWidth="0.8"
              />
            </motion.g>
          );
        })}

        {/* Core "thinking" particles — circulate inside core node */}
        {Array.from({ length: 5 }).map((_, i) => (
          <circle key={`cp${i}`} r={1.6} fill="oklch(0.92 0.22 124)" opacity="0.85">
            <animateMotion
              dur={`${5 + i * 0.7}s`}
              repeatCount="indefinite"
              begin={`${-i * 0.6}s`}
              href={i % 2 ? "#coreOrbit2" : "#coreOrbit"}
            />
          </circle>
        ))}

        {/* Pulse — primary + 3 ghosts */}
        <g filter="url(#glow)">
          <circle
            ref={pulseRef}
            r="4"
            fill="oklch(0.96 0.22 124)"
            style={{ filter: "drop-shadow(0 0 6px oklch(0.92 0.22 124))" }}
          />
          {[0, 1, 2].map((i) => (
            <circle
              key={`ghost-${i}`}
              ref={(el) => {
                ghostRefs.current[i] = el;
              }}
              r="3"
              fill="oklch(0.92 0.22 124)"
              opacity="0"
              style={{ filter: "drop-shadow(0 0 5px oklch(0.92 0.22 124))" }}
            />
          ))}
        </g>
      </svg>

      {/* Top corner technical accents */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground/70">
        <span className="mr-1 inline-block size-1.5 translate-y-[-1px] animate-pulse rounded-full bg-primary align-middle" />
        system.live
      </div>
      <div className="pointer-events-none absolute right-0 top-0 z-10 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground/70">
        attention · conversion · automation
      </div>
    </div>
  );
}
