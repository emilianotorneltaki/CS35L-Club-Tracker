import { useState } from 'react';
import { addClubLink } from '../api/clubs.js';
import { useAuth } from '../auth/AuthContext.js';
import { LINK_TYPES } from '../linkTypes.js';

// SH7: owner-only form to add a website or social media link to a club page.
export default function AddLinkForm({ clubId, onAdded }) {
    const { token } = useAuth();
    const [open, setOpen] = useState(false);
    const [type, setType] = useState(LINK_TYPES[0].id);
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    function close() {
        setOpen(false);
        setUrl('');
        setError('');
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setSaving(true);
        try {
            const link = await addClubLink(clubId, { type, url }, token);
            onAdded(link);
            close();
        } catch (err) {
            // Invalid link: keep what they typed so they can fix it.
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    if (!open) {
        return (
        <button type="button" onClick={() => setOpen(true)}>
            + Add link
        </button>
        );
    }

    const placeholder = LINK_TYPES.find((t) => t.id === type).placeholder;

    return (
        <form className="add-link-form" onSubmit={handleSubmit}>
        <label>
            Type
            <select value={type} onChange={(e) => setType(e.target.value)}>
            {LINK_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                {t.label}
                </option>
            ))}
            </select>
        </label>
        <label>
            Link
            <input
            type="text"
            value={url}
            placeholder={placeholder}
            onChange={(e) => setUrl(e.target.value)}
            required
            />
        </label>
        {error && (
            <p className="error" role="alert">
            {error}
            </p>
        )}
        <div className="add-link-actions">
            <button type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
            </button>
            <button type="button" onClick={close} disabled={saving}>
            Cancel
            </button>
        </div>
        </form>
    );
    }