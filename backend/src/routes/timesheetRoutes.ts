import { Router } from 'express';
import { getTimesheets, createTimesheet } from '../controllers/timesheetController';

const router = Router();

router.get('/', getTimesheets);
router.post('/', createTimesheet);

export default router;
