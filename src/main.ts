import { createSignal } from "./reactivity/signal";
import { Runtime } from "./runtime";

class App {
    signals = {
        isPlaying: createSignal(false),
        counter: createSignal(0)
    };

    constructor() {
        // Bind methods to preserve 'this' context
        this.playPiano = this.playPiano.bind(this);
        this.resetCounter = this.resetCounter.bind(this);
    }

    playPiano() {
        console.log("Piano is playing!", this.signals.isPlaying.get());
        const audio = new Audio('https://raw.githubusercontent.com/nbrosowsky/tonejs-instruments/refs/heads/master/samples/piano/A1.mp3');
        audio.play();
    }

    resetCounter() {
        console.log("Resetting counter from", this.signals.counter.get(), "to 0");
        this.signals.counter.set(0);
    }

    pianoAt10() {
        this.playPiano()
        this.resetCounter()
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            const app = document.querySelector('#app');
            if (app) {
                Runtime.getInstance().mount(app as HTMLElement, this.signals);
                
                // attach effects after mounting
                this.signals.isPlaying.addEffect('playPiano', this.playPiano, () => this.signals.isPlaying.get() === true);
                this.signals.counter.addEffect('resetCounter', this.resetCounter, 
                    value => value > 10);
            }
        });

        // Make signals and methods available globally for testing
        (window as any).app = this;
    }
}

const app = new App();
app.init();