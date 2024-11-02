"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const signal_1 = require("./signal");
const nestedSignal = new signal_1.Signal({ a: { b: 2 }, c: [1, 2, 3] });
nestedSignal.value;
nestedSignal.subscribe(() => console.log("Signal changed:", nestedSignal.value));
nestedSignal.set((prev) => (Object.assign(Object.assign({}, prev), { a: Object.assign(Object.assign({}, prev.a), { b: 5 }) })));
