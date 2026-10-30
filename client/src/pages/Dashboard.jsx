import { useAuth } from '../auth/AuthContext.js';

// Placeholder until the saved/submitted applications stories land.
export default function Dashboard() {
  const { user, logout } = useAuth();
  return (
    <main>
      <h1>Welcome, {user.name || user.email}</h1>
      <p>Your saved and submitted club applications will show up here.</p>
      <button onClick={logout}>Log out</button>
    </main>
  );
}
