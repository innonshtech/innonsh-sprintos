import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import bcrypt from 'bcryptjs';

const checkPMRole = (req: Request, res: Response) => {
  const user = req.user;
  if (!user || (user.role !== 'PRODUCT_MANAGER' && user.role !== 'ADMIN' && user.email !== 'saket.innonsh@gmail.com')) {
    res.status(403).json({ success: false, message: 'Access denied. Only Product Managers and Admins can access team management.' });
    return false;
  }
  return true;
};

export const getTeam = async (req: Request, res: Response) => {
  try {
    const team = await prisma.user.findMany({
      where: { isActive: true },
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

export const createTeamMember = async (req: Request, res: Response) => {
  if (!checkPMRole(req, res)) return;
  try {
    const { name, email, role, department, password, avatar } = req.body;
    const normalizedEmail = (email || '').trim().toLowerCase();

    if (!normalizedEmail || !password || !name) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    // Check for existing user
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: `User with email '${normalizedEmail}' already exists.`
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        name: (name || '').trim(),
        email: normalizedEmail,
        role: role || 'DEVELOPER',
        department: (department || 'Engineering').trim(),
        password: hashedPassword,
        avatar: avatar || null,
        isActive: true
      }
    });

    const { AuditEngineService } = await import('../services/audit/audit.service');
    await AuditEngineService.logAction(
      req.user?.id || 'SYSTEM',
      'MEMBER_ONBOARDED',
      'USER',
      user.id,
      `Employee Onboarded: ${user.name}`,
      `Created new team member ${user.name} (${user.role})`
    );

    res.status(201).json({
      success: true,
      message: 'Employee onboarded successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      }
    });
  } catch (error: any) {
    console.error('Error creating team member:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to create team member' });
  }
};

export const updateTeamMember = async (req: Request, res: Response) => {
  if (!checkPMRole(req, res)) return;
  try {
    const { id } = req.params;
    const { name, email, role, department, password, avatar, isActive } = req.body;
    
    const dataToUpdate: any = {};
    if (name) dataToUpdate.name = name.trim();
    if (email) dataToUpdate.email = email.trim().toLowerCase();
    if (role) dataToUpdate.role = role;
    if (department) dataToUpdate.department = department.trim();
    if (avatar !== undefined) dataToUpdate.avatar = avatar;
    if (isActive !== undefined) dataToUpdate.isActive = isActive;
    
    if (password && password.trim().length > 0) {
      dataToUpdate.password = await bcrypt.hash(password, 10);
    }
    
    const user = await prisma.user.update({
      where: { id },
      data: dataToUpdate
    });

    const { AuditEngineService } = await import('../services/audit/audit.service');
    await AuditEngineService.logAction(
      req.user?.id || 'SYSTEM',
      'MEMBER_UPDATED',
      'USER',
      user.id,
      `Employee Updated: ${user.name}`,
      `Updated team member details for ${user.name}`
    );

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      user
    });
  } catch (error: any) {
    console.error('Error updating team member:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to update team member' });
  }
};

export const deleteTeamMember = async (req: Request, res: Response) => {
  if (!checkPMRole(req, res)) return;
  try {
    const { id } = req.params;
    
    // Deactivate user so they are hidden from team directory and cannot log in
    const user = await prisma.user.update({
      where: { id },
      data: { isActive: false }
    });

    const { AuditEngineService } = await import('../services/audit/audit.service');
    await AuditEngineService.logAction(
      req.user?.id || 'SYSTEM',
      'MEMBER_DEACTIVATED',
      'USER',
      user.id,
      `Employee Deactivated: ${user.name}`,
      `Deactivated team member ${user.name}`
    );

    res.status(200).json({ success: true, message: 'Employee deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting team member:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to delete team member' });
  }
};

export const getRolePermissions = async (req: Request, res: Response) => {
  try {
    const permissions = await (prisma as any).rolePermission.findMany();
    res.status(200).json({ success: true, data: permissions });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch role permissions' });
  }
};

export const updateRolePermissions = async (req: Request, res: Response) => {
  try {
    const { role, permissions } = req.body;
    const userId = req.user?.id;

    // Saket Patil Authorization Check
    const currentUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!currentUser || (currentUser.email !== 'saket.innonsh@gmail.com' && currentUser.role !== 'PRODUCT_MANAGER' && currentUser.role !== 'ADMIN')) {
      return res.status(403).json({ success: false, message: 'Only Saket Patil has permission to modify feature flags & access controls.' });
    }

    const updated = await (prisma as any).rolePermission.upsert({
      where: { role },
      update: { permissions, updatedById: userId },
      create: { role, permissions, updatedById: userId },
    });

    res.status(200).json({ success: true, data: updated, message: `Updated permissions for ${role}` });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to update permissions' });
  }
};

