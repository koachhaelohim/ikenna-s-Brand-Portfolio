import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSiteSettings } from "../hooks/useSiteSettings";
import { useProjects } from "../hooks/useProjects";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import ProjectCard from "../components/ProjectCard";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const { settings } = useSiteSettings();
  const { projects, loading } = useProjects();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance — runs once on load, no scroll trigger needed
      const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 1 } });
      tl.from(".hero-eyebrow", { opacity: 0, y: 16 })
        .from(".hero-title", { opacity: 0, y: 44 }, "-=0.7")
        .from(".hero-sub", { opacity: 0, y: 20 }, "-=0.65");

      // Section headers fade up as they enter view
      gsap.utils.toArray<HTMLElement>(".reveal-up").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 32,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });

      // Project cards stagger in as the grid scrolls into view
      gsap.from(".project-card", {
        opacity: 0,
        y: 56,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: ".work-grid", start: "top 82%" },
      });

      // About meta rows stagger from the side
      gsap.from(".about-meta-row", {
        opacity: 0,
        x: 24,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".about-meta", start: "top 85%" },
      });
    }, rootRef);

    return () => ctx.revert();
    // re-run once projects have loaded so ScrollTrigger measures the real grid
  }, [loading, projects.length]);

  return (
    <div ref={rootRef}>
      <Nav siteName={settings.site_name} />

      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 5vw", position: "relative" }}>
        <div className="hero-eyebrow" style={{ fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: 22, fontFamily: "ui-monospace, SF Mono, Menlo, monospace" }}>
          {settings.location ? `Brand design studio — ${settings.location}` : "Brand design studio"}
        </div>
        <h1 className="hero-title" style={{ fontSize: "clamp(42px,8vw,108px)", fontWeight: 600, letterSpacing: "-0.035em", lineHeight: 1.02, maxWidth: "16ch", fontFamily: "var(--font-display)" }}>
          {settings.tagline}
        </h1>
        <p className="hero-sub" style={{ marginTop: 28, fontSize: "clamp(16px,1.6vw,20px)", color: "var(--text-muted)", maxWidth: "42ch", lineHeight: 1.5 }}>
          Selected brand design work — logo systems, visual identity, and the thinking behind them.
        </p>
      </section>

      <section id="work" style={{ padding: "120px 5vw" }}>
        <div className="reveal-up" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 56, flexWrap: "wrap", gap: 16 }}>
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
          <div className="work-grid">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </section>

      <section id="about" style={{ padding: "120px 5vw" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>
          <p className="reveal-up" style={{ fontSize: "clamp(20px,2.2vw,28px)", lineHeight: 1.4, fontWeight: 500, letterSpacing: "-0.01em" }}>
            {settings.about_text}
          </p>
          <div className="about-meta" style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            {settings.location && (
              <div className="about-meta-row" style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: 14, fontSize: 13.5 }}>
                <span style={{ color: "var(--text-dim)" }}>Based</span><span>{settings.location}</span>
              </div>
            )}
            <div className="about-meta-row" style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: 14, fontSize: 13.5 }}>
              <span style={{ color: "var(--text-dim)" }}>Focus</span><span>Identity, brand systems, logo design</span>
            </div>
            <div className="about-meta-row" style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: 14, fontSize: 13.5 }}>
              <span style={{ color: "var(--text-dim)" }}>Status</span><span>Open for projects</span>
            </div>
          </div>
        </div>
      </section>

      <Footer settings={settings} />
    </div>
  );
}
