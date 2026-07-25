import { Link } from "react-router-dom";

export default function Nav({ siteName }: { siteName: string }) {
  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "22px 5vw",
        backdropFilter: "blur(20px) saturate(180%)",
        background: "rgba(0,0,0,0.55)",
        borderBottom: "1px solid var(--border)",
        fontFamily: "var(--font-display)",
      }}
    >
      <Link to="/" style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em", textDecoration: "none" }}>
        {siteName}°
      </Link>
      <div style={{ display: "flex", gap: 34, fontSize: 13, color: "var(--text-muted)" }}>
        <a href="#work" style={{ textDecoration: "none" }}>Work</a>
        <a href="#about" style={{ textDecoration: "none" }}>About</a>
        <a href="#contact" style={{ textDecoration: "none" }}>Contact</a>
      </div>
    </nav>
  );
}
