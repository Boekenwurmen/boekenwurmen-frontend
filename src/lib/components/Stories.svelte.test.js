import { expect, test, vi } from 'vitest';

vi.mock('$env/static/public', () => ({
    PUBLIC_API_URL: 'http://localhost:3012'
}));

import Stories from './Stories.svelte.js';

const indexes = [-10000, -100, -10, -3, -2, -1, 0, 0.5, ...getIntegersInRange(1, 20), 100, 1000, 10000, Infinity, undefined, null];
const bookId = 0;

/**
 * 
 * @param {number} from starting range value
 * @param {number} to ending range value
 * @returns {number[]} all integers in the specified range
 */
function getIntegersInRange(from, to) {
    const offset = from;
    const length = to - from + 1;
    return [...Array(length)].map((_, i) => i + offset);
}

test("All pages give valid stories", async () => {
    const storyPromises = indexes.map(page => Stories.getPageStory(bookId, page));
    const stories = await Promise.all(storyPromises);
    for (const story of stories) {
        expect(story).toBeTypeOf('string');
        expect(story).not.toBe('');
        // expect(story).toMatch('');
    }
});

test('All pages give valid options', async () => {
    const storyPromises = indexes.map(page => Stories.getPageOptions(bookId, page));
    const stories = await Promise.all(storyPromises);
    stories.forEach(options => {
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