import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting data cleanup...');
  
  await prisma.pinnedMessage.deleteMany({});
  await prisma.chatMember.deleteMany({});
  await prisma.messageReaction.deleteMany({});
  await prisma.chatMessage.deleteMany({});
  await prisma.chatChannel.deleteMany({});
  
  await prisma.inAppNotification.deleteMany({});
  await prisma.passwordResetToken.deleteMany({});
  await prisma.loginHistory.deleteMany({});
  await prisma.securityAuditLog.deleteMany({});
  
  await prisma.activityLog.deleteMany({});
  await prisma.emailLog.deleteMany({});
  await prisma.productivitySnapshot.deleteMany({});
  await prisma.todayFocus.deleteMany({});
  await prisma.memberSprintStats.deleteMany({});
  
  await prisma.auditLog.deleteMany({});
  await prisma.attachment.deleteMany({});
  await prisma.notification.deleteMany({});
  
  await prisma.retrospectiveComparison.deleteMany({});
  await prisma.teamPerformanceMetric.deleteMany({});
  await prisma.sprintReport.deleteMany({});
  await prisma.feedback.deleteMany({});
  await prisma.blocker.deleteMany({});
  await prisma.dailyStandup.deleteMany({});
  
  await prisma.taskActivity.deleteMany({});
  await prisma.taskSubtask.deleteMany({});
  await prisma.commentReaction.deleteMany({});
  await prisma.comment.deleteMany({});
  
  await prisma.task.deleteMany({});
  await prisma.sprintMember.deleteMany({});
  await prisma.sprint.deleteMany({});
  await prisma.projectMember.deleteMany({});
  await prisma.project.deleteMany({});

  console.log('Successfully cleared all mock projects, sprints, tasks, and related data.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
