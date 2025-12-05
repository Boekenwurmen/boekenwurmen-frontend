import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import TypeWriter from './TypeWriter.svelte.js';

describe('TypeWriter', () => {
    /**
     * @type {TypeWriter}
     */
    let typeWriter;

    beforeEach(() => {
        vi.useFakeTimers(); // Enable fake timers
        typeWriter = new TypeWriter(10); // speed = 10 words per minute
    });

    afterEach(() => {
        vi.useRealTimers(); // Restore real timers
    });

    it('should type out the text over time', () => {
        const text = 'Hello';
        typeWriter.reset(text);

        // Initially, only the first character should be shown
        expect(typeWriter.shown).toBe('H');

        // Simulate each "_speed" interval
        for (let i = 1; i < text.length; i++) {
            vi.advanceTimersByTime(typeWriter._typingDelay);
            expect(typeWriter.shown.length).toBe(i + 1);
            expect(typeWriter.shown).toBe(text.slice(0, i + 1));
        }

        // After all timers, full text should be typed
        vi.runAllTimers();
        expect(typeWriter.shown).toBe(text);
    });

    it('should reset correctly and cancel previous timeout', () => {
        typeWriter.reset('Hello');
        vi.advanceTimersByTime(typeWriter._typingDelay * 2); // type 2 letters

        typeWriter.reset('New'); // reset mid-way
        expect(typeWriter.shown).toBe('N'); // first letter of new text
        expect(typeWriter._index).toBe(1);

        vi.runAllTimers();
        expect(typeWriter.shown).toBe('New'); // full new text typed
    });
});
