import { Component, Container } from "./core/dom/container"
import { effect, match, when, _ } from "./core/framework/framework"
import { createSignal } from "./core/reactivity/store"

export class App implements Component {
    render(): HTMLElement {
        const [counter, setCounter, attachToCounter] = createSignal<number>(0)
        const [message, setMessage, attachToMessage] = createSignal<string>('')

        const div = document.createElement('div')
        const p = document.createElement('p')

        const buttonIcr = document.createElement('button')
        const buttonDcr = document.createElement('button')
        const buttonRst = document.createElement('button')
        buttonIcr.textContent = "Increment"
        buttonDcr.textContent = "Decrement"
        buttonRst.textContent = 'Reset'

        p.textContent = `Count: ${counter.value}`
        
        buttonIcr.onclick = () => setCounter(counter.value + 1) 
        buttonDcr.onclick = () => setCounter(counter.value - 1)
        buttonRst.onclick = () => { 
            setCounter(0)
            div.removeChild(buttonRst)
        }

        attachToCounter(() => setMessage(counter.value, [
            [ when(v => v >= 10 || v <= -10), effect("Cannot exceed +=10!") ],
            [ when(v => v === 0), effect("Press a button to get started.")] ,
            [ _, effect(`Counter: ${counter.value}`) ]
        ]))

        attachToMessage(() => p.textContent = message.value)

        div.appendChild(buttonIcr)
        div.appendChild(buttonDcr)
        div.appendChild(p)

        return div
    }
}

const app = new App()
const container = new Container(app)

const rootElement = document.getElementById('root')
rootElement.appendChild(container.render())