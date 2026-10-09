# ManoMitra

ManoMitra is a Next.js mental-wellbeing application. Prisma uses PostgreSQL so records persist across Vercel serverless deployments; SQLite files are not persistent on Vercel.

## Local development

1. Create a PostgreSQL database and copy `.env.example` to `.env`.
2. Set `POSTGRES_PRISMA_URL` to the pooled/runtime URL and `DATABASE_URL_UNPOOLED` to the direct, non-pooled migration URL. Keep both private.
3. Run `npm ci`, then `npm run db:deploy`, then `npm run dev`.

## Vercel

The project is configured to run `prisma migrate deploy`, generate Prisma Client, and build Next.js. The Neon Vercel integration supplies `POSTGRES_PRISMA_URL` and `DATABASE_URL_UNPOOLED`. Use separate databases for production and previews. The project root is `.`.

This prototype can store sensitive mental-health data. Do not use it for real clinical or confidential data until authentication/access controls, privacy practices, and applicable compliance requirements have been reviewed.
