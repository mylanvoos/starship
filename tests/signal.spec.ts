import test, { expect } from '@playwright/test'
import { Signal } from '../src/signal'

test.describe('Signal Class', () => {

    test('should initialise with a primitive value', () => {
        const signal = new Signal(10)
        expect(signal.value).toBe(10)
    })
    test('should update value correctly with set', () => {
        const signal = new Signal(10)
        signal.set(20)
        expect(signal.value).toBe(20)
    })
    test('should support functional updates in set', () => {
        const signal = new Signal(10)
        signal.set(prev => prev + 5)
        expect(signal.value).toBe(15)
    })
    test('should trigger notify when value changes', () => {
        const signal = new Signal(10)
        let triggered = false
        signal.subscribe(() => triggered = true)
        signal.set(20)
        expect(triggered).toBe(true)
    })
    test('should NOT trigger notify when value is set to the same value', () => {
        const signal = new Signal(10)
        let triggered = 0
        signal.subscribe(() => triggered + 10)
        signal.set(10)
        expect(triggered).toBe(0)
    })
    test("should update and notify subscribers for nested objects", () => {
        const signal = new Signal({ a: { b: 1 } });
        let nestedValue = null;
    
        signal.value.a
        signal.value.a.subscribe(() => nestedValue = signal.value.a.b.value);
        signal.value.a.b.set(2);  // Update nested value
    
        expect(nestedValue).toBe(2);
      });
    
      test("should make nested properties reactive", () => {
        const signal = new Signal({ nested: { value: 42 } });
        let triggered = false;
        
        signal.value.nested.subscribe(() => triggered = true);
        signal.value.nested.value.set(100);
        
        expect(triggered).toBe(true);
        expect(signal.value.nested.value).toBe(100);
      });
    
      test("should handle arrays reactively", () => {
        const signal = new Signal([1, 2, 3]);
        let triggered = false;
        
        signal.subscribe(() => triggered = true);
        signal.set((prev) => [...prev, 4]);
        
        expect(triggered).toBe(true);
        expect(signal.value).toEqual([1, 2, 3, 4]);
      });
    
      test("should prevent direct mutation", () => {
        const signal = new Signal({ a: 1 });
        
        // Attempt direct mutation
        // @ts-expect-error Ignore TS error for this test
        signal.value.a = 2;
        
        expect(signal.value.a).toBe(1);
      });
    
      test("should support unsubscribe", () => {
        const signal = new Signal(10);
        let triggerCount = 0;
        
        const callback = () => triggerCount++;
        signal.subscribe(callback);
        signal.unsubscribe(callback);
        signal.set(20);
        
        expect(triggerCount).toBe(0);
      });
    
      test("should track dependencies for multiple subscribers", () => {
        const signal = new Signal(10);
        let triggerCount1 = 0;
        let triggerCount2 = 0;
        
        const callback1 = () => triggerCount1++;
        const callback2 = () => triggerCount2++;
        
        signal.subscribe(callback1);
        signal.subscribe(callback2);
        signal.set(20);
        
        expect(triggerCount1).toBe(1);
        expect(triggerCount2).toBe(1);
      });
    
      test("should work with complex nested updates", () => {
        const signal = new Signal({ a: { b: { c: 3 } } });
        let capturedValue = null;
        
        signal.value.a.b.subscribe(() => capturedValue = signal.value.a.b.c);
        signal.value.a.b.c.set(42); // Deeply nested update
        
        expect(capturedValue).toBe(42);
      });
    
      test("should support reactive arrays within objects", () => {
        const signal = new Signal({ list: [1, 2, 3] });
        let triggered = false;
        
        signal.value.list.subscribe(() => triggered = true);
        signal.value.list.set([...signal.value.list, 4]);
        
        expect(triggered).toBe(true);
        expect(signal.value.list).toEqual([1, 2, 3, 4]);
      });
    
      test("should allow custom functions to reactively compute derived state", () => {
        const signal = new Signal(10);
        const double = new Signal(() => signal.value * 2);
        
        let doubleValue = null;
        double.subscribe(() => doubleValue = double.value);
        
        signal.set(20);
        
        expect(doubleValue).toBe(40);
      });
    
      test("should not create dependencies on read-only access", () => {
        const signal = new Signal(10);
        let triggerCount = 0;
        
        const callback = () => triggerCount++;
        signal.subscribe(callback);
        
        expect(signal.value).toBe(10); // Only reading the value, should not trigger reactivity
        expect(triggerCount).toBe(0);
      });
    
      test("should update deeply nested objects immutably", () => {
        const signal = new Signal({ a: { b: { c: 3 } } });
        let capturedValue = null;
        
        signal.subscribe(() => capturedValue = signal.value.a.b.c);
        
        signal.set(prev => ({
          ...prev,
          a: { ...prev.a, b: { ...prev.a.b, c: 5 } }
        }));
        
        expect(capturedValue).toBe(5);
        expect(signal.value.a.b.c).toBe(5);
      });
})
