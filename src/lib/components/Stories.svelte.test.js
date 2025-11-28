import { expect, test } from 'vitest';
import Stories from './Stories.svelte.js';

const indexes = [-10000, -100, -10, -3, -2, -1, 0, 0.5, 1, 2, 3, 10, 100, 1000, 10000, Infinity, undefined, null];
const bookId = 0;

test("All pages give valid stories", () => {
    indexes.forEach(page => {
        const story = Stories.getPageStory(bookId, page);
        expect(story).toBeTypeOf('string');
        expect(story).not.toBe('');
        // expect(story).toMatch('');
    });
});

test('All pages give valid options', () => {
    indexes.forEach(page => {
        const options = Stories.getPageOptions(bookId, page);
        expect(options).toBeInstanceOf(Array);
        options.forEach(option => {
            expect(option).toEqual(
                expect.objectContaining({
                    toPage: expect.any(Number),
                    name: expect.any(String)
                })
            );
            expect(option.toPage).toBeGreaterThanOrEqual(0);
            expect(Number.isInteger(option.toPage)).toBe(true);
            expect(option.name).not.toBe('');
        });
    });
});