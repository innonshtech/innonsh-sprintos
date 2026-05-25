import { Router } from 'express';
import {
  getMemberOverview,
  getTodayFocus,
  createTodayFocus,
  updateTodayFocus
} from '../controllers/memberDashboardController';

const router = Router();

// Member Overview KPI API
router.get('/dashboard/member-overview', getMemberOverview);

// Today Focus APIs
router.get('/focus', getTodayFocus);
router.post('/focus', createTodayFocus);
router.put('/focus/:id', updateTodayFocus);

export default router;
