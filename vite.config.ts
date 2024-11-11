import { defineConfig } from 'vite'
import path from 'path'
import { starshipPlugin } from './vite-starship'

export default defineConfig({
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, './src/core'),
      '@core/dom': path.resolve(__dirname, './src/core/dom'),
      '@core/framework': path.resolve(__dirname, './src/core/framework'),
      '@core/reactivity': path.resolve(__dirname, './src/core/reactivity'),
      '@core/compiler': path.resolve(__dirname, './src/core/compiler')
    }
  },
  plugins: [ starshipPlugin() ],
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    sourcemap: true, // debug
  },
  assetsInclude: '**/*.uss',
  build: {
    lib: {
      entry: {
        'index': path.resolve(__dirname, 'src/core/index.ts'),
        'vite-starship': path.resolve(__dirname, 'vite-starship.ts')
      },
      name: 'StarshipJSX',
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'mjs' : 'js'}`
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'vite', 'esbuild', 'fs', 'path'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    },
    sourcemap: true,
    minify: 'esbuild'
  }
})
