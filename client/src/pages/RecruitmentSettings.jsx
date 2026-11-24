import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getClubPositions } from '../api/clubContent.js';
import { useAuth } from '../auth/AuthContext.js';
import PositionForm from '../components/PositionForm.jsx';
import PositionList from '../components/PositionList.jsx';

// Club accounts add and edit their open recruitment positions here. They show
// up under the "Open Positions" tab on the club's page.
export default function RecruitmentSettings() {
  const { user } = useAuth();
  const clubId = user.clubId;
  const [positions, setPositions] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [justAdded, setJustAdded] = useState(null);

  useEffect(() => {
    if (!clubId) return;
    const controller = new AbortController();
    getClubPositions(clubId, controller.signal)
      .then(setPositions)
      .catch((err) => {
        if (err.name !== 'AbortError') setLoadError(err.message);
      });
    return () => controller.abort();
  }, [clubId]);

  if (!clubId) {
    return (
      <main className="page">
        <p className="status">Only club accounts can manage recruitment positions.</p>
      </main>
    );
  }

  return (
    <main className="page">
      <Link to="/dashboard" className="back-link">
        ← Back to dashboard
      </Link>
      <h1 className="page-title">Recruitment settings</h1>
      <p className="owner-note">
        Positions appear on your{' '}
        <Link to={`/clubs/${clubId}?tab=positions`}>club page’s Open Positions tab</Link>.
      </p>

      <PositionForm
        clubId={clubId}
        onSaved={(position) => {
          setPositions((list) => [...(list ?? []), position]);
          setJustAdded(position.title);
        }}
      />
      {justAdded && (
        <p className="success" role="status">
          “{justAdded}” added.{' '}
          <Link to={`/clubs/${clubId}?tab=positions`}>View it on your club page</Link>
        </p>
      )}

      <h2 className="section-heading">Open positions</h2>
      {loadError ? (
        <p className="status error">Couldn’t load positions: {loadError}</p>
      ) : positions === null ? (
        <p className="status">Loading…</p>
      ) : (
        <PositionList
          clubId={clubId}
          positions={positions}
          onPositionsChange={setPositions}
          canEdit
        />
      )}
    </main>
  );
}
