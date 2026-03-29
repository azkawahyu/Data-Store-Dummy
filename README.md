This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Split frontend and backend

If you want to separate frontend and backend for partial deployment, see [docs/split-deployment.md](docs/split-deployment.md).

For a practical QNAP deployment plan with minimal frontend changes, see [docs/qnap-deployment.md](docs/qnap-deployment.md).

Use [.env.example](.env.example) as the starting point for environment variables.

### Command split for migration

- Frontend: `npm run dev:web`
- Backend Express service: `npm run dev:api`

The backend command starts an Express service. In production deploys, frontend proxy is disabled by default so the backend can run independently.

### Separate build and deploy flow

Recommended order:

1. Build backend: `npm run build:api`
2. Deploy backend: `npm run deploy:api`
3. Build frontend: `npm run build:web`
4. Deploy frontend: `npm run deploy:web`

This order is good when the backend must be available first and the frontend will connect to it later.

### Docker deployment

Recommended production order:

1. Start PostgreSQL first
   - `docker compose up -d postgres`
2. Build and run backend
   - `docker compose up -d backend`
3. Verify backend health
4. Build and run frontend
   - `docker compose up -d web`
5. Start pgAdmin if needed
   - `docker compose up -d pgadmin`

Useful files:

- [Dockerfile.api](Dockerfile.api)
- [Dockerfile.web](Dockerfile.web)
- [docker-compose.yml](docker-compose.yml)
- [docker-compose.prod.yml](docker-compose.prod.yml)
- [.env.docker.example](.env.docker.example)

This backend-first order is good because the web app depends on API availability.

For production Docker deploy, copy [.env.docker.example](.env.docker.example) to [.env.docker](.env.docker) and fill the values first.

The production compose file also includes PostgreSQL and pgAdmin services. Mounts are mapped to QNAP shared folders:

- `/share/Web/database/postgres`
- `/share/Web/database/pgadmin`
- `/share/Web/uploads`

To deploy backend first and then frontend automatically, run `npm run deploy:prod`.

Auth routes currently moved to Express:

- `/api/login`
- `/api/logout`
- `/api/register`

Data routes currently moved to Express:

- `/api/user`
- `/api/user/:id`
- `/api/roles`

The main API routes have been moved to Express.

Upload route currently moved to Express:

- `/api/documents/upload`
