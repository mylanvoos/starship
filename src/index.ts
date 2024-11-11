export { createSignals, createSignal } from './core/reactivity'
export { Show, h, Fragment } from './core/dom'
export { match } from './core/framework'
import App from './App.uss'

const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined'

if (isBrowser) {
    const app = new App();
    document.getElementById('app')!.appendChild(app.render());  
}