import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { getClub } from '../api/clubs.js';

// MH4: a club's page, showing its name and published description.
export default function ClubPage() {
  const { id } = useParams();
  const location = useLocation();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    getClub(id, controller.signal)
      .then((club) => setResult({ id, club, error: null }))
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setResult({ id, club: null, error: err });
        }
      });
    return () => controller.abort();
  }, [id]);

  // Return to the same search the student came from, if any.
  const fromSearch = location.state?.fromSearch;
  const backTo = fromSearch ? `/clubs?${fromSearch}` : '/clubs';
  const loading = !result || result.id !== id;

  let content;
  if (loading) {
    content = <p className="status">Loading…</p>;
  } else if (result.error?.status === 404) {
    content = <p className="status">Club not found</p>;
  } else if (result.error) {
    content = (
      <p className="status error">Couldn’t load this club: {result.error.message}</p>
    );
  } else {
    const { club } = result;
    content = (
      <article className="club-page">
        <h1 className="page-title">{club.name}</h1>
        <section className="club-description">
          {club.description ? (
            <p>{club.description}</p>
          ) : (
            <p className="status">This club hasn’t added a description yet.</p>
          )}
        </section>
        {club.images?.length > 0 && (
          <div className="club-images">
            {club.images.map((src) => (
              <img key={src} src={src} alt={`${club.name}`} />
            ))}
          </div>
        )}
      </article>
    );
  }

  return (
    <main className="page">
      <Link to={backTo} className="back-link">
        ← Back to search
      </Link>
      {content}
    </main>
  );
}
