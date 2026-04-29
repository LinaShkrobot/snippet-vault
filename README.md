# Snippet Vault

Mini service for storing useful snippets (links / notes / commands) with tags and search.

Test assignment for Junior FullStack Developer.

## Stack

- **Frontend:** Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4
- **Backend:** NestJS 11 + TypeScript + Mongoose
- **Database:** MongoDB 8 (local; the same connection string format works with Atlas)

## Project structure

```
snippet-vault/
├── backend/        NestJS REST API on port 4000
├── frontend/       Next.js UI on port 3000
└── README.md
```

Two independent applications. Frontend talks to backend via HTTP, backend talks to MongoDB via Mongoose.

## Prerequisites

- Node.js 18+ (tested on 24)
- npm 10+
- MongoDB 6+ running locally on `mongodb://localhost:27017`
  - On Ubuntu/WSL: `sudo systemctl start mongod`
  - Or any MongoDB Atlas cluster — just change `MONGODB_URI` in `backend/.env`

## Local setup

### 1. Clone and install

```bash
git clone https://github.com/LinaShkrobot/snippet-vault.git
cd snippet-vault

# backend deps
cd backend && npm install && cd ..

# frontend deps
cd frontend && npm install && cd ..
```

### 2. Environment variables

Copy the example files and adjust if needed.

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

`backend/.env`:

```
MONGODB_URI=mongodb://localhost:27017/snippet-vault
PORT=4000
```

`frontend/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 3. Run in dev mode

In two separate terminals:

```bash
# terminal 1: backend on http://localhost:4000
cd backend
npm run start:dev

# terminal 2: frontend on http://localhost:3000
cd frontend
npm run dev
```

Open <http://localhost:3000> in a browser.

### 4. Production build

```bash
# backend
cd backend
npm run build
npm run start:prod

# frontend
cd frontend
npm run build
npm run start
```

## API reference

Base URL: `http://localhost:4000`

### `GET /snippets`

List snippets with optional filters and pagination.

Query params:

- `q` — full-text search across `title` and `content`
- `tag` — filter by exact tag
- `page` — page number, default `1`
- `limit` — page size, default `20`, max `100`

Example:

```bash
curl "http://localhost:4000/snippets?q=react&tag=js&page=1&limit=10"
```

Response:

```json
{
  "data": [ /* array of Snippet */ ],
  "total": 5,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

### `POST /snippets`

Create a snippet. Body:

```json
{
  "title": "React useEffect cheatsheet",
  "content": "Always include dependencies",
  "type": "note",
  "tags": ["react", "js"]
}
```

`type` must be one of `link | note | command`. `tags` is optional.

```bash
curl -X POST http://localhost:4000/snippets \
  -H "Content-Type: application/json" \
  -d '{"title":"NestJS docs","content":"https://docs.nestjs.com","type":"link","tags":["nestjs"]}'
```

### `GET /snippets/:id`

Returns a single snippet by ObjectId, or `404` if missing or id is malformed.

### `PATCH /snippets/:id`

Partial update. Same body shape as `POST`, all fields optional.

```bash
curl -X PATCH http://localhost:4000/snippets/ID \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated title"}'
```

### `DELETE /snippets/:id`

Returns `204 No Content` on success, `404` if not found.

## Implementation notes

- **Validation:** global `ValidationPipe` with `whitelist + forbidNonWhitelisted + transform`. Unknown fields are rejected with `400`.
- **Error handling:** invalid Mongo ObjectIds and missing documents both return `404` via `NotFoundException` (cleaner than `500` from a `CastError`).
- **Search:** MongoDB text index on `title` and `content`, queried via `$text: { $search }`.
- **Pagination:** `skip + limit`, plus a parallel `countDocuments` (via `Promise.all`) for `totalPages`.
- **CORS:** enabled globally on the backend so the Next.js client can call it from a different port.
- **Frontend data fetching:** server components with `fetch(..., { cache: 'no-store' })` for always-fresh data; mutations use `router.refresh()` to revalidate the list.
- **Dynamic routes:** `params` is a Promise in Next.js 16 — `await params` is required.

## What I'd improve given more time

- **Server actions** for mutations instead of client-side `fetch` — fewer round-trips, less code in the form.
- **Optimistic UI** for delete (remove from list immediately, rollback on error).
- **Tag picker** instead of a comma-separated text field, with autocomplete from existing tags.
- **Backend tests** (e2e + unit for the service) using `@nestjs/testing` and `mongodb-memory-server`.
- **Search highlight** on the list page for matched terms.
- **Atlas + Render/Vercel deploy** with a CI workflow.

## License

Test task code, not licensed for redistribution.
