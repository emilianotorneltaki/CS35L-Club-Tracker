import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

import { supabase } from './services/supabase.js';

app.get('/api/health/db', async (req, res) => {
  const { error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 });
  if (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
  res.json({ status: 'ok' });
});