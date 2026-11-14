import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../auth/AuthContext.js';

export default function Login() {
  const { user, startSession } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  if (user) return <Navigate to="/dashboard" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const { session } = await api('/auth/student/login', { method: 'POST', body: form });
      await startSession(session.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-card">
      <h1>Student log in</h1>
      <form onSubmit={handleSubmit}>
        <label>
          UCLA email
          <input type="email" value={form.email} onChange={update('email')} required />
        </label>
        <label>
          Password
          <input type="password" value={form.password} onChange={update('password')} required />
        </label>
        {error && <p className="error" role="alert">{error}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? 'Logging in…' : 'Log in'}
        </button>
      </form>
      <p>
        New here? <Link to="/signup">Create an account</Link>
      </p>
    </main>
  );
}
