import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useSiteSettings } from "../hooks/useSiteSettings";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import type { Project } from "../lib/types";

export default function ProjectDetail() {
  const { id } = useParams();
  const { settings } = useSiteSettings();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("projects").select("*").eq("id", id).single();
      setProject(data as Project);
      setLoading(false);
    })();
  }, [id]);

  return (
    <div>
      <Nav siteName={settings.site_name} />
      <section style={{ padding: "140px 5vw 80px" }}>
        <Link to="/" style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none" }}>← Back to work</Link>
        {loading && <div style={{ marginTop: 40, color: "var(--text-dim)" }}>Loading…</div>}
        {!loading && !project && <div style={{ marginTop: 40, color: "var(--text-dim)" }}>Project not found.</div>}
        {project && (
          <div style={{ marginTop: 40 }}>
            <div style={{ fontSize: 12, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16, fontFamily: "ui-monospace, SF Mono, Menlo, monospace" }}>
              {project.category}{project.year ? ` — ${project.year}` : ""}
            </div>
            <h1 style={{ fontSize: "clamp(34px,5vw,64px)", fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 24, fontFamily: "var(--font-display)" }}>
              {project.title}
            </h1>
            {project.cover_image_url && (
              <img
                src={project.cover_image_url}
                alt={project.title}
                style={{ width: "100%", borderRadius: 14, border: "1px solid var(--border)", marginBottom: 32 }}
              />
            )}
            <p style={{ fontSize: 17, lineHeight: 1.7, color: "var(--text-muted)", maxWidth: "62ch" }}>
              {project.description}
            </p>
            {project.pdf_url && (
              <a
                href={project.pdf_url}
                target="_blank"
                rel="noreferrer"
                style={{ display: "inline-block", marginTop: 32, fontSize: 14, textDecoration: "underline" }}
              >
                View full case study (PDF)
              </a>
            )}
          </div>
        )}
      </section>
      <Footer settings={settings} />
    </div>
  );
}
