import { PrismaClient, UserRole, ProjectStatus, SprintStatus, TaskStatus, TaskPriority } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const prisma = new PrismaClient();

interface ParsedStory {
  sprintId: string;
  storyNum: number;
  title: string;
  module: string;
  description: string;
  acceptanceCriteria: string[];
}

function parseSprintPlanHtml(): { sprints: { id: string; name: string; goal: string }[]; stories: ParsedStory[] } {
  const htmlPath = path.resolve(__dirname, '../../../SprintPlan.html');
  const html = fs.readFileSync(htmlPath, 'utf-8');

  const sprints: { id: string; name: string; goal: string }[] = [];
  const stories: ParsedStory[] = [];

  // Match each sprint section: <section id="s1"> ... </section>
  const sprintRegex = /<section id="(s[1-6])">([\s\S]*?)<\/section>/g;
  let sprintMatch;

  while ((sprintMatch = sprintRegex.exec(html)) !== null) {
    const sprintId = sprintMatch[1];
    const sprintContent = sprintMatch[2];

    // Extract sprint title and goal
    const titleMatch = sprintContent.match(/<div class="sprint-title"[^>]*>([\s\S]*?)<\/div>/);
    const sprintTitle = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : `Sprint ${sprintId.toUpperCase()}`;

    const goalMatch = sprintContent.match(/<div class="sprint-goal">[\s\S]*?<strong>Sprint Goal:<\/strong>([\s\S]*?)<\/div>/);
    const sprintGoal = goalMatch ? goalMatch[1].replace(/<[^>]+>/g, '').trim() : '';

    sprints.push({ id: sprintId, name: sprintTitle, goal: sprintGoal });

    // Split sprint content by story-card
    const rawCards = sprintContent.split('<div class="story-card">');
    rawCards.shift(); // remove header part before first card

    for (const cardHtml of rawCards) {
      // Number
      const numMatch = cardHtml.match(/<div class="story-num[^"]*">#?(\d+)<\/div>/);
      const storyNum = numMatch ? parseInt(numMatch[1], 10) : stories.length + 1;

      // Title
      const storyTitleMatch = cardHtml.match(/<div class="story-title">([\s\S]*?)<\/div>/);
      const title = storyTitleMatch ? storyTitleMatch[1].trim() : `Story #${storyNum}`;

      // Module
      const moduleMatch = cardHtml.match(/<span class="story-module[^"]*">([\s\S]*?)<\/span>/);
      const module = moduleMatch ? moduleMatch[1].trim() : 'General';

      // Description
      const descMatch = cardHtml.match(/<div class="story-desc">([\s\S]*?)<\/div>/);
      const description = descMatch ? descMatch[1].trim() : '';

      // Acceptance Criteria
      const acList: string[] = [];
      const acRegex = /<li>([\s\S]*?)<\/li>/g;
      let acMatch;
      while ((acMatch = acRegex.exec(cardHtml)) !== null) {
        acList.push(acMatch[1].replace(/<[^>]+>/g, '').trim());
      }

      stories.push({
        sprintId,
        storyNum,
        title,
        module,
        description,
        acceptanceCriteria: acList
      });
    }
  }

  return { sprints, stories };
}

