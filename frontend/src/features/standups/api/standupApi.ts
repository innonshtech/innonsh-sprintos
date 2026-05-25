import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { DailyStandup } from '@/types/core';

export const useStandups = (filters?: { sprintId?: string; userId?: string }) => {
  return useQuery<DailyStandup[]>({
    queryKey: ['standups', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.sprintId) params.append('sprintId', filters.sprintId);
      if (filters?.userId) params.append('userId', filters.userId);
      
      const url = `/standups${params.toString() ? `?${params.toString()}` : ''}`;
      const { data } = await api.get(url);
      return data;
    },
  });
};

export const useMyStandups = (sprintId?: string, options?: { enabled?: boolean }) => {
  return useQuery<DailyStandup[]>({
    queryKey: ['my-standups', sprintId],
    queryFn: async () => {
      const url = sprintId ? `/standups/me?sprintId=${sprintId}` : `/standups/me`;
      const { data } = await api.get(url);
      return data;
    },
    enabled: options?.enabled !== false,
  });
};

export const useCreateStandup = (isPM?: boolean) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newStandup: any) => {
      const { data } = await api.post('/standups', newStandup);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['standups'] });
      queryClient.invalidateQueries({ queryKey: ['my-standups'] });
      if (isPM) {
        queryClient.invalidateQueries({ queryKey: ['team-standups'] });
      }
    },
  });
};

export const useTeamStandups = (sprintId?: string, options?: { enabled?: boolean }) => {
  return useQuery<DailyStandup[]>({
    queryKey: ['team-standups', sprintId],
    queryFn: async () => {
      const url = sprintId ? `/standups/team?sprintId=${sprintId}` : `/standups/team`;
      const { data } = await api.get(url);
      return data;
    },
    enabled: options?.enabled,
  });
};
