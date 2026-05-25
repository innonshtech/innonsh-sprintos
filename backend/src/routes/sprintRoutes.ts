import { Router } from 'express';
import { getSprints, getSprintById, createSprint, updateSprint, deleteSprint, archiveSprint } from '../controllers/sprintController';

import { requireProductManager } from '../middleware/requireProductManager';

const router = Router();

router.get('/', getSprints);
router.get('/:id', getSprintById);
router.post('/', requireProductManager, createSprint);
router.put('/:id', requireProductManager, updateSprint);
router.delete('/:id', requireProductManager, deleteSprint);
router.patch('/:id/archive', requireProductManager, archiveSprint);

export default router;
