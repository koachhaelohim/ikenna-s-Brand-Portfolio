# Studio — Brand Design Portfolio + CMS

A dark, minimalist (Apple-in-dark-mode) brand design portfolio with a full
content management system built on Supabase. Every text field, color, font,
and project comes from Supabase — nothing is hardcoded.

- **Frontend**: React + Vite + TypeScript, React Router
- **Backend**: Supabase (Postgres + Auth + Storage) — no separate server needed
- **Deploy target**: Vercel

## What you get

- `/` — public portfolio site (hero, project grid, about, contact)
- `/work/:id` — individual case study page (cover image, description, PDF link)
- `/admin/login` — CMS sign-in
- `/admin` — manage projects (create, edit, publish/unpublish, delete)
- `/admin/projects/:id` — edit a project, upload cover image + PDF
- `/admin/settings` — edit site name, tagline, about text, contact links, and
  full theme (background/surface/text/accent colors, display + body fonts)

Changing anything in `/admin` reflects live on the public site immediately —
no redeploy needed, since content lives in Supabase, not in the code.

## 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** → paste the contents of `supabase/schema.sql` → run it.
   This creates the `site_settings` and `projects` tables with RLS policies.
3. Go to **Storage** → create two buckets: `covers` and `pdfs`, both **public**.
   (The schema file's storage policies assume these bucket names.)
4. Go to **Authentication → Users** → add yourself as a user (email + password).
   This is the only account that can sign in to `/admin`.
5. Go to **Project Settings → API** → copy the **Project URL** and **anon public key**.

## 2. Configure the app locally (VS Code)

```bash
git clone <your-new-repo-url>
cd brand-portfolio
npm install
cp .env.example .env
```

Paste your Supabase URL and anon key into `.env`:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxxxxxxx
```

Run it:

```bash
npm run dev
```

Visit `http://localhost:5173`, and `http://localhost:5173/admin/login` to sign
in with the Supabase user you created.

## 3. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

(Create the empty repo on GitHub first, or use `gh repo create` if you have
the GitHub CLI.)

## 4. Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import the GitHub repo.
2. Framework preset: **Vite** (auto-detected).
3. Add environment variables in the Vercel project settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy. `vercel.json` is already set up to handle client-side routing
   (`/admin`, `/work/:id`, etc.) on refresh.

From then on, every `git push` to `main` redeploys automatically.

## Notes

- There's no public sign-up — only the user(s) you manually add in Supabase
  Authentication can access `/admin`.
- To add case study PDFs: on `/admin/projects/:id`, upload a cover image (used
  on the grid and case study page) and the PDF itself (linked as "View full
  case study"). If you want the PDF's actual pages laid out on the case study
  page instead of a download link, that's a follow-up: extracting PDF pages to
  images on upload.
- All theme values are CSS custom properties set from `site_settings`, so
  changing colors/fonts in `/admin/settings` reskins the whole site instantly.
