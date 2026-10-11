import { readFileSync } from 'node:fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { licenses } from './vite-plugins/licenses.ts'

const ALMANAC_PATH = new URL('./data/hashtags.enc', import.meta.url)

/** `data/hashtags.enc` (Base64) をHTML本文に埋め込み、実行時の追加fetchをなくす */
function inlineAlmanac(): Plugin {
  return {
    name: 'inline-almanac',
    transformIndexHtml() {
      return [
        {
          tag: 'script',
          attrs: { id: 'almanac-data', type: 'text/plain' },
          children: readFileSync(ALMANAC_PATH, 'utf-8').trim(),
          injectTo: 'body-prepend',
        },
      ]
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), inlineAlmanac(), licenses()],
  base: '/hashtag-calendar/',
  server: {
    host: true,
  },
  preview: {
    host: true,
  },
})
