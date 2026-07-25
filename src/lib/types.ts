export interface SiteSettings {
  id: string;
  site_name: string;
  tagline: string;
  bg_color: string;
  surface_color: string;
  text_color: string;
  muted_color: string;
  accent_color: string;
  font_display: string;
  font_body: string;
  about_text: string;
  location: string;
  email: string;
  instagram_url: string;
  behance_url: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  cover_image_url: string | null;
  pdf_url: string | null;
  body: unknown[];
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}
