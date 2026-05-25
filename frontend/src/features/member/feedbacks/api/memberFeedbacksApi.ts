import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export const useMyFeedbacks = () => {
  return useQuery({
    queryKey: ['my-feedbacks'],
    queryFn: async () => {
      const { data } = await api.get('/member-feedbacks/me');
      return data;
    }
  });
};

export const useSubmitFeedback = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (feedback: any) => {
      const { data } = await api.post('/member-feedbacks', feedback);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-feedbacks'] });
    }
  });
};

export const useDeleteFeedback = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/member-feedbacks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-feedbacks'] });
    }
  });
};
