import dotenv from 'dotenv';
dotenv.config();
import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function transferPawanToSanju() {
  console.log('🔄 Starting transfer of all authority and records from Pawan Verma to Sanju Verma...');

  // 1. Ensure Sanju Verma exists and has PRODUCT_OWNER authority
  const sanjuPwd = await bcrypt.hash('sanju@123', 10);
  const sanju = await prisma.user.upsert({
    where: { email: 'sanju.verma@gyoash.com' },
    update: {
      name: 'Sanju Verma',
      password: sanjuPwd,
      role: UserRole.PRODUCT_OWNER,
      department: 'Product Management',
      isActive: true,
    },
    create: {
      name: 'Sanju Verma',
      email: 'sanju.verma@gyoash.com',
      password: sanjuPwd,
      role: UserRole.PRODUCT_OWNER,
      department: 'Product Management',
      avatar: 'https://i.pravatar.cc/150?u=sanju',
      isActive: true,
    },
  });
  console.log('✅ Sanju Verma user verified:', sanju.id, sanju.email);

  // 2. Find Pawan Verma
  const pawan = await prisma.user.findUnique({
    where: { email: 'pawan.verma@gyoash.com' },
  });

  if (pawan) {
    console.log('Found Pawan Verma in database (ID:', pawan.id, '). Transferring all records & authority to Sanju Verma...');

    // Transfer Project Ownership
    const updatedProjects = await prisma.project.updateMany({
      where: { ownerId: pawan.id },
      data: { ownerId: sanju.id },
    });
    console.log(`- Transferred ${updatedProjects.count} owned projects to Sanju.`);

    // Transfer Assigned Tasks
    const updatedAssignedTasks = await prisma.task.updateMany({
      where: { assigneeId: pawan.id },
      data: { assigneeId: sanju.id },
    });
    console.log(`- Transferred ${updatedAssignedTasks.count} assigned tasks to Sanju.`);

    // Transfer Created Tasks
    const updatedCreatedTasks = await prisma.task.updateMany({
      where: { creatorId: pawan.id },
      data: { creatorId: sanju.id },
    });
    console.log(`- Transferred ${updatedCreatedTasks.count} created tasks to Sanju.`);

    // Transfer Created User Stories
    const updatedCreatedStories = await prisma.userStory.updateMany({
      where: { createdById: pawan.id },
      data: { createdById: sanju.id },
    });
    console.log(`- Transferred ${updatedCreatedStories.count} created user stories to Sanju.`);

    // Transfer Updated User Stories
    const updatedStories = await prisma.userStory.updateMany({
      where: { updatedById: pawan.id },
      data: { updatedById: sanju.id },
    });
    console.log(`- Transferred ${updatedStories.count} updated user stories to Sanju.`);

    // User Story Histories
    await prisma.userStoryHistory.updateMany({
      where: { changedById: pawan.id },
      data: { changedById: sanju.id },
    });

    // Chat Channels created
    await prisma.chatChannel.updateMany({
      where: { createdById: pawan.id },
      data: { createdById: sanju.id },
    });

    // Chat Memberships
    const pawanChatMemberships = await prisma.chatMember.findMany({ where: { userId: pawan.id } });
    for (const cm of pawanChatMemberships) {
      const existingSanjuCM = await prisma.chatMember.findUnique({
        where: { channelId_userId: { channelId: cm.channelId, userId: sanju.id } },
      });
      if (!existingSanjuCM) {
        await prisma.chatMember.create({
          data: {
            channelId: cm.channelId,
            userId: sanju.id,
          },
        });
      }
    }
    await prisma.chatMember.deleteMany({ where: { userId: pawan.id } });

    // Chat Messages & Reactions
    await prisma.chatMessage.updateMany({
      where: { senderId: pawan.id },
      data: { senderId: sanju.id },
    });
    await prisma.messageReaction.deleteMany({ where: { userId: pawan.id } });
    await prisma.pinnedMessage.deleteMany({ where: { pinnedById: pawan.id } });

    // Project Memberships
    const pawanProjMembers = await prisma.projectMember.findMany({ where: { userId: pawan.id } });
    for (const pm of pawanProjMembers) {
      const existingSanjuPM = await prisma.projectMember.findUnique({
        where: { projectId_userId: { projectId: pm.projectId, userId: sanju.id } },
      });
      if (!existingSanjuPM) {
        await prisma.projectMember.create({
          data: {
            projectId: pm.projectId,
            userId: sanju.id,
            role: 'PRODUCT_OWNER',
          },
        });
      }
    }
    await prisma.projectMember.deleteMany({ where: { userId: pawan.id } });

    // Sprint Memberships
    const pawanSprintMembers = await prisma.sprintMember.findMany({ where: { userId: pawan.id } });
    for (const sm of pawanSprintMembers) {
      const existingSanjuSM = await prisma.sprintMember.findUnique({
        where: { sprintId_userId: { sprintId: sm.sprintId, userId: sanju.id } },
      });
      if (!existingSanjuSM) {
        await prisma.sprintMember.create({
          data: {
            sprintId: sm.sprintId,
            userId: sanju.id,
          },
        });
      }
    }
    await prisma.sprintMember.deleteMany({ where: { userId: pawan.id } });

    // Blockers
    await prisma.blocker.updateMany({
      where: { reporterId: pawan.id },
      data: { reporterId: sanju.id },
    });
    await prisma.blocker.updateMany({
      where: { helperId: pawan.id },
      data: { helperId: sanju.id },
    });

    // Activities & Comments & Feedbacks
    await prisma.comment.updateMany({
      where: { userId: pawan.id },
      data: { userId: sanju.id },
    });
    await prisma.commentReaction.deleteMany({ where: { userId: pawan.id } });
    await prisma.taskActivity.deleteMany({ where: { userId: pawan.id } });
    await prisma.activityLog.deleteMany({ where: { userId: pawan.id } });
    await prisma.dailyStandup.deleteMany({ where: { userId: pawan.id } });
    await prisma.feedback.deleteMany({ where: { userId: pawan.id } });
    await prisma.timesheet.deleteMany({ where: { userId: pawan.id } });
    await prisma.todayFocus.deleteMany({ where: { userId: pawan.id } });
    await prisma.inAppNotification.deleteMany({ where: { userId: pawan.id } });
    await prisma.notification.deleteMany({ where: { userId: pawan.id } });
    await prisma.teamPerformanceMetric.deleteMany({ where: { userId: pawan.id } });
    await prisma.userSession.deleteMany({ where: { userId: pawan.id } });
    await prisma.loginHistory.deleteMany({ where: { userId: pawan.id } });
    await prisma.securityAuditLog.deleteMany({ where: { userId: pawan.id } });

    // Delete Pawan Verma user
    await prisma.user.delete({ where: { id: pawan.id } });
    console.log('🗑️ Pawan Verma user account successfully removed from database.');
  } else {
    console.log('ℹ️ Pawan Verma was not found in the database (already removed).');
  }

  // 3. Ensure Sanju is member of all projects and sprints
  const allProjects = await prisma.project.findMany();
  for (const proj of allProjects) {
    await prisma.projectMember.upsert({
      where: { projectId_userId: { projectId: proj.id, userId: sanju.id } },
      update: { role: 'PRODUCT_OWNER' },
      create: {
        projectId: proj.id,
        userId: sanju.id,
        role: 'PRODUCT_OWNER',
      },
    });
  }

  const allSprints = await prisma.sprint.findMany();
  for (const sp of allSprints) {
    await prisma.sprintMember.upsert({
      where: { sprintId_userId: { sprintId: sp.id, userId: sanju.id } },
      update: {},
      create: {
        sprintId: sp.id,
        userId: sanju.id,
      },
    });
  }

  console.log('🎉 Successfully transferred all authority and permissions to Sanju Verma!');
}

transferPawanToSanju()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error('Error transferring user data:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
