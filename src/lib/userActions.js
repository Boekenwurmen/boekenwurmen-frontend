/**
 * User-related helper functions extracted from ChooseActionWindow
 */

export async function prefillCodeForClient(clientId, baseUrl, returnRaw = false) {
  try {
    const res = await fetch(`${baseUrl}/clients/${clientId}`);
    const d = await res.json();
    if (returnRaw) return d;
    if (d && d.success && d.client && d.client.code) {
      return d.client.code;
    }
    return '';
  } catch (e) {
    console.warn('[userActions] could not prefill code', e);
    return '';
  }
}

export async function ensureClientExists(baseUrl, preferredName = 'guest') {
  try {
    const createRes = await fetch(`${baseUrl}/clients`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: preferredName })
    });
    const createData = await createRes.json();
    if (createData && createData.success && createData.client) {
      return { id: createData.client.id, name: createData.client.name };
    }
    return null;
  } catch (e) {
    console.warn('[userActions] ensureClientExists failed', e);
    return null;
  }
}

export async function saveClientCode(baseUrl, clientId, code) {
  try {
    const res = await fetch(`${baseUrl}/clients/${clientId}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });
    const data = await res.json();
    return data;
  } catch (e) {
    console.warn('[userActions] saveClientCode failed', e);
    return null;
  }
}
