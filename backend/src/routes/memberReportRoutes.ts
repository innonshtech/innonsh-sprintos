import { Router } from 'express';
import { getSprintSummary, getCompletedTasks, getPendingTasks, getBlockers, getProductivity } from '../controllers/memberReportController';

const router = Router();

router.get('/sprint-summary', getSprintSummary);
router.get('/completed-tasks', getCompletedTasks);
router.get('/pending-tasks', getPendingTasks);
router.get('/blockers', getBlockers);
router.get('/productivity', getProductivity);

export default router;
