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
