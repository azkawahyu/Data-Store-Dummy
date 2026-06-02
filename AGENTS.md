# AI Agent Instructions for Data Store Dummy

This document helps AI coding agents understand the codebase structure, conventions, and workflows for the Data Store Dummy project.

## Project Overview

**Data Store Dummy** is an HR/Employee document management system built as a monorepo with:
- **Frontend**: Next.js 16 with React 19 for a modern UI
- **Backend**: Express.js API handling all data operations
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based auth with role-based access control (RBAC)
- **Key Features**: Employee management, document upload/verification, activity logging, dashboard analytics

## Technology Stack

| Layer | Stack |
|-------|-------|
| Frontend | Next.js 16, React 19, TypeScript, TailwindCSS |
| Backend | Express.js, Node.js, TypeScript |
| Database | PostgreSQL, Prisma ORM |
| Auth | JWT + NextAuth (legacy NextAuth routes still present) |
| Build | tsup (backend), Next.js build (frontend) |
| File Upload | Multer |
| Charts | Recharts |
| Validation | Zod |

## Directory Structure & Responsibilities

```
app/                    # Next.js frontend (Next.js App Router)
├── login, register     # Public auth pages
├── dashboard           # Main dashboard with analytics
├── documents           # Document upload & management UI
├── employee            # Employee list & details
├── profile             # User profile management
├── activity            # Activity log view
├── users               # User management
└── layout.tsx          # Root layout with global styles

backend/                # Express.js API server
├── server.ts           # Express setup, routing, middleware
├── bootstrap.ts        # Environment loading, server startup
├── lib/
│   ├── auth.ts         # JWT auth utilities, password hashing
│   └── uploads.ts      # File upload configuration
└── routes/             # API endpoints
    ├── auth.ts         # Login, logout, register endpoints
    ├── users.ts        # User CRUD operations
    ├── employees.ts    # Employee CRUD
    ├── documents.ts    # Document retrieval, listing
    ├── documentsUpload.ts       # Document upload handler
    ├── documentsVerifyReject.ts # Document approval workflow
    ├── activity.ts     # Activity log retrieval
    ├── roles.ts        # Role listing
    └── rolesId.ts      # Role details

lib/                    # Shared utilities
├── api.ts              # API client/fetch utilities
├── auth.ts             # Auth helpers (JWT, session)
├── db.ts               # Database connection
├── jwt.ts              # JWT token operations
├── logActivity.ts      # Activity logging helper
├── password.ts         # Password hashing/validation
├── prisma.ts           # Prisma client instance
├── require-role.ts     # Middleware for role-based access
└── session.ts          # Session management

components/             # Reusable React components
├── common/             # Shared components (modals, labels)
├── layout/             # Layout components (AppShell, etc.)
├── auth/               # Auth-specific components
├── dashboard/          # Dashboard-specific components
├── documents/          # Document management UI
├── employee/           # Employee UI components
└── users/              # User management UI

prisma/                 # Database schema & migrations
├── schema.prisma       # Data models: users, employees, documents, roles, activity_logs
└── seed.ts             # Database seeding script

types/                  # TypeScript type definitions
├── employee.ts
├── role.ts
└── next-auth.d.ts

utils/                  # Utility functions
├── fileUpload.ts       # File upload helpers
└── ...

docs/                   # Additional documentation
├── split-deployment.md # Frontend/backend separation guide
└── qnap-deployment.md  # QNAP-specific deployment
```

## Core Architecture Decisions

### Backend-First Approach
- **Express backend runs independently** on port 12000 (configurable via `BACKEND_PORT`)
- **Frontend proxies API requests** to backend during development (configurable via `BACKEND_PROXY_TO_UPSTREAM`)
- **Production**: Backend and frontend can run separately on different machines
- **Benefit**: Allows flexible deployment scenarios (Vercel frontend + VPS backend, Docker containers, QNAP NAS)

### Authentication Flow
1. User logs in via `/api/login` (Express endpoint)
2. JWT token issued with user ID, role, employee ID
3. Token stored in HTTP-only cookie
4. Subsequent requests include token in Authorization header or cookie
5. Backend validates token and enforces role-based access control via `require-role` middleware

### API Route Convention
- **Express routes** in `backend/routes/*.ts` handle all API operations
- **Route prefix**: `/api/*` (e.g., `/api/login`, `/api/users`, `/api/documents/upload`)
- **Middleware stack**: CORS, JSON parsing, auth verification, role checking
- **Response format**: JSON with status codes (200, 401, 403, 404, 500)

### File Upload Handling
- **Multer** middleware in `documentsUpload.ts` processes multipart form-data
- **Upload destination**: `/uploads` directory (served by Express static middleware)
- **File metadata**: Stored in `documents` table with file path, name, size, mime type
- **Document lifecycle**: pending → verified/rejected via `documentsVerifyReject.ts`

## Development Workflows

### Starting Development Servers

**Option 1: All-in-one (frontend + backend together)**
```bash
npm run dev  # Starts Next.js on port 3000 with backend proxy enabled
```

**Option 2: Separate terminals (recommended for debugging)**
```bash
# Terminal 1: Frontend
npm run dev:web

# Terminal 2: Backend API
npm run dev:api
```

### Building for Production

**Sequential order (backend first)**
```bash
npm run build:api   # Compile backend to dist/backend/
npm run build:web   # Build Next.js frontend
```

