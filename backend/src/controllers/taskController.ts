import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { notificationService } from '../services/notifications/notification.service';

export const getTasks = async (req: Request, res: Response) => {
  try {
    const { projectId, sprintId, assigneeId } = req.query;
    
    const query: any = {};
    if (projectId) query.projectId = String(projectId);
    if (sprintId) query.sprintId = String(sprintId);
    
    // Removed the constraint that limited tasks by assigneeId for non-PMs.
    // Now everyone can see all tasks, but updateTask enforces edit permissions.
    if (assigneeId) {
      query.assigneeId = String(assigneeId);
    }

    const tasks = await prisma.task.findMany({
      where: query,
      include: {
        assignee: true,
        project: true,
        sprint: true,
        blockers: {
          where: { isResolved: false }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        assignee: true,
        creator: true,
        project: true,
        sprint: true,
        blockers: true,
        subtasks: {
          orderBy: { createdAt: 'asc' }
        },
        attachments: {
          orderBy: { createdAt: 'desc' }
        },
        standups: {
          include: { user: true },
          orderBy: { date: 'desc' }
        },
        comments: {
          include: { user: true },
          orderBy: { createdAt: 'asc' }
        },
        activities: {
          include: { user: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch task' });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const { key, title, description, type, status, priority, storyPoints, projectId, sprintId, assigneeId, creatorId } = req.body;

    const task = await prisma.task.create({
      data: {
        key,
        title,
        description,
        type: type || 'STORY',
        status: status || 'TODO',
        priority: priority || 'MEDIUM',
        storyPoints: storyPoints ? parseInt(storyPoints) : null,
        projectId,
        sprintId,
        assigneeId,
        creatorId,
      },
      include: {
        assignee: true,
        project: true,
        sprint: true,
        blockers: true
      }
    });

    let emailTriggered = false;
    if (task.assignee) {
      emailTriggered = await notificationService.handleTaskAssignment({
        assigneeEmail: task.assignee.email,
        assigneeName: task.assignee.name,
        projectName: task.project.name,
        sprintName: task.sprint ? task.sprint.name : 'Backlog',
        taskTitle: task.title,
        taskKey: task.key,
        priority: task.priority,
        dueDate: task.dueDate ? task.dueDate.toISOString().split('T')[0] : 'No due date',
        storyPoints: task.storyPoints ? task.storyPoints.toString() : 'Unestimated',
        description: task.description || '',
        acceptanceCriteria: task.acceptanceCriteria || '',
        taskId: task.id
      });
    }

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task,
      emailTriggered,
    });
  } catch (error: any) {
    console.error(error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'A task with this key already exists.' });
    }
    res.status(500).json({ error: 'Failed to create task' });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user;
    
    // Check edit permission
    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask) return res.status(404).json({ error: 'Task not found' });
    
    if (user && user.role !== 'PRODUCT_MANAGER' && existingTask.assigneeId !== user.id) {
      return res.status(403).json({ error: 'Forbidden: You can only edit your own assigned tasks' });
    }

    const { title, description, type, status, priority, storyPoints, sprintId, assigneeId, dueDate, startDate, acceptanceCriteria, labels } = req.body;

    const dataToUpdate: any = {};
    if (title !== undefined) dataToUpdate.title = title;
    if (description !== undefined) dataToUpdate.description = description;
    if (type !== undefined) dataToUpdate.type = type;
    if (status !== undefined) dataToUpdate.status = status;
    if (priority !== undefined) dataToUpdate.priority = priority;
    if (storyPoints !== undefined) dataToUpdate.storyPoints = storyPoints ? parseInt(storyPoints) : null;
    if (sprintId !== undefined) dataToUpdate.sprintId = sprintId;
    if (assigneeId !== undefined) dataToUpdate.assigneeId = assigneeId;
    if (dueDate !== undefined) dataToUpdate.dueDate = dueDate ? new Date(dueDate) : null;
    if (startDate !== undefined) dataToUpdate.startDate = startDate ? new Date(startDate) : null;
    if (acceptanceCriteria !== undefined) dataToUpdate.acceptanceCriteria = acceptanceCriteria;
    if (labels !== undefined) dataToUpdate.labels = labels;

    const task = await prisma.task.update({
      where: { id },
      data: dataToUpdate,
      include: {
        assignee: true,
        project: true,
        blockers: {
          where: { isResolved: false }
        }
      }
    });

    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.task.delete({
      where: { id }
    });
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

export const moveSprint = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { sprintId } = req.body;
    const user = req.user;
    
    // Check edit permission
    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask) return res.status(404).json({ error: 'Task not found' });
    
    if (user && user.role !== 'PRODUCT_MANAGER' && existingTask.assigneeId !== user.id) {
      return res.status(403).json({ error: 'Forbidden: You can only move your own assigned tasks' });
    }

    const task = await prisma.task.update({
      where: { id },
      data: { sprintId }
    });

    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to move task to sprint' });
  }
};

export const getMyTasks = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const tasks = await prisma.task.findMany({
      where: { assigneeId: userId },
      include: { project: true, sprint: true, blockers: { where: { isResolved: false } } },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

export const addBlocker = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const { description, severity, type, helperId } = req.body;
    const blocker = await prisma.blocker.create({
      data: {
        description,
        severity: severity || 'HIGH',
        type: type || 'TECHNICAL',
        helperId,
        taskId: id,
        reporterId: userId,
      }
    });
    res.status(201).json(blocker);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create blocker' });
  }
};

export const addQuickUpdate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    
    const { updateText } = req.body;
    const activity = await prisma.taskActivity.create({
      data: {
        taskId: id,
        userId: userId,
        action: 'QUICK_UPDATE',
        newValue: updateText
      }
    });
    res.status(201).json(activity);
  } catch(error) {
    res.status(500).json({ error: 'Failed to create quick update' });
  }
};
