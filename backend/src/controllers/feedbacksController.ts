import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const createFeedback = async (req: Request, res: Response) => {
  try {
    const { 
      content, sentiment, category, wentWell, wentWrong, improvement, 
      realisticPlanning, achievableDeadlines, fairDistribution, blockerPatterns, sprintId 
    } = req.body;
    const userId = req.user?.id;

    if (!userId || !sprintId) {
      return res.status(400).json({ error: 'User ID and Sprint ID are required' });
    }

    const feedback = await prisma.feedback.create({
      data: {
        content,
        sentiment,
        category: category || 'SPRINT',
        wentWell,
        wentWrong,
        improvement,
        realisticPlanning,
        achievableDeadlines,
        fairDistribution,
        blockerPatterns,
        userId,
        sprintId
      }
    });

    res.status(201).json(feedback);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create feedback' });
  }
};

export const getFeedbacks = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (user?.role !== 'PRODUCT_MANAGER') {
      return res.status(403).json({ error: 'Only PMs can view all feedbacks' });
    }

    const { sprintId, category } = req.query;

    const filters: any = {};
    if (sprintId) filters.sprintId = String(sprintId);
    if (category) filters.category = String(category);

    const feedbacks = await prisma.feedback.findMany({
      where: filters,
      include: {
        user: true,
        sprint: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch feedbacks' });
  }
};

export const getComparison = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (user?.role !== 'PRODUCT_MANAGER') {
      return res.status(403).json({ error: 'Only PMs can view comparisons' });
    }

    // Get last two completed sprints
    const sprints = await prisma.sprint.findMany({
      where: { status: { in: ['COMPLETED', 'ACTIVE'] } },
      orderBy: { startDate: 'desc' },
      take: 2,
      include: { feedbacks: true, tasks: true }
    });

    if (sprints.length < 2) {
      return res.status(200).json({ message: 'Not enough sprints for comparison' });
    }

    const currentSprint = sprints[0];
    const previousSprint = sprints[1];

    // Dummy comparison logic based on tasks and feedbacks count
    const comparisonData = {
      improvedAreas: ['Communication', 'Requirement Clarity'],
      recurringProblems: ['Testing delays'],
      deadlineIssues: 'Reduced by 24%',
      teamCollaborationImprovements: 'Positive trend observed in feedbacks',
      blockerReductions: true,
      sprintHealthChanges: 'Improved compared to ' + previousSprint.name,
      currentSprintData: {
        id: currentSprint.id,
        name: currentSprint.name,
        feedbackCount: currentSprint.feedbacks.length,
      },
      previousSprintData: {
        id: previousSprint.id,
        name: previousSprint.name,
        feedbackCount: previousSprint.feedbacks.length,
      }
    };

    res.status(200).json(comparisonData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch retrospective comparison' });
  }
};

export const updateFeedback = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    const feedback = await prisma.feedback.update({
      where: { id },
      data
    });
    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update feedback' });
  }
};

export const deleteFeedback = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.feedback.delete({ where: { id } });
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete feedback' });
  }
};
