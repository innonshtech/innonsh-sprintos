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
    password: "nikheel@123",
    role: "ADMIN",
    department: "Administration",
    status: "ONLINE",
    avatar: undefined,
    color: "rose",
    isActive: true,
  },
  // PRODUCT MANAGEMENT
  {
    id: "5a67a900-345d-4159-8547-032139b01e5d",
    name: "Saket",
    email: "saket.innonsh@gmail.com",
    password: "saket@123",
    role: "PRODUCT_MANAGER",
    department: "Product Management",
    status: "ONLINE",
    avatar: undefined,
    color: "indigo",
    isActive: true,
  },
  {
    id: "chetana-p-uuid-006",
    name: "Chetana Pakhale",
    email: "chetana.innonsh@gmail.com",
    password: "chetana@123",
    role: "PRODUCT_MANAGER",
    department: "Engineering",
    status: "ONLINE",
    avatar: undefined,
    color: "purple",
    isActive: true,
  },

  // DEVELOPMENT TEAM
  {
    id: "526bbc44-08f1-452c-a889-8a2dcd4b31da",
    name: "Lokeek",
    email: "lokeek.innonsh@gmail.com",
    password: "lokeek@123",
    role: "DEVELOPER",
    department: "Engineering",
    status: "ONLINE",
    avatar: undefined,
    color: "blue",
    isActive: true,
  },
  {
    id: "sanket-n-uuid-004",
    name: "Sanket",
    email: "sanketn022@gmail.com",
    password: "sanket@123",
    role: "DEVELOPER",
    department: "Engineering",
    status: "ONLINE",
    avatar: undefined,
    color: "indigo",
    isActive: true,
  },
  {
    id: "nupur-k-uuid-007",
    name: "Nupur Kulkarni",
    email: "nupur.innonsh@gmail.com",
    password: "nupur@123",
    role: "DEVELOPER",
    department: "Engineering",
    status: "ONLINE",
    avatar: undefined,
    color: "teal",
    isActive: true,
  },
  {
    id: "pawan-v-uuid-008",
    name: "Pawan Verma",
    email: "pawan.verma@gyoash.com",
    password: "pawan@123",
    role: "PRODUCT_OWNER",
    department: "Product Management",
    status: "ONLINE",
    avatar: undefined,
    color: "amber",
    isActive: true,
  }
];
