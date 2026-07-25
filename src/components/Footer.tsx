import type { SiteSettings } from "../lib/types";

export default function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer
      id="contact"
      style={{
        padding: "64px 5vw 40px",
        borderTop: "1px solid var(--border)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 20,
      }}
    >
      <div style={{ fontSize: "clamp(24px,4vw,44px)", fontWeight: 600, letterSpacing: "-0.02em", maxWidth: "14ch", fontFamily: "var(--font-display)" }}>
        Let's build your identity.
      </div>
      <div style={{ display: "flex", gap: 26, fontSize: 13, color: "var(--text-muted)" }}>
        {settings.email && <a href={`mailto:${settings.email}`} style={{ textDecoration: "none" }}>Email</a>}
        {settings.instagram_url && <a href={settings.instagram_url} style={{ textDecoration: "none" }}>Instagram</a>}
        {settings.behance_url && <a href={settings.behance_url} style={{ textDecoration: "none" }}>Behance</a>}
      </div>
      <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 40, width: "100%" }}>
        © {new Date().getFullYear()} {settings.site_name}. All rights reserved.
      </div>
    </footer>
  );
}
