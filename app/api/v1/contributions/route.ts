import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Schema for contribution validation
const ContributionSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  contributorAddress: z.string().min(1, 'Contributor address is required'),
  campaignId: z.string().uuid('Invalid campaign ID'),
  tierId: z.string().uuid('Invalid tier ID').optional(),
  message: z.string().max(500, 'Message is too long').optional(),
  transactionHash: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate the request body
    const validationResult = ContributionSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.format(),
        },
        { status: 400 },
      );
    }

    const { amount, contributorAddress, campaignId, tierId, transactionHash } =
      validationResult.data;

    // Check if the campaign exists
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: { tiers: true },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 },
      );
    }

    // If a tierId is provided, verify it belongs to the campaign
    if (tierId) {
      const tierExists = campaign.tiers.some((tier) => tier.id === tierId);
      if (!tierExists) {
        return NextResponse.json(
          { error: 'Tier does not belong to this campaign' },
          { status: 400 },
        );
      }
    }

    // Create the contribution
    const contribution = await prisma.contribution.create({
      data: {
        amount,
        contributorAddress,
        tierId,
        transactionHash,
        campaignId,
      },
    });

    return NextResponse.json(
      { success: true, data: contribution },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating contribution:', error);
    return NextResponse.json(
      {
        error: 'Failed to create contribution',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
