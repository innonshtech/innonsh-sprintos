import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const prisma = new PrismaClient();

async function main() {
  const email = 'adityad.innonsh@gmail.com';
  const rawPassword = 'aditya@123';
  const name = 'Aditya';
  const role = UserRole.DEVELOPER;
  const department = 'Engineering';

  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      password: hashedPassword,
      role,
      department,
      isActive: true,
      avatar: 'https://i.pravatar.cc/150?u=adityad'
    },
    create: {
      name,
      email,
      password: hashedPassword,
      role,
      department,
      isActive: true,
      avatar: 'https://i.pravatar.cc/150?u=adityad'
    }
  });

  console.log(`✅ User created/updated successfully: ${user.name} (${user.email}), Role: ${user.role}`);

  // Add to all projects as MEMBER
  const projects = await prisma.project.findMany();
  for (const proj of projects) {
    await prisma.projectMember.upsert({
      where: {
        projectId_userId: {
          projectId: proj.id,
          userId: user.id
        }
      },
      update: { role: 'MEMBER' },
      create: {
        projectId: proj.id,
        userId: user.id,
        role: 'MEMBER'
      }
    });
  }
  console.log(`✅ Added ${user.name} to ${projects.length} project(s).`);

  // Add to all sprints
  const sprints = await prisma.sprint.findMany();
  for (const sp of sprints) {
    await prisma.sprintMember.upsert({
      where: {
        sprintId_userId: {
          sprintId: sp.id,
          userId: user.id
        }
      },
      update: {},
      create: {
        sprintId: sp.id,
        userId: user.id
      }
    });
  }
  console.log(`✅ Added ${user.name} to ${sprints.length} sprint(s).`);
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
