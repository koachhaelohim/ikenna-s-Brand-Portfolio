import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import type { Project } from "../../lib/types";

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

export default function ProjectEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("projects").select("*").eq("id", id).single();
      setProject(data as Project);
    })();
  }, [id]);

  function update<K extends keyof Project>(key: K, value: Project[K]) {
    setProject((p) => (p ? { ...p, [key]: value } : p));
  }

  async function save() {
    if (!project) return;
    setSaving(true);
    await supabase
      .from("projects")
      .update({
        title: project.title,
        category: project.category,
        year: project.year,
        description: project.description,
        cover_image_url: project.cover_image_url,
        pdf_url: project.pdf_url,
        sort_order: project.sort_order,
        updated_at: new Date().toISOString(),
      })
      .eq("id", project.id);
    setSaving(false);
    navigate("/admin");
  }

  async function uploadFile(file: File, bucket: "covers" | "pdfs", field: "cover_image_url" | "pdf_url") {
    setUploading(true);
    const path = `${project!.id}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
    if (!error) {
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      update(field, data.publicUrl);
    }
    setUploading(false);
  }

  if (!project) return <div style={{ padding: 48 }}>Loading…</div>;

  return (
    <div style={{ padding: "48px 5vw", maxWidth: 700, margin: "0 auto" }}>
      <Link to="/admin" style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none" }}>← Back to admin</Link>
      <div style={{ fontSize: 24, fontWeight: 600, margin: "24px 0 32px", fontFamily: "var(--font-display)" }}>Edit project</div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <label style={labelStyle}>Title</label>
          <input style={inputStyle} value={project.title} onChange={(e) => update("title", e.target.value)} />
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Category</label>
            <input style={inputStyle} value={project.category} onChange={(e) => update("category", e.target.value)} placeholder="e.g. Identity, Logo system" />
          </div>
          <div style={{ width: 120 }}>
            <label style={labelStyle}>Year</label>
            <input style={inputStyle} value={project.year} onChange={(e) => update("year", e.target.value)} placeholder="2026" />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Description</label>
          <textarea style={{ ...inputStyle, minHeight: 100, resize: "vertical" }} value={project.description} onChange={(e) => update("description", e.target.value)} />
        </div>

        <div>
          <label style={labelStyle}>Cover image</label>
          {project.cover_image_url && <img src={project.cover_image_url} style={{ width: "100%", borderRadius: 8, marginBottom: 10, border: "1px solid var(--border)" }} />}
          <input type="file" accept="image/*" onChange={(e) => e.target.files && uploadFile(e.target.files[0], "covers", "cover_image_url")} />
        </div>

        <div>
          <label style={labelStyle}>Case study PDF</label>
          {project.pdf_url && (
            <div style={{ fontSize: 13, marginBottom: 10 }}>
              <a href={project.pdf_url} target="_blank" rel="noreferrer" style={{ textDecoration: "underline" }}>Current PDF</a>
            </div>
          )}
          <input type="file" accept="application/pdf" onChange={(e) => e.target.files && uploadFile(e.target.files[0], "pdfs", "pdf_url")} />
        </div>

        {uploading && <div style={{ fontSize: 12, color: "var(--text-dim)" }}>Uploading…</div>}

        <button
          onClick={save}
          disabled={saving}
          style={{ background: "var(--text)", color: "var(--bg)", border: "none", borderRadius: 8, padding: "12px 16px", fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: 12 }}
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}
