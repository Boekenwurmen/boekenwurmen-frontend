import { CODE_FORWARD_OFFSET } from './constants';

export async function createClient(baseUrl, name) {
  try {
    const res = await fetch(`${baseUrl}/clients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
  } catch (e) {
    return { ok: false, status: 0, data: { message: 'network-error' } };
  }
}

/**
 * Save progress to backend
 * @param {string} baseUrl
 * @param {number} clientId
 * @param {number} bookId
 * @param {number} pageId
 * @returns {Promise<{ok: boolean, status: number}>}
 */
export async function saveProgressToBackend(baseUrl, clientId, bookId, pageId) {
  try {
    const res = await fetch(`${baseUrl}/progress/${clientId}/${bookId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pageId })
    });
    return { ok: res.ok, status: res.status };
  } catch (e) {
    console.warn('[readingActions] saveProgressToBackend failed', e);
    return { ok: false, status: 0 };
  }
}

export function goTo(pageContext, pageNumber) {
  try {
    if (!pageContext) return;
    pageContext[0] = Number(pageNumber) || 0;
  } catch (e) {
    // ignore
  }
}

export function advanceFromNameToCode(pageContext) {
  try {
    if (!pageContext) return;
    const current = Number(pageContext[0]) || 0;
    pageContext[0] = current + CODE_FORWARD_OFFSET;
  } catch (e) {
    // ignore
  }
}

/**
 * Jumps to the target page stored in an options object
 * @param {number[]} pageContext keeps track of what page we are on
 * @param {{toPage: number, type: string, name: string}|undefined} option has the new page inside
 * @param {string} [baseUrl] the base URL for API calls (optional)
 * @param {number} [clientId] the client ID (optional)
 * @returns {Promise<boolean>} true if successful, false if unsuccessful
 */
export async function followOption(pageContext, option, baseUrl, clientId) {
  try {
    if (!pageContext || !option || option.toPage === undefined || option.toPage === null) return false;
    
    const bookId = Number(pageContext[1]);
    const newPageId = option.toPage;
    
    // Index 2 tracks action clicks to trigger effects
    pageContext[2]++;
    pageContext[0] = newPageId;
    
    // Save to backend
    if (clientId && bookId && baseUrl) {
      await saveProgressToBackend(baseUrl, clientId, bookId, newPageId);
    }
    
    return true;
  } catch (e) {
    console.warn('[readingActions] followOption failed', e);
    return false;
  }
}
