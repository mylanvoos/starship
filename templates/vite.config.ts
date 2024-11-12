import { defineConfig } from 'vite';
import { starshipPlugin } from './core/vite-starship'
import path from 'path';

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
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, 'core'),
      '@framework': path.resolve(__dirname, 'core/framework'),
      '@reactivity': path.resolve(__dirname, 'core/reactivity'),
      '@dom': path.resolve(__dirname, 'core/dom')
    }
  }
})
