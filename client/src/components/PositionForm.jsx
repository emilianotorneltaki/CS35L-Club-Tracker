import { useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../auth/AuthContext.js';
import { validatePosition } from '../lib/clubContent.js';

const EMPTY_POSITION = { title: '', description: '', requirements: '' };

// Adds a new position, or edits `position` when one is passed in.
export default function PositionForm({ clubId, position, onSaved, onCancel }) {
  const { token } = useAuth();
  const editing = Boolean(position);
  const [form, setForm] = useState(() =>
    editing
      ? {
          title: position.title,
          description: position.description,
          requirements: position.requirements,
        }
      : EMPTY_POSITION,
  );
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    const fieldErrors = validatePosition(form);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length) return;

    setSaving(true);
    try {
      const saved = await api(
        editing ? `/clubs/${clubId}/positions/${position.id}` : `/clubs/${clubId}/positions`,
        { method: editing ? 'PUT' : 'POST', body: form, token },
      );
      onSaved(saved);
      if (!editing) setForm(EMPTY_POSITION);
    } catch (err) {
      if (err.fields) setErrors(err.fields);
      else setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="content-form" onSubmit={handleSubmit} noValidate>
      {!editing && <h2>Add a position</h2>}
      <label>
        Position title <span className="required">(required)</span>
        <input
          value={form.title}
          onChange={(e) => update('title', e.target.value)}
          aria-invalid={Boolean(errors.title)}
        />
        {errors.title && <span className="field-error" role="alert">{errors.title}</span>}
      </label>
      <label>
        Role description <span className="required">(required)</span>
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          aria-invalid={Boolean(errors.description)}
        />
        {errors.description && (
          <span className="field-error" role="alert">{errors.description}</span>
        )}
      </label>
      <label>
        Requirements
        <textarea
          rows={3}
          value={form.requirements}
          onChange={(e) => update('requirements', e.target.value)}
        />
      </label>
      {formError && <p className="error" role="alert">{formError}</p>}
      <div className="form-actions">
        <button type="submit" disabled={saving}>
          {saving ? 'Saving…' : editing ? 'Save' : 'Add Position'}
        </button>
        {onCancel && (
          <button type="button" className="secondary" onClick={onCancel} disabled={saving}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
