# ManoMitra

ManoMitra is a Next.js mental-wellbeing application. It uses Prisma with PostgreSQL so user records survive serverless deployments; SQLite files are not suitable for persistent Vercel storage.

## Local development

1. Create a PostgreSQL database (Neon is one option) and copy `.env.example` to `.env`.
2. Set `POSTGRES_PRISMA_URL` to the provider's pooled connection string and `DATABASE_URL_UNPOOLED` to its direct, non-pooled connection string. Keep both values private.
3. Install dependencies with `npm ci`.
4. Run `npm run db:deploy` to apply committed migrations, then `npm run dev`.

Use `npm run build` to validate a production build locally. The existing `.env` may still contain a local SQLite URL; replace it with PostgreSQL connection strings before using the database after this change.

## Deploy to Vercel

1. Push this project to a GitHub repository. In Vercel, choose **Add New → Project** and import that repository. Keep the root directory as `.`.
2. Create a managed PostgreSQL database. The Neon integration supplies `POSTGRES_PRISMA_URL` (pooled/runtime URL) and `DATABASE_URL_UNPOOLED` (direct migration URL). Use separate databases for **Production**, **Preview**, and **Development**; do not point previews at production data.
3. Leave the framework as Next.js and the build command as configured in `vercel.json`. Vercel runs `prisma migrate deploy`, generates Prisma Client, then builds Next.js.
4. Deploy. After the first deployment, verify onboarding, API writes, and persistence across a redeploy.

The app's records can include sensitive mental-health information. This project is a prototype and should not be used for real clinical or confidential data until authentication/access controls, privacy practices, and applicable compliance requirements have been reviewed.
