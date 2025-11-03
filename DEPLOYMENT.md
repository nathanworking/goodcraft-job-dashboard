# Deployment Guide

## Deploy to Vercel

### 1. Set up Vercel Postgres Database

1. Go to your Vercel project dashboard
2. Click on the **Storage** tab
3. Click **Create Database**
4. Select **Postgres**
5. Follow the prompts to create your database
6. Vercel will automatically add `DATABASE_URL` and `DIRECT_URL` environment variables to your project

### 2. Run Database Migrations

After connecting the database, you need to run the Prisma migrations:

1. In your Vercel project, go to **Settings** → **Environment Variables**
2. Make sure `DATABASE_URL` and `DIRECT_URL` are set (they should be automatically added)
3. Go to your project's **Deployments** page
4. Click on the latest deployment
5. Click **Redeploy** to trigger a new deployment with the database connected

The deployment will automatically run `prisma generate` and `prisma migrate deploy` to set up your database tables.

### 3. Optional: Add API Keys for Job Search

If you want to enable AI-powered job search (otherwise mock data is used):

1. Go to **Settings** → **Environment Variables**
2. Add these optional variables:
   - `GEMINI_API_KEY` - Get from https://aistudio.google.com/app/apikey (Free: 1,500 requests/day)
   - `SERP_API_KEY` - Get from https://serpapi.com/users/sign_up (Free: 100 searches/month)

### 4. Deploy

Push to GitHub and Vercel will automatically deploy:

```bash
git push origin main
```

Your app will be live at: `https://your-project.vercel.app`

## Local Development with SQLite

For local development, you can use SQLite:

1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

2. Update `.env`:
```bash
DATABASE_URL="file:./dev.db"
```

3. Run migrations:
```bash
npx prisma migrate dev
```

## Troubleshooting

### Build fails with "ERESOLVE" error
- This is handled by `.npmrc` with `legacy-peer-deps=true`
- Make sure this file is committed to your repo

### Database connection errors
- Ensure `DATABASE_URL` is set in Vercel environment variables
- Check that Vercel Postgres is properly connected in the Storage tab

### Tables don't exist
- Redeploy your project to run migrations
- Or manually run: `npx prisma migrate deploy` from Vercel CLI
