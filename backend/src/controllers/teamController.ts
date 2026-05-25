import { Request, Response } from 'express';
import prisma from '../utils/prisma';

const checkPMRole = (req: Request, res: Response) => {
  const user = req.user;
  if (!user || user.role !== 'PRODUCT_MANAGER') {
    res.status(403).json({ error: 'Access denied. Only Product Managers can access team management.' });
    return false;
  }
  return true;
};

export const getTeam = async (req: Request, res: Response) => {
  if (!checkPMRole(req, res)) return;
  try {
    const team = await prisma.user.findMany({
      include: {
        tasksAssigned: {
          select: { status: true }
        },
        blockersReported: {
          where: { isResolved: false }
        },
        sprintMembers: {
          include: { sprint: true }
        }
      }
    });

    const formattedTeam = team.map(u => {
      const assignedTasks = u.tasksAssigned.length;
      const completedTasks = u.tasksAssigned.filter(t => t.status === 'DONE').length;
      const activeSprint = u.sprintMembers.find(sm => sm.sprint.status === 'ACTIVE')?.sprint;
      
      // Calculate utilization based on relative scale of active tasks
      const activeTasks = u.tasksAssigned.filter(t => t.status !== 'DONE').length;
      // Assume 5 active tasks is 100% utilization for the relative scale
      const utilizationPercent = Math.min((activeTasks / 5) * 100, 100);

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        department: u.department,
        avatar: u.avatar,
        assignedTasks,
        completedTasks,
        activeSprint: activeSprint ? activeSprint.name : null,
        blockersCount: u.blockersReported.length,
        utilizationPercent: Math.round(utilizationPercent),
        isOnline: Math.random() > 0.5 // mock online status
      };
    });

    res.status(200).json(formattedTeam);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch team' });
  }
};

export const getTeamMember = async (req: Request, res: Response) => {
  if (!checkPMRole(req, res)) return;
  try {
    const { id } = req.params;
    const member = await prisma.user.findUnique({
      where: { id },
      include: {
        tasksAssigned: true,
        sprintMembers: { include: { sprint: true } },
        blockersReported: true,
        standups: true,
        projectMembers: { include: { project: true } }
      }
    });

    if (!member) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(member);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch team member' });
  }
};

export const getTeamWorkload = async (req: Request, res: Response) => {
  if (!checkPMRole(req, res)) return;
  try {
    const users = await prisma.user.findMany({
      include: {
        tasksAssigned: { where: { status: { not: 'DONE' } } }
      }
    });
    
    // Heatmap / workload array
    const data = users.map(u => {
      const count = u.tasksAssigned.length;
      let status = 'balanced';
      if (count > 5) status = 'overloaded';
      if (count < 2) status = 'underutilized';

      return {
        id: u.id,
        name: u.name,
        taskCount: count,
        status
      };
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch team workload' });
  }
};

export const assignProject = async (req: Request, res: Response) => {
  if (!checkPMRole(req, res)) return;
  try {
    const { id } = req.params;
    const { projectId, role } = req.body;

    const pm = await prisma.projectMember.create({
      data: {
        userId: id,
        projectId,
        role: role || 'MEMBER'
      }
    });

    res.status(200).json(pm);
  } catch (error) {
    res.status(500).json({ error: 'Failed to assign project' });
  }
};

export const assignSprint = async (req: Request, res: Response) => {
  if (!checkPMRole(req, res)) return;
  try {
    const { id } = req.params;
    const { sprintId } = req.body;

    const sm = await prisma.sprintMember.create({
      data: {
        userId: id,
        sprintId
      }
    });

    res.status(200).json(sm);
  } catch (error) {
    res.status(500).json({ error: 'Failed to assign sprint' });
  }
};
