import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
// @ts-expect-error - yes
import pkg from './package.json' with { type: 'json' }

const dependencies = [...Object.keys(pkg.dependencies)]

export default defineConfig({
  plugins: [svelte()],
  build: {
    target: 'esnext',
    assetsDir: './',
    outDir: 'docs',
    modulePreload: {
      polyfill: false,
    },
    assetsInlineLimit: 0,
    sourcemap: true,
    chunkSizeWarningLimit: 550,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const name = dependencies.find((dep) =>
            id.includes(dep),
          )

          if (name) {
            return name
          }
        },
      },
    },
  },
  define: {
    'process.env': {},
  },
})
