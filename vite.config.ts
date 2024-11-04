// vite.config.ts
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    root: 'src',
    build: {
        outDir: '../dist',
    },
    resolve: {
        alias: {
            '@components': path.resolve(__dirname, 'src/core/dom'),
            '@reactivity': path.resolve(__dirname, 'src/core/reactivity'),
        },
    },
});
