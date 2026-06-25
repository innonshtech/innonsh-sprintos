import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import cloudinary from '../utils/cloudinary';
import { UploadApiResponse } from 'cloudinary';
import streamifier from 'streamifier';

export const addAttachment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { taskId } = req.params;
    const user = req.user;

    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    // Upload to Cloudinary using a stream (since we use multer memoryStorage)
    const streamUpload = (fileBuffer: Buffer): Promise<UploadApiResponse> => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: 'auto' }, // auto detects if it's an image, pdf, etc.
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    const uploadResult = await streamUpload(req.file.buffer);

    const attachment = await prisma.attachment.create({
      data: {
        fileName: req.file.originalname,
        fileUrl: uploadResult.secure_url,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        taskId
      }
    });

    // Create activity log
    await prisma.taskActivity.create({
      data: {
        taskId,
        userId: user.id,
        action: 'ATTACHMENT_ADDED',
        newValue: req.file.originalname
      }
    });

    res.status(201).json(attachment);
  } catch (error) {
    console.error('Attachment Upload Error:', error);
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
