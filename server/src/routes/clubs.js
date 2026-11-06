import express from 'express';
import { supabase } from '../services/supabase.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { name, email, password} = req.body;
    const { data, err } = await supabase.auth.signUp({ email, password });
    if (err) {
        return res.status(400).json({ error: error.message });
    }
    console.log(data);
    res.status(201).json({ ok: true });
});

// Instead of modules.export = router since we are already using imports in index.js, let's keep it consistent
export default router;