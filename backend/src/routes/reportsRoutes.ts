import { Router } from 'express';
import { getSprintReports, getTeamReports, getProjectReports, getProductivityReports } from '../controllers/reportsController';


const router = Router();



router.get('/sprints', getSprintReports);
router.get('/team', getTeamReports);
router.get('/projects', getProjectReports);
router.get('/productivity', getProductivityReports);

export default router;
