import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon-64.png', 'icons/icon-192x192.png', 'icons/icon-512x512.png'],
      manifest: {
        name: 'D1 Diamond',
        short_name: 'D1 Diamond',
        description: 'Live college baseball scores, rankings, and favorite team tracking',
        theme_color: '#09090e',
        background_color: '#09090e',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        categories: ['sports'],
        icons: [
          { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
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
          {
            urlPattern: /^https:\/\/site\.web\.api\.espn\.com\/apis\/v2\/sports\/baseball\/college-baseball\/standings/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'espn-standings',
              expiration: { maxEntries: 5, maxAgeSeconds: 3600 },
            },
          },
        ],
      },
    }),
  ],
})
