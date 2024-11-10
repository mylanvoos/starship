import { defineConfig } from 'vite'
import path from 'path'
import { starshipPlugin } from './src/plugins/vite-starship'

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
  assetsInclude: '**/*.uss'
})
