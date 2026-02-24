# Chance Me — Frontend handoff

This is a **UI-only prototype**. Copy it and hook your own data/API to build the real app.

## Routes

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `Onboarding` | Step 1: pick colleges. Step 2: GPA, test score, round, etc. Submit → goes to `/dashboard`. |
| `/dashboard` | `Dashboard` | Per-school view: chance %, pillars, academic/personal/hooks charts, sensitivity, “Add data” demo. |

## Where to hook data

### 1. Onboarding submit

**File:** `components/onboarding.tsx`  
**Spot:** `handleSubmit` (around “See My Chances” button).

Right now it only does `router.push("/dashboard")`.  
**Hook:** Call your API with the form state (colleges, GPA, testScore, applicationRound, etc.), then redirect to `/dashboard` or your results URL. Form state lives in the same component (`colleges`, `gpa`, `testScore`, `appRound`, etc.).

### 2. Dashboard data

**File:** `lib/dashboard-mock-data.ts`  
**Export:** `COLLEGE_DATA` (array of `CollegeData`).

The dashboard reads this array.  
**Hook:** Replace with your API:

- Fetch “my colleges + chance data” (e.g. per selected school).
- Map your API response to the `CollegeData` shape (see types in that file).
- Either:
  - Swap the import in `components/dashboard.tsx` from `@/lib/dashboard-mock-data` to a new module that fetches and returns `CollegeData[]`, or
  - Use React Query / SWR / context in the dashboard and pass the same shape.

**Types:** All dashboard data types live in `lib/dashboard-mock-data.ts`: `CollegeData`, `InputLevel`, `Classification`, `Confidence`, `PillarScore`, `FactorScore`, `SensitivityFactor`. Use them for your API types.

### 3. “Add data” on dashboard

The “Add details” button is a **UI demo**: it toggles `fullData` so locked sections (personal/hooks charts, sensitivity) appear.  
**Hook:** Drive that from real state (e.g. “user has completed activities”) instead of a local boolean.

## Running

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`. Use onboarding → “See My Chances” → dashboard.  
Direct link to dashboard: `http://localhost:3000/dashboard`.

## Stack

- Next.js (App Router), React, TypeScript  
- Tailwind + shadcn/ui (`components/ui/`)  
- Charts: Bklit UI (area, bar, radar) in `components/charts/`  
- No backend; no auth; no persistence.
