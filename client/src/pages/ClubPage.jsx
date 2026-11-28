import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { getClub } from '../api/clubs.js';
import { useAuth } from '../auth/AuthContext.js';
import AddLinkForm from '../components/AddLinkForm.jsx';
import { linkLabel } from '../linkTypes.js';

// MH4: a club's page, showing its name and published description.
export default function ClubPage() {
  const { id } = useParams();
  const location = useLocation();
  const [result, setResult] = useState(null);
  const { user } = useAuth();

  // SH7: show a newly added link without reloading the page.
  function handleLinkAdded(link) {
    setResult((prev) => ({
      ...prev,
      club: { ...prev.club, links: [...(prev.club.links ?? []), link] },
    }));
  }

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
    const links = club.links ?? [];
    const isOwner = Boolean(user?.clubId) && user.clubId === club.id;
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
          {(links.length > 0 || isOwner) && (
          <section className="club-links">
            <h2>Links</h2>
            {links.length > 0 ? (
              <ul>
                {links.map((link) => (
                  <li key={link.id}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      {linkLabel(link.type)}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="status">No links yet. Add your website or socials.</p>
            )}
            {isOwner && <AddLinkForm clubId={club.id} onAdded={handleLinkAdded} />}
          </section>
        )}
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
