import { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { getClubEvents, getClubPositions } from '../api/clubContent.js';
import { useAuth } from '../auth/AuthContext.js';
import ClubTimeline from './ClubTimeline.jsx';
import PositionList from './PositionList.jsx';

const TABS = [
  { id: 'timeline', label: 'Timeline' },
  { id: 'positions', label: 'Open Positions' },
];

// The "Timeline" and "Open Positions" tabs on a club's page. The club's own
// account can add events here and edit positions in place.
export default function ClubSections({ clubId }) {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const [result, setResult] = useState(null);

  // The tab lives in the URL (?tab=positions) so other pages can link to it.
  const tab = searchParams.get('tab') === 'positions' ? 'positions' : 'timeline';
  const canEdit = Boolean(user?.clubId) && user.clubId === clubId;

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    Promise.all([getClubEvents(clubId, signal), getClubPositions(clubId, signal)])
      .then(([events, positions]) => setResult({ clubId, events, positions, error: null }))
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setResult({ clubId, events: [], positions: [], error: err.message });
        }
      });
    return () => controller.abort();
  }, [clubId]);

  function selectTab(next) {
    setSearchParams(next === 'timeline' ? {} : { tab: next }, {
      replace: true,
      state: location.state, // keep the "back to search" info
    });
  }

  const loading = !result || result.clubId !== clubId;

  let panel;
  if (loading) {
    panel = <p className="status">Loading…</p>;
  } else if (result.error) {
    panel = <p className="status error">Couldn’t load this section: {result.error}</p>;
  } else if (tab === 'timeline') {
    panel = (
      <ClubTimeline
        clubId={clubId}
        events={result.events}
        canEdit={canEdit}
        onEventsChange={(events) => setResult((r) => ({ ...r, events }))}
      />
    );
  } else {
    panel = (
      <>
        {canEdit && (
          <p className="owner-note">
            Add new positions in <Link to="/club/recruitment">Recruitment settings</Link>.
          </p>
        )}
        <PositionList
          clubId={clubId}
          positions={result.positions}
          canEdit={canEdit}
          onPositionsChange={(positions) => setResult((r) => ({ ...r, positions }))}
        />
      </>
    );
  }

  return (
    <section className="club-sections">
      <div className="tabs" role="tablist" aria-label="Club sections">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            className={`tab${tab === t.id ? ' active' : ''}`}
            onClick={() => selectTab(t.id)}
          >
            {t.label}
            {t.id === 'positions' && result?.positions.length > 0 && (
              <span className="tab-count">{result.positions.length}</span>
            )}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {panel}
      </div>
    </section>
  );
}
