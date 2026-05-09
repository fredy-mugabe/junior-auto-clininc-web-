# Junior Auto Clinique ltd — J.A.C

Single-page web app (React + Vite) with an Express API that stores job/internship applications in Supabase. Authentication uses Supabase Auth on the client; the API verifies admin access with the user JWT and `ADMIN_EMAILS`.

## Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project

## 1. Supabase setup

1. Create a project in the Supabase dashboard.
2. Open **SQL Editor** and run the script in [`docs/supabase-schema.sql`](docs/supabase-schema.sql).
3. Under **Authentication → Providers**, ensure **Email** is enabled (defaults are fine for development).
4. Copy **Project URL**, **anon public** key, and **service_role** key from **Settings → API**. Never expose the service role in frontend or public repos.

## 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAILS, FRONTEND_ORIGIN
npm install
npm run dev
```

The API listens on `http://localhost:4000` by default.

- `POST /api/apply` — public; saves an application row.
- `GET /api/applications` — requires `Authorization: Bearer <Supabase access_token>` and an email listed in `ADMIN_EMAILS`.
 
**Application rule:** users must be **logged in** before `POST /api/apply` is accepted (enforced in both frontend and backend).

Production: `npm run build` then `npm start` (runs `node dist/index.js`).

## 3. Frontend

```bash
cd frontend
cp .env.example .env
# Edit .env: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_API_URL
npm install
npm run dev
```

Open `http://localhost:5173`. Brand logos live in `frontend/public/branding/`.

## 4. Run both apps

Use two terminals: backend `npm run dev` in `backend/`, frontend `npm run dev` in `frontend/`.

## Environment summary

| Variable | Where | Purpose |
|----------|--------|---------|
| `VITE_SUPABASE_URL` | frontend | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | frontend | Supabase anon key (browser) |
| `VITE_API_URL` | frontend | Express base URL; **leave empty in dev** so `/api` is proxied by Vite to port 4000 |
| `SUPABASE_URL` | backend | Same project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | backend | Service role (insert/select applications) |
| `ADMIN_EMAILS` | backend | Comma-separated emails allowed to list applications |
| `FRONTEND_ORIGIN` | backend | CORS origin |

## Troubleshooting: “Server misconfigured” / apply form fails

1. **Put `.env` in the correct folders** (not nested `frontend/frontend` or `backend/backend`):
   - Backend keys: `backend/.env` next to `backend/package.json`.
   - Frontend keys: `frontend/.env` next to `frontend/package.json`.
2. **Backend must have** `SUPABASE_URL` and **`SUPABASE_SERVICE_ROLE_KEY`** (service role, not the anon key). Restart the API after editing `.env`.
3. **Run the SQL** in [`docs/supabase-schema.sql`](docs/supabase-schema.sql) so the `applications` table exists.
4. Ensure **`npm run dev`** is running in `backend/` and `VITE_API_URL` in `frontend/.env` points at that same API (default `http://localhost:4000`).

## Vercel (production)

**Production URL:** [https://junior-auto-clininc-officalwebsite.vercel.app](https://junior-auto-clininc-officalwebsite.vercel.app)

If the live site does not match `main` on GitHub:

1. In Vercel → **Project → Settings → Git**, confirm the repository is **`fredy-mugabe/junior-auto-clininc-web-`** and the production branch is **`main`**.
2. Set **Root Directory** to **empty** (repository root), **not** `frontend`, so the root `vercel.json` runs `cd frontend && npm run build` and deploys `frontend/dist` (and keeps `/api` serverless routes at the repo root).
3. Open **Deployments** → latest production deployment → **Building** log. If the build failed, Vercel keeps serving the **previous** successful deployment (you will still see old text and old stats).
4. After a good deploy, scroll to the footer on the live site: **Build `abc1234`** must match the short Git SHA of the commit on GitHub.

## License

Private project for Junior Auto Clinique ltd.
