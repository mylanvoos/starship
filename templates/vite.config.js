import { defineConfig } from 'vite';
import { starshipPlugin } from 'starship-jsx/vite-starship';

export default defineConfig({
  plugins: [starshipPlugin()],
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment'
  },
  assetsInclude: '**/*.uss'
})
