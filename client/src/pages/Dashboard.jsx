import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.js';

// Placeholder until the saved/submitted applications stories land.
export default function Dashboard() {
  const { user, logout } = useAuth();
  return (
    <main>
      <h1>Welcome, {user.name || user.email}</h1>
      {user.clubId ? (
        <nav className="dashboard-links">
          <Link to={`/clubs/${user.clubId}`}>View club page</Link>
          <Link to={`/clubs/${user.clubId}?tab=timeline`}>Edit timeline</Link>
          <Link to="/club/recruitment">Recruitment settings</Link>
        </nav>
      ) : (
        <p>Your saved and submitted club applications will show up here.</p>
      )}
      <button onClick={logout}>Log out</button>
    </main>
  );
}
