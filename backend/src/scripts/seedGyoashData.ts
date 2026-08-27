import { PrismaClient, UserRole, ProjectStatus, SprintStatus, TaskStatus, TaskPriority } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';

const prisma = new PrismaClient();

async function seedGyoashData() {
  console.log('🚀 Starting GYOASH project data population...');

  // 1. Users setup
  const usersData = [
    { name: "Saket", email: "saket.innonsh@gmail.com", password: "saket@123", role: UserRole.PRODUCT_MANAGER, department: "Product Management", avatar: "https://i.pravatar.cc/150?u=saket", isActive: true },
    { name: "Lokeek", email: "lokeek.innonsh@gmail.com", password: "lokeek@123", role: UserRole.DEVELOPER, department: "Engineering", avatar: "https://i.pravatar.cc/150?u=lokeek", isActive: true },
    { name: "Sanket", email: "sanketn022@gmail.com", password: "sanket@123", role: UserRole.DEVELOPER, department: "Engineering", avatar: "https://i.pravatar.cc/150?u=sanketn", isActive: true },
    { name: "Chetana Pakhale", email: "chetana.innonsh@gmail.com", password: "chetana@123", role: UserRole.PRODUCT_MANAGER, department: "Engineering", avatar: "https://i.pravatar.cc/150?u=chetana", isActive: true },
    { name: "Nupur Kulkarni", email: "nupur.innonsh@gmail.com", password: "nupur@123", role: UserRole.DEVELOPER, department: "Engineering", avatar: "https://i.pravatar.cc/150?u=nupur", isActive: true },
    { name: "Pawan Verma", email: "pawan.verma@gyoash.com", password: "pawan@123", role: UserRole.PRODUCT_OWNER, department: "Product Management", avatar: "https://i.pravatar.cc/150?u=pawan", isActive: true },
    { name: "Nikheel", email: "nikheel.innonsh@gmail.com", password: "nikheel@123", role: UserRole.ADMIN, department: "Administration", avatar: "https://i.pravatar.cc/150?u=nikheel", isActive: true }
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
  console.log('✅ Users seeded successfully.');

  // Assignable users (Excluding Saket & Nikheel)
  const assignableUsers = [
    createdUsers["Lokeek"],
    createdUsers["Sanket"],
    createdUsers["Chetana Pakhale"],
    createdUsers["Nupur Kulkarni"],
    createdUsers["Pawan Verma"]
  ].filter(Boolean);

  // 2. Read extracted stories JSON
  const extractedPath = 'C:\\Users\\lokha\\.gemini\\antigravity-ide\\brain\\ab41c2b1-3fa0-4890-807b-44f5787b8bbf\\scratch\\extracted_stories.json';
  if (!fs.existsSync(extractedPath)) {
    throw new Error(`Extracted stories JSON not found at ${extractedPath}`);
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
    deadline: new Date('2026-11-23')
  };

  const project = await prisma.project.upsert({
    where: { key: projectData.key },
    update: projectData,
    create: projectData
  });
  console.log(`✅ Project "${project.name}" (GYOASH) created.`);

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

  // 4. Create Sprints (Sept 1, 2026 Start Date, 2-Week Duration each)
  const sprintMap: Record<string, any> = {};
  const sprintDates = [
    { id: 's1', name: 'Sprint 1 — Foundation', start: '2026-09-01', end: '2026-09-14', goal: 'Foundation & Login & License Setup' },
    { id: 's2', name: 'Sprint 2 — Core Learning Engine', start: '2026-09-15', end: '2026-09-28', goal: 'Whiteboard, Digital Books & Quiz Engine' },
    { id: 's3', name: 'Sprint 3 — AI & Multimedia', start: '2026-09-29', end: '2026-10-12', goal: 'AI Assistant, Lesson Generator & Content Store' },
    { id: 's4', name: 'Sprint 4 — Mobile & Sync', start: '2026-10-13', end: '2026-10-26', goal: 'Teacher & Student Mobile Apps & Offline Sync' },
    { id: 's5', name: 'Sprint 5 — Analytics & Admin', start: '2026-10-27', end: '2026-11-09', goal: 'School Admin Portal, Reports & Device Management' },
    { id: 's6', name: 'Sprint 6 — Hardening & Launch', start: '2026-11-10', end: '2026-11-23', goal: 'Security Audit, Load Testing & Production Deployment' },
  ];

  for (let i = 0; i < sprintDates.length; i++) {
    const sc = sprintDates[i];
    const startDate = new Date(`${sc.start}T00:00:00.000Z`);
    const endDate = new Date(`${sc.end}T23:59:59.000Z`);

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
  console.log(`✅ 6 Sprints created starting Sept 1, 2026.`);

  // 5. Clear old User Stories & Tasks
  await prisma.task.deleteMany({ where: { projectId: project.id } });
  await prisma.userStory.deleteMany({});

  // 6. Create Tasks & User Story Specification Sheet rows for all 98 stories
  console.log(`⏳ Seeding ${rawStories.length} User Stories & Tasks with balanced Kanban statuses...`);

  const userStorySheetData: any[] = [];
  const tasksToCreate: any[] = [];

  for (let idx = 0; idx < rawStories.length; idx++) {
    const story = rawStories[idx];
    const numInt = idx + 1;
    const formattedNum = String(numInt).padStart(4, '0');
    const taskKey = `GYO-${numInt}`;

    const targetSprint = sprintMap[story.sprintId] || sprintMap['s1'];
    const assignee = assignableUsers[idx % assignableUsers.length];

    // Priority
    const priority = (numInt % 7 === 0) ? TaskPriority.URGENT : (numInt % 3 === 0) ? TaskPriority.HIGH : TaskPriority.MEDIUM;

    // Realistic Kanban Status Distribution across columns
    let status: TaskStatus = TaskStatus.TODO;
    let itStatus = 'BACKLOG';

    if (story.sprintId === 's1') {
      if (numInt <= 4) {
        status = TaskStatus.DONE;
        itStatus = 'DEPLOYED';
      } else if (numInt <= 8) {
        status = TaskStatus.IN_REVIEW;
        itStatus = 'TESTING';
      } else if (numInt <= 12) {
        status = TaskStatus.IN_PROGRESS;
        itStatus = 'IN_DEVELOPMENT';
      } else {
        status = TaskStatus.TODO;
        itStatus = 'BACKLOG';
      }
    } else if (story.sprintId === 's2') {
      if (numInt % 3 === 0) {
        status = TaskStatus.IN_PROGRESS;
        itStatus = 'IN_DEVELOPMENT';
      } else {
        status = TaskStatus.TODO;
        itStatus = 'BACKLOG';
      }
    }

    // Task record
    tasksToCreate.push({
      key: taskKey,
      title: story.title,
      description: `${story.description}\n\nAcceptance Criteria:\n${(story.acceptanceCriteria || []).map((ac: string) => `- ${ac}`).join('\n')}`,
      type: 'STORY',
      status,
      priority,
      storyPoints: (numInt % 5) + 2,
      projectId: project.id,
      sprintId: targetSprint.id,
      assigneeId: assignee.id,
      creatorId: createdUsers["Saket"].id
    });

    // Clean Expected Output formatting with distinct bullet points
    const criteriaFormatted = (story.acceptanceCriteria || [])
      .map((ac: string) => `• ${ac}`)
      .join('\n');

    const expectedOutputFormatted = `${story.description}\n\nKey Criteria:\n${criteriaFormatted}`;

    // UserStory Specification Sheet record
    userStorySheetData.push({
      featureId: `FC${formattedNum}`,
      featureName: story.module ? story.module.split('·')[0].trim() : 'General',
      moduleSection: story.module || 'General Module',
      userType: story.title.toLowerCase().includes('admin') ? 'Admin' : story.title.toLowerCase().includes('teacher') ? 'Teacher' : story.title.toLowerCase().includes('student') ? 'Student' : 'User',
      scenarioId: `SCN${formattedNum}`,
      scenarioName: story.title,
      userStoryExpectedOutput: expectedOutputFormatted,
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

  console.log(`🎉 Successfully seeded ${tasksToCreate.length} tasks & ${userStorySheetData.length} User Story specification rows!`);
}

seedGyoashData()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error seeding GYOASH data:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
