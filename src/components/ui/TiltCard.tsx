import { useRef, type ReactNode, type CSSProperties } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  intensity?: number; // deg
  glow?: boolean;
  style?: CSSProperties;
};

/**
 * Lightweight 3D-tilt + cursor-glow wrapper. Pure DOM, no library.
 * Respects prefers-reduced-motion via CSS var fallback.
 */
export function TiltCard({ children, className = "", intensity = 6, glow = true, style }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - py) * intensity;
    const ry = (px - 0.5) * intensity;
    el.style.setProperty("--rx", `${rx}deg`);
    el.style.setProperty("--ry", `${ry}deg`);
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`${glow ? "cursor-glow" : ""} ${className}`}
      style={{
        transform: "perspective(900px) rotateX(var(--rx,0)) rotateY(var(--ry,0))",
        transformStyle: "preserve-3d",
        transition: "transform 260ms cubic-bezier(.2,.7,.2,1)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
