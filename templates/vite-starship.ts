import fs from 'fs';
import { transform as esbuildTransform } from 'esbuild';
// @ts-ignore
import { compile } from './src/core/compiler'

export function starshipPlugin() {
  return {
    name: 'vite-plugin-starship',
    async transform(src: string, id: string) {
      console.log('Processing file:', id)

      if (id.endsWith('.uss')) {
        const fileContent = fs.readFileSync(id, 'utf-8')

        const scriptMatch = fileContent.match(/<script>([\s\S]*?)<\/script>/)
        const styleMatch = fileContent.match(/<style>([\s\S]*?)<\/style>/)
        const templateMatch = fileContent.replace(/<script>([\s\S]*?)<\/script>|<style>([\s\S]*?)<\/style>/g, '')

        const templateContent = compile(templateMatch)

        const scriptContent = scriptMatch ? scriptMatch[1] : ''
        const styleContent = styleMatch ? styleMatch[1] : ''

        const styleInjectionCode = styleContent ? `
          const style = document.createElement('style')
          style.textContent = \`${styleContent}\`
          document.head.appendChild(style)
          ` : ''

        const code = `
import { effect, match, when, _ } from "../starship/core/framework"
import { createSignals, createSignal } from "../starship/core/reactivity"
import { Show, h, Fragment } from "../starship/core/compiler"

${scriptContent}

export default class Component {
  render(): HTMLElement {
    ${styleInjectionCode}
    return (
      <main>
        ${templateContent}
      </main>
    );
  }
}
        `;

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
