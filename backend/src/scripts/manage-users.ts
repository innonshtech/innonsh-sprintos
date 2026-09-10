import dotenv from 'dotenv';
dotenv.config();
import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function run() {
  console.log('--- Starting User Updates ---');

  // 1. Create or upsert Sanju Verma
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
      isActive: true,
    }
  });
  console.log('Sanju Verma ready:', sanju.id);

  // 2. Create or upsert Girish Khairnar
  const girishPwd = await bcrypt.hash('girish@123', 10);
  const girish = await prisma.user.upsert({
    where: { email: 'girish.khairnar@gyoash.com' },
    update: {
      name: 'Girish Khairnar',
      password: girishPwd,
      role: UserRole.PRODUCT_OWNER,
      department: 'Product Management',
      isActive: true,
    },
    create: {
      name: 'Girish Khairnar',
      email: 'girish.khairnar@gyoash.com',
      password: girishPwd,
      role: UserRole.PRODUCT_OWNER,
      department: 'Product Management',
      isActive: true,
    }
  });
  console.log('Girish Khairnar ready:', girish.id);

  // 3. Create or upsert Samarth
  const samarthPwd = await bcrypt.hash('samarth@123', 10);
  const samarth = await prisma.user.upsert({
    where: { email: 'samarth.innonsh@gmail.com' },
    update: {
      name: 'Samarth',
      password: samarthPwd,
      role: UserRole.DEVELOPER,
      department: 'Engineering',
      isActive: true,
    },
    create: {
      name: 'Samarth',
      email: 'samarth.innonsh@gmail.com',
      password: samarthPwd,
      role: UserRole.DEVELOPER,
      department: 'Engineering',
      isActive: true,
    }
  });
  console.log('Samarth ready:', samarth.id);

  // 4. Create or upsert Vaibhav
  const vaibhavPwd = await bcrypt.hash('vaibhav@123', 10);
  const vaibhav = await prisma.user.upsert({
    where: { email: 'vaibhav.innonsh@gmail.com' },
    update: {
      name: 'Vaibhav',
      password: vaibhavPwd,
      role: UserRole.DEVELOPER,
      department: 'Engineering',
      isActive: true,
    },
    create: {
      name: 'Vaibhav',
      email: 'vaibhav.innonsh@gmail.com',
      password: vaibhavPwd,
      role: UserRole.DEVELOPER,
      department: 'Engineering',
      isActive: true,
    }
  });
  console.log('Vaibhav ready:', vaibhav.id);

  // 5. Check Nupur and reassign tasks to Samarth
  const nupur = await prisma.user.findUnique({
    where: { email: 'nupur.innonsh@gmail.com' }
  });

  if (nupur) {
    const reassignedTasks = await prisma.task.updateMany({
      where: { assigneeId: nupur.id },
      data: { assigneeId: samarth.id }
    });
    console.log('Reassigned tasks from Nupur to Samarth:', reassignedTasks.count);

    // Reassign created tasks if any
    await prisma.task.updateMany({
      where: { creatorId: nupur.id },
      data: { creatorId: samarth.id }
    });

    // Delete Nupur memberships and dependencies
    await prisma.projectMember.deleteMany({ where: { userId: nupur.id } });
    await prisma.sprintMember.deleteMany({ where: { userId: nupur.id } });
    await prisma.loginHistory.deleteMany({ where: { userId: nupur.id } });
    await prisma.userSession.deleteMany({ where: { userId: nupur.id } });
    await prisma.dailyStandup.deleteMany({ where: { userId: nupur.id } });
    await prisma.taskActivity.deleteMany({ where: { userId: nupur.id } });
    await prisma.activityLog.deleteMany({ where: { userId: nupur.id } });
    await prisma.comment.deleteMany({ where: { userId: nupur.id } });
    await prisma.feedback.deleteMany({ where: { userId: nupur.id } });
    await prisma.timesheet.deleteMany({ where: { userId: nupur.id } });
    await prisma.inAppNotification.deleteMany({ where: { userId: nupur.id } });
    await prisma.notification.deleteMany({ where: { userId: nupur.id } });

    // Delete Nupur user
    await prisma.user.delete({ where: { id: nupur.id } });
    console.log('Nupur removed from database.');
  } else {
    console.log('Nupur was not found in database (already removed).');
  }

  // 6. Ensure Samarth, Vaibhav, Sanju, Girish are members of active projects
  const projects = await prisma.project.findMany();
  for (const proj of projects) {
    for (const u of [samarth, vaibhav, sanju, girish]) {
      await prisma.projectMember.upsert({
        where: {
          projectId_userId: {
            projectId: proj.id,
            userId: u.id
          }
        },
        update: {},
        create: {
          projectId: proj.id,
          userId: u.id,
          role: u.role === UserRole.PRODUCT_OWNER ? 'PRODUCT_OWNER' : 'MEMBER'
        }
      });
    }
  }

  // Ensure Samarth and Vaibhav are members of all sprints
  const sprints = await prisma.sprint.findMany();
  for (const sp of sprints) {
    for (const u of [samarth, vaibhav]) {
      await prisma.sprintMember.upsert({
        where: {
          sprintId_userId: {
            sprintId: sp.id,
            userId: u.id
          }
        },
        update: {},
        create: {
          sprintId: sp.id,
          userId: u.id
        }
      });
    }
  }

  console.log('--- All User updates and memberships complete ---');
}

run()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error('Error running script:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
