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
    return { ok: res.ok, status: res.status, data };
  } catch (e) {
    console.warn('[userActions] saveClientCode failed', e);
    return { ok: false, status: 0, data: { message: 'network-error' } };
  }
}

export async function registerClient(baseUrl, name, code) {
  try {
    const res = await fetch(`${baseUrl}/clients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, code })
    });
    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
  } catch (e) {
    console.warn('[userActions] registerClient failed', e);
    return { ok: false, status: 0, data: { message: 'network-error' } };
  }
}

export async function getProgress(baseUrl, clientId, bookId) {
  try {
    const res = await fetch(`${baseUrl}/progress/${clientId}/${bookId}`);
    const data = await res.json();
    return { ok: res.ok, percentage: data.percentage || 0 };
  } catch (e) {
    console.warn('[userActions] getProgress failed', e);
    return { ok: false, percentage: 0 };
  }
}
