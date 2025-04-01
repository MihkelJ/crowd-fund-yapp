import { useQuery } from '@tanstack/react-query';
import { CampaignWithStats, fetchCampaign } from '../api';

// Define query keys for type safety and better organization
export const campaignKeys = {
  all: ['campaigns'] as const,
  detail: (id: string) => [...campaignKeys.all, id] as const,
};

export function useCampaign(id: string) {
  return useQuery<CampaignWithStats>({
    queryKey: campaignKeys.detail(id),
    queryFn: () => fetchCampaign(id),
    staleTime: 1000 * 60 * 5, // Data considered fresh for 5 minutes
    // Additional options can be configured here:
    // refetchOnWindowFocus: true, // Refetch when window gets focus (default is true)
    // retry: 3, // Number of retries on failed queries
  });
}
