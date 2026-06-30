
# Hero "Growth Engine" Animation — Rebuild Plan

Replace the current 3-node canvas pipeline with an SVG-based ambient system that occupies the right side of the hero and bleeds into the next section. Goal is feel, not explanation — visitors think "I wish my business worked like that."

## Files

- Rewrite `src/components/home/HeroFlowAnimation.tsx` — full SVG composition + Motion-driven pulse engine.
- Light edit `src/components/home/HeroSection.tsx` — remove the rounded card frame so the system reads as the brand surface, not a thumbnail. Let it overflow the right edge and extend ~120px below the section so it can visually bleed into the next section.
- No new dependencies. Uses `motion/react` (already installed) + native SVG.

## Composition (SVG, 100% width of right column, no card chrome)

```text
            ┌── floating UI fragment (content card)
            │
   ●━━━━━╮  │     ╭━━━━━━●━━━━━━━━━╮
  intake │  │     │     core       │ ──╮
         ╰──┴─────┤   (AI brain)   │   ├──● outcome
                  ╰━━━┬━━━━━━━━━━━╯   │
                      ├── CRM frag ───┤
                      ├── WA frag ────┤
                      └── calendar ───╯
                       (parallel branches)
```

- 7 primary nodes: `intake`, `signal`, `route`, `core`, `branch-followup`, `branch-crm`, `branch-schedule`, `outcome` (8 total — intake + 6 working + outcome).
- Connections are smooth cubic Béziers (`<path d="M.. C ..">`), generated from control points offset perpendicular to each segment — gives the fiber-optic feel, never straight.
- Nodes rendered as layered SVG: outer translucent disc, inner gradient core, 1px hairline ring, single subtle lime highlight arc on top. No labels.
- 4–5 floating UI fragments (abstract, unlabelled): small rounded rects with 2-3 internal lines/dots suggesting a calendar grid, message bubbles, a chart sparkline, a contact card. Positioned around the network, drifting via slow Motion `animate` loops (±3–6px over 6–11s, eased).

## Pulse engine

- Single lime pulse traveling along the network. Uses Motion's `useMotionValue` + `useAnimationFrame` to advance a normalized `t` along a precomputed path sequence.
- Each path is measured once via `pathRef.getTotalLength()` so the pulse can be placed with `getPointAtLength(t * len)` — gives true curve-following motion.
- Pulse is a small lime circle with `filter: url(#glow)` (SVG gaussian blur + merge) for the soft halo.
- Node-arrival behavior: when pulse t enters a node radius, that node's Motion controls trigger a 600ms `scale 1 → 1.04 → 1` + `opacity` glow boost on its outer disc. No bounce, no flash.
- Branching: after the `route` node, the pulse splits into 3 ghost pulses (cloned + lower opacity) that traverse the parallel branches at slightly different speeds, then re-merge at `outcome`.
- Arrival at `outcome`: a single synchronized "wash" — every connection path's stroke opacity briefly lifts (600ms ease-out, 300ms hold, 1.2s ease-out down). Not an explosion. Then a new pulse starts from a different intake offset.

## Ambient life (always running, even between pulses)

- All nodes have a slow breathing transform (scale 1 → 1.015 → 1 over 7–11s, staggered phases).
- Connection paths have an animated `<stop>` offset on their linear gradient (12–18s loop) so light direction slowly shifts.
- Occasional micro-particles (3 at a time max) travel secondary connections at low opacity.
- Core node has 5 small particles circulating inside via SVG `<animateMotion>` on a tiny ellipse path, suggesting "thinking."

## Cursor awareness (no chase)

- Single `pointermove` listener on the SVG wrapper. Compute distance to each node; if within 140px, lift that node's glow by up to +0.25 opacity (eased via Motion spring, stiffness 80, damping 20). UI fragments within 100px nudge 2–3px away from cursor on a spring. No element follows the cursor.

## Scroll bleed into next section

- Hero section's right column gets `overflow: visible` and the SVG extends ~140px below the section bottom via a tall viewBox + absolute positioning.
- The pulse, on its final leg, exits the visible hero frame downward along a tail path that runs into the next section's top edge. The next section gets a thin lime gradient line entering from the top right that visually continues the pulse trail (decorative div with `mask-image: linear-gradient(to bottom, black, transparent)`).

## Performance + accessibility

- `prefers-reduced-motion`: disable pulse loop and breathing, keep static composition with one resting glow.
- `IntersectionObserver` pauses the rAF loop when hero is offscreen.
- SVG is `aria-hidden="true"`. The H1 remains the page's semantic anchor.
- Targets ≤ 4ms/frame: ~30 animated SVG nodes total, no per-frame DOM creation, Motion values mutate transforms only.

## Technical sketch

```tsx
// HeroFlowAnimation.tsx (shape only)
const PATHS = [
  { id: 'a', d: 'M 40 220 C 120 180, 180 240, 260 210' },     // intake → signal
  { id: 'b', d: 'M 260 210 C 320 200, 360 260, 420 250' },    // signal → route
  { id: 'c1', d: 'M 420 250 C 480 200, 540 180, 600 220' },   // branch followup
  { id: 'c2', d: 'M 420 250 C 480 250, 540 250, 600 250' },   // branch crm
  { id: 'c3', d: 'M 420 250 C 480 300, 540 320, 600 280' },   // branch schedule
  { id: 'd', d: 'M 600 220 C 660 230, 700 240, 740 250' },    // merge → outcome (3 paths converge)
  { id: 'tail', d: 'M 740 250 C 760 320, 740 400, 700 480' }, // bleed into next section
]

const pulse = useMotionValue(0)
useAnimationFrame((t) => { /* advance, branch, trigger node controls */ })
```

## Out of scope

- No changes to hero copy, CTAs, or stats list.
- No changes to other sections' content (only the thin decorative continuation line added at top of next section).
- No new packages.
