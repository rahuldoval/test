# Notes for developer — Onboarding & data-adding flow

Use this repo as the front-end reference. Copy the onboarding and data panel UI; plug in your own API.

---

## Run locally

```bash
pnpm install
pnpm dev
```

Open **http://localhost:3000**.  
- **/** = onboarding (college pick → academic form → “See My Chances” → dashboard)  
- **/dashboard** = dashboard + “Add details” opens the data side panel  

---

## What to copy

| Flow | File(s) | What it does |
|------|---------|----------------|
| **Onboarding** | `components/onboarding.tsx` | Step 1: college multi-select. Step 2: GPA, test type/score, AP count, application round, class rank. Uses `Input`, `Label`, `ToggleGroup`, `Badge`, `Button` from `components/ui/`. |
| **Data-adding panel** | `components/data-panel.tsx` | Side panel (Sheet from `components/ui/sheet.tsx`). Lists 5 data categories; “Add data” opens a form (Academic, Personal, Background, Strategy). Same input patterns as onboarding. Opened by “Add details” in `components/dashboard.tsx`. |

---

## Hooking your backend

1. **Onboarding submit**  
   In `onboarding.tsx`, the “See My Chances” button currently does `Link href="/dashboard"`. Replace with: call your API with the form state (colleges, gpa, testScore, appRound, etc.), then redirect to your dashboard or results URL.

2. **Data panel**  
   Data is local state in `data-panel.tsx` (e.g. `academic`, `personal`, `background`, `strategy`). On “Save” for each category, call your API and then mark that category complete (or sync the `filled` set from your backend).

3. **Dashboard data**  
   Dashboard content is in `components/dashboard.tsx`. Replace mock data with your API; types live in `lib/dashboard-mock-data.ts` (`CollegeData`, etc.).

---

## Stack

- **Next.js** (App Router), **React**, **TypeScript**
- **Tailwind** + **shadcn/ui** (`components/ui/` — Button, Input, Label, Sheet, ToggleGroup, Slider, etc.)
- No auth, no persistence in this repo — UI only.
