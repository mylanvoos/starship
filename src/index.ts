import App from './App.uss'
import '@core/utils'

const app = new App();
document.getElementById('app')!.appendChild(app.render());