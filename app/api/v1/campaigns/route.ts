import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Schema for campaign creation payload validation
const TierSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  amount: z.string().refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    },
    { message: 'Amount must be a positive number' },
  ),
  emoji: z.string().min(1, 'Emoji is required'),
  perk: z.string().min(1, 'Perk is required'),
});

const CampaignSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  goal: z.string().refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    },
    { message: 'Goal must be a positive number' },
  ),
  endDate: z.string().optional(),
  creatorAddress: z.string().min(1, 'Creator address is required'),
  emoji: z.string().min(1, 'Emoji is required').default('🚀'),
  tiers: z.array(TierSchema),
});

// GET endpoint to fetch all campaigns
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get total count for pagination
    const total = await prisma.campaign.count();

    // Fetch campaigns with tiers, ordered by creation date (newest first)
    const campaigns = await prisma.campaign.findMany({
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        tiers: true,
        contributions: {
          select: {
            amount: true,
            contributorAddress: true,
            tierId: true,
          },
        },
      },
    });

    // Calculate stats for each campaign to match CampaignWithStats interface
    const campaignsWithStats = campaigns.map((campaign) => {
      // Calculate total raised
      const raised = campaign.contributions.reduce(
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

      // Create a short tagline from description if not present
      const tagline =
        campaign.description.length > 100
          ? campaign.description.substring(0, 100) + '...'
          : campaign.description;

      return {
        ...campaign,
        tagline,
        stats: {
          raised,
          percentageRaised:
            campaign.goal > 0 ? (raised / campaign.goal) * 100 : 0,
          backers: uniqueContributors,
          contributionsByTier,
        },
      };
    });

    return NextResponse.json({
      campaigns: campaignsWithStats,
      meta: {
        total,
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch campaigns',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();

    // Validate the request body against our schema
    const validationResult = CampaignSchema.safeParse(body);

    if (!validationResult.success) {
      // Return validation errors
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.format(),
        },
        { status: 400 },
      );
    }

    const { title, description, goal, endDate, creatorAddress, tiers, emoji } =
      validationResult.data;

    // Create the campaign with tiers in a transaction
    const campaign = await prisma.$transaction(async (tx) => {
      // Create the campaign
      const campaign = await tx.campaign.create({
        data: {
          title,
          description,
          goal: parseFloat(goal),
          endDate: endDate ? new Date(endDate) : null,
          creatorAddress,
          emoji,
        },
      });

      // Create the tiers associated with this campaign
      await Promise.all(
        tiers.map((tier) =>
          tx.tier.create({
            data: {
              title: tier.title,
              description: tier.description,
              amount: parseFloat(tier.amount),
              emoji: tier.emoji,
              perk: tier.perk,
              campaignId: campaign.id,
            },
          }),
        ),
      );

      return campaign;
    });

    return NextResponse.json(
      { success: true, data: campaign },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json(
      {
        error: 'Failed to create campaign',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
