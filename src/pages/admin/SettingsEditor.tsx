import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useSiteSettings } from "../../hooks/useSiteSettings";

const inputStyle: React.CSSProperties = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  padding: "12px 14px",
  fontSize: 14,
  color: "var(--text)",
  width: "100%",
};
const labelStyle: React.CSSProperties = { fontSize: 12, color: "var(--text-dim)", marginBottom: 6, display: "block" };
const colorRow: React.CSSProperties = { display: "flex", gap: 10, alignItems: "center" };

export default function SettingsEditor() {
  const { settings, refetch } = useSiteSettings();
  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  // sync once settings load from Supabase
  useEffect(() => {
    setForm(settings);
  }, [settings]);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save() {
    setSaving(true);
    await supabase
      .from("site_settings")
      .update({ ...form, updated_at: new Date().toISOString() })
      .eq("id", "default");
    setSaving(false);
    refetch();
    navigate("/admin");
  }

  return (
    <div style={{ padding: "48px 5vw", maxWidth: 700, margin: "0 auto" }}>
      <Link to="/admin" style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none" }}>← Back to admin</Link>
      <div style={{ fontSize: 24, fontWeight: 600, margin: "24px 0 32px", fontFamily: "var(--font-display)" }}>Site settings</div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <label style={labelStyle}>Site name</label>
          <input style={inputStyle} value={form.site_name} onChange={(e) => update("site_name", e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Hero tagline</label>
          <input style={inputStyle} value={form.tagline} onChange={(e) => update("tagline", e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>About text</label>
          <textarea style={{ ...inputStyle, minHeight: 90 }} value={form.about_text} onChange={(e) => update("about_text", e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Location</label>
          <input style={inputStyle} value={form.location} onChange={(e) => update("location", e.target.value)} />
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Email</label>
            <input style={inputStyle} value={form.email} onChange={(e) => update("email", e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Instagram URL</label>
            <input style={inputStyle} value={form.instagram_url} onChange={(e) => update("instagram_url", e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Behance URL</label>
            <input style={inputStyle} value={form.behance_url} onChange={(e) => update("behance_url", e.target.value)} />
          </div>
        </div>

        <div style={{ fontSize: 13, color: "var(--text-dim)", marginTop: 10, borderTop: "1px solid var(--border)", paddingTop: 20 }}>Theme</div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {([
            ["Background", "bg_color"],
            ["Surface", "surface_color"],
            ["Text", "text_color"],
            ["Muted text", "muted_color"],
            ["Accent", "accent_color"],
          ] as const).map(([label, key]) => (
            <div key={key} style={{ width: 150 }}>
              <label style={labelStyle}>{label}</label>
              <div style={colorRow}>
                <input type="color" value={form[key]} onChange={(e) => update(key, e.target.value)} style={{ width: 36, height: 36, border: "none", background: "none", padding: 0 }} />
                <input style={{ ...inputStyle, flex: 1 }} value={form[key]} onChange={(e) => update(key, e.target.value)} />
              </div>
            </div>
          ))}
        </div>

        <div>
          <label style={labelStyle}>Display font (CSS font-family stack)</label>
          <input style={inputStyle} value={form.font_display} onChange={(e) => update("font_display", e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Body font (CSS font-family stack)</label>
          <input style={inputStyle} value={form.font_body} onChange={(e) => update("font_body", e.target.value)} />
        </div>

        <button
          onClick={save}
          disabled={saving}
          style={{ background: "var(--text)", color: "var(--bg)", border: "none", borderRadius: 8, padding: "12px 16px", fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: 12 }}
        >
          {saving ? "Saving…" : "Save settings"}
        </button>
      </div>
    </div>
  );
}
