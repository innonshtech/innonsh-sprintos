import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { TeamMember } from '@/types/user';

export const useTeam = () => {
  return useQuery<TeamMember[]>({
    queryKey: ['team'],
    queryFn: async () => {
      const response = await api.get('/team');
      return response.data;
    },
  });
};
