import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/bible-flashcard-pwa/', // 新增這一行（前後都要有斜線）
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'Bible-niv-main/*.json'],
      manifest: {
        name: '聖經背誦字卡 PWA (Bible Flashcard)',
        short_name: '聖經字卡',
        description: '中英對照（和合本 / NIV）手機端優先聖經背誦字卡應用',
        theme_color: '#4f46e5',
        background_color: '#f8fafc',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
});
