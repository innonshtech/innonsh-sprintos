import { Request, Response } from 'express';
import prisma from '../utils/prisma';

// Helper to get current active sprint for user if not provided
const resolveSprintId = async (sprintId?: string): Promise<string | null> => {
  if (sprintId) return sprintId;
  const activeSprint = await prisma.sprint.findFirst({
    where: { status: 'ACTIVE' }
  });
  return activeSprint?.id || null;
};

export const getSprintSummary = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const sprintId = await resolveSprintId(req.query.sprintId as string);
    if (!sprintId) return res.status(404).json({ error: 'No active sprint found' });

    const sprint = await prisma.sprint.findUnique({
      where: { id: sprintId }
    });
    if (!sprint) return res.status(404).json({ error: 'Sprint not found' });

    const now = new Date();
    const totalDays = Math.ceil((sprint.endDate.getTime() - sprint.startDate.getTime()) / (1000 * 60 * 60 * 24));
    const elapsedDays = Math.max(0, Math.ceil((now.getTime() - sprint.startDate.getTime()) / (1000 * 60 * 60 * 24)));
    const daysRemaining = Math.max(0, totalDays - elapsedDays);
    const progress = Math.min(100, Math.round((elapsedDays / totalDays) * 100)) || 0;

    res.status(200).json({
      id: sprint.id,
      name: sprint.name,
      totalDays,
      elapsedDays,
      daysRemaining,
      progress
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sprint summary' });
  }
};

export const getCompletedTasks = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const sprintId = await resolveSprintId(req.query.sprintId as string);
    if (!sprintId) return res.status(404).json({ error: 'No sprint found' });

    const tasks = await prisma.task.findMany({
      where: {
        assigneeId: userId,
        sprintId,
        status: 'DONE'
      },
      orderBy: { updatedAt: 'desc' }
    });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch completed tasks' });
  }
};

export const getPendingTasks = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const sprintId = await resolveSprintId(req.query.sprintId as string);
    if (!sprintId) return res.status(404).json({ error: 'No sprint found' });

    const tasks = await prisma.task.findMany({
      where: {
        assigneeId: userId,
        sprintId,
        status: { not: 'DONE' }
      },
      orderBy: { dueDate: 'asc' }
    });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pending tasks' });
  }
};

export const getBlockers = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    // Find blockers reported by user
    const blockers = await prisma.blocker.findMany({
      where: {
        reporterId: userId
      },
      include: { task: true },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json(blockers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blockers' });
  }
};

export const getProductivity = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const sprintId = await resolveSprintId(req.query.sprintId as string);
    if (!sprintId) return res.status(404).json({ error: 'No sprint found' });

    const completed = await prisma.task.count({
      where: { assigneeId: userId, sprintId, status: 'DONE' }
    });

    const pending = await prisma.task.count({
      where: { assigneeId: userId, sprintId, status: { not: 'DONE' } }
    });

    const blockersCount = await prisma.blocker.count({
      where: { reporterId: userId, task: { sprintId } }
    });

    const totalTasks = completed + pending;
    const completionRate = totalTasks > 0 ? (completed / totalTasks) * 100 : 0;

    const allStoryPoints = await prisma.task.aggregate({
      where: { assigneeId: userId, sprintId, status: 'DONE' },
      _sum: { storyPoints: true }
    });
    
    // Calculate or fetch MemberSprintStats
    let stats = await prisma.memberSprintStats.findFirst({
      where: { userId, sprintId }
    });

    if (!stats) {
      stats = await prisma.memberSprintStats.create({
        data: {
          userId,
          sprintId,
          completedTasks: completed,
          pendingTasks: pending,
          storyPoints: allStoryPoints._sum.storyPoints || 0,
          completionRate,
          blockerCount: blockersCount
        }
      });
    } else {
      // Update with latest dynamically calculated
      stats = await prisma.memberSprintStats.update({
        where: { id: stats.id },
        data: {
          completedTasks: completed,
          pendingTasks: pending,
          storyPoints: allStoryPoints._sum.storyPoints || 0,
          completionRate,
          blockerCount: blockersCount
        }
      });
    }

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch productivity' });
  }
};
