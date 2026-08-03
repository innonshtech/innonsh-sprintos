import { Request, Response } from 'express';
import prisma from '../../utils/prisma';

export const getAllUserStories = async (req: Request, res: Response) => {
  try {
    const { search, featureName, moduleSection, phase, itStatus, figmaStatus } = req.query;

    const where: any = {};

    if (featureName && typeof featureName === 'string') {
      where.featureName = featureName;
    }
    if (moduleSection && typeof moduleSection === 'string') {
      where.moduleSection = moduleSection;
    }
    if (phase && typeof phase === 'string') {
      where.phase = phase;
    }
    if (itStatus && typeof itStatus === 'string') {
      where.itStatus = itStatus;
    }
    if (figmaStatus && typeof figmaStatus === 'string') {
      where.figmaStatus = figmaStatus;
    }

    if (search && typeof search === 'string' && search.trim()) {
      const query = search.trim();
      where.OR = [
        { featureId: { contains: query, mode: 'insensitive' } },
        { featureName: { contains: query, mode: 'insensitive' } },
        { moduleSection: { contains: query, mode: 'insensitive' } },
        { userType: { contains: query, mode: 'insensitive' } },
        { scenarioId: { contains: query, mode: 'insensitive' } },
        { scenarioName: { contains: query, mode: 'insensitive' } },
        { userStoryExpectedOutput: { contains: query, mode: 'insensitive' } },
        { uiScreenName: { contains: query, mode: 'insensitive' } },
        { uiScreenId: { contains: query, mode: 'insensitive' } },
      ];
    }

    const userStories = await (prisma as any).userStory.findMany({
      where,
      include: {
        createdBy: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        updatedBy: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
      orderBy: [
        { createdAt: 'asc' },
      ],
    });

    res.status(200).json({
      success: true,
      data: userStories,
    });
  } catch (error: any) {
    console.error('Error fetching user stories:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch user stories',
    });
  }
};

export const getUserStoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const story = await (prisma as any).userStory.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        updatedBy: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        history: {
          where: {
            action: { notIn: ['IMPORTED', 'bulk_import'] },
            field: { not: 'bulk_import' },
          },
          include: {
            changedBy: {
              select: { id: true, name: true, email: true, avatar: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'User story not found',
      });
    }

    res.status(200).json({
      success: true,
      data: story,
    });
  } catch (error: any) {
    console.error('Error fetching user story by ID:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch user story',
    });
  }
};

export const createUserStory = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const data = req.body;

    const newStory = await (prisma as any).userStory.create({
      data: {
        featureId: data.featureId || '',
        featureName: data.featureName || '',
        moduleSection: data.moduleSection || '',
        userType: data.userType || '',
        scenarioId: data.scenarioId || '',
        scenarioName: data.scenarioName || '',
        userStoryExpectedOutput: data.userStoryExpectedOutput || '',
        uiScreenName: data.uiScreenName || '',
        uiScreenId: data.uiScreenId || '',
        figmaLink: data.figmaLink || '',
        phase: data.phase || '',
        figmaStatus: data.figmaStatus || 'PENDING',
        itStatus: data.itStatus || 'BACKLOG',
        createdById: userId || null,
        updatedById: userId || null,
      },
      include: {
        createdBy: { select: { id: true, name: true, email: true, avatar: true } },
        updatedBy: { select: { id: true, name: true, email: true, avatar: true } },
      },
    });

    // Record creation history
    await (prisma as any).userStoryHistory.create({
      data: {
        userStoryId: newStory.id,
        changedById: userId || null,
        field: 'All',
        newValue: `Created story ${newStory.featureId || newStory.featureName || ''}`,
        action: 'CREATED',
      },
    });

    res.status(201).json({
      success: true,
      message: 'User story created successfully',
      data: newStory,
    });
  } catch (error: any) {
    console.error('Error creating user story:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create user story',
    });
  }
};

