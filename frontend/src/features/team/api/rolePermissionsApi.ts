import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { UserRole } from '@/types/user';

export type SidebarFeatureKey =
  | 'Dashboard'
  | 'Projects'
  | 'Sprints'
  | 'Tasks'
  | 'My Tasks'
  | 'Campaign Tasks'
  | 'User Stories'
  | 'Boards'
  | 'Chat'
  | 'Standups'
  | 'Timesheets'
  | 'Activity Log'
  | 'Analytics'
  | 'Reports'
  | 'Sprint Reports'
  | 'Audit Log'
  | 'Feedbacks'
  | 'Team Management'
  | 'Calendar'
  | 'Settings';

export type RolePermissionMap = Record<SidebarFeatureKey, boolean>;

export interface RolePermissionItem {
  id: string;
  role: UserRole;
  permissions: RolePermissionMap;
  updatedAt: string;
}

export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, RolePermissionMap> = {
  PRODUCT_MANAGER: {
    Dashboard: true,
    Projects: true,
    Sprints: true,
    Tasks: true,
    'My Tasks': true,
    'Campaign Tasks': true,
    'User Stories': true,
    Boards: true,
    Chat: true,
    Standups: true,
    Timesheets: true,
    'Activity Log': true,
    Analytics: true,
    Reports: true,
    'Sprint Reports': true,
    'Audit Log': true,
    Feedbacks: true,
    'Team Management': true,
    Calendar: true,
    Settings: true,
  },
  PRODUCT_OWNER: {
    Dashboard: true,
    Projects: true,
    Sprints: true,
    Tasks: true,
    'My Tasks': true,
    'Campaign Tasks': true,
    'User Stories': true,
    Boards: true,
    Chat: true,
    Standups: true,
    Timesheets: true,
    'Activity Log': true,
    Analytics: true,
    Reports: true,
    'Sprint Reports': true,
    'Audit Log': true,
    Feedbacks: true,
    'Team Management': true,
    Calendar: true,
    Settings: true,
  },
  DEVELOPER: {
    Dashboard: true,
    Projects: false,
    Sprints: false,
    Tasks: false,
    'My Tasks': true,
    'Campaign Tasks': false,
    'User Stories': true,
    Boards: true,
    Chat: true,
    Standups: true,
    Timesheets: true,
    'Activity Log': true,
    Analytics: false,
    Reports: false,
    'Sprint Reports': true,
    'Audit Log': false,
    Feedbacks: true,
    'Team Management': false,
    Calendar: true,
    Settings: true,
  },
  MARKETING: {
    Dashboard: true,
    Projects: false,
    Sprints: false,
    Tasks: false,
    'My Tasks': false,
    'Campaign Tasks': true,
    'User Stories': true,
    Boards: false,
    Chat: true,
    Standups: true,
    Timesheets: true,
    'Activity Log': true,
    Analytics: false,
    Reports: false,
    'Sprint Reports': false,
    'Audit Log': false,
    Feedbacks: true,
    'Team Management': false,
    Calendar: true,
    Settings: true,
  },
  ADMIN: {
    Dashboard: true,
    Projects: true,
    Sprints: true,
    Tasks: true,
    'My Tasks': true,
    'Campaign Tasks': true,
    'User Stories': true,
    Boards: true,
    Chat: true,
    Standups: true,
    Timesheets: true,
    'Activity Log': true,
    Analytics: true,
    Reports: true,
    'Sprint Reports': true,
    'Audit Log': true,
    Feedbacks: true,
    'Team Management': true,
    Calendar: true,
    Settings: true,
  },
};

export const fetchRolePermissions = async (): Promise<RolePermissionItem[]> => {
  const res = await api.get('/team/role-permissions');
  return res.data.data;
};

export const updateRolePermissionsApi = async ({ role, permissions }: { role: UserRole; permissions: RolePermissionMap }): Promise<RolePermissionItem> => {
  const res = await api.patch('/team/role-permissions', { role, permissions });
  return res.data.data;
};

export const useRolePermissions = () => {
  return useQuery({
    queryKey: ['rolePermissions'],
    queryFn: fetchRolePermissions,
  });
};

export const useUpdateRolePermissions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateRolePermissionsApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rolePermissions'] });
    },
  });
};
