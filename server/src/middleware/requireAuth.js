import { supabase } from '../services/supabase.js';

// Expects "Authorization: Bearer <access token>" and sets req.user.
export async function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace(/^Bearer /, '');
  if (!token) {
    return res.status(401).json({ error: 'Not logged in' });
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    return res.status(401).json({ error: 'Session expired, please log in again' });
  }

  req.user = data.user;
  next();
}
