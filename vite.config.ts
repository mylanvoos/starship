import { defineConfig } from 'vite';
import path from 'path';
import babel from 'vite-plugin-babel'
import * as babelCore from '@babel/core'
import jsxPlugin from '@babel/plugin-transform-react-jsx'
import fs from 'fs'

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
          enforce: 'pre',
          async transform(code, id) {
            if (id.endsWith('.uss')) {
              const filePath = path.resolve(id);
              const fileContents = fs.readFileSync(filePath, 'utf-8');

              console.log("File contents:", fileContents);

              // extract the <template> content
              const templateMatch = fileContents.match(/<template>([\s\S]*)<\/template>/);
              const template = templateMatch ? templateMatch[1] : '';

              console.log("Matched template content:", template);
              const cleanTemplate = template.trim() || '<div><p>Defaulted to this</p></div>';

              const componentCode = `
                import { ComponentBase as Component } from './core/dom/container';
                import { h } from './core/framework/framework';

                export default class extends Component {
                  render() {
                    return (${cleanTemplate});
                  }
                }
              `;

              const result = await babelCore.transformAsync(componentCode, {
                plugins: [
                  [jsxPlugin, { pragma: 'h', pragmaFrag: 'Fragment' }]
                ],
                filename: id,
                sourceMaps: true
              });

              console.log('Transformed code:', result?.code)

              return result?.code? {
                code: result.code,
                map: result.map || { version: 3, file: id, sources: [], names: [], mappings: '' }
              } : undefined
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
