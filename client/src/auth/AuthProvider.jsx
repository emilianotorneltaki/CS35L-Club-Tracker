import { useCallback, useEffect, useState } from 'react';
import { api } from '../api.js';
import { AuthContext } from './AuthContext.js';

const TOKEN_KEY = 'clubTracker.accessToken';

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(Boolean(token));

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  // Saves the access token and loads the user it belongs to.
  const startSession = useCallback(
    async (accessToken) => {
      localStorage.setItem(TOKEN_KEY, accessToken);
      setToken(accessToken);
      try {
        const { user } = await api('/auth/me', { token: accessToken });
        setUser(user);
      } catch {
        logout();
      }
    },
    [logout],
  );

  // Restore a saved session on first load.
  useEffect(() => {
    const saved = localStorage.getItem(TOKEN_KEY);
    if (!saved) return;
    api('/auth/me', { token: saved })
      .then(({ user }) => setUser(user))
      .catch(logout)
      .finally(() => setLoading(false));
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, token, loading, startSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
