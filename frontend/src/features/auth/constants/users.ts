import type { Role } from '../types';

export const HARDCODED_USERS = [
  {
    id: 'u_1',
    email: 'admin@innonsh.com',
    password: 'Admin@123',
    role: 'SUPER_ADMIN' as Role,
    name: 'Nikhil (Super Admin)',
    avatarUrl: undefined,
  },
  {
    id: 'u_2',
    email: 'pm@innonsh.com',
    password: 'PM@123',
    role: 'PRODUCT_MANAGER' as Role,
    name: 'Sarah (Product Manager)',
    avatarUrl: undefined,
  },
  {
    id: 'u_3',
    email: 'lead@innonsh.com',
    password: 'Lead@123',
    role: 'TEAM_LEAD' as Role,
    name: 'David (Team Lead)',
    avatarUrl: undefined,
  },
  {
    id: 'u_4',
    email: 'dev@innonsh.com',
    password: 'Dev@123',
    role: 'DEVELOPER' as Role,
    name: 'Alex (Developer)',
    avatarUrl: undefined,
  },
  {
    id: 'u_5',
    email: 'hr@innonsh.com',
    password: 'HR@123',
    role: 'HR' as Role,
    name: 'Jessica (HR)',
    avatarUrl: undefined,
  },
];
