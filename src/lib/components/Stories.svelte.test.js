import { expect, test } from 'vitest';
import Stories from './Stories.svelte.js';

test('Stories', () => {
    const indexes = [-10000, -100, -10, -3, -2, -1, 0, 0.5, 1, 2, 3, 10, 100, 1000, 10000, Infinity, undefined, null];
    indexes.forEach(element => {
        const story = Stories.getPageStory(element);
        expect(story).toBeTypeOf('string');
        expect(story).not.toBe('');
        // expect(story).toMatch('');
    });
});

test('Options', () => {
    const indexes = [-10000, -100, -10, -3, -2, -1, 0, 0.5, 1, 2, 3, 10, 100, 1000, 10000, Infinity, undefined, null];
    indexes.forEach(element => {
        const options = Stories.getPageOptions(element);
        expect(options).toBeInstanceOf(Array);
        options.forEach(option => {
            expect(option).toEqual(expect.objectContaining({ toPage: expect.any(Number), name: expect.any(String) }));
        });
    });
});