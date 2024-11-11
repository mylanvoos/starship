import { defineConfig } from 'vite';
import { starshipPlugin } from '../vite-starship';

export default defineConfig({
  plugins: [starshipPlugin()],
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment'
  },
  assetsInclude: '**/*.uss'
})
