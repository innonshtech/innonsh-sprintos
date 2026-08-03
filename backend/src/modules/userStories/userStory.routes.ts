import { Router } from 'express';
import {
  getAllUserStories,
  getUserStoryById,
  createUserStory,
  updateUserStory,
  deleteUserStory,
  clearAllUserStories,
  bulkImportUserStories,
  getAuditLogs,
} from './userStory.controller';

const router = Router();

router.get('/history', getAuditLogs);
router.get('/', getAllUserStories);
router.get('/:id', getUserStoryById);
router.post('/bulk-import', bulkImportUserStories);
router.post('/', createUserStory);
router.patch('/:id', updateUserStory);
router.delete('/clear-all', clearAllUserStories);
router.delete('/:id', deleteUserStory);

export default router;
