import { Link } from "react-router-dom";
import type { Project } from "../lib/types";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      to={`/work/${project.id}`}
      className="project-card"
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
      }}
    >
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
