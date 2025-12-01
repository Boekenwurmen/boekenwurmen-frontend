import { PUBLIC_API_URL } from "$env/static/public";

/**
 * Function to load appointments
 * this function expects the backend routes below to exist and act as specified below:
 *   * `${PUBLIC_API_URL}/books` to return an index of all book ids: {number[]}
 *   * `${PUBLIC_API_URL}/books/${bookId}` to get an index of all page ids: {number[]}
 *   * `${PUBLIC_API_URL}/books/${bookId}/${pageId}` to get the text on that page: {string}
 *   * `${PUBLIC_API_URL}/books/${bookId}/${pageId}/options` to get an array of objects that each have the properties "toPage" and "name" in other words: {{toPage: number, name: string}[]}
 * where PUBLIC_API_URL could be "http://localhost:3012/api/v1" but is subject to change
 * @param {{ fetch: (a:string) => Promise<any> }} fetch 
 * @returns {Promise<{ appointments: any[]; } | { error: any; }>}
 */
export const load = async ({ fetch }) => {
    try {
        const data = await getDataBody(`${PUBLIC_API_URL}/pets`, fetch)
        const promises = data?.map((e) => getDataBody(`${PUBLIC_API_URL}${e}`, fetch));
        const dataLoaded = promises ? await Promise.all(promises) : null;
        return { dataLoaded };
    } catch (error) {
        // console.error(error);
        throw error;
    }
};

/**
 * 
 * @param {string} url 
 * @param {(a:string) => Promise<any>} fetch 
 * @returns {Promise<Object|null>}
 */
async function getDataBody(url, fetch) {
    try {
        const res = await fetch(url);
        const data = await res.json();
        return data ?? null;
    } catch (error) {
        // console.error(error);
        return null;
    }
}

// /**
//  * @param {*} prefix 
//  * @param {*} urls 
//  * @example const dataLoaded = await getDataBodyAll(PUBLIC_API_URL, data);
//  * @returns 
//  */
// async function getDataBodyAll(prefix, urls) {
//     const resPromises = urls.map((url) => fetch(`${prefix}${url}`));
//     const ress = await Promise.all(resPromises);
//     const jsonPromises = ress.map((res) => res.json);
//     const data = await Promise.all(jsonPromises);
//     return data?.body ?? null;
// }