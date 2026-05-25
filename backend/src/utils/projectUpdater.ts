import prisma from './prisma';

export const autoUpdateProjectStatuses = async () => {
  const now = new Date();
  
  try {
    // 1. PLANNING -> ACTIVE (start date has arrived)
    await prisma.project.updateMany({
      where: {
        status: 'PLANNING',
        startDate: { lte: now }
      },
      data: { status: 'ACTIVE' }
    });
  } catch (error) {
    console.error('Error auto-updating project statuses:', error);
  }
};
