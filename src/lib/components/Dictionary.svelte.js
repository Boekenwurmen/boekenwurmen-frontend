import { PUBLIC_API_URL } from "$env/static/public";
import Stories from "./Stories.svelte";

export default class Dictionary {
    /**
     * 
     * @param word {string | null | undefined}
     * @returns {Promise<Object>}
     */
    static async getDefinition(word){
        try {
            return await Dictionary._getDefinitionServer(word);
        } catch (error) {
            console.warn('failed to load book story from server, switched to local story', error);
            return Dictionary._getDefinitionLocal(word);
        }
    }

    /**
     * 
     * @returns {Promise<string[]>}
     */
    static async getBookList(){
        try {
            return /** @type {string[]} */ (await Dictionary._getBookListServer());
        } catch (error) {
            console.warn('failed to load book options from server, switched to local story', error);
            return /** @type {string[]} */ (Dictionary._getBookListLocal());
        }
    }

    /**
     * 
     * @param word {string | null | undefined}
     * @returns {Promise<string>}
     */
    static async _getDefinitionServer(word){
        if (word === null || word === undefined) {
            throw new Error(`pageId is ${word} in _getDefinitionServer`);
        }
        const res = await Stories.getDataBody(`${PUBLIC_API_URL}/dictionary/${word}`);
        const data = res?.data;
        if (typeof data === 'object' && data !== null && data !== undefined) {
            return data;
        } else {
            throw new Error('backend did not return the definition as a string');
        }
    }

    /**
     * 
     * @returns {Promise<Object[]>}
     */
    static async _getBookListServer(){
        const res = await Stories.getDataBody(`${PUBLIC_API_URL}/dictionary`);
        const data = res?.data;
        if (Array.isArray(data) && data !== null && data !== undefined) {
            return data;
        } else {
            throw new Error('backend did not return the book list as an array');
        }
    }


    /**
     * 
     * @param {string | null | undefined} word
     */
    static _getDefinitionLocal(word){
        return {};
    }

    /**
     * 
     */
    static _getBookListLocal(){
        return [];
    }
}