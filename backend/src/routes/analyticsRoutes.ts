import { Router } from 'express';
import { getOverview, getSprintsAnalytics, getTeamWorkload, getBlockersAnalytics, getProductivityTimeline, getBurndown } from '../controllers/analyticsController';


const router = Router();



router.get('/overview', getOverview);
router.get('/sprints', getSprintsAnalytics);
router.get('/team-workload', getTeamWorkload);
router.get('/blockers', getBlockersAnalytics);
router.get('/productivity', getProductivityTimeline);
router.get('/burndown', getBurndown);

export default router;
