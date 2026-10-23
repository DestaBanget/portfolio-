# Portfolio

Personal site of Ferrel Destatiananda Edwardo: about, experience, TryHackMe writeups, projects and contact on one page, with full writeups under `/writeups`. Content lives in Supabase and is edited from the admin dashboard at `/loginytta`.

## Run locally

```bash
npm ci
cp .env.example .env.local   # then fill in the values below
npm run dev
```

| Variable | Used for |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Reading public content |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin dashboard writes and private writeups |
| `ADMIN_PASSWORD_HASH`, `ADMIN_SESSION_SECRET` | Admin login |
| `RESEND_API_KEY`, `CONTACT_EMAIL` | Contact form delivery |
| `CONTACT_FROM` (optional) | Sender address on a domain verified in Resend; defaults to `onboarding@resend.dev` |
| `HTB_PASSWORD` | Password for the private `/htb` page |

## Layout

- `src/app` routes. `/experience`, `/projects` and `/contact` redirect to sections of the home page (`next.config.mjs`). Public pages rebuild at most 60 seconds after a dashboard edit (`revalidate` in `layout.tsx`); `/writeups` renders on every request.
- `src/lib` data access: `profile.ts`, `experience.ts`, `projects.ts`, `writeups.ts` (paths, sections, rooms and solved counts).
- `src/components` shared UI. `RoomCells` draws the solved/unsolved board used on the home page and the writeups page.
- Design tokens are RGB channels in `src/app/globals.css`, mapped to Tailwind colours in `tailwind.config.ts`. Type: Instrument Sans for everything, IBM Plex Mono for dates and counts.
