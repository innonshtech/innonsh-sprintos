import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Sprint } from '@/types/core';

export const useSprints = (projectId?: string) => {
  return useQuery<Sprint[]>({
    queryKey: ['sprints', { projectId }],
    queryFn: async () => {
      const url = projectId ? `/sprints?projectId=${projectId}` : '/sprints';
      const { data } = await api.get(url);
      return data;
    },
  });
};

export const useSprint = (id: string) => {
  return useQuery<Sprint>({
    queryKey: ['sprint', id],
    queryFn: async () => {
      const { data } = await api.get(`/sprints/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateSprint = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newSprint: Partial<Sprint>) => {
      const { data } = await api.post('/sprints', newSprint);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sprints'] });
    },
  });
};

export const useUpdateSprint = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<Sprint> & { id: string }) => {
      const { data } = await api.put(`/sprints/${id}`, updateData);
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sprints'] });
      queryClient.invalidateQueries({ queryKey: ['sprint', variables.id] });
    },
  });
};

export const useDeleteSprint = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/sprints/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sprints'] });
    },
  });
};

export const useArchiveSprint = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isArchived }: { id: string; isArchived: boolean }) => {
      const { data } = await api.patch(`/sprints/${id}/archive`, { isArchived });
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sprints'] });
      queryClient.invalidateQueries({ queryKey: ['sprint', variables.id] });
    },
  });
};
