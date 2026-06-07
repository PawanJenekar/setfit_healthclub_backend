# SetFit Backend

Quick bootstrap for the SetFit backend (Express + Postgres).

Run locally:

```bash
npm install
npm run dev
```

Endpoints:
- `GET /health` - basic health check
- `GET /api/v1/users` - list users
- `POST /api/v1/users` - create user `{ name, email }`

DB initialization: see `sql/init.sql`.
