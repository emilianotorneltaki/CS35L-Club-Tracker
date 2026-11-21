//SH7: link types a club can add. Keep in sync with server/src/utils/links.js
//(the server is the one that actually validates links).
export const LINK_TYPES = [
    { id: 'website', label: 'Website', placeholder: 'https://yourclub.org' },
    { id: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/yourclub' },
    { id: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/yourclub' },
    { id: 'discord', label: 'Discord', placeholder: 'https://discord.gg/invite-code' },
    { id: 'slack', label: 'Slack', placeholder: 'https://yourclub.slack.com' },
];

export function linkLabel(typeId) {
    return LINK_TYPES.find((t) => t.id === typeId)?.label ?? 'Link';
}