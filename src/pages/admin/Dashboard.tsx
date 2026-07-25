import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useProjects } from "../../hooks/useProjects";

export default function Dashboard() {
  const { projects, loading, refetch } = useProjects({ includeDrafts: true });
  const navigate = useNavigate();

  async function createProject() {
    const { data } = await supabase
      .from("projects")
      .insert({ title: "Untitled project", sort_order: projects.length })
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

  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= projects.length) return;

    const current = projects[index];
    const neighbor = projects[target];

    // Swap sort_order between the two projects
    await Promise.all([
      supabase.from("projects").update({ sort_order: neighbor.sort_order }).eq("id", current.id),
      supabase.from("projects").update({ sort_order: current.sort_order }).eq("id", neighbor.id),
    ]);
    refetch();
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
        Use the arrows to reorder — this controls the order projects appear in on the site.
      </div>

      {loading && <div style={{ color: "var(--text-dim)" }}>Loading…</div>}

      <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "var(--border)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
        {projects.map((p, i) => (
          <div key={p.id} style={{ background: "var(--surface)", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <button
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  aria-label="Move up"
                  style={{ background: "none", border: "1px solid var(--border)", borderRadius: 5, width: 22, height: 20, color: i === 0 ? "var(--text-dim)" : "var(--text)", cursor: i === 0 ? "default" : "pointer", fontSize: 11, lineHeight: 1, padding: 0 }}
                >
                  ▲
                </button>
                <button
                  onClick={() => move(i, 1)}
                  disabled={i === projects.length - 1}
                  aria-label="Move down"
                  style={{ background: "none", border: "1px solid var(--border)", borderRadius: 5, width: 22, height: 20, color: i === projects.length - 1 ? "var(--text-dim)" : "var(--text)", cursor: i === projects.length - 1 ? "default" : "pointer", fontSize: 11, lineHeight: 1, padding: 0 }}
                >
                  ▼
                </button>
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