export const updateUserStory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const updates = req.body;

    const existingStory = await (prisma as any).userStory.findUnique({
      where: { id },
    });

    if (!existingStory) {
      return res.status(404).json({
        success: false,
        message: 'User story not found',
      });
    }

    const historyRecords: any[] = [];
    const fieldsToTrack = [
      'featureId',
      'featureName',
      'moduleSection',
      'userType',
      'scenarioId',
      'scenarioName',
      'userStoryExpectedOutput',
      'uiScreenName',
      'uiScreenId',
      'figmaLink',
      'phase',
      'figmaStatus',
      'itStatus',
    ];

    for (const field of fieldsToTrack) {
      if (updates[field] !== undefined && updates[field] !== existingStory[field]) {
        historyRecords.push({
          userStoryId: id,
          changedById: userId || null,
          field,
          oldValue: String(existingStory[field] ?? ''),
          newValue: String(updates[field] ?? ''),
          action: 'UPDATED',
        });
      }
    }

    const updatedStory = await (prisma as any).userStory.update({
      where: { id },
      data: {
        ...updates,
        updatedById: userId || null,
      },
      include: {
        createdBy: { select: { id: true, name: true, email: true, avatar: true } },
        updatedBy: { select: { id: true, name: true, email: true, avatar: true } },
      },
    });

    if (historyRecords.length > 0) {
      await (prisma as any).userStoryHistory.createMany({
        data: historyRecords,
      });
    }

    res.status(200).json({
      success: true,
      message: 'User story updated successfully',
      data: updatedStory,
    });
  } catch (error: any) {
    console.error('Error updating user story:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update user story',
    });
  }
};

export const deleteUserStory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingStory = await (prisma as any).userStory.findUnique({
      where: { id },
    });

    if (!existingStory) {
      return res.status(404).json({
        success: false,
        message: 'User story not found',
      });
    }

    await (prisma as any).userStory.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'User story deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting user story:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete user story',
    });
  }
};

export const clearAllUserStories = async (req: Request, res: Response) => {
  try {
    await (prisma as any).userStoryHistory.deleteMany({});
    await (prisma as any).userStory.deleteMany({});

    res.status(200).json({
      success: true,
      message: 'Successfully deleted all user stories and audit history',
    });
  } catch (error: any) {
    console.error('Error clearing user stories:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to clear user stories',
    });
  }
};

export const bulkImportUserStories = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { stories } = req.body;

    if (!Array.isArray(stories) || stories.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No user stories provided for import',
      });
    }

    const createdStories = [];

    for (const item of stories) {
      const newStory = await (prisma as any).userStory.create({
        data: {
          featureId: item.featureId || item['Feature ID'] || '',
          featureName: item.featureName || item['Feature Name'] || '',
          moduleSection: item.moduleSection || item['Module / Section'] || item['Module/Section'] || '',
          userType: item.userType || item['User Type'] || '',
          scenarioId: item.scenarioId || item['Scenario ID'] || '',
          scenarioName: item.scenarioName || item['Scenario Name'] || '',
          userStoryExpectedOutput: item.userStoryExpectedOutput || item['User Story - Expected Output'] || item['User Story'] || '',
          uiScreenName: item.uiScreenName || item['UI Screen Name'] || '',
          uiScreenId: item.uiScreenId || item['UI Screen ID'] || '',
          figmaLink: item.figmaLink || item['Figma Link'] || '',
          phase: item.phase || item['Phase'] || '',
          figmaStatus: item.figmaStatus || item['Figma Status'] || 'PENDING',
          itStatus: item.itStatus || item['IT Status'] || 'BACKLOG',
          createdById: userId || null,
          updatedById: userId || null,
        },
      });

      createdStories.push(newStory);
    }

    res.status(200).json({
      success: true,
      message: `Successfully imported ${createdStories.length} user stories`,
      count: createdStories.length,
      data: createdStories,
    });
  } catch (error: any) {
    console.error('Error importing user stories:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to import user stories',
    });
  }
};

export const getAuditLogs = async (req: Request, res: Response) => {
  try {
    const { storyId } = req.query;
    const where: any = {
      action: { notIn: ['IMPORTED', 'bulk_import'] },
      field: { not: 'bulk_import' },
    };

    if (storyId && typeof storyId === 'string') {
      where.userStoryId = storyId;
    }

    const historyLogs = await (prisma as any).userStoryHistory.findMany({
      where,
      include: {
        changedBy: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        userStory: {
          select: { id: true, featureId: true, featureName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    res.status(200).json({
      success: true,
      data: historyLogs,
    });
  } catch (error: any) {
    console.error('Error fetching user story audit logs:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch audit logs',
    });
  }
};
