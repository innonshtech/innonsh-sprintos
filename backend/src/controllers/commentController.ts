import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getComments = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const comments = await prisma.taskComment.findMany({
      where: { taskId },
      include: {
        user: true,
      },
      orderBy: { createdAt: 'asc' }
    });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

export const addComment = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const { content } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const comment = await prisma.taskComment.create({
      data: {
        content,
        taskId,
        userId: user.id
      },
      include: {
        user: true
      }
    });

    // Create activity log
    await prisma.taskActivity.create({
      data: {
        taskId,
        userId: user.id,
        action: 'COMMENT_ADDED',
        newValue: content.substring(0, 50) + (content.length > 50 ? '...' : '')
      }
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

export const updateComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const user = req.user;

    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const existingComment = await prisma.taskComment.findUnique({ where: { id } });
    if (!existingComment) return res.status(404).json({ error: 'Comment not found' });
    if (existingComment.userId !== user.id && user.role !== 'PRODUCT_MANAGER') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const comment = await prisma.taskComment.update({
      where: { id },
      data: { content },
      include: { user: true }
    });

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update comment' });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const existingComment = await prisma.taskComment.findUnique({ where: { id } });
    if (!existingComment) return res.status(404).json({ error: 'Comment not found' });
    if (existingComment.userId !== user.id && user.role !== 'PRODUCT_MANAGER') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await prisma.taskComment.delete({ where: { id } });
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};
