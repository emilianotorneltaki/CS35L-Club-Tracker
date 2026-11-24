import { useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../auth/AuthContext.js';
import {
  EVENT_DESCRIPTION_MAX,
  formatEventDate,
  sortEvents,
  validateEvent,
} from '../lib/clubContent.js';

const EMPTY_EVENT = { name: '', date: '', description: '' };

// The club's events in date order, joined by a line. The club's own account
// also gets a form to add events.
export default function ClubTimeline({ clubId, events, onEventsChange, canEdit }) {
  return (
    <section className="timeline-section" aria-label="Club timeline">
      {canEdit && (
        <AddEventForm
          clubId={clubId}
          onAdded={(event) => onEventsChange(sortEvents([...events, event]))}
        />
      )}
      {events.length === 0 ? (
        <p className="status">No events on the timeline yet.</p>
      ) : (
        <ol className="timeline">
          {events.map((event) => (
            <li key={event.id} className="timeline-item">
              <span className="timeline-dot" aria-hidden="true" />
              <time className="timeline-date" dateTime={event.date}>
                {formatEventDate(event.date)}
              </time>
              <h3 className="timeline-name">{event.name}</h3>
              {event.description && <p className="timeline-description">{event.description}</p>}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function AddEventForm({ clubId, onAdded }) {
  const { token } = useAuth();
  const [form, setForm] = useState(EMPTY_EVENT);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const descriptionLength = form.description.trim().length;

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    const fieldErrors = validateEvent(form);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length) return;

    setSaving(true);
    try {
      const event = await api(`/clubs/${clubId}/events`, { method: 'POST', body: form, token });
      onAdded(event);
      setForm(EMPTY_EVENT);
    } catch (err) {
      if (err.fields) setErrors(err.fields);
      else setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="content-form" onSubmit={handleSubmit} noValidate>
      <h2>Add an event</h2>
      <div className="form-row">
        <label>
          Event name
          <input
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name && <span className="field-error" role="alert">{errors.name}</span>}
        </label>
        <label>
          Date
          <input
            type="date"
            value={form.date}
            onChange={(e) => update('date', e.target.value)}
            aria-invalid={Boolean(errors.date)}
          />
          {errors.date && <span className="field-error" role="alert">{errors.date}</span>}
        </label>
      </div>
      <label>
        Description
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          aria-invalid={Boolean(errors.description)}
        />
        <span className={`char-count${descriptionLength > EVENT_DESCRIPTION_MAX ? ' over' : ''}`}>
          {descriptionLength}/{EVENT_DESCRIPTION_MAX}
        </span>
        {errors.description && (
          <span className="field-error" role="alert">{errors.description}</span>
        )}
      </label>
      {formError && <p className="error" role="alert">{formError}</p>}
      <button type="submit" disabled={saving}>
        {saving ? 'Adding…' : 'Add event'}
      </button>
    </form>
  );
}
