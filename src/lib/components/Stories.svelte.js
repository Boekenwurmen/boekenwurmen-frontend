import { PUBLIC_API_URL } from "$env/static/public";

export default class Stories {
    /**
     * 
     * @param bookId {number | null | undefined}
     * @param pageId {number | null | undefined}
     * @returns {Promise<string>}
     */
    static async getPageStory(bookId, pageId){
        try {
            return await Stories._getPageStoryServer(bookId, pageId);
        } catch (error) {
            console.warn('failed to load book story from server, switched to local story', error);
            return Stories._getPageStoryLocal(pageId);
        }
    }

    /**
     * 
     * @param bookId {number | null | undefined}
     * @param pageId {number | null | undefined}
     * @returns {Promise<{ toPage: number, name: string }[]>}
     */
    static async getPageOptions(bookId, pageId){
        try {
            return /** @type {{ toPage: number, name: string }[]} */ (await Stories._getPageOptionsServer(bookId, pageId));
        } catch (error) {
            console.warn('failed to load book options from server, switched to local story', error);
            return Stories._getPageOptionsLocal(pageId);
        }
    }

    /**
     * 
     * @param bookId {number | null | undefined}
     * @param pageId {number | null | undefined}
     * @returns {Promise<string>}
     */
    static async _getPageStoryServer(bookId, pageId){
        if (pageId === null || pageId === undefined) {
            throw new Error(`pageId is ${pageId} in _getPageStoryServer`);
        }
        if (bookId === null || bookId === undefined) {
            throw new Error(`bookId is ${bookId} in _getPageStoryServer`);
        }
        const res = await Stories.getDataBody(`${PUBLIC_API_URL}/books/${bookId}/${pageId}`);
        const direct = (typeof res === 'string') ? res : undefined;
        const nested = typeof res?.data?.books === 'string' ? res.data.books : undefined;
        const val = nested ?? direct;
        if (typeof val === 'string' && val !== null && val !== undefined) return val;
        throw new Error('backend did not return the story as a string');

        const data = res?.data?.books;
        if (typeof data === 'string' && data !== null && data !== undefined) {
            return data;
        } else {
            throw new Error('backend did not return the story as a string');
        }

    }

    /**
     * 
     * @param bookId {number | null | undefined}
     * @param pageId {number | null | undefined}
     * @returns {Promise<Object[]>}
     */
    static async _getPageOptionsServer(bookId, pageId){
        if (pageId === null || pageId === undefined) {
            throw new Error(`pageId is ${pageId} in _getPageOptionsServer`);
        }
        if (bookId === null || bookId === undefined) {
            throw new Error(`bookId is ${bookId} in _getPageOptionsServer`);
        }
        const res = await Stories.getDataBody(`${PUBLIC_API_URL}/books/${bookId}/${pageId}/options`);
        const direct = Array.isArray(res) ? res : undefined;
        const nested = Array.isArray(res?.data?.books) ? res.data.books : undefined;
        const val = nested ?? direct;
        if (Array.isArray(val) && val !== null && val !== undefined) return val;
        throw new Error('backend did not return the story as an array');
        const data = res?.data?.books;
        if (Array.isArray(data) && data !== null && data !== undefined) {
            return data;
        } else {
            throw new Error('backend did not return the story as an array');
        }
    }

    /**
     * 
     * @param {string} url 
     * @returns {Promise<any|null>}
     */
    static async getDataBody(url) {
        try {
            const res = await fetch(url);
            const data = await res.json();
            // console.log('getDataBody', url, res, data, data.body);
            return data ?? null;
        } catch (error) {
            return null;
        }
    }

    /**
     * 
     * @param page {number | null | undefined}
     */
    static _getPageStoryLocal(page){
        switch (page) {
            case 0: return "You walk through a sandy, windy desert. The wind blows sand in your eyes and you fall to the ground."
            case 1: return "You start screaming into the vast empty desert. While screaming you feel yourself slowely sinking into the ground when all of a sudden you fall through the ground! You hit the ground hard and hurt yourself."
            case 2: return "As soon as you hit the ground you feel a wooden hatch beneath you. It feels old and rotten. Yet when you put your ear to the hatch you hear running water. As you hear the water your throat starts to dry up you have not drank anything for about a day..."
            case 3: return "You enter what seems to be a library with a bit of running water. You take a drink and start looking around but all the books you see you can't read..."
            case 4: return "As you wander further you become more and more thirsty and start seeing things that aren’t there... After five more hours of wandering in the heat of the desert you fall to the ground. You fall asleep not to wake up again... "
            case 5: return "As you look around you see the running water and take a sip. behind all the water you see a old library filled with books you can’t read..."
            case 6: return "You check your leg and see it bleeding. You rip off a piece of your shirt and after you clean the wound with the running water you see, you make a makeshift bandage. Now that you’ve treated your wound you start to look around and see an old library filled with books you can’t read...."
            default: return `This part of the story ${Math.random() < 0.5 ? 'went missing' : 'got burned up'}.`
        }
    }

    /**
     * 
     * @param page {number | null | undefined}
     */
    static _getPageOptionsLocal(page){
        switch (page) {

            case 0: return [
                {toPage:2, name:"You hit the ground out of frustation"},
                {toPage:1, name:"You scream in pain from the sand in your eyes"},
            ]
            case 1: return [
                {toPage:2, name:"You hit the ground out of frustration"},
                {toPage:2, name:"You scream in pain from the sand in your eyes"},
            ]
            case 2: return [
                {toPage:3, name:"Check yourself for wounds"},
                {toPage:3, name:"Look around to see where you are"},
            ]
            case 3: case 6: case 7: return [
                {toPage:Infinity, name:"Enter library"},
            ]
            case 4: return [
                {toPage:1, name:"Go back"},
            ]
            default: return [
                {toPage:1, name:"Go back"},
            ]
        }
    }
}