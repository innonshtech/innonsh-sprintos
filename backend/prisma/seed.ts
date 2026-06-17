import { PrismaClient, UserRole, ProjectStatus, SprintStatus, TaskStatus, TaskPriority, BlockerSeverity, BlockerType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const users = [
  { name: "Saket", email: "saket.innonsh@gmail.com", password: "saket123", role: UserRole.PRODUCT_MANAGER, department: "Product Management", avatar: "https://i.pravatar.cc/150?u=saket" },
  { name: "Chetana", email: "chetana.innonsh@gmail.com", password: "chetana123", role: UserRole.DEVELOPER, department: "Engineering", avatar: "https://i.pravatar.cc/150?u=chetana" },
  { name: "Lokeek", email: "lokeek.innonsh@gmail.com", password: "lokeek123", role: UserRole.DEVELOPER, department: "Engineering", avatar: "https://i.pravatar.cc/150?u=lokeek" },
  { name: "Vaibhav", email: "vaibhav.innonsh@gmail.com", password: "vaibhav123", role: UserRole.DEVELOPER, department: "Engineering", avatar: "https://i.pravatar.cc/150?u=vaibhav" },
  { name: "Aniket", email: "aniket.innonsh@gmail.com", password: "aniket123", role: UserRole.DEVELOPER, department: "Engineering", avatar: "https://i.pravatar.cc/150?u=aniket" },
  { name: "Tasmiya Shaikh", email: "tasmiya.shaikh@innonsh.com", password: "tasmiya123", role: UserRole.MARKETING, department: "Marketing", avatar: "https://i.pravatar.cc/150?u=tasmiya" },
  { name: "Reshma", email: "reshma.innonsh@gmail.com", password: "reshma123", role: UserRole.MARKETING, department: "Marketing", avatar: "https://i.pravatar.cc/150?u=reshma" },
  { name: "Nikheel", email: "nikheel.innonsh@gmail.com", password: "nikheel123", role: UserRole.ADMIN, department: "Executive", avatar: "https://i.pravatar.cc/150?u=nikheel" }
];

async function main() {
  console.log('Starting seed...');

  // 1. Seed Users
  const createdUsers: Record<string, any> = {};
  for (const u of users) {
    const hashedPassword = await bcrypt.hash(u.password, 10);
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        ...u,
        password: hashedPassword,
      },
      create: {
        ...u,
        password: hashedPassword,
      },
    });
    createdUsers[u.name] = user;
  }
  console.log('Seed completed successfully! Mock projects and tasks have been removed.');
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
