import { PrismaClient, UserRole, ProjectStatus, SprintStatus, TaskStatus, TaskPriority } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting GYOASH project seed...');

  // 1. Users setup
  const usersData = [
    { name: "Saket", email: "saket.innonsh@gmail.com", password: "saket@123", role: UserRole.PRODUCT_MANAGER, department: "Product Management", avatar: "https://i.pravatar.cc/150?u=saket", isActive: true },
    { name: "Lokeek", email: "lokeek.innonsh@gmail.com", password: "lokeek@123", role: UserRole.DEVELOPER, department: "Engineering", avatar: "https://i.pravatar.cc/150?u=lokeek", isActive: true },
    { name: "Sanket", email: "sanketn022@gmail.com", password: "sanket@123", role: UserRole.DEVELOPER, department: "Engineering", avatar: "https://i.pravatar.cc/150?u=sanketn", isActive: true },
    { name: "Samarth", email: "samarth.innonsh@gmail.com", password: "samarth@123", role: UserRole.DEVELOPER, department: "Engineering", avatar: "https://i.pravatar.cc/150?u=samarth", isActive: true },
    { name: "Vaibhav", email: "vaibhav.innonsh@gmail.com", password: "vaibhav@123", role: UserRole.DEVELOPER, department: "Engineering", avatar: "https://i.pravatar.cc/150?u=vaibhav", isActive: true },
    { name: "Chetana Pakhale", email: "chetana.innonsh@gmail.com", password: "chetana@123", role: UserRole.PRODUCT_MANAGER, department: "Engineering", avatar: "https://i.pravatar.cc/150?u=chetana", isActive: true },
    { name: "Nikheel", email: "nikheel.innonsh@gmail.com", password: "nikheel@123", role: UserRole.ADMIN, department: "Executive", avatar: "https://i.pravatar.cc/150?u=nikheel", isActive: true },
    { name: "Sanju Verma", email: "sanju.verma@gyoash.com", password: "sanju@123", role: UserRole.PRODUCT_OWNER, department: "Product Management", avatar: "https://i.pravatar.cc/150?u=sanju", isActive: true },
    { name: "Girish Khairnar", email: "girish.khairnar@gyoash.com", password: "girish@123", role: UserRole.PRODUCT_OWNER, department: "Product Management", avatar: "https://i.pravatar.cc/150?u=girish", isActive: true },
    { name: "Pawan Verma", email: "pawan.verma@gyoash.com", password: "pawan@123", role: UserRole.PRODUCT_OWNER, department: "Product Management", avatar: "https://i.pravatar.cc/150?u=pawan", isActive: true },
  ];

  const createdUsers: Record<string, any> = {};
  for (const u of usersData) {
    const hashedPassword = await bcrypt.hash(u.password, 10);
    const userRecord = await prisma.user.upsert({
      where: { email: u.email },
      update: { ...u, password: hashedPassword },
      create: { ...u, password: hashedPassword },
    });
    createdUsers[u.name] = userRecord;
  }

  // Assignable users (Excluding Saket, Nikheel, & Product Owners)
  const assignableUsers = [
    createdUsers["Lokeek"],
    createdUsers["Sanket"],
    createdUsers["Samarth"],
    createdUsers["Vaibhav"],
    createdUsers["Chetana Pakhale"],
  ].filter(Boolean);

  // 2. Read extracted stories JSON
  const extractedPath = 'C:\\Users\\lokha\\.gemini\\antigravity-ide\\brain\\ab41c2b1-3fa0-4890-807b-44f5787b8bbf\\scratch\\extracted_stories.json';
  if (!fs.existsSync(extractedPath)) {
    console.warn(`Extracted stories JSON not found at ${extractedPath}, skipping GYOASH project data.`);
    return;
  }

  const { sprints: rawSprints, stories: rawStories } = JSON.parse(fs.readFileSync(extractedPath, 'utf-8'));

  // 3. Create Project
  const projectData = {
    key: "GYOASH",
    name: "GYOASH — Sprint Plan & User Stories",
    description: "GYOASH Project 2609 Phase 1 — Interactive Learning & Management Platform",
    status: ProjectStatus.ACTIVE,
    ownerId: createdUsers["Saket"].id,
    startDate: new Date('2026-09-01'),
    deadline: new Date('2026-11-30')
  };

  const project = await prisma.project.upsert({
    where: { key: projectData.key },
    update: projectData,
    create: projectData
  });

  // Project Members
  const allUserIds = Object.values(createdUsers).map(u => u.id);
  await prisma.projectMember.createMany({
    data: allUserIds.map(userId => ({
      projectId: project.id,
      userId,
      role: userId === createdUsers["Saket"].id ? "LEAD" : "MEMBER"
    })),
    skipDuplicates: true
  });

  // 4. Create Sprints
  const sprintMap: Record<string, any> = {};
  const sprintConfig = [
    { id: 's1', name: 'Sprint 1 — Foundation', offsetDays: 0, goal: 'Foundation & Login & License Setup' },
    { id: 's2', name: 'Sprint 2 — Core Learning Engine', offsetDays: 14, goal: 'Whiteboard, Digital Books & Quiz Engine' },
    { id: 's3', name: 'Sprint 3 — AI & Multimedia', offsetDays: 28, goal: 'AI Assistant, Lesson Generator & Content Store' },
    { id: 's4', name: 'Sprint 4 — Mobile & Sync', offsetDays: 42, goal: 'Teacher & Student Mobile Apps & Offline Sync' },
    { id: 's5', name: 'Sprint 5 — Analytics & Admin', offsetDays: 56, goal: 'School Admin Portal, Reports & Device Management' },
    { id: 's6', name: 'Sprint 6 — Hardening & Launch', offsetDays: 70, goal: 'Security Audit, Load Testing & Production Deployment' },
  ];

  for (let i = 0; i < sprintConfig.length; i++) {
    const sc = sprintConfig[i];
    const startDate = new Date(Date.now() + sc.offsetDays * 24 * 60 * 60 * 1000);
    const endDate = new Date(startDate.getTime() + 14 * 24 * 60 * 60 * 1000);

    const sprintRecord = await prisma.sprint.create({
      data: {
        name: sc.name,
        goal: sc.goal,
        startDate,
        endDate,
        status: i === 0 ? SprintStatus.ACTIVE : SprintStatus.PLANNED,
        projectId: project.id
      }
    });

    sprintMap[sc.id] = sprintRecord;

    await prisma.sprintMember.createMany({
      data: assignableUsers.map(u => ({
        sprintId: sprintRecord.id,
        userId: u.id
      })),
      skipDuplicates: true
    });
  }

  // 5. Clear old tasks & user stories
  await prisma.task.deleteMany({ where: { projectId: project.id } });
  await prisma.userStory.deleteMany({});

  // 6. Create Tasks & User Story Specification Sheet rows
  const userStorySheetData: any[] = [];
  const tasksToCreate: any[] = [];

  for (let idx = 0; idx < rawStories.length; idx++) {
    const story = rawStories[idx];
    const numInt = idx + 1;
    const formattedNum = String(numInt).padStart(4, '0');
    const taskKey = `GYO-${numInt}`;

    const targetSprint = sprintMap[story.sprintId] || sprintMap['s1'];
    const assignee = assignableUsers[idx % assignableUsers.length];

    const priority = (numInt % 5 === 0) ? TaskPriority.URGENT : (numInt % 2 === 0) ? TaskPriority.HIGH : TaskPriority.MEDIUM;
    const status = (numInt <= 5) ? TaskStatus.IN_PROGRESS : (numInt <= 15) ? TaskStatus.IN_REVIEW : TaskStatus.TODO;
    const itStatus = (numInt <= 5) ? 'IN_DEVELOPMENT' : (numInt <= 15) ? 'TESTING' : 'BACKLOG';

    tasksToCreate.push({
      key: taskKey,
      title: story.title,
      description: `${story.description}\n\nAcceptance Criteria:\n${(story.acceptanceCriteria || []).map((ac: string) => `- ${ac}`).join('\n')}`,
      type: 'STORY',
      status,
      priority,
      storyPoints: (numInt % 8) + 1,
      projectId: project.id,
      sprintId: targetSprint.id,
      assigneeId: assignee.id,
      creatorId: createdUsers["Saket"].id
    });

    userStorySheetData.push({
      featureId: `FC${formattedNum}`,
      featureName: story.module ? story.module.split('·')[0].trim() : 'General',
      moduleSection: story.module || 'General Module',
      userType: story.title.toLowerCase().includes('admin') ? 'Admin' : story.title.toLowerCase().includes('teacher') ? 'Teacher' : story.title.toLowerCase().includes('student') ? 'Student' : 'User',
      scenarioId: `SCN${formattedNum}`,
      scenarioName: story.title,
      userStoryExpectedOutput: `${story.description}\n\nKey Criteria:\n${(story.acceptanceCriteria || []).slice(0, 3).map((ac: string) => `• ${ac}`).join('\n')}`,
      uiScreenName: `${story.title} Screen`,
      uiScreenId: `UI${formattedNum}`,
      figmaLink: '',
      phase: targetSprint.name,
      figmaStatus: 'PENDING',
      itStatus
    });
  }

  for (const t of tasksToCreate) {
    await prisma.task.create({ data: t });
  }

  await prisma.userStory.createMany({
    data: userStorySheetData
  });

  console.log('🎉 Seed completed successfully!');
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
