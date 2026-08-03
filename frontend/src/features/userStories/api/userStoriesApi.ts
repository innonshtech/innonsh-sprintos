import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { UserStory, UserStoryHistory } from '../types/userStory';

export interface UserStoryFilters {
  search?: string;
  featureName?: string;
  moduleSection?: string;
  phase?: string;
  itStatus?: string;
  figmaStatus?: string;
}

export const fetchUserStories = async (filters?: UserStoryFilters): Promise<UserStory[]> => {
  const response = await api.get('/user-stories', { params: filters });
  return response.data.data;
};

export const fetchUserStoryHistory = async (storyId?: string): Promise<UserStoryHistory[]> => {
  const response = await api.get('/user-stories/history', { params: { storyId } });
  return response.data.data;
};

export const createUserStoryApi = async (data: Partial<UserStory>): Promise<UserStory> => {
  const response = await api.post('/user-stories', data);
  return response.data.data;
};

export const updateUserStoryApi = async ({ id, data }: { id: string; data: Partial<UserStory> }): Promise<UserStory> => {
  const response = await api.patch(`/user-stories/${id}`, data);
  return response.data.data;
};

export const deleteUserStoryApi = async (id: string): Promise<void> => {
  await api.delete(`/user-stories/${id}`);
};

export const clearAllUserStoriesApi = async (): Promise<void> => {
  await api.delete('/user-stories/clear-all');
};

export const bulkImportUserStoriesApi = async (stories: Partial<UserStory>[]): Promise<{ count: number; data: UserStory[] }> => {
  const response = await api.post('/user-stories/bulk-import', { stories });
  return response.data;
};

// React Query Hooks

export const useUserStories = (filters?: UserStoryFilters) => {
  return useQuery({
    queryKey: ['userStories', filters],
    queryFn: () => fetchUserStories(filters),
  });
};

export const useUserStoryHistory = (storyId?: string) => {
  return useQuery({
    queryKey: ['userStoryHistory', storyId],
    queryFn: () => fetchUserStoryHistory(storyId),
  });
};

export const useCreateUserStory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUserStoryApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userStories'] });
      queryClient.invalidateQueries({ queryKey: ['userStoryHistory'] });
    },
  });
};

export const useUpdateUserStory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUserStoryApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userStories'] });
      queryClient.invalidateQueries({ queryKey: ['userStoryHistory'] });
    },
  });
};

export const useDeleteUserStory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUserStoryApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userStories'] });
      queryClient.invalidateQueries({ queryKey: ['userStoryHistory'] });
    },
  });
};

export const useClearAllUserStories = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clearAllUserStoriesApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userStories'] });
      queryClient.invalidateQueries({ queryKey: ['userStoryHistory'] });
    },
  });
};

export const useBulkImportUserStories = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bulkImportUserStoriesApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userStories'] });
      queryClient.invalidateQueries({ queryKey: ['userStoryHistory'] });
    },
  });
};
