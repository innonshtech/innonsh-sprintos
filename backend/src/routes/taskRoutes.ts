import { Router } from 'express';
import { getTasks, getTaskById, createTask, updateTask, deleteTask, getMyTasks, addBlocker, addQuickUpdate, moveSprint } from '../controllers/taskController';
import { getComments, addComment, updateComment, deleteComment } from '../controllers/commentController';
import { addAttachment, deleteAttachment } from '../controllers/attachmentController';
import { addSubtask, updateSubtask, deleteSubtask } from '../controllers/subtaskController';

const router = Router();

router.get('/my-tasks', getMyTasks);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.patch('/:id/move-sprint', moveSprint);
router.post('/:id/blocker', addBlocker);
router.post('/:id/update', addQuickUpdate);

// Comments
router.get('/:taskId/comments', getComments);
router.post('/:taskId/comments', addComment);
router.put('/comments/:id', updateComment);
router.delete('/comments/:id', deleteComment);

// Attachments
router.post('/:taskId/attachments', addAttachment);
router.delete('/attachments/:id', deleteAttachment);

// Subtasks
router.post('/:taskId/subtasks', addSubtask);
router.put('/subtasks/:id', updateSubtask);
router.delete('/subtasks/:id', deleteSubtask);

export default router;
