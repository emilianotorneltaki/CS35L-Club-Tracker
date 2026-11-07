import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ClubCard from '../components/ClubCard.jsx';
import { searchClubs } from '../api/clubs.js';

const DEBOUNCE_MS = 300;

// MH3: search clubs by keyword (matches name or description).
export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const [text, setText] = useState(query);
  // Holds the result for one specific query, so we can tell whether the
  // results on screen are still loading for the current query.
  const [result, setResult] = useState(null);

  // Keep the keyword in the URL (?q=...) so going back from a club page
  // restores the same search. Wait until the user pauses typing.
  useEffect(() => {
    const trimmed = text.trim();
    if (trimmed === query) return;
    const timer = setTimeout(() => {
      setSearchParams(trimmed ? { q: trimmed } : {}, { replace: true });
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [text, query, setSearchParams]);

  useEffect(() => {
    const controller = new AbortController();
    searchClubs(query, controller.signal)
      .then((clubs) => setResult({ query, clubs, error: null }))
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setResult({ query, clubs: [], error: err.message });
        }
      });
    return () => controller.abort();
  }, [query]);

  const loading = !result || result.query !== query;

  return (
    <main className="page">
      <h1 className="page-title">Find a club</h1>

      <form className="search-bar" role="search" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="club-search" className="visually-hidden">
          Search clubs
        </label>
        <input
          id="club-search"
          type="search"
          placeholder="Search by name or description"
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoFocus
        />
      </form>

      {loading ? (
        <p className="status">Loading…</p>
      ) : result.error ? (
        <p className="status error">Couldn’t load clubs: {result.error}</p>
      ) : result.clubs.length === 0 ? (
        <p className="status">No clubs found</p>
      ) : (
        <ul className="club-list">
          {result.clubs.map((club) => (
            <ClubCard key={club.id} club={club} searchState={searchParams.toString()} />
          ))}
        </ul>
      )}
    </main>
  );
}
