import express from 'express';
import { supabase } from '../services/supabase.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { name, email, password} = req.body;
    const trimmedName = name?.trim();
    if (!trimmedName) {
        return res.status(400).json({ error: 'Club name is required.' });
    }

    const safeName = trimmedName.replace(/[\\%_]/g, '\\$&');

    const { data: existingClub, error: lookupError } = await supabase.from('clubs').select('id').ilike('name', safeName).maybeSingle();
    if (lookupError) {
        return res.status(500).json({ error: lookupError.message });
    }
    if (existingClub) {
        return res.status(409).json({ error: 'A club with that name already exists.' });
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
    if (authError) {
        return res.status(400).json({ error: authError.message });
    }
    
    const ownerId = authData.user.id;
    
    const { error: insertError } = await supabase.from('clubs').insert({ owner_id: ownerId, name: trimmedName });
    if (insertError) {
        if (insertError.message.includes('clubs_name_unique')) {
            return res.status(409).json({ error: 'A club with that name already exists.' });
        }
        return res.status(500).json({ error: insertError.message });
    }
    res.status(201).json({ message: "Check your email to verify your account." });
});

// MH9: patch /api/clubs/:id/application
router.patch('/:id/application', async (req, res) => {
    // read id from req.params, and application data from req.body, then update the club's application_status, application_url, and status_reason in the database
    const { id } = req.params;
    const { application_status, application_url, status_reason } = req.body;
    const { data: club, error: fetchError } = await supabase.from('clubs').select('owner_id').eq('id', id).maybeSingle();
    const cleanUrl = application_url?.trim() || null;
    const cleanReason = status_reason?.trim() || null;

    // db error
    if (fetchError) return res.status(500).json({ error: fetchError.message });
        
    // check if row exists
    if (!club) return res.status(404).json({ error: 'Club not found.' });
        
    // need to validate that the user is the owner of the club before allowing them to update the application (need MH7)
    // if (club.owner_id !== req.user.id) return res.status(403).json({ error: 'You are not the owner of this club.' });
        
    // status must be "accepting" or "not_accepting", else 400
    if (!['accepting', 'not_accepting'].includes(application_status)) return res.status(400).json({ error: 'Invalid status. Must be "accepting" or "not_accepting".' });

    // if "accepting", URL must be a valid URL, else 400
    if (application_status === 'accepting') {
        try {
            const testUrl = new URL(cleanUrl);
            if (!['http:', 'https:'].includes(testUrl.protocol)) return res.status(400).json({ error: 'Invalid URL. Must be a valid HTTP or HTTPS URL.' });
        } catch (err) {
            return res.status(400).json({ error: 'Invalid URL. Must be a valid URL.' });
        }
    }

    // status_reason (if given) must be <= 100 chars, else 400
    if (typeof cleanReason === 'string' && cleanReason.length > 100) return res.status(400).json({ error: 'Reason must be 100 characters or less.' });

    // db updates
    const finalUrl = application_status === 'accepting' ? cleanUrl : null;
    const finalReason = cleanReason;
    const { data: updatedClub, error: updateError } = await supabase.from('clubs').update({ application_status: application_status, application_url: finalUrl, status_reason: finalReason }).eq('id', id).select().maybeSingle();
    if (updateError) return res.status(500).json({ error: updateError.message });
    res.status(200).json(updatedClub);
})

// Instead of modules.export = router since we are already using imports in index.js, let's keep it consistent
export default router;