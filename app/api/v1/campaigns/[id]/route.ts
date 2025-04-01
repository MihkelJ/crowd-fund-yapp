import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Fetch campaign with its tiers and contributions
    const campaign = await prisma.campaign.findUnique({
      where: {
        id,
      },
      include: {
        tiers: true, // Include all tiers
        contributions: {
          select: {
            id: true,
            amount: true,
            contributorAddress: true,
            tierId: true,
            createdAt: true,
          },
        },
      },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 },
      );
    }

    // Calculate total raised
    const totalRaised = campaign.contributions.reduce(
      (sum, contribution) => sum + contribution.amount,
      0,
    );

    // Count unique contributors
    const uniqueContributors = new Set(
      campaign.contributions.map((c) => c.contributorAddress),
    ).size;

    // Group contributions by tier
    const contributionsByTier = campaign.tiers.map((tier) => {
      const tierContributions = campaign.contributions.filter(
        (c) => c.tierId === tier.id,
      );
      return {
        tierId: tier.id,
        tierTitle: tier.title,
        count: tierContributions.length,
      };
    });

    // Enhance campaign data with stats
    const enhancedCampaign = {
      ...campaign,
      stats: {
        raised: totalRaised,
        percentageRaised:
          campaign.goal > 0 ? (totalRaised / campaign.goal) * 100 : 0,
        backers: uniqueContributors,
        contributionsByTier,
      },
    };

    return NextResponse.json(enhancedCampaign);
  } catch (error) {
    console.error('Error fetching campaign:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch campaign',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
