export const ESPN_BASE = 'https://site.api.espn.com/apis/site/v2/sports/baseball/college-baseball';

export const POLL_INTERVAL_LIVE = 30_000;
export const POLL_INTERVAL_IDLE = 300_000;
export const API_TIMEOUT = 8_000;

export const STORAGE_KEYS = {
  FAVORITES: 'ncaa-baseball-favorites',
  NOTIFICATION_PREFS: 'ncaa-baseball-notification-prefs',
  THEME: 'ncaa-baseball-theme',
} as const;
