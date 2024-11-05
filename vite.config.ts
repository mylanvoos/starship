import { defineConfig } from 'vite'
import fs from 'fs'
import { transform as esbuildTransform } from 'esbuild'

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
        const scriptContent = scriptMatch ? scriptMatch[1] : ''
        const styleContent = styleMatch ? styleMatch[1] : ''

        const componentId = id.replace(/[^a-zA-Z0-9]/g, '_')
        const uniqueClass = `component_${componentId}`

        const scopedTemplate = templateContent.replace(
          /<div([^>]*)>/,
          `<div class="${
            styleContent ? uniqueClass : ''
          }"$1>`
        )
        
        const styleInjectionCode = styleContent ? `
          const style = document.createElement('style')
          style.textContent = \`${styleContent}\`
          document.head.appendChild(style)
          ` : ''

        const code = `
import { h } from './core/framework/framework'

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

        console.log("Code:", code)

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
  plugins: [starshipPlugin()],
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    sourcemap: true, // debug
  },
  assetsInclude: '**/*.uss'
})
