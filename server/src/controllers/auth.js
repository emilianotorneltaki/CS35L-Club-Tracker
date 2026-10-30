import { supabase, createAuthClient } from '../services/supabase.js';

const UCLA_EMAIL = /^[^\s@]+@ucla\.edu$/i;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const MIN_PASSWORD_LENGTH = 6;

function readCredentials(body = {}) {
  return {
    name: String(body.name ?? '').trim(),
    email: String(body.email ?? '').trim().toLowerCase(),
    password: String(body.password ?? ''),
  };
}

function toPublicUser(user) {
  return { id: user.id, email: user.email, name: user.user_metadata?.name ?? '' };
}

async function isClubAccount(userId) {
  const { data, error } = await supabase
    .from('clubs')
    .select('id')
    .eq('owner_id', userId)
    .maybeSingle();
  if (error) throw error;
  return Boolean(data);
}

// MH1: create the account and email a verification link.
export async function studentSignup(req, res) {
  const { name, email, password } = readCredentials(req.body);

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }
  if (!UCLA_EMAIL.test(email)) {
    return res.status(400).json({ error: 'Only @ucla.edu emails are accepted' });
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return res
      .status(400)
      .json({ error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` });
  }

  const { data, error } = await createAuthClient().auth.signUp({
    email,
    password,
    options: {
      data: { name, role: 'student' },
      emailRedirectTo: `${CLIENT_URL}/auth/callback`,
    },
  });
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  // Supabase returns a user with no identities when the email is already registered.
  if (data.user?.identities?.length === 0) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  res.status(201).json({ message: `Verification link sent to ${email}` });
}

// MH2: log in a verified student.
export async function studentLogin(req, res) {
  const { email, password } = readCredentials(req.body);

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const { data, error } = await createAuthClient().auth.signInWithPassword({ email, password });
  if (error) {
    if (error.code === 'email_not_confirmed') {
      return res.status(403).json({ error: 'Please verify your email before logging in' });
    }
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  if (await isClubAccount(data.user.id)) {
    return res.status(403).json({ error: 'This is a club account, use club login instead' });
  }

  const { access_token, refresh_token, expires_at } = data.session;
  res.json({
    session: { access_token, refresh_token, expires_at },
    user: toPublicUser(data.user),
  });
}

export function me(req, res) {
  res.json({ user: toPublicUser(req.user) });
}
