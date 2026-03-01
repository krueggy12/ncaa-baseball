# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server with HMR at localhost:5173
npm run build     # Type-check (tsc -b) then Vite build for production
npm run lint      # ESLint
npm run preview   # Preview production build locally
```

No test suite exists in this project.

## Architecture

**D1 Diamond** is a React 19 + TypeScript + Vite PWA for live NCAA college baseball scores, rankings, standings, and team schedules. All data comes from the public ESPN API (no auth). FanGraphs is used for stats leaderboards only.

### Data Flow

```
ESPN API → espnClient.fetchESPN<T>() → transformers.ts → typed models → hooks → pages/components
FanGraphs API → useCollegeStats → StatsPage
```

- **`src/api/espnClient.ts`** — Single generic `fetchESPN<T>(url)` with 8s abort timeout
- **`src/api/endpoints.ts`** — URL builder functions (`getScoreboardUrl`, `getStandingsUrl`, etc.); standings uses `site.web.api.espn.com` (alternate host)
- **`src/api/transformers.ts`** — Converts raw ESPN JSON (`any`) into typed models; uses `satisfies` over `as` to catch shape mismatches at compile time
- **`src/api/conferences.ts`** — Static `CONFERENCES` array with ESPN integer IDs (3=ACC, 23=SEC, 8=B12, etc.)
- **`src/api/fgSchools.ts`** — FanGraphs school ID lookup table (300+ teams) for the stats leaderboard

### Polling Pattern

`usePolling<T>` (`src/hooks/usePolling.ts`) is the foundation for all data-fetching hooks. It:
- Fetches immediately on mount and on `fetcher` identity change
- Polls at the given `interval` via `setInterval`
- Pauses polling when the tab is hidden (via `visibilitychange`); resumes and refetches on tab focus
- Returns `{ data, isLoading, error, refetch }`

Poll intervals by hook: `useScoreboard` 30s live / 5min idle (adaptive); `useGameDetail` 10s live / 30s post; `useRankings` / `usePowerRankings` 1hr; `useCollegeStats` 30min.

### Conference Filtering (Non-Obvious)

ESPN's `groups=` query param doesn't work for baseball scoreboards. Instead:
1. `useTeamConferenceMap` builds a `Map<teamId, conferenceId>` by fetching all conference standings
2. `ScoresPage` uses this map to filter the `Game[]` returned by `useScoreboard` client-side

### Routing

Routes are defined in `src/App.tsx`. Most pages render inside `AppShell` (Header + BottomNav). `GameDetailPage` renders outside `AppShell` as a full-screen overlay.

```
/                       → ScoresPage
/rankings               → RankingsPage (Poll + Power Rankings tabs)
/favorites              → FavoritesPage
/more                   → MorePage
/more/standings         → StandingsPage
/more/stats             → StatsPage (FanGraphs leaderboards)
/more/teams             → TeamDirectoryPage
/more/teams/:teamId     → TeamSchedulePage
/more/settings          → SettingsPage
/game/:id               → GameDetailPage (no AppShell)
```

### State Management

Three React contexts in `src/context/`, all backed by `localStorage` via `src/utils/storage.ts`:
- **`FavoritesContext`** — `Set<string>` of favorite team IDs
- **`ThemeContext`** — light/dark/system; applies `dark` class to `document.documentElement`
- **`NotificationContext`** — per-team push notification prefs

### Types

- **`src/types/game.ts`** — All ESPN-derived types: `Game`, `TeamScore`, `GameStatus`, `GameSituation`, `RankedTeam`, `PowerRankedTeam`, `ConferenceStandings`, `StandingEntry`, `TeamSchedule`, `ScheduleGame`. `GameState` is `'pre' | 'in' | 'post'`.
- **`src/types/stats.ts`** — FanGraphs stat types for the leaderboard

### Power Rankings

`usePowerRankings` computes a metric-driven ranking independent of polls:
- Pulls all conference standings via `useStandings`; filters to teams with ≥10 games played
- **Score = 60% × normalized(Win%) + 40% × normalized(Run Differential per Game)**
- Normalizes win% and RD/G independently across the full pool; outputs top 25

### Styling

Tailwind CSS v4 via `@tailwindcss/vite` plugin. No `tailwind.config.js`. Custom design tokens defined in `src/index.css` under `@theme`:
- `--color-navy` (`#080e1d`) — header, dark surfaces
- `--color-royal` (`#3474e6`) — primary accent, active states
- `--color-d1red` (`#e53e3e`) — live indicator
- `--color-surface-dark` / `--color-bg-dark` — dark mode card/page backgrounds

Dark mode toggled via `document.documentElement.classList` by `ThemeContext`.

### Favorites Schedule

When "Favorites Only" is active on ScoresPage, `useFavoriteSchedules` parallel-fetches all favorite teams' schedules, deduplicates shared games, and groups results by date across a rolling 8-day window (yesterday + today + next 7 days).

### PWA / Caching

`vite-plugin-pwa` + Workbox. Caching strategies in `vite.config.ts`:
- **Scoreboard** (`/scoreboard`): `NetworkFirst`, 5-min expiry
- **Team logos** (`a.espncdn.com/*.png`): `CacheFirst`, 30-day expiry
- **Rankings / Standings**: `StaleWhileRevalidate`, 1-hour expiry
- **Teams list**: `CacheFirst`, 7-day expiry
