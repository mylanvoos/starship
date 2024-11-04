import { Component, Container } from "./core/dom/container"
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

        p.textContent = `Count: ${counter()}`

        buttonIcr.onclick = () => setCounter(counter() + 1) 
        buttonDcr.onclick = () => setCounter(counter() - 1)
        buttonRst.onclick = () => { 
            setCounter(0)
            div.removeChild(buttonRst)
        }

        attachToCounter(() => {
            if (counter() >= 10 || counter() <= -10) {
                setMessage(`Cannot exceed +=10`)
                div.appendChild(buttonRst)
            }
            else {
                setMessage(`Count: ${counter()}`)
            }
        })
        attachToMessage(() => p.textContent = message())
        
        

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