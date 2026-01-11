import { PUBLIC_API_URL } from "$env/static/public";
import { _getPageOptionsJson, _getPageStoryJson, _getPageTypeJson } from "$lib/algorithms/bookJsonAccess.js";

export default class Stories {
    /**
     *
     * @param bookId {number | null | undefined}
     * @param pageId {number | null | undefined}
     * @param lang {string} Language code (default: 'nl')
     * @returns {Promise<string>}
     */
    static async getPageStory(bookId, pageId, lang = 'en'){
        try {
            return await Stories._getPageStoryServer(bookId, pageId, lang);
        } catch (error) {
            console.warn('failed to load book story from server, switched to local story', error);
            return Stories._getPageStoryLocal(bookId, pageId);
        }
    }

    /**
     *
     * @param bookId {number | null | undefined}
     * @param pageId {number | null | undefined}
     * @param lang {string} Language code (default: 'nl')
     * @returns {Promise<{ toPage: number, type:"page" | "bad ending" | "ending" | "to library" | "submit" | "onError", name: string }[]>}
     */
    static async getPageOptions(bookId, pageId, lang = 'en'){
        try {
            return /** @type {{ toPage: number, type:"page" | "bad ending" | "ending" | "to library" | "submit" | "onError", name: string }[]} */ (await Stories._getPageOptionsServer(bookId, pageId, lang));
        } catch (error) {
            console.warn('failed to load book options from server, switched to local story', error);
            return /** @type {{ toPage: number, type:"page" | "bad ending" | "ending" | "to library" | "submit" | "onError", name: string }[]} */ (Stories._getPageOptionsLocal(bookId, pageId));
        }
    }

    /**
     * 
     * @param bookId {number | null | undefined}
     * @param pageId {number | null | undefined}
     * @returns {Promise<"page" | "enter name" | "enter password" | "set name" | "set password">}
     */
    static async getPageType(bookId, pageId){
        try {
            return /** @type {"page" | "enter name" | "enter password" | "set name" | "set password"} */ (await Stories._getPageTypeServer(bookId, pageId));
        } catch (error) {
            console.warn('failed to load book options from server, switched to local story', error);
            return Stories._getPageTypeLocal(bookId, pageId);
        }
    }

    /**
     *
     * @param bookId {number | null | undefined}
     * @param pageId {number | null | undefined}
     * @param lang {string} Language code (default: 'nl')
     * @returns {Promise<string>}
     */
    static async _getPageStoryServer(bookId, pageId, lang = 'en'){
        if (pageId === null || pageId === undefined) {
            throw new Error(`pageId is ${pageId} in _getPageStoryServer`);
        }
        if (bookId === null || bookId === undefined) {
            throw new Error(`bookId is ${bookId} in _getPageStoryServer`);
        }
        // Always send language to backend - let backend decide if translation is needed
        const url = `${PUBLIC_API_URL}/books/${bookId}/${pageId}?lang=${lang}`;
        const res = await Stories.getDataBody(url);
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
     * @returns {Promise<string>}
     */
    static async _getPageTypeServer(bookId, pageId){
        if (pageId === null || pageId === undefined) {
            throw new Error(`pageId is ${pageId} in _getPageStoryServer`);
        }
        if (bookId === null || bookId === undefined) {
            throw new Error(`bookId is ${bookId} in _getPageStoryServer`);
        }
        const res = await Stories.getDataBody(`${PUBLIC_API_URL}/books/${bookId}/${pageId}/type`);
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
     * @param lang {string} Language code (default: 'nl')
     * @returns {Promise<Object[]>}
     */
    static async _getPageOptionsServer(bookId, pageId, lang = 'en'){
        if (pageId === null || pageId === undefined) {
            throw new Error(`pageId is ${pageId} in _getPageOptionsServer`);
        }
        if (bookId === null || bookId === undefined) {
            throw new Error(`bookId is ${bookId} in _getPageOptionsServer`);
        }
        // Always send language to backend - let backend decide if translation is needed
        const url = `${PUBLIC_API_URL}/books/${bookId}/${pageId}/options?lang=${lang}`;
        const res = await Stories.getDataBody(url);
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
     * @param {number | null | undefined} page
     */
    static _getPageStoryLocal(bookId, page){
        if (page === null || page === undefined) {
            return `This part of the story ${Math.random() < 0.5 ? 'went missing' : 'got burned up'}.`;
        }
        return _getPageStoryJson(Number(bookId) || 0, page);
    }

    /**
     * 
     * @param {number | null | undefined} page
     */
    static _getPageTypeLocal(bookId, page){
        if (page === null || page === undefined) {
            return 'page';
        }
        return _getPageTypeJson(Number(bookId) || 0, page);
    }

    /**
     * 
     * @param {number | null | undefined} page 
     */
    static _getPageOptionsLocal(bookId, page){
        if (page === null || page === undefined) {
            return [
                {toPage:0, type: 'page', name: 'Go back'},
            ];
        }
        return _getPageOptionsJson(Number(bookId) || 0, page);
    }
}