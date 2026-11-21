// Small wrappers around the /api/clubs endpoints (proxied to Express by Vite).
import { api } from '../api.js';

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

//SH7: resolves to the new link for the club page
export function addClubLink(clubId, { type, url }, token) {
  return api(`/clubs/${encodeURIComponent(clubId)}/links`, {
    method: 'POST',
    body: { type, url },
    token,
  });
}