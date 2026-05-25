import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const addSubtask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const { title } = req.body;
    const user = req.user;

    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const subtask = await prisma.taskSubtask.create({
      data: {
        title,
        taskId
      }
    });

    res.status(201).json(subtask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add subtask' });
  }
};

export const updateSubtask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isCompleted, title } = req.body;
    
    const subtask = await prisma.taskSubtask.update({
      where: { id },
      data: { isCompleted, title }
    });

    res.status(200).json(subtask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update subtask' });
  }
};

export const deleteSubtask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.taskSubtask.delete({ where: { id } });
    res.status(200).json({ message: 'Subtask deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete subtask' });
  }
};
