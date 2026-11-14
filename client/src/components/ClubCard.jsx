import { Link } from 'react-router-dom';

// One search result. Clicking it opens the club's page (MH4).
export default function ClubCard({ club, searchState }) {
  return (
    <li className="club-card">
      <Link to={`/clubs/${club.id}`} state={{ fromSearch: searchState }}>
        <h2>{club.name}</h2>
        <p className="club-card-description">
          {club.description || 'No description yet.'}
        </p>
      </Link>
    </li>
  );
}
