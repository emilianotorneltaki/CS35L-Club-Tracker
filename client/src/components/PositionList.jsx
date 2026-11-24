import { useState } from 'react';
import PositionForm from './PositionForm.jsx';

// The club's open positions. With canEdit, each one has an Edit button that
// swaps it for a form; saving updates the list right away.
export default function PositionList({ clubId, positions, onPositionsChange, canEdit }) {
  const [editingId, setEditingId] = useState(null);

  if (positions.length === 0) {
    return <p className="status">No open positions right now.</p>;
  }

  function handleSaved(saved) {
    onPositionsChange(positions.map((p) => (p.id === saved.id ? saved : p)));
    setEditingId(null);
  }

  return (
    <ul className="position-list">
      {positions.map((position) => (
        <li key={position.id} className="position-card">
          {editingId === position.id ? (
            <PositionForm
              clubId={clubId}
              position={position}
              onSaved={handleSaved}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <>
              <div className="position-header">
                <h3>{position.title}</h3>
                {canEdit && (
                  <button type="button" className="secondary" onClick={() => setEditingId(position.id)}>
                    Edit
                  </button>
                )}
              </div>
              <p className="position-description">{position.description}</p>
              {position.requirements && (
                <>
                  <h4>Requirements</h4>
                  <p className="position-requirements">{position.requirements}</p>
                </>
              )}
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
