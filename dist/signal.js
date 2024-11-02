"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Signal = void 0;
class Signal {
    constructor(val) {
        this.dependency = new Set();
        this._value = this._makeReactive(val);
    }
    _makeReactive(obj) {
        if (typeof obj !== 'object' || obj === null)
            return obj;
        // recursively make children elements reactive
        if (Array.isArray(obj)) {
            return obj.map(item => this._makeReactive(item));
        }
        const reactiveObj = {};
        for (const key in obj)
            reactiveObj[key] = new Signal(obj[key]);
        return new Proxy(reactiveObj, {
            // when accessing a property, retrieves the value of the Signal (e.g., reactiveObj[prop].value)
            get: (target, prop) => { var _a; return (_a = target[prop]) === null || _a === void 0 ? void 0 : _a.value; },
            set: () => {
                console.warn("Direct mutation is not allowed. Use set()");
                return true;
            }
        });
    }
    // getter and setter
    get value() { return this._value; }
    set(setter) {
        const newValue = typeof setter === "function" ? setter(this.value) : setter;
        this._value = this._makeReactive(newValue);
        this.notify();
    }
    subscribe(callback) { this.dependency.add(callback); }
    unsubscribe(callback) { this.dependency.delete(callback); }
    notify() {
        this.dependency.forEach(callback => callback());
    }
}
exports.Signal = Signal;
