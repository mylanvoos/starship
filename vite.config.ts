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
      entry: path.resolve(__dirname, 'src/core/index.ts'),
      name: 'StarshipJSX',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
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
