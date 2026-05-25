import { Router } from 'express';
import { createFeedback, getFeedbacks, getComparison, updateFeedback, deleteFeedback } from '../controllers/feedbacksController';


const router = Router();



router.post('/', createFeedback);
router.get('/', getFeedbacks);
router.get('/comparison', getComparison);
router.put('/:id', updateFeedback);
router.delete('/:id', deleteFeedback);

export default router;
