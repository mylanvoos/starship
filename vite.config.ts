import { defineConfig } from 'vite'
import { starshipPlugin } from './vite-starship'

export default defineConfig({
  plugins: [starshipPlugin()],
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'StarshipJSX',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`,
    },
    sourcemap: true,
    minify: 'esbuild',
    rollupOptions: {
      external: ['react', 'react-dom'],
    },
  },
})