**Start production servers**
```bash
npm run start:api   # Run compiled backend (port 12000)
npm run start:web   # Run compiled frontend (port 3000)
```

### Database Operations

```bash
npm run seed        # Run seed.ts to populate initial data
npx prisma studio  # GUI for database inspection
npx prisma migrate dev --name <migration_name>  # Create migration
npx prisma db push # Sync schema to database
```

### Linting & Code Quality
```bash
npm run lint        # Run ESLint on workspace
```

## Important Conventions

### Environment Variables
Load from `.env.local` or `.env.docker` based on runtime:
- `DATABASE_URL`: PostgreSQL connection string (required)
- `BACKEND_PORT`: Express server port (default: 12000)
- `BACKEND_UPSTREAM_URL`: Frontend URL for backend proxy (default: http://localhost:3000)
- `CORS_ORIGIN`: Allowed CORS origin (default: backend upstream URL)
- `BACKEND_PROXY_TO_UPSTREAM`: Enable frontend proxy (default: false in production)
- `JWT_SECRET`: Secret for signing JWT tokens (required in production)
- `JWT_EXPIRES_IN`: JWT expiry duration (default: 1d)

### Database Models

**Key relationships:**
- `users` → `employees` (one-to-one via employee_id)
- `users` → `roles` (many-to-one, enforces role-based access)
- `documents` → `employees` (many-to-one, cascade delete)
- `documents` → `users` (verified_by field for auditing)
- `activity_logs` → `users` (many-to-one for tracking actions)

**Document Status Enum**: pending, verified, rejected

### Common Tasks & Where to Edit

| Task | Where to Make Changes |
|------|----------------------|
| Add new API endpoint | Create route in `backend/routes/` and add to `server.ts` |
| Add new page/feature | Create folder in `app/` with `layout.tsx` and `page.tsx` |
| Add new React component | Create file in `components/` organized by feature |
| Add database model | Edit `prisma/schema.prisma` and create migration |
| Add role-based access | Use `require-role(["role1", "role2"])` middleware in route handler |
| Fetch API data in component | Use `lib/api.ts` utilities or fetch with auth headers |
| Validate user input | Define Zod schema in `lib/validations/` and use in route |
| Log user activity | Call `logActivity()` from `lib/logActivity.ts` in route handler |
| Upload document | Use Multer middleware from `backend/routes/documentsUpload.ts` |
| Custom auth check | Use `lib/auth.ts` to verify JWT and extract user info |

### Authentication Patterns

**Check JWT in backend route:**
```typescript
import { verifyJwt } from "@lib/jwt";

const token = req.headers.authorization?.split(" ")[1];
const payload = verifyJwt(token);  // Throws if invalid
const userId = payload.sub;
```

**Require specific role:**
```typescript
import { requireRole } from "@lib/require-role";

router.post("/admin/users", requireRole(["admin"]), (req, res) => {
  // Only admin role can access
});
```

**Check auth in frontend:**
```typescript
import { useSession } from "next-auth/react";

export default function ProtectedComponent() {
  const { data: session } = useSession();
  if (!session) redirect("/login");
  return <div>User: {session.user.email}</div>;
}
```

## Deployment Considerations

### Docker Deployment
- **Production compose file**: `docker-compose.prod.yml` (includes PostgreSQL + pgAdmin)
- **Backend image**: Built from `Dockerfile.api`
- **Frontend image**: Built from `Dockerfile.web`
- **Volume mounts** (QNAP paths): `/share/Web/database/postgres`, `/share/Web/database/pgadmin`, `/share/Web/uploads`
- **Startup order**: PostgreSQL → Backend → Frontend (backend must be healthy first)

### Health Check Endpoints
- `GET /health` → Returns service health with framework info
- `GET /api/health` → Alternative health check endpoint

### Production Build Order (Recommended)
```bash
npm run build:api       # Build backend
npm run deploy:api      # Start backend on port 12000
npm run build:web       # Build Next.js
npm run deploy:web      # Start frontend on port 3000
# Or use: npm run deploy:prod  # One command for both (runs deploy-prod.sh)
```

## Common Pitfalls & Tips

1. **Backend port conflict**: If port 12000 is in use, set `BACKEND_PORT` env var
2. **CORS errors in development**: Ensure `CORS_ORIGIN` matches frontend URL
3. **JWT expiry**: Set `JWT_EXPIRES_IN` appropriately for your security requirements
4. **File uploads**: Check `process.env.UPLOADS_DIR` for upload directory path
5. **Database migrations**: Run `npx prisma migrate deploy` before starting backend
6. **Environment switching**: `.env.docker` used in Docker, `.env.local` in development
7. **Role names**: Check `roles` table for valid role names before using in `requireRole()`

## Related Documentation

- [Split Frontend/Backend Deployment](docs/split-deployment.md) — Separate frontend from backend for partial updates
- [QNAP Deployment Guide](docs/qnap-deployment.md) — QNAP NAS-specific deployment instructions
- See README.md for Docker deployment details and example commands

## Key Files for Quick Reference

- **Adding a route**: See `backend/routes/auth.ts` for endpoint pattern
- **Adding a component**: See `components/dashboard/DashboardStats.tsx` for structure
- **Database operations**: See `backend/routes/employees.ts` for Prisma usage
- **Auth middleware**: See `backend/routes/documents.ts` for role checking example
