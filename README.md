# Max Rewards

Max Rewards is a full-stack portfolio MVP that recommends credit cards from real spending patterns.
Users authenticate, connect accounts through Plaid Link, sync transactions, view spending charts, and rank cards by estimated annual rewards.

## Stack

- Next.js, React, TypeScript, Tailwind CSS, Recharts
- Express, TypeScript, Prisma
- PostgreSQL
- Plaid Sandbox
- HTTP-only cookie sessions

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Start PostgreSQL:

```bash
docker compose up -d
```

3. Create `.env` from `.env.example` and set Plaid sandbox credentials plus strong local secrets.

4. Generate Prisma client and migrate:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

5. Start both apps:

```bash
npm run dev
```

Frontend: `http://localhost:3000`
API: `http://localhost:4000`

## Architecture

```text
Next.js web app
  -> Express API
    -> Prisma
      -> PostgreSQL
    -> Plaid API
```

Sensitive Plaid access tokens are encrypted before storage and never sent to the browser.

## MVP Notes

- Card data is a manually maintained demo catalog with issuer source links and verification dates.
- Reward estimates are cashback-equivalent values based on normalized reward categories and user spending aggregates.
- The app does not provide financial advice, approval odds, or live application flows.
- Plaid Sandbox is the intended development environment.
- Before demoing a refreshed catalog, run the migration, seed, test, and build checks listed below.

## Useful Scripts

```bash
npm run dev
npm run build
npm run test
npm run db:migrate
npm run db:seed
```
