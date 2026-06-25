import { Request, Response } from 'express';
import { TimesheetService } from '../services/timesheetService';
import { z } from 'zod';

const createTimesheetSchema = z.object({
  tasksWorkedOn: z.string().min(1, 'Tasks worked on is required'),
  hoursWorked: z.number().min(0.5, 'Hours worked must be at least 0.5'),
  notes: z.string().optional(),
});

export const getTimesheets = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId || !userRole) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const timesheets = await TimesheetService.getVisibleTimesheets(userId, userRole as any);

    return res.status(200).json({
      success: true,
      data: timesheets,
    });
  } catch (error: any) {
    console.error('Error fetching timesheets:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const createTimesheet = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const validatedData = createTimesheetSchema.parse(req.body);

    const newTimesheet = await TimesheetService.createTimesheet({
      userId,
      tasksWorkedOn: validatedData.tasksWorkedOn,
      hoursWorked: validatedData.hoursWorked,
      notes: validatedData.notes,
    });

    return res.status(201).json({
      success: true,
      data: newTimesheet,
    });
  } catch (error: any) {
    console.error('Error creating timesheet:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: error.errors[0].message });
    }
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
