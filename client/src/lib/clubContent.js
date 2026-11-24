// Client-side copies of the server's validation rules, so the form can say
// which field needs fixing before sending anything. The server checks again.

export const EVENT_DESCRIPTION_MAX = 200;

export function validateEvent({ name, date, description }) {
  const fields = {};
  if (!name.trim()) fields.name = 'Event name is required.';
  if (!date) fields.date = 'Event date is required.';
  const length = description.trim().length;
  if (length > EVENT_DESCRIPTION_MAX) {
    fields.description = `Description must be ${EVENT_DESCRIPTION_MAX} characters or fewer (currently ${length}).`;
  }
  return fields;
}

export function validatePosition({ title, description }) {
  const fields = {};
  if (!title.trim()) fields.title = 'Position title is required.';
  if (!description.trim()) fields.description = 'Role description is required.';
  return fields;
}

// Oldest date first; events on the same day keep the order they were added.
export function sortEvents(events) {
  return [...events].sort((a, b) => a.date.localeCompare(b.date));
}

// "2026-11-20" -> "Fri, Nov 20, 2026". Parsed as a local date so it never
// shifts a day in timezones west of UTC.
export function formatEventDate(date) {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
