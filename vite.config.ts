import { defineConfig } from 'vite';
import fs from 'fs'
import { transform as esbuildTransform } from 'esbuild'

function starshipPlugin() {
  return {
    name: 'vite-plugin-starship',
    async transform(src: string, id: string) {
      console.log('Processing file:', id);

      if (id.endsWith('.uss')) { 
        const fileContent = fs.readFileSync(id, 'utf-8')
        const templateMatch = fileContent.match(/<template>([\s\S]*?)<\/template>/);
        const scriptMatch = fileContent.match(/<script>([\s\S]*?)<\/script>/);

        const templateContent = templateMatch ? templateMatch[1] : '';
        const scriptContent = scriptMatch ? scriptMatch[1] : '';

        const importStatements: string[] = []
        const otherCode: string[] = []

        scriptContent.split('\n').forEach((line) => {
          if (line.startsWith('import')) {
            importStatements.push(line)
          } else {
            otherCode.push(line)
          }
        })

        const code = `
import { h } from './core/framework/framework';

${scriptContent}

export default class Component {
  render(): HTMLElement {
    return (
      ${templateContent}
    );
  }
}
        `;

        console.log("Code:", code)

        const result = await esbuildTransform(code, {
          loader: 'tsx',
          sourcemap: true,
          sourcefile: id,
          jsxFactory: 'h',
          jsxFragment: 'Fragment',
        });

        return {
          code: result.code,
          map: result.map,
        };
      }
    },
  };
}


export default defineConfig({
  plugins: [starshipPlugin()],
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    sourcemap: true, // debug
  },
  assetsInclude: '**/*.uss'
});
