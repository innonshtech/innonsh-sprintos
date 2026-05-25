import { Router } from 'express';
import { getStandups, getTeamStandups, createStandup, deleteStandup, getMyLatestStandup, getMyStandups } from '../controllers/standupController';

const router = Router();

router.get('/my-latest', getMyLatestStandup);
router.get('/me', getMyStandups);
router.get('/', getStandups);
router.get('/team', getTeamStandups);
router.post('/', createStandup);
router.delete('/:id', deleteStandup);

export default router;
