// vite.config.ts
import { defineConfig } from 'vite';
import path from 'path';
import babel from 'vite-plugin-babel'

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
    plugins: [
        {
          name: 'uss',
          async transform(code, id) {
            if (id.endsWith('.uss')) {
              const templateMatch = code.match(/<template>([\s\S]*)<\/template>/);
                const template = templateMatch ? templateMatch[1].trim() : '';


              const componentCode = `
                import { ComponentBase as Component } from './core/dom/container';
                    import { h, Fragment } from './core/framework/framework';

                    export default class extends Component {
                        render() {
                            return (
                                <>
                                  ${template}
                                </>
                            );
                        }
                    }
              `
              return {
                code: componentCode,
                map: null
              }
            }
          }
        },
        babel({
          babelConfig: {
            plugins: [
              ['@babel/plugin-transform-react-jsx', {
                pragma: 'h', 
                pragmaFrag: 'Fragment'
              }]
            ]
          }
        })
    ],
    assetsInclude: ['**/*.uss'],
    esbuild: {
        // disable esbuild's JSX handling since we're using Babel
        jsx: 'preserve'
    }
});
