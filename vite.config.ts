import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/ncaa-baseball/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'NCAA Baseball Scores',
        short_name: 'NCAA Baseball',
        description: 'Live NCAA college baseball scores, rankings, and favorite team tracking',
        theme_color: '#1e3a5f',
        background_color: '#f8fafc',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/ncaa-baseball/',
        start_url: '/ncaa-baseball/',
        categories: ['sports'],
        icons: [
          { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
          { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/site\.api\.espn\.com\/apis\/site\/v2\/sports\/baseball\/college-baseball\/scoreboard/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'espn-scoreboard',
              expiration: { maxEntries: 30, maxAgeSeconds: 300 },
              networkTimeoutSeconds: 5,
            },
          },
          {
            urlPattern: /^https:\/\/a\.espncdn\.com\/.*\.png$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'team-logos',
              expiration: { maxEntries: 500, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          {
            urlPattern: /^https:\/\/site\.api\.espn\.com\/apis\/site\/v2\/sports\/baseball\/college-baseball\/rankings/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'espn-rankings',
              expiration: { maxEntries: 5, maxAgeSeconds: 3600 },
            },
          },
          {
            urlPattern: /^https:\/\/site\.api\.espn\.com\/apis\/site\/v2\/sports\/baseball\/college-baseball\/teams/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'espn-teams',
              expiration: { maxEntries: 5, maxAgeSeconds: 60 * 60 * 24 * 7 },
            },
          },
        ],
      },
    }),
  ],
})
