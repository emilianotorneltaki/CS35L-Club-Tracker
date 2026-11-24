import { supabase } from '../services/supabase.js';

export const EVENT_DESCRIPTION_MAX = 200;

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const EVENT_FIELDS = 'id, club_id, name, date:event_date, description';
const POSITION_FIELDS =
  'id, club_id, title, description, requirements, created_at, updated_at';

function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

// True for a real calendar date written as YYYY-MM-DD (rejects 2026-02-30).
function isValidDate(value) {
  if (!DATE_RE.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

// Sends a 400 that names every field needing a fix, e.g.
// { error: 'Event name is required.', fields: { name: '...' } }
function sendFieldErrors(res, fields) {
  return res.status(400).json({ error: Object.values(fields).join(' '), fields });
}

// Runs after requireAuth. Only the account that owns club :id may continue.
export async function requireClubOwner(req, res, next) {
  const { id } = req.params;
  if (!UUID_RE.test(id)) return res.status(404).json({ error: 'Club not found' });

  const { data, error } = await supabase
    .from('clubs')
    .select('id, owner_id')
    .eq('id', id)
    .maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Club not found' });
  if (data.owner_id !== req.user.id) {
    return res.status(403).json({ error: 'Only this club’s account can make changes here' });
  }
  next();
}

// ---------- Timeline events ----------

export function validateEvent(body = {}) {
  const name = text(body.name);
  const date = text(body.date);
  const description = text(body.description);
  const fields = {};

  if (!name) fields.name = 'Event name is required.';
  if (!date) fields.date = 'Event date is required.';
  else if (!isValidDate(date)) fields.date = 'Event date must be a valid date.';
  if (description.length > EVENT_DESCRIPTION_MAX) {
    fields.description = `Description must be ${EVENT_DESCRIPTION_MAX} characters or fewer (currently ${description.length}).`;
  }
  return { fields, value: { name, date, description } };
}

// GET /api/clubs/:id/events — public, oldest first.
export async function listEvents(req, res) {
  const { id } = req.params;
  if (!UUID_RE.test(id)) return res.status(404).json({ error: 'Club not found' });

  const { data, error } = await supabase
    .from('club_events')
    .select(EVENT_FIELDS)
    .eq('club_id', id)
    .order('event_date', { ascending: true })
    .order('created_at', { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
}

// POST /api/clubs/:id/events — club owner only.
export async function createEvent(req, res) {
  const { fields, value } = validateEvent(req.body);
  if (Object.keys(fields).length) return sendFieldErrors(res, fields);

  const { data, error } = await supabase
    .from('club_events')
    .insert({
      club_id: req.params.id,
      name: value.name,
      event_date: value.date,
      description: value.description,
    })
    .select(EVENT_FIELDS)
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
}

// ---------- Open positions ----------

export function validatePosition(body = {}) {
  const title = text(body.title);
  const description = text(body.description);
  const requirements = text(body.requirements);
  const fields = {};

  if (!title) fields.title = 'Position title is required.';
  if (!description) fields.description = 'Role description is required.';
  return { fields, value: { title, description, requirements } };
}

// GET /api/clubs/:id/positions — public, oldest first.
export async function listPositions(req, res) {
  const { id } = req.params;
  if (!UUID_RE.test(id)) return res.status(404).json({ error: 'Club not found' });

  const { data, error } = await supabase
    .from('club_positions')
    .select(POSITION_FIELDS)
    .eq('club_id', id)
    .order('created_at', { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
}

// POST /api/clubs/:id/positions — club owner only.
export async function createPosition(req, res) {
  const { fields, value } = validatePosition(req.body);
  if (Object.keys(fields).length) return sendFieldErrors(res, fields);

  const { data, error } = await supabase
    .from('club_positions')
    .insert({ club_id: req.params.id, ...value })
    .select(POSITION_FIELDS)
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
}

// PUT /api/clubs/:id/positions/:positionId — club owner only.
export async function updatePosition(req, res) {
  const { id, positionId } = req.params;
  if (!UUID_RE.test(positionId)) return res.status(404).json({ error: 'Position not found' });

  const { fields, value } = validatePosition(req.body);
  if (Object.keys(fields).length) return sendFieldErrors(res, fields);

  // Matching on club_id too means a club can never edit another club's position.
  const { data, error } = await supabase
    .from('club_positions')
    .update({ ...value, updated_at: new Date().toISOString() })
    .eq('id', positionId)
    .eq('club_id', id)
    .select(POSITION_FIELDS)
    .maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Position not found' });
  res.json(data);
}
