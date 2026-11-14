// Small wrappers around the /api/clubs endpoints (proxied to Express by Vite).

async function getJson(url, signal) {
  const res = await fetch(url, { signal });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(body.error || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return body;
}

export function searchClubs(keyword, signal) {
  const params = new URLSearchParams();
  if (keyword) params.set('q', keyword);
  const qs = params.toString();
  return getJson(`/api/clubs${qs ? `?${qs}` : ''}`, signal);
}

export function getClub(id, signal) {
  return getJson(`/api/clubs/${encodeURIComponent(id)}`, signal);
}
