import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.js';

// Supabase sends the verification link back here with the session in the URL hash.
export default function AuthCallback() {
  const { startSession } = useAuth();
  const navigate = useNavigate();
  const [params] = useState(() => new URLSearchParams(window.location.hash.slice(1)));
  const accessToken = params.get('access_token');
  const error = accessToken
    ? ''
    : params.get('error_description') || 'This verification link is invalid.';

  useEffect(() => {
    if (accessToken) {
      startSession(accessToken).then(() => navigate('/dashboard', { replace: true }));
    }
  }, [accessToken, startSession, navigate]);

  if (error) {
    return (
      <main className="auth-card">
        <h1>Verification failed</h1>
        <p className="error">{error}</p>
        <p>
          <Link to="/signup">Sign up again</Link> or <Link to="/login">log in</Link>
        </p>
      </main>
    );
  }
  return <p>Verifying your email…</p>;
}
