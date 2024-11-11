// This is the main entry point of your application

// @ts-ignore
import App from './App.uss'
import './app.css'

const app = new App()
document.getElementById('app')!.appendChild(app.render())