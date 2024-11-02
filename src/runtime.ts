import { Signal } from "./reactivity/signal";

declare global {
    interface Window {
        currentContext: Runtime;
    }
    interface Function {
        attach(signalKey: string, condition?: (value: any) => boolean): void;
    }
}

// This is messing with the scope. Explore adding back later
//
// Function.prototype.attach = function(signalKey: string, condition?: (value: any) => boolean) {
//     if (!window.currentContext) return;
//     console.log(window.currentContext.signals[signalKey])
//     const signal = window.currentContext.signals[signalKey];
//     if (signal instanceof Signal) {
//         signal.addEffect(this.name || 'anonymous', this, condition);
//     }
// };

export class Runtime {
    private static instance: Runtime;
    signals: Record<string, Signal<any>> = {};
    private mounted = new Set<HTMLElement>();
    
    static getInstance(): Runtime {
        if (!Runtime.instance) {
            Runtime.instance = new Runtime();
        }
        return Runtime.instance;
    }

    mount(element: HTMLElement, signals: Record<string, Signal<any>>): void {
        this.signals = signals;
        window.currentContext = this;
        this.parseTemplate(element);
    }

    private parseTemplate(element: HTMLElement): void {
        if (this.mounted.has(element)) return;
        this.mounted.add(element);

        if (element.hasAttribute(':signals')) {
            element.removeAttribute(':signals');
        }

        const showAttr = element.getAttribute(':show');
        if (showAttr) {
            const display = element.style.display || 'block';
            element.style.display = 'none';
            if (this.signals[showAttr]) {
                this.signals[showAttr].subscribe((value) => {
                    element.style.display = value ? display : 'none';
                });
            }
        }

        const textNodes = Array.from(element.childNodes)
            .filter(node => node.nodeType === Node.TEXT_NODE);

        textNodes.forEach(node => {
            const text = node.textContent || '';
            const matches = text.match(/\{([^}]+)\}/g);
            
            if (matches) {
                matches.forEach(match => {
                    const signalKey = match.slice(1, -1).trim();
                    if (this.signals[signalKey]) {
                        this.signals[signalKey].subscribe((value) => {
                            node.textContent = text.replace(match, String(value));
                        });
                    }
                });
            }
        });

        element.querySelectorAll('[\\@click]').forEach(el => {
            const attr = el.getAttribute('@click');
            if (attr) {
                el.removeAttribute('@click');
                el.addEventListener('click', () => {
                    const handler = new Function('signals', `
                        with (signals) {
                            ${attr}
                        }
                    `);
                    handler(this.signals);
                });
            }
        });

        Array.from(element.children).forEach(child => {
            this.parseTemplate(child as HTMLElement);
        });
    }
}
