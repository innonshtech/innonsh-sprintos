import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { autoUpdateSprintStatuses } from '../utils/sprintUpdater';

const parseSprintNumber = (name: string): number => {
  const match = name.match(/Sprint\s*(\d+)/i);
  return match ? parseInt(match[1], 10) : 999;
};

export const cascadeSprintDates = async (projectId: string) => {
  const sprints = await prisma.sprint.findMany({
    where: { projectId, isArchived: false }
  });

  if (sprints.length === 0) return;

  sprints.sort((a, b) => {
    const numA = parseSprintNumber(a.name);
    const numB = parseSprintNumber(b.name);
    if (numA !== numB) return numA - numB;
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;
  let currentStart = new Date(sprints[0].startDate);

  for (let i = 0; i < sprints.length; i++) {
    const sprint = sprints[i];
    const sprintStart = new Date(currentStart);
    
    const rawDuration = new Date(sprint.endDate).getTime() - new Date(sprint.startDate).getTime();
    const duration = rawDuration > 0 ? rawDuration : FOURTEEN_DAYS_MS;
    
    const sprintEnd = new Date(sprintStart.getTime() + duration);
    currentStart = new Date(sprintEnd);

    if (
      new Date(sprint.startDate).getTime() !== sprintStart.getTime() ||
      new Date(sprint.endDate).getTime() !== sprintEnd.getTime()
    ) {
      await prisma.sprint.update({
        where: { id: sprint.id },
        data: {
          startDate: sprintStart,
          endDate: sprintEnd
        }
      });
    }
  }
};

export const getSprints = async (req: Request, res: Response) => {
  try {
    await autoUpdateSprintStatuses();
    
    const { projectId } = req.query;
    
    const query: any = { isArchived: false };
    if (projectId) {
      query.projectId = String(projectId);
    }
    
    const user = req.user;
    if (user && user.role !== 'PRODUCT_MANAGER') {
      query.project = {
        members: {
          some: {
            userId: user.id
          }
        }
      };
    }

    const sprints = await prisma.sprint.findMany({
      where: query,
      include: {
        project: true,
      },
      orderBy: { startDate: 'asc' }
    });

    sprints.sort((a, b) => {
      const numA = parseSprintNumber(a.name);
      const numB = parseSprintNumber(b.name);
      if (numA !== numB) return numA - numB;
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    });
    
    res.status(200).json(sprints);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sprints' });
  }
};

export const getSprintById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const sprint = await prisma.sprint.findUnique({
      where: { id },
      include: {
        project: true,
        tasks: {
          include: {
            assignee: true,
            blockers: true,
          }
        },
        standups: true,
      }
    });

    if (!sprint) {
      return res.status(404).json({ error: 'Sprint not found' });
    }

    res.status(200).json(sprint);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sprint' });
  }
};

export const createSprint = async (req: Request, res: Response) => {
  try {
    const { name, goal, startDate, endDate, status, projectId } = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const minStartDate = new Date(Date.now() - 36 * 60 * 60 * 1000);

    if (start < minStartDate) {
      return res.status(400).json({ error: 'Sprint start date cannot be in the past.' });
    }
    if (end < start) {
      return res.status(400).json({ error: 'Sprint end date cannot be before start date.' });
    }

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (project && project.deadline) {
      if (end > new Date(project.deadline)) {
        return res.status(400).json({ error: 'Sprint end date cannot exceed the project deadline.' });
      }
    }

    const sprint = await prisma.sprint.create({
      data: {
        name,
        goal,
        startDate: start,
        endDate: end,
        status: status || 'PLANNED',
        projectId,
      }
    });

    if (projectId) {
      await cascadeSprintDates(projectId);
    }

    res.status(201).json(sprint);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create sprint' });
  }
};

export const updateSprint = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, goal, startDate, endDate, status } = req.body;

    const currentSprint = await prisma.sprint.findUnique({ where: { id }, include: { project: true } });
    if (!currentSprint) return res.status(404).json({ error: 'Sprint not found' });

    const start = startDate ? new Date(startDate) : new Date(currentSprint.startDate);
    const end = endDate ? new Date(endDate) : new Date(currentSprint.endDate);
    
    if (startDate) {
      const minStartDate = new Date(Date.now() - 36 * 60 * 60 * 1000);
      if (start < minStartDate) {
        return res.status(400).json({ error: 'Sprint start date cannot be in the past.' });
      }
    }

    if (end < start) {
      return res.status(400).json({ error: 'Sprint end date cannot be before start date.' });
    }

    if (currentSprint.project && currentSprint.project.deadline) {
      if (end > new Date(currentSprint.project.deadline)) {
        return res.status(400).json({ error: 'Sprint end date cannot exceed the project deadline.' });
      }
    }

    const dataToUpdate: any = {};
    if (name !== undefined) dataToUpdate.name = name;
    if (goal !== undefined) dataToUpdate.goal = goal;
    if (startDate !== undefined) dataToUpdate.startDate = start;
    if (endDate !== undefined) dataToUpdate.endDate = end;
    if (status !== undefined) dataToUpdate.status = status;

    await prisma.sprint.update({
      where: { id },
      data: dataToUpdate
    });

    if (currentSprint.projectId) {
      await cascadeSprintDates(currentSprint.projectId);
    }

    const updatedSprint = await prisma.sprint.findUnique({
      where: { id },
      include: { project: true }
    });

    res.status(200).json(updatedSprint);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update sprint' });
  }
};

export const deleteSprint = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.sprint.delete({
      where: { id }
    });
    res.status(200).json({ message: 'Sprint deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete sprint' });
  }
};

export const archiveSprint = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isArchived } = req.body;
    const sprint = await prisma.sprint.update({
      where: { id },
      data: { isArchived }
    });
    res.status(200).json(sprint);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Failed to archive sprint' });
  }
};

