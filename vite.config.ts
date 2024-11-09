import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'
import { transform as esbuildTransform } from 'esbuild'
import { parse } from './src/compiler/parser'

function starshipPlugin() {
  return {
    name: 'vite-plugin-starship',
    async transform(src: string, id: string) {
      console.log('Processing file:', id)

      if (id.endsWith('.uss')) { 
        const fileContent = fs.readFileSync(id, 'utf-8')
        const templateMatch = fileContent.match(/<template>([\s\S]*?)<\/template>/)
        const scriptMatch = fileContent.match(/<script>([\s\S]*?)<\/script>/)
        const styleMatch = fileContent.match(/<style>([\s\S]*?)<\/style>/)

        const templateContent = templateMatch ? templateMatch[1] : ''
        const templateParsed = parse(templateMatch ? templateMatch[1] : '')
        const scriptContent = scriptMatch ? scriptMatch[1] : ''
        const styleContent = styleMatch ? styleMatch[1] : ''
        
        const styleInjectionCode = styleContent ? `
          const style = document.createElement('style')
          style.textContent = \`${styleContent}\`
          document.head.appendChild(style)
          ` : ''

        const code = `
        import {  effect, match, when, _ } from "@core/framework"
        import { createSignal } from "@core/reactivity"
        import { Show, h, Fragment } from "@core/dom"

        ${scriptContent}

        export default class Component {
          render(): HTMLElement {
          ${styleInjectionCode}
            return (
                  ${templateContent}
            )
          }
        }
        `

        const result = await esbuildTransform(code, {
          loader: 'tsx',
          sourcemap: true,
          sourcefile: id,
          jsxFactory: 'h',
          jsxFragment: 'Fragment',
        })

        return {
          code: result.code,
          map: result.map,
        }
      }
    },
  }
}


export default defineConfig({
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, './src/core'),
      '@core/dom': path.resolve(__dirname, './src/core/dom'),
      '@core/framework': path.resolve(__dirname, './src/core/framework'),
      '@core/reactivity': path.resolve(__dirname, './src/core/reactivity')
    }
  },
  plugins: [
    starshipPlugin()
    ],
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    sourcemap: true, // debug
  },
  assetsInclude: '**/*.uss'
})
