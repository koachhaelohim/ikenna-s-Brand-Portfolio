import { useSiteSettings } from "../hooks/useSiteSettings";
import { useProjects } from "../hooks/useProjects";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import ProjectCard from "../components/ProjectCard";

export default function Home() {
  const { settings } = useSiteSettings();
  const { projects, loading } = useProjects();

  return (
    <div>
      <Nav siteName={settings.site_name} />

      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 5vw", position: "relative" }}>
        <div style={{ fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: 22, fontFamily: "ui-monospace, SF Mono, Menlo, monospace" }}>
          {settings.location ? `Brand design studio — ${settings.location}` : "Brand design studio"}
        </div>
        <h1 style={{ fontSize: "clamp(42px,8vw,108px)", fontWeight: 600, letterSpacing: "-0.035em", lineHeight: 1.02, maxWidth: "16ch", fontFamily: "var(--font-display)" }}>
          {settings.tagline}
        </h1>
        <p style={{ marginTop: 28, fontSize: "clamp(16px,1.6vw,20px)", color: "var(--text-muted)", maxWidth: "42ch", lineHeight: 1.5 }}>
          Selected brand design work — logo systems, visual identity, and the thinking behind them.
        </p>
      </section>

      <section id="work" style={{ padding: "120px 5vw" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 56, flexWrap: "wrap", gap: 16 }}>
          <div style={{ fontSize: "clamp(26px,3vw,38px)", fontWeight: 600, letterSpacing: "-0.02em", fontFamily: "var(--font-display)" }}>Selected work</div>
          <div style={{ fontSize: 13, color: "var(--text-muted)", maxWidth: "34ch" }}>
            A running collection of identity systems, refreshed as new case studies are published.
          </div>
        </div>

        {loading && <div style={{ color: "var(--text-dim)", fontSize: 13 }}>Loading…</div>}
        {!loading && projects.length === 0 && (
          <div style={{ color: "var(--text-dim)", fontSize: 13 }}>
            No published projects yet — add one from /admin.
          </div>
        )}
        {projects.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
              gap: 1,
              background: "var(--border)",
              border: "1px solid var(--border)",
              borderRadius: 14,
              overflow: "hidden",
            }}
          >
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </section>

      <section id="about" style={{ padding: "120px 5vw" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>
          <p style={{ fontSize: "clamp(20px,2.2vw,28px)", lineHeight: 1.4, fontWeight: 500, letterSpacing: "-0.01em" }}>
            {settings.about_text}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            {settings.location && (
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: 14, fontSize: 13.5 }}>
                <span style={{ color: "var(--text-dim)" }}>Based</span><span>{settings.location}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: 14, fontSize: 13.5 }}>
              <span style={{ color: "var(--text-dim)" }}>Focus</span><span>Identity, brand systems, logo design</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: 14, fontSize: 13.5 }}>
              <span style={{ color: "var(--text-dim)" }}>Status</span><span>Open for projects</span>
            </div>
          </div>
        </div>
      </section>

      <Footer settings={settings} />
    </div>
  );
}
