import type { TeamMember, UserRole } from "../types/user";

export const USER_ROLES: UserRole[] = [
  "ADMIN",
  "PRODUCT_MANAGER",
  "PRODUCT_OWNER",
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
  PRODUCT_OWNER: "bg-purple-500/10 text-purple-600 border-purple-200 dark:text-purple-400 dark:border-purple-800",
  DEVELOPER: "bg-blue-500/10 text-blue-600 border-blue-200 dark:text-blue-400 dark:border-blue-800",
  MARKETING: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:text-emerald-400 dark:border-emerald-800",
};

export const TEAM_MEMBERS: TeamMember[] = [
  // EXECUTIVE & ADMIN
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
    isActive: true,
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
    isActive: true,
  },

  // NEW TEAM MEMBERS (DEFAULT ROLE: PRODUCT_OWNER)
  {
    id: "ashish-jain-uuid-001",
    name: "Ashish Jain",
    email: "ashish.jain@hyperlocalventures.com",
    password: "ashish123",
    role: "PRODUCT_OWNER",
    department: "Product Management",
    status: "ONLINE",
    avatar: "https://i.pravatar.cc/150?u=ashish",
    color: "purple",
    isActive: true,
  },
  {
    id: "pratik-kotangale-uuid-002",
    name: "Pratik Kotangale",
    email: "kotangale.pratik18@dmsiitd.org",
    password: "pratik123",
    role: "PRODUCT_OWNER",
    department: "Engineering",
    status: "ONLINE",
    avatar: "https://i.pravatar.cc/150?u=pratik",
    color: "cyan",
    isActive: true,
  },
  {
    id: "shashank-mohore-uuid-003",
    name: "Shashank Mohore",
    email: "shashank.mohore@hyperlocalventures.com",
    password: "shashank123",
    role: "PRODUCT_OWNER",
    department: "Engineering",
    status: "ONLINE",
    avatar: "https://i.pravatar.cc/150?u=shashank",
    color: "amber",
    isActive: true,
  },

  // DEVELOPMENT TEAM
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
    isActive: true,
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
    isActive: true,
  },

  // HIDDEN FOR NOW (isActive: false)
  {
    id: "ec63ffb8-e267-4b77-b591-d56a51803522",
    name: "Chetana",
    email: "chetana.innonsh@gmail.com",
    password: "chetana123",
    role: "DEVELOPER",
    department: "Engineering",
    status: "OFFLINE",
    avatar: "https://i.pravatar.cc/150?u=chetana",
    color: "orange",
    isActive: false,
  },
  {
    id: "3a8db40b-6c7f-4ac3-bd5f-198fea06b880",
    name: "Reshma",
    email: "reshma.innonsh@gmail.com",
    password: "reshma123",
    role: "MARKETING",
    department: "Marketing",
    avatar: "https://i.pravatar.cc/150?u=reshma",
    status: "OFFLINE",
    isActive: false,
  }
];
