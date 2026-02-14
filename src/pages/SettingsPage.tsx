import { useTheme } from '../context/ThemeContext';
import { useNotificationPrefs } from '../context/NotificationContext';
import { requestNotificationPermission, canNotify } from '../utils/notifications';
import { useState } from 'react';

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (val: boolean) => void; label: string }) {
  return (
    <label className="flex items-center justify-between py-3 cursor-pointer">
      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-6 rounded-full transition-colors ${
          checked ? 'bg-navy' : 'bg-gray-300 dark:bg-gray-600'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
    </label>
  );
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { prefs, updatePref } = useNotificationPrefs();
  const [notifPermission, setNotifPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'denied'
  );

  async function handleEnableNotifications(val: boolean) {
    if (val && !canNotify()) {
      const granted = await requestNotificationPermission();
      setNotifPermission(granted ? 'granted' : 'denied');
      if (!granted) return;
    }
    updatePref('enabled', val);
  }

  return (
    <div className="px-4 pb-8">
      <div className="py-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Settings</h2>
      </div>

      {/* Appearance */}
      <section className="mb-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
          Appearance
        </h3>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm px-4">
          <div className="flex items-center justify-between py-3">
            <span className="text-sm text-gray-700 dark:text-gray-300">Theme</span>
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
              {(['light', 'system', 'dark'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors capitalize ${
                    theme === t
                      ? 'bg-white dark:bg-slate-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="mb-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
          Notifications
        </h3>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm px-4 divide-y divide-gray-50 dark:divide-gray-700/50">
          <Toggle
            label="Enable notifications"
            checked={prefs.enabled}
            onChange={handleEnableNotifications}
          />
          {prefs.enabled && (
            <>
              <Toggle
                label="Game started"
                checked={prefs.gameStart}
                onChange={v => updatePref('gameStart', v)}
              />
              <Toggle
                label="Score changes"
                checked={prefs.scoreChange}
                onChange={v => updatePref('scoreChange', v)}
              />
              <Toggle
                label="Game finished"
                checked={prefs.gameEnd}
                onChange={v => updatePref('gameEnd', v)}
              />
            </>
          )}
        </div>
        {notifPermission === 'denied' && (
          <p className="text-xs text-red-500 mt-2 px-1">
            Notifications are blocked. Please enable them in your browser settings.
          </p>
        )}
        {prefs.enabled && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 px-1">
            Notifications work when the app is open. Add favorite teams to receive alerts about their games.
          </p>
        )}
      </section>

      {/* About */}
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
          About
        </h3>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm px-4 py-3">
          <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">NCAA Baseball Scores</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Track live NCAA college baseball scores, rankings, and your favorite teams. Data provided by ESPN.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            Version 1.0.0
          </p>
        </div>
      </section>
    </div>
  );
}
