import express from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import {
  requireClubOwner,
  listEvents,
  createEvent,
  listPositions,
  createPosition,
  updatePosition,
} from '../controllers/clubContent.js';

// Mounted at /api/clubs next to routes/clubs.js.
const router = express.Router();

// Club timeline: anyone can read, only the club's own account can add.
router.get('/:id/events', listEvents);
router.post('/:id/events', requireAuth, requireClubOwner, createEvent);

// Open recruitment positions: anyone can read, only the club can add or edit.
router.get('/:id/positions', listPositions);
router.post('/:id/positions', requireAuth, requireClubOwner, createPosition);
router.put('/:id/positions/:positionId', requireAuth, requireClubOwner, updatePosition);

export default router;
