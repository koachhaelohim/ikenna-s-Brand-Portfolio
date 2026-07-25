import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useProjects } from "../../hooks/useProjects";
import type { Project } from "../../lib/types";

export default function Dashboard() {
  const { projects, loading, refetch } = useProjects({ includeDrafts: true });
  const [items, setItems] = useState<Project[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setItems(projects);
  }, [projects]);

  async function createProject() {
    const { data } = await supabase
      .from("projects")
      .insert({ title: "Untitled project", sort_order: items.length })
      .select()
      .single();
    if (data) navigate(`/admin/projects/${data.id}`);
  }

  async function deleteProject(id: string) {
    if (!confirm("Delete this project?")) return;
    await supabase.from("projects").delete().eq("id", id);
    refetch();
  }

  async function togglePublish(id: string, published: boolean) {
    await supabase.from("projects").update({ published: !published }).eq("id", id);
    refetch();
  }

  async function persistOrder(ordered: Project[]) {
    await Promise.all(
      ordered.map((p, i) =>
        p.sort_order === i ? null : supabase.from("projects").update({ sort_order: i }).eq("id", p.id)
      )
    );
  }

  function handleDrop(targetIndex: number) {
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null);
      setOverIndex(null);
      return;
    }
    const reordered = [...items];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(targetIndex, 0, moved);
    setItems(reordered);
    setDragIndex(null);
    setOverIndex(null);
    persistOrder(reordered);
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate("/admin/login");
  }

  return (
    <div style={{ padding: "48px 5vw", maxWidth: 900, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
        <div style={{ fontSize: 26, fontWeight: 600, fontFamily: "var(--font-display)" }}>Admin</div>
        <div style={{ display: "flex", gap: 20, fontSize: 13, color: "var(--text-muted)" }}>
          <Link to="/admin/settings" style={{ textDecoration: "none" }}>Site settings</Link>
          <Link to="/" style={{ textDecoration: "none" }}>View site</Link>
          <button onClick={signOut} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 13, padding: 0 }}>
            Sign out
          </button>
        </div>
      </div>

      <button
        onClick={createProject}
        style={{ background: "var(--text)", color: "var(--bg)", border: "none", borderRadius: 8, padding: "10px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 16 }}
      >
        + New project
      </button>
      <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 16 }}>
        Drag a row by its handle to reorder — this controls the order projects appear in on the site.
      </div>

      {loading && <div style={{ color: "var(--text-dim)" }}>Loading…</div>}

      <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "var(--border)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
        {items.map((p, i) => (
          <div
            key={p.id}
            onDragOver={(e) => {
              e.preventDefault();
              if (overIndex !== i) setOverIndex(i);
            }}
            onDrop={(e) => {
              e.preventDefault();
              handleDrop(i);
            }}
            style={{
              background: overIndex === i && dragIndex !== null && dragIndex !== i ? "var(--surface-2, #111113)" : "var(--surface)",
              padding: "16px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
              opacity: dragIndex === i ? 0.4 : 1,
              borderTop: overIndex === i && dragIndex !== null && dragIndex !== i ? "2px solid var(--text)" : "2px solid transparent",
              transition: "background 0.15s, opacity 0.15s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                draggable
                onDragStart={() => setDragIndex(i)}
                onDragEnd={() => {
                  setDragIndex(null);
                  setOverIndex(null);
                }}
                title="Drag to reorder"
                style={{
                  cursor: "grab",
                  color: "var(--text-dim)",
                  fontSize: 16,
                  letterSpacing: "2px",
                  padding: "4px 6px",
                  userSelect: "none",
                  lineHeight: 1,
                }}
              >
                ⠿
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{p.title}</div>
                <div style={{ fontSize: 12, color: "var(--text-dim)" }}>
                  {p.category || "Uncategorized"} · {p.published ? "Published" : "Draft"}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 14, fontSize: 13 }}>
              <button onClick={() => togglePublish(p.id, p.published)} style={{ background: "none", border: "1px solid var(--border)", borderRadius: 6, padding: "6px 10px", color: "var(--text)", cursor: "pointer" }}>
                {p.published ? "Unpublish" : "Publish"}
              </button>
              <Link to={`/admin/projects/${p.id}`} style={{ color: "var(--text-muted)", textDecoration: "none", alignSelf: "center" }}>Edit</Link>
              <button onClick={() => deleteProject(p.id)} style={{ background: "none", border: "none", color: "#ff6961", cursor: "pointer" }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
