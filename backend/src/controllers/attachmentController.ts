import { Request, Response } from 'express';
import prisma from '../utils/prisma';

// A simple mock attachment controller since we don't have AWS S3 set up.
// For real attachments we would use multer + upload to cloud storage.
export const addAttachment = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const { fileName, fileUrl, fileType, fileSize } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const attachment = await prisma.attachment.create({
      data: {
        fileName,
        fileUrl,
        fileType,
        fileSize,
        taskId
      }
    });

    // Create activity log
    await prisma.taskActivity.create({
      data: {
        taskId,
        userId: user.id,
        action: 'ATTACHMENT_ADDED',
        newValue: fileName
      }
    });

    res.status(201).json(attachment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add attachment' });
  }
};

export const deleteAttachment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    await prisma.attachment.delete({ where: { id } });
    res.status(200).json({ message: 'Attachment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete attachment' });
  }
};
