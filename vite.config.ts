import { defineConfig } from 'vite';
import { starshipPlugin } from './vite-starship';
import path from 'path';

export default defineConfig({
  plugins: [starshipPlugin()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'StarshipJSX',
      formats: ['es', 'cjs'],
    },
    sourcemap: true,
    minify: 'esbuild',
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        dir: 'dist',
        entryFileNames: ({ facadeModuleId }) => {
          // @ts-ignore
          const relativePath = path.relative(path.resolve(__dirname, 'src'), facadeModuleId);
          return `${relativePath.replace(/\.ts$/, '.js')}`;
        },
      },
    },
  },
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, 'src/core'),
      '@dom': path.resolve(__dirname, 'src/core/dom'),
      '@reactivity': path.resolve(__dirname, 'src/core/reactivity'),
    },
  },
});