async function run() {
  console.log('🔄 Parsing SprintPlan.html and updating database...');

  const { sprints: parsedSprints, stories: parsedStories } = parseSprintPlanHtml();
  console.log(`📊 Found ${parsedSprints.length} Sprints and ${parsedStories.length} Stories in SprintPlan.html.`);

  // 1. Get or create project
  let project = await prisma.project.findFirst({ where: { key: 'GYOASH' } });
  if (!project) {
    const adminUser = await prisma.user.findFirst({ where: { role: UserRole.ADMIN } });
    if (!adminUser) throw new Error('No admin user found in database.');
    project = await prisma.project.create({
      data: {
        key: 'GYOASH',
        name: 'GYOASH — Sprint Plan & User Stories',
        description: 'GYOASH Project 2609 Phase 1 — Interactive Learning & Management Platform',
        status: ProjectStatus.ACTIVE,
        ownerId: adminUser.id,
        startDate: new Date('2026-09-01'),
        deadline: new Date('2026-11-23')
      }
    });
  }

  // 2. Get exact assignable users (matching original seed.ts)
  const allUsers = await prisma.user.findMany();
  const usersByName: Record<string, any> = {};
  allUsers.forEach(u => { usersByName[u.name] = u; });

  const saket = usersByName["Saket"] || allUsers[0];
  const assignableUsers = [
    usersByName["Lokeek"],
    usersByName["Sanket"],
    usersByName["Samarth"],
    usersByName["Vaibhav"],
    usersByName["Chetana Pakhale"],
  ].filter(Boolean);

  if (assignableUsers.length === 0) {
    throw new Error('No assignable users found.');
  }

  // 3. Upsert Sprints
  const sprintMap: Record<string, any> = {};
  const sprintDateRanges: Record<string, { start: string; end: string }> = {
    s1: { start: '2026-09-01', end: '2026-09-14' },
    s2: { start: '2026-09-15', end: '2026-09-28' },
    s3: { start: '2026-09-29', end: '2026-10-12' },
    s4: { start: '2026-10-13', end: '2026-10-26' },
    s5: { start: '2026-10-27', end: '2026-11-09' },
    s6: { start: '2026-11-10', end: '2026-11-23' },
  };

  for (let i = 0; i < parsedSprints.length; i++) {
    const sp = parsedSprints[i];
    const dates = sprintDateRanges[sp.id] || { start: '2026-09-01', end: '2026-09-14' };
    const startDate = new Date(`${dates.start}T00:00:00.000Z`);
    const endDate = new Date(`${dates.end}T23:59:59.000Z`);

    const existingSprint = await prisma.sprint.findFirst({
      where: { projectId: project.id, name: { startsWith: `Sprint ${i + 1}` } }
    });

    let sprintRecord;
    if (existingSprint) {
      sprintRecord = await prisma.sprint.update({
        where: { id: existingSprint.id },
        data: {
          name: sp.name,
          goal: sp.goal,
          startDate,
          endDate,
          status: i === 0 ? SprintStatus.ACTIVE : SprintStatus.PLANNED,
        }
      });
    } else {
      sprintRecord = await prisma.sprint.create({
        data: {
          name: sp.name,
          goal: sp.goal,
          startDate,
          endDate,
          status: i === 0 ? SprintStatus.ACTIVE : SprintStatus.PLANNED,
          projectId: project.id
        }
      });
    }

    sprintMap[sp.id] = sprintRecord;
  }

  // 4. Clear existing tasks and user stories for this project to ensure clean sync
  await prisma.task.deleteMany({ where: { projectId: project.id } });
  await prisma.userStory.deleteMany({});

  console.log('🧹 Cleared old tasks and user stories from database.');

  // 5. Insert new tasks and user stories matching seed.ts logic
  const tasksToCreate: any[] = [];
  const userStorySheetData: any[] = [];

  for (let idx = 0; idx < parsedStories.length; idx++) {
    const story = parsedStories[idx];
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
      description: `${story.description}\n\nAcceptance Criteria:\n${story.acceptanceCriteria.map(ac => `- ${ac}`).join('\n')}`,
      type: 'STORY',
      status,
      priority,
      storyPoints: (numInt % 8) + 1,
      projectId: project.id,
      sprintId: targetSprint.id,
      assigneeId: assignee.id,
      creatorId: saket.id
    });

    userStorySheetData.push({
      featureId: `FC${formattedNum}`,
      featureName: story.module ? story.module.split('·')[0].trim() : 'General',
      moduleSection: story.module || 'General Module',
      userType: story.title.toLowerCase().includes('admin') ? 'Admin' : story.title.toLowerCase().includes('teacher') ? 'Teacher' : story.title.toLowerCase().includes('student') ? 'Student' : 'User',
      scenarioId: `SCN${formattedNum}`,
      scenarioName: story.title,
      userStoryExpectedOutput: `${story.description}\n\nKey Criteria:\n${story.acceptanceCriteria.slice(0, 3).map(ac => `• ${ac}`).join('\n')}`,
      uiScreenName: `${story.title} Screen`,
      uiScreenId: `UI${formattedNum}`,
      figmaLink: '',
      phase: targetSprint.name,
      figmaStatus: 'PENDING',
      itStatus,
      createdById: saket.id
    });
  }

  // Create tasks
  for (const t of tasksToCreate) {
    await prisma.task.create({ data: t });
  }

  // Create user stories
  await prisma.userStory.createMany({
    data: userStorySheetData
  });

  console.log(`✅ Successfully inserted ${tasksToCreate.length} Tasks & User Stories into PostgreSQL!`);

  // Verify Sprint 1 and Sprint 2 tasks
  const s1Tasks = await prisma.task.findMany({
    where: { sprintId: sprintMap['s1'].id },
    orderBy: { key: 'asc' },
    select: { key: true, title: true }
  });
  console.log('\n--- SPRINT 1 TASKS IN DB ---');
  s1Tasks.forEach(t => console.log(`${t.key}: ${t.title}`));

  const s2Tasks = await prisma.task.findMany({
    where: { sprintId: sprintMap['s2'].id },
    orderBy: { key: 'asc' },
    take: 5,
    select: { key: true, title: true }
  });
  console.log('\n--- SPRINT 2 (FIRST 5) TASKS IN DB ---');
  s2Tasks.forEach(t => console.log(`${t.key}: ${t.title}`));
}

run()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
