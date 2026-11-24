// Public reads for a club's timeline events and open positions.
// Writes go through api() in ../api.js with the user's token.

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

export function getClubEvents(id, signal) {
  return getJson(`/api/clubs/${encodeURIComponent(id)}/events`, signal);
}

export function getClubPositions(id, signal) {
  return getJson(`/api/clubs/${encodeURIComponent(id)}/positions`, signal);
}
