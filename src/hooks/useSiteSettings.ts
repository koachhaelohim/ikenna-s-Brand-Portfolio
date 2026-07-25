import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { SiteSettings } from "../lib/types";

const FALLBACK: SiteSettings = {
  id: "default",
  site_name: "Studio",
  tagline: "Identity systems built to be believed.",
  bg_color: "#000000",
  surface_color: "#0a0a0c",
  text_color: "#f5f5f7",
  muted_color: "#86868b",
  accent_color: "#f5f5f7",
  font_display:
    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif',
  font_body:
    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif',
  about_text:
    "A design studio focused on identity systems for brands that need to feel considered, not decorated.",
  location: "",
  email: "",
  instagram_url: "",
  behance_url: "",
  updated_at: "",
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(FALLBACK);
  const [loading, setLoading] = useState(true);

  const refetch = async () => {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", "default")
      .single();
    if (!error && data) setSettings(data as SiteSettings);
    setLoading(false);
  };

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    const root = document.documentElement.style;
    root.setProperty("--bg", settings.bg_color);
    root.setProperty("--surface", settings.surface_color);
    root.setProperty("--text", settings.text_color);
    root.setProperty("--text-muted", settings.muted_color);
    root.setProperty("--accent", settings.accent_color);
    root.setProperty("--font-display", settings.font_display);
    root.setProperty("--font-body", settings.font_body);
    document.title = settings.site_name + " — Brand Design Portfolio";
  }, [settings]);

  return { settings, loading, refetch };
}
