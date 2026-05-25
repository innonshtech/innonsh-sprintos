import { Router } from 'express';
import { getProjects, getProjectById, createProject, updateProject, deleteProject, archiveProject } from '../controllers/projectController';

import { requireProductManager } from '../middleware/requireProductManager';

const router = Router();

router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post('/', requireProductManager, createProject);
router.put('/:id', requireProductManager, updateProject);
router.delete('/:id', requireProductManager, deleteProject);
router.patch('/:id/archive', requireProductManager, archiveProject);

export default router;
