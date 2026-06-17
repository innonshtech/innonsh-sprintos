import type { TeamMember, UserRole } from "../types/user";

export const USER_ROLES: UserRole[] = [
  "ADMIN",
  "PRODUCT_MANAGER",
  "DEVELOPER",
  "MARKETING"
];

export const DEPARTMENTS = [
  "Product Management",
  "Engineering",
  "Marketing"
];

export const ROLE_COLORS: Record<UserRole, string> = {
  ADMIN: "bg-rose-500/10 text-rose-600 border-rose-200 dark:text-rose-400 dark:border-rose-800",
  PRODUCT_MANAGER: "bg-indigo-500/10 text-indigo-600 border-indigo-200 dark:text-indigo-400 dark:border-indigo-800",
  DEVELOPER: "bg-blue-500/10 text-blue-600 border-blue-200 dark:text-blue-400 dark:border-blue-800",
  MARKETING: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:text-emerald-400 dark:border-emerald-800",
};

export const TEAM_MEMBERS: TeamMember[] = [
  // EXECUTIVE
  {
    id: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    name: "Nikheel",
    email: "nikheel.innonsh@gmail.com",
    password: "nikheel123",
    role: "ADMIN",
    department: "Executive",
    status: "ONLINE",
    avatar: "https://i.pravatar.cc/150?u=nikheel",
    color: "rose",
  },
  // PRODUCT MANAGEMENT
  {
    id: "5a67a900-345d-4159-8547-032139b01e5d",
    name: "Saket",
    email: "saket.innonsh@gmail.com",
    password: "saket123",
    role: "PRODUCT_MANAGER",
    department: "Product Management",
    status: "ONLINE",
    avatar: "https://i.pravatar.cc/150?u=saket",
    color: "indigo",
  },
  // DEVELOPMENT TEAM
  {
    id: "ec63ffb8-e267-4b77-b591-d56a51803522",
    name: "Chetana",
    email: "chetana.innonsh@gmail.com",
    password: "chetana123",
    role: "DEVELOPER",
    department: "Engineering",
    status: "ONLINE",
    avatar: "https://i.pravatar.cc/150?u=chetana",
    color: "orange",
  },
  {
    id: "526bbc44-08f1-452c-a889-8a2dcd4b31da",
    name: "Lokeek",
    email: "lokeek.innonsh@gmail.com",
    password: "lokeek123",
    role: "DEVELOPER",
    department: "Engineering",
    status: "ONLINE",
    avatar: "https://i.pravatar.cc/150?u=lokeek",
    color: "blue",
  },
  {
    id: "b7019483-6db5-4b5e-86d5-c89c7fc98915",
    name: "Vaibhav",
    email: "vaibhav.innonsh@gmail.com",
    password: "vaibhav123",
    role: "DEVELOPER",
    department: "Engineering",
    status: "ONLINE",
    avatar: "https://i.pravatar.cc/150?u=vaibhav",
    color: "emerald",
  },
  {
    id: "0764372f-a5ea-4f15-ad52-9b19b9479ace",
    name: "Aniket",
    email: "aniket.innonsh@gmail.com",
    password: "aniket123",
    role: "DEVELOPER",
    department: "Engineering",
    status: "ONLINE",
    avatar: "https://i.pravatar.cc/150?u=aniket",
    color: "cyan",
  },
  // MARKETING TEAM
  {
    id: "uuid-4",
    name: "Tasmiya Shaikh",
    email: "tasmiya.shaikh@innonsh.com",
    password: "tasmiya123",
    role: "MARKETING",
    department: "Marketing",
    avatar: "https://i.pravatar.cc/150?u=tasmiya",
    status: "online",
    assignedTasks: 4,
    completedSprintTasks: 10
  },
  {
    id: "3a8db40b-6c7f-4ac3-bd5f-198fea06b880",
    name: "Reshma",
    email: "reshma.innonsh@gmail.com",
    password: "reshma123",
    role: "MARKETING",
    department: "Marketing",
    avatar: "https://i.pravatar.cc/150?u=reshma",
    status: "offline",
    assignedTasks: 2,
    completedSprintTasks: 5
  }
];
