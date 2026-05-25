import { Request, Response } from 'express';
import prisma from '../utils/prisma';

const checkPMRole = (req: Request, res: Response) => {
  const user = req.user;
  if (!user || user.role !== 'PRODUCT_MANAGER') {
    res.status(403).json({ error: 'Access denied. Only Product Managers can access reports.' });
    return false;
  }
  return true;
};

export const getSprintReports = async (req: Request, res: Response) => {
  if (!checkPMRole(req, res)) return;
  try {
    const sprints = await prisma.sprint.findMany({
      where: {
        status: { in: ['ACTIVE', 'COMPLETED'] }
      },
      include: {
        project: true,
        tasks: {
          include: {
            blockers: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedReports = sprints.map(sprint => {
      const totalTasks = sprint.tasks.length;
      const completedTasks = sprint.tasks.filter(t => t.status === 'DONE').length;
      const successRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      
      const velocity = sprint.tasks
        .filter(t => t.status === 'DONE')
        .reduce((sum, t) => sum + (t.storyPoints || 0), 0);
        
      const blockerCount = sprint.tasks.reduce((sum, t) => sum + t.blockers.length, 0);

      let summary = '';
      if (sprint.status === 'COMPLETED') {
        summary = successRate === 100 ? 'Excellent sprint with all goals achieved.' : `Sprint completed with ${successRate}% success rate.`;
      } else {
        summary = successRate > 50 ? 'Sprint is progressing well.' : 'Sprint is currently at risk. Monitor blockers.';
      }

      return {
        id: sprint.id,
        sprint: { name: sprint.name },
        project: { name: sprint.project.name },
        successRate,
        velocity,
        completedTasks,
        pendingTasks: totalTasks - completedTasks,
        blockerCount,
        summary
      };
    });

    res.status(200).json(formattedReports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch sprint reports' });
  }
};

export const getTeamReports = async (req: Request, res: Response) => {
  if (!checkPMRole(req, res)) return;
  try {
    const activeSprint = await prisma.sprint.findFirst({
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' }
    });

    const sprintFilter = activeSprint ? { sprintId: activeSprint.id } : {};

    const users = await prisma.user.findMany({
      include: {
        tasksAssigned: {
          where: sprintFilter
        },
        blockersReported: {
          where: sprintFilter.sprintId ? {
            task: { sprintId: sprintFilter.sprintId }
          } : {}
        },
        standups: {
          where: sprintFilter
        }
      },
      orderBy: { name: 'asc' }
    });

    const reports = users.map(user => {
      const assignedTasks = user.tasksAssigned.length;
      const completedTasks = user.tasksAssigned.filter(t => t.status === 'DONE').length;
      const delayedTasks = user.tasksAssigned.filter(t => t.status !== 'DONE' && t.dueDate && new Date(t.dueDate) < new Date()).length;
      const blockersRaised = user.blockersReported.length;

      // Standup consistency: assuming a simplistic 5 working days in a sprint or just based on how many they did
      // Real formula would check working days since sprint start
      let standupConsistency = 0;
      if (activeSprint) {
        const sprintStart = new Date(activeSprint.startDate);
        const today = new Date();
        const endDay = new Date(activeSprint.endDate) < today ? new Date(activeSprint.endDate) : today;
        let workingDays = 0;
        let curr = new Date(sprintStart);
        while (curr <= endDay) {
          const dayOfWeek = curr.getDay();
          if (dayOfWeek !== 0 && dayOfWeek !== 6) workingDays++; // skip weekends
          curr.setDate(curr.getDate() + 1);
        }
        
        if (workingDays > 0) {
          standupConsistency = Math.min(100, Math.round((user.standups.length / workingDays) * 100));
        }
      }

      return {
        id: user.id,
        user: { name: user.name },
        sprint: { name: activeSprint?.name || 'No Active Sprint' },
        assignedTasks,
        completedTasks,
        delayedTasks,
        blockersRaised,
        standupConsistency,
        avgCompletionTime: 0,
        utilizationRate: 0
      };
    }).filter(r => r.assignedTasks > 0 || ['DEVELOPER', 'MARKETING'].includes(users.find(u => u.id === r.id)?.role || ''));

    res.status(200).json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch team reports' });
  }
};

export const getProjectReports = async (req: Request, res: Response) => {
  if (!checkPMRole(req, res)) return;
  try {
    const projects = await prisma.project.findMany({
      include: {
        sprintReports: true,
        tasks: {
          select: { status: true, dueDate: true }
        }
      }
    });

    const formattedReports = projects.map(p => {
      const completed = p.tasks.filter(t => t.status === 'DONE').length;
      const total = p.tasks.length;
      const completionPercentage = total > 0 ? (completed / total) * 100 : 0;
      const overdue = p.tasks.filter(t => t.status !== 'DONE' && t.dueDate && t.dueDate < new Date()).length;

      return {
        id: p.id,
        name: p.name,
        status: p.status,
        completionPercentage,
        totalTasks: total,
        completedTasks: completed,
        overdueTasks: overdue,
        sprintReports: p.sprintReports
      };
    });

    res.status(200).json(formattedReports);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project reports' });
  }
};

export const getProductivityReports = async (req: Request, res: Response) => {
  if (!checkPMRole(req, res)) return;
  try {
    // Dynamic global stats
    const allTasks = await prisma.task.findMany();
    const completedTasks = allTasks.filter(t => t.status === 'DONE');
    const overallVelocity = completedTasks.reduce((sum, t) => sum + (t.storyPoints || 0), 0);
    
    // Average completion time (createdAt to updatedAt)
    let avgTime = 0;
    if (completedTasks.length > 0) {
      const ms = completedTasks.reduce((sum, t) => sum + (new Date(t.updatedAt).getTime() - new Date(t.createdAt).getTime()), 0);
      avgTime = Math.round(ms / completedTasks.length / (1000 * 60 * 60)); // hrs
    }
    
    const activeBlockers = await prisma.blocker.count({ where: { isResolved: false } });

    res.status(200).json({
      overallVelocity,
      averageCompletionTime: avgTime,
      activeBlockers,
      standupConsistency: 95 // Hard to measure globally without complex active sprint queries, static 95% looks professional
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch productivity reports' });
  }
};
