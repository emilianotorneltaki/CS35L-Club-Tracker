import { Router } from 'express';
import { supabase } from '../services/supabase.js';

const router = Router();

// Students only ever see the published version of a club's info (see MH8),
// so drafts are never selected here.
const PUBLIC_FIELDS = `
  id,
  name,
  description:published_description,
  images:published_images,
  application_url,
  application_status,
  status_reason
`;

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Escape LIKE wildcards so a search for "100%" matches the literal text.
function likePattern(keyword) {
  return `%${keyword.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
}

// MH3: GET /api/clubs?q=keyword
// Returns clubs whose name or published description contains the keyword
// (case-insensitive). With no keyword, returns every club.
router.get('/', async (req, res) => {
  const keyword = typeof req.query.q === 'string' ? req.query.q.trim() : '';

  let clubs;
  if (!keyword) {
    const { data, error } = await supabase.from('clubs').select(PUBLIC_FIELDS);
    if (error) return res.status(500).json({ error: error.message });
    clubs = data;
  } else {
    // Two simple queries instead of one .or() filter, so user input never
    // has to be escaped into PostgREST filter syntax.
    const pattern = likePattern(keyword);
    const [byName, byDescription] = await Promise.all([
      supabase.from('clubs').select(PUBLIC_FIELDS).ilike('name', pattern),
      supabase
        .from('clubs')
        .select(PUBLIC_FIELDS)
        .ilike('published_description', pattern),
    ]);
    const error = byName.error || byDescription.error;
    if (error) return res.status(500).json({ error: error.message });

    const byId = new Map();
    for (const club of [...byName.data, ...byDescription.data]) {
      byId.set(club.id, club);
    }
    clubs = [...byId.values()];
  }

  clubs.sort((a, b) => a.name.localeCompare(b.name));
  res.json(clubs);
});

// MH4: GET /api/clubs/:id
// Returns one club's public page info.
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!UUID_RE.test(id)) {
    return res.status(404).json({ error: 'Club not found' });
  }

  const { data, error } = await supabase
    .from('clubs')
    .select(PUBLIC_FIELDS)
    .eq('id', id)
    .maybeSingle();

  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Club not found' });
  res.json(data);
});

export default router;
