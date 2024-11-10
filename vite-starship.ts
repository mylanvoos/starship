import fs from 'fs'
import { transform as esbuildTransform } from 'esbuild'
import { compile } from './src/core/compiler'

const testCode = `
<div ".container">
  <h1 "#text">Starship 🛰️</h1>
  <p "#text">The classic button experiment to test reactivity...</p>
  <button on:click={setCounter(+1)}> -1 </button>
      { counter }
  <button on:click={setHidden(!)}> +1 </button>
</div>`
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

          console.log("\n\n\n\n START: \n\n\n\n")
          
          const testTemplate = compile(testCode)
  
          const scriptContent = scriptMatch ? scriptMatch[1] : ''
          const styleContent = styleMatch ? styleMatch[1] : ''
          
          const styleInjectionCode = styleContent ? `
            const style = document.createElement('style')
            style.textContent = \`${styleContent}\`
            document.head.appendChild(style)
            ` : ''
  
          const code = `
          import {  effect, match, when, _ } from "@core/framework"
          import { createSignals, createSignal } from "@core/reactivity"
          import { Show, h, Fragment } from "@core/dom"
  
          ${scriptContent}
  
          export default class Component {
            render(): HTMLElement {
            ${styleInjectionCode}
              return (
                <main>
                  ${templateContent}
                </main>
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
  