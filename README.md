# Polly — Minimal Polling App (Scaffold)

Polly is a lightweight Next.js polling app scaffold with Tailwind-style UI and shadcn-inspired components. It is client-first and intentionally backend-free for now — registration, login, voting, and poll creation are simulated on the client.

## Key routes
- GET /                      → Home (app/page.tsx)  
- GET /polls                 → All polls (app/polls/page.tsx)  
- GET /polls/[id]            → Poll details (app/polls/[id]/page.tsx)  
- GET /create-poll           → Create poll (app/create-poll/page.tsx)  
- GET /(auth)/login          → Sign in (app/(auth)/login/page.tsx)  
- GET /(auth)/register       → Register (app/(auth)/register/page.tsx)  
- GET /dashboard             → Dashboard (app/dashboard/page.tsx)

## Features (current)
- Client-side registration → redirects to login (no backend)
- Client-side login → redirects to /dashboard (simulated)
- Create poll form with option management (add/remove) and client-only submit
- Polls list with search, sort, and pagination (client)
- Poll details page with local voting UI (votes are local-only)
- Shared UI components: Button, Input, PollCard, PollList, PollVote, AuthForm, NavBar

## Project layout (high-level)
- app/ — Next.js app routes and pages
- components/ — UI and feature components (poll/, auth/, nav/, ui/)
- hooks/ — simple client/server placeholder hooks
- styles/globals.css — global Tailwind (if configured)

## Installation (Windows)
1. Install dependencies:
   - npm install
   - or: pnpm install / yarn
2. Run dev server:
   - npm run dev
   - or: pnpm dev / yarn dev
3. Open http://localhost:3000

## Notes & next steps
- No backend is wired. Replace placeholder hooks / simulated timeouts with real API calls when ready.
- The project uses path alias "@/..." — ensure tsconfig.json and Next config support it or change imports to relative paths.
- UI uses Tailwind utility classes. If shadcn components are desired, install and wire them in (I used minimal shadcn-like patterns).
- To persist polls/votes/auth: add API routes (app/api or /pages/api) and connect a database (Prisma suggested).

## Quick dev tips
- Restart dev server after adding new route files.
- Check console for Next.js messages about async dynamic params (await params in dynamic route handlers).

License: MIT
