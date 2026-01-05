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
 * @returns {boolean} true if successful, false if unsuccessful
 */
export function followOption(pageContext, option) {
  try {
    pageContext[2]++;
    if (!pageContext || !option || option.toPage === undefined || option.toPage === null) return false;
    pageContext[0] = option.toPage;
    return true;
  } catch (e) {
    return false;
    // ignore
  }
}
