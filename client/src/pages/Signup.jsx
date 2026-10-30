import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [sentTo, setSentTo] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.email.trim().toLowerCase().endsWith('@ucla.edu')) {
      setError('Only @ucla.edu emails are accepted');
      return;
    }
    setSubmitting(true);
    try {
      await api('/auth/student/signup', { method: 'POST', body: form });
      setSentTo(form.email.trim());
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (sentTo) {
    return (
      <main className="auth-card">
        <h1>Check your email</h1>
        <p>
          We sent a verification link to <strong>{sentTo}</strong>. Click it to finish
          creating your account.
        </p>
      </main>
    );
  }

  return (
    <main className="auth-card">
      <h1>Student sign up</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name
          <input value={form.name} onChange={update('name')} required />
        </label>
        <label>
          UCLA email
          <input
            type="email"
            placeholder="joebruin@ucla.edu"
            value={form.email}
            onChange={update('email')}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            minLength={6}
            value={form.password}
            onChange={update('password')}
            required
          />
        </label>
        {error && <p className="error" role="alert">{error}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? 'Signing up…' : 'Sign up'}
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </main>
  );
}
