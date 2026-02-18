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

**D1 Diamond** is a React 19 + TypeScript + Vite PWA for live NCAA college baseball scores, rankings, standings, and team schedules. All data comes from the public ESPN API (no auth).

### Data Flow

```
ESPN API → espnClient.fetchESPN<T>() → transformers.ts → typed models → hooks → pages/components
```

- **`src/api/espnClient.ts`** — Single generic `fetchESPN<T>(url)` with 8s abort timeout
- **`src/api/endpoints.ts`** — URL builder functions (`getScoreboardUrl`, `getStandingsUrl`, etc.)
- **`src/api/transformers.ts`** — Converts raw ESPN JSON (`any`) into typed models from `src/types/game.ts`; uses `satisfies` to catch type mismatches
- **`src/api/conferences.ts`** — Static array of conference `{ id, name, abbreviation }` used for filtering; ESPN conference IDs are integers passed as `groups=` query param

### Polling Pattern

`usePolling<T>` (`src/hooks/usePolling.ts`) is the foundation for all data-fetching hooks. It:
- Fetches immediately on mount and on `fetcher` identity change
- Polls at the given `interval` via `setInterval`
- Pauses polling when the tab is hidden (via `visibilitychange`); resumes and refetches on tab focus
- Returns `{ data, isLoading, error, refetch }`

`useScoreboard` switches poll interval between `POLL_INTERVAL_LIVE` (30s) and `POLL_INTERVAL_IDLE` (5min) based on whether any game has `status.state === 'in'`.

### Routing

Routes are defined in `src/App.tsx`. Most pages render inside `AppShell` (which provides `BottomNav` + `Header`). `GameDetailPage` (`/game/:id`) renders outside `AppShell` as a full-screen overlay.

```
/                       → ScoresPage
/rankings               → RankingsPage
/favorites              → FavoritesPage
/more                   → MorePage
/more/standings         → StandingsPage
/more/teams             → TeamDirectoryPage
/more/teams/:teamId     → TeamSchedulePage
/more/settings          → SettingsPage
/game/:id               → GameDetailPage (no shell)
```

### State Management

Three React contexts in `src/context/`, all backed by `localStorage` via `src/utils/storage.ts`:
- **`FavoritesContext`** — `Set<string>` of favorite team IDs; persisted under `STORAGE_KEYS.FAVORITES`
- **`ThemeContext`** — light/dark/system preference; persisted under `STORAGE_KEYS.THEME`
- **`NotificationContext`** — per-team notification prefs; persisted under `STORAGE_KEYS.NOTIFICATION_PREFS`

### Types

All app-level types live in `src/types/game.ts`. Key types: `Game`, `TeamScore`, `GameStatus`, `GameSituation`, `RankedTeam`, `ConferenceStandings`, `StandingEntry`, `TeamSchedule`, `ScheduleGame`.

`GameState` is `'pre' | 'in' | 'post'` — maps directly to ESPN's `status.type.state`.

### Styling

Tailwind CSS v4 via `@tailwindcss/vite` plugin. No `tailwind.config.js` — configuration is inline in CSS or via the Vite plugin. Global styles in `src/index.css`.

### PWA / Caching

`vite-plugin-pwa` + Workbox. Caching strategies in `vite.config.ts`:
- **Scoreboard** (`/scoreboard`): `NetworkFirst`, 5-min expiry (live score freshness)
- **Team logos** (`a.espncdn.com/*.png`): `CacheFirst`, 30-day expiry
- **Rankings / Standings**: `StaleWhileRevalidate`, 1-hour expiry
- **Teams list**: `CacheFirst`, 7-day expiry
