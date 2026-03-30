# Multikart Backend

Node.js + Express + MySQL backend for the Multikart frontend. All API routes mirror the existing Next.js JSON API contract so the frontend can switch via `NEXT_PUBLIC_API_URL`.

## Setup

1. **Install dependencies**
   ```bash
   cd backend && npm install
   ```

2. **Environment**
   - Copy `.env.example` to `.env`
   - Set `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, and optionally `CORS_ORIGIN`, `PORT`

3. **Database**
   - Create MySQL database: `CREATE DATABASE multikart;`
   - Run schema: `mysql -u root -p multikart < scripts/schema.sql`
   - Seed from frontend JSON: `npm run seed` (run from backend directory; expects `frontend/src/app/api` to exist)

   Seed: cd backend && npm run seed

4. **Run**
   - Development: `npm run dev` (port 5000 by default)
   - Production: `npm start`

## Frontend

To use this backend instead of the Next.js API routes, set in the frontend (e.g. `.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Leave unset to keep using the existing Next.js `/api` routes.

## Admin

To connect the admin panel to this backend:

1. In the **admin** project, create or edit `admin/.env.local`:
   ```env
   API_PROD_URL=http://localhost:5000/api
   ```
2. Run the admin on a different port than the frontend (e.g. `cd admin && npm run dev -- -p 3001`).
3. Backend CORS allows `http://localhost:3000` (frontend) and `http://localhost:3001` (admin) by default; set `CORS_ORIGIN` in backend `.env` if you use other origins.

Shared routes (category, product, theme, home, menu, settings, login, self, etc.) work with the backend. Some admin-only endpoints (e.g. role, user CRUD, shipping, dashboard stats) may need to be added to the backend if you use them.

## API base path

All routes are mounted under `/api` (e.g. `GET /api/category`, `GET /api/product`, `POST /api/login`, `GET /api/self`). The frontend `baseURL` should be `http://localhost:5000/api` when using the backend.

## Auth

- `POST /api/register` – body: `{ name, email, password }`
- `POST /api/login` – body: `{ email, password }` → returns `{ user, token }`
- `GET /api/self` – requires `Authorization: Bearer <token>`

Protected routes use the same Bearer token in the `Authorization` header.

**Seeded users (after `npm run seed`):**
- **Admin:** `admin@example.com` / `password` (role: admin)
- **Consumer:** `john.customer@example.com` / `password` (role: consumer)
