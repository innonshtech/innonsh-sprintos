import { PrismaClient, SprintStatus } from '@prisma/client';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Cleaning duplicate sprints and setting Sprint 1 to ACTIVE...');

  const project = await prisma.project.findFirst({ where: { key: 'GYOASH' } });
  if (!project) throw new Error('GYOASH project not found');

  const allSprints = await prisma.sprint.findMany({
    where: { projectId: project.id },
    orderBy: { createdAt: 'asc' }
  });

  console.log(`Found ${allSprints.length} sprints in database.`);

  const sprintDefinitions = [
    { num: 1, name: '⚡ Sprint 1 — Foundation', goal: 'Foundation & Login & License Setup', status: SprintStatus.ACTIVE, start: '2026-09-01', end: '2026-09-14' },
    { num: 2, name: '🖊️ Sprint 2 — Whiteboard Core', goal: 'Whiteboard, Digital Books & Quiz Engine', status: SprintStatus.PLANNED, start: '2026-09-15', end: '2026-09-28' },
    { num: 3, name: '🤖 Sprint 3 — AI Teacher Panel', goal: 'AI Assistant, Lesson Generator & Content Store', status: SprintStatus.PLANNED, start: '2026-09-29', end: '2026-10-12' },
    { num: 4, name: '🎓 Sprint 4 — Interactive Classroom + Mobile Apps', goal: 'Teacher & Student Mobile Apps & Offline Sync', status: SprintStatus.PLANNED, start: '2026-10-13', end: '2026-10-26' },
    { num: 5, name: '📚 Sprint 5 — Content, Labs, Recording & Analytics', goal: 'School Admin Portal, Reports & Device Management', status: SprintStatus.PLANNED, start: '2026-10-27', end: '2026-11-09' },
    { num: 6, name: '🔧 Sprint 6 — Integrations, Device & Polish', goal: 'Security Audit, Load Testing & Production Deployment', status: SprintStatus.PLANNED, start: '2026-11-10', end: '2026-11-23' },
  ];

  // Pick the first sprint of each number as the canonical sprint
  const canonicalSprints: Record<number, any> = {};
  const duplicateSprintIds: string[] = [];

  for (const def of sprintDefinitions) {
    const matching = allSprints.filter(s => s.name.includes(`Sprint ${def.num}`));
    if (matching.length > 0) {
      const canonical = matching[0];
      // Update canonical sprint to correct name, status, goal, dates
      const updated = await prisma.sprint.update({
        where: { id: canonical.id },
        data: {
          name: def.name,
          goal: def.goal,
          status: def.status,
          startDate: new Date(`${def.start}T00:00:00.000Z`),
          endDate: new Date(`${def.end}T23:59:59.000Z`)
        }
      });
      canonicalSprints[def.num] = updated;

      for (let i = 1; i < matching.length; i++) {
        duplicateSprintIds.push(matching[i].id);
      }
    } else {
      // Create if missing
      const created = await prisma.sprint.create({
        data: {
          name: def.name,
          goal: def.goal,
          status: def.status,
          startDate: new Date(`${def.start}T00:00:00.000Z`),
          endDate: new Date(`${def.end}T23:59:59.000Z`),
          projectId: project.id
        }
      });
      canonicalSprints[def.num] = created;
    }
  }

  console.log(`Identified ${duplicateSprintIds.length} duplicate sprint records to clean up.`);

  // Re-link all tasks that were pointing to duplicate sprints to their canonical sprint
  const allTasks = await prisma.task.findMany({ where: { projectId: project.id } });
  for (const task of allTasks) {
    if (!task.sprintId) continue;
    // Check if task is pointing to a duplicate
    const taskSprint = allSprints.find(s => s.id === task.sprintId);
    if (taskSprint) {
      const numMatch = taskSprint.name.match(/Sprint (\d+)/);
      if (numMatch) {
        const sprintNum = parseInt(numMatch[1], 10);
        const canonical = canonicalSprints[sprintNum];
        if (canonical && task.sprintId !== canonical.id) {
          await prisma.task.update({
            where: { id: task.id },
            data: { sprintId: canonical.id }
          });
        }
      }
    }
  }

  // Delete duplicate sprint records
  for (const dupId of duplicateSprintIds) {
    // Delete sprint members first if needed
    await prisma.sprintMember.deleteMany({ where: { sprintId: dupId } });
    await prisma.sprint.delete({ where: { id: dupId } });
  }

  console.log('✅ Duplicate sprints removed.');

  // Print remaining sprints
  const finalSprints = await prisma.sprint.findMany({
    where: { projectId: project.id },
    orderBy: { name: 'asc' }
  });

  console.log('\n--- FINAL EXACT 6 SPRINTS ---');
  finalSprints.forEach(s => console.log(`${s.name} | Status: ${s.status} | Dates: ${s.startDate.toISOString().split('T')[0]} to ${s.endDate.toISOString().split('T')[0]}`));
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
