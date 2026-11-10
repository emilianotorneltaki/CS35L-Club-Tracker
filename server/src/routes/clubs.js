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

// Instead of modules.export = router since we are already using imports in index.js, let's keep it consistent
export default router;