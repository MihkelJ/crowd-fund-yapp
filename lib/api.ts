import { ContributionListResponse } from '@/app/api/v1/campaigns/[id]/contributions/route';
import { Campaign, Contribution, Tier } from '@prisma/client';

// Campaign with stats from the API
export interface CampaignWithStats extends Campaign {
  tiers: Tier[];
  contributions: Contribution[];
  stats: {
    raised: number;
    percentageRaised: number;
    backers: number;
    contributionsByTier: {
      tierId: string;
      tierTitle: string;
      count: number;
    }[];
  };
  // Adding UI-specific fields
  creatorName?: string; // Derived from creatorAddress
  tagline?: string; // Short summary derived from description
  contractAddress?: `0x${string}`; // The blockchain address derived from data
}

// Interface for the campaign list response
export interface CampaignListResponse {
  campaigns: CampaignWithStats[];
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
}

// Helper function to get the base URL
function getBaseUrl() {
  if (typeof window !== 'undefined') {
    // Browser environment
    return window.location.origin;
  }
  // Server environment - use environment variable or fallback
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
}

// Function to fetch a campaign by ID
export async function fetchCampaign(id: string): Promise<CampaignWithStats> {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/api/v1/campaigns/${id}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch campaign');
  }

  return response.json();
}

// Function to fetch all campaigns with pagination
export async function fetchCampaigns(
  limit = 10,
  offset = 0,
): Promise<CampaignListResponse> {
  const baseUrl = getBaseUrl();
  const response = await fetch(
    `${baseUrl}/api/v1/campaigns?limit=${limit}&offset=${offset}`,
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch campaigns');
  }

  return response.json();
}

export async function fetchContributions(
  id: string,
  limit = 10,
  offset = 0,
): Promise<ContributionListResponse> {
  const baseUrl = getBaseUrl();
  const response = await fetch(
    `${baseUrl}/api/v1/campaigns/${id}/contributions?limit=${limit}&offset=${offset}`,
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch contributions');
  }

  return response.json();
}
