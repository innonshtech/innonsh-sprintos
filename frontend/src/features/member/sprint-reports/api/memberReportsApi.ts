import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export const useMemberSprintSummary = (sprintId?: string) => {
  return useQuery({
    queryKey: ['member-sprint-summary', sprintId],
    queryFn: async () => {
      const url = sprintId ? `/member-reports/sprint-summary?sprintId=${sprintId}` : '/member-reports/sprint-summary';
      const { data } = await api.get(url);
      return data;
    }
  });
};

export const useCompletedTasks = (sprintId?: string) => {
  return useQuery({
    queryKey: ['member-completed-tasks', sprintId],
    queryFn: async () => {
      const url = sprintId ? `/member-reports/completed-tasks?sprintId=${sprintId}` : '/member-reports/completed-tasks';
      const { data } = await api.get(url);
      return data;
    }
  });
};

export const usePendingTasks = (sprintId?: string) => {
  return useQuery({
    queryKey: ['member-pending-tasks', sprintId],
    queryFn: async () => {
      const url = sprintId ? `/member-reports/pending-tasks?sprintId=${sprintId}` : '/member-reports/pending-tasks';
      const { data } = await api.get(url);
      return data;
    }
  });
};

export const useMemberBlockers = (sprintId?: string) => {
  return useQuery({
    queryKey: ['member-blockers', sprintId],
    queryFn: async () => {
      const url = sprintId ? `/member-reports/blockers?sprintId=${sprintId}` : '/member-reports/blockers';
      const { data } = await api.get(url);
      return data;
    }
  });
};

export const useMemberProductivity = (sprintId?: string) => {
  return useQuery({
    queryKey: ['member-productivity', sprintId],
    queryFn: async () => {
      const url = sprintId ? `/member-reports/productivity?sprintId=${sprintId}` : '/member-reports/productivity';
      const { data } = await api.get(url);
      return data;
    }
  });
};
