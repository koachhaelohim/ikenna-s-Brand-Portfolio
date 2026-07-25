import { useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import type { Project } from "../lib/types";

export default function ProjectCard({ project }: { project: Project }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const quickX = useRef<gsap.QuickToFunc | null>(null);
  const quickY = useRef<gsap.QuickToFunc | null>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (!quickX.current) {
      quickX.current = gsap.quickTo(card, "--mx", { duration: 0.5, ease: "power3.out" });
      quickY.current = gsap.quickTo(card, "--my", { duration: 0.5, ease: "power3.out" });
    }
    quickX.current(x);
    quickY.current?.(y);
  }

  function handleMouseEnter() {
    gsap.to(cardRef.current, { "--spotlight-opacity": 1, duration: 0.35 });
  }
  function handleMouseLeave() {
    gsap.to(cardRef.current, { "--spotlight-opacity": 0, duration: 0.5 });
  }

  return (
    <Link
      ref={cardRef}
      to={`/work/${project.id}`}
      className="project-card"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        background: "var(--surface)",
        padding: 32,
        minHeight: 380,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        position: "relative",
        textDecoration: "none",
        color: "inherit",
        overflow: "hidden",
        // @ts-ignore custom properties for the spotlight
        "--mx": "50%",
        "--my": "50%",
        "--spotlight-opacity": 0,
      }}
    >
      {/* GSAP-driven cursor spotlight — position tracks the mouse smoothly */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: "var(--spotlight-opacity)" as unknown as number,
          background:
            "radial-gradient(320px circle at var(--mx) var(--my), rgba(255,255,255,0.06), transparent 65%)",
          transition: "opacity 0.1s linear",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 32,
          left: 32,
          right: 32,
          bottom: 120,
          borderRadius: 10,
          background: project.cover_image_url
            ? `center/cover no-repeat url(${project.cover_image_url})`
            : "linear-gradient(150deg,#1a1a1c,#0a0a0a)",
          border: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-dim)",
          fontSize: 12,
          fontFamily: "ui-monospace, SF Mono, Menlo, monospace",
        }}
      >
        {!project.cover_image_url && "Cover image"}
      </div>
      <div style={{ fontSize: 11, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10, fontFamily: "ui-monospace, SF Mono, Menlo, monospace" }}>
        {project.category}{project.year ? ` — ${project.year}` : ""}
      </div>
      <div style={{ fontSize: 21, fontWeight: 600, letterSpacing: "-0.01em", marginBottom: 6, fontFamily: "var(--font-display)" }}>
        {project.title}
      </div>
      <div style={{ fontSize: 13.5, color: "var(--text-muted)", lineHeight: 1.5 }}>
        {project.description}
      </div>
    </Link>
  );
}
