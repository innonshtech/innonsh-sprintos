import { Router } from 'express';
import { createFeedback, getMyFeedbacks, updateFeedback, deleteFeedback } from '../controllers/memberFeedbackController';

const router = Router();

router.get('/me', getMyFeedbacks);
router.post('/', createFeedback);
router.put('/:id', updateFeedback);
router.delete('/:id', deleteFeedback);

export default router;
