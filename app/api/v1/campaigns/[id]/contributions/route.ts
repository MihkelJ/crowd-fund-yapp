import prisma from '@/lib/prisma';
import { Contribution } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Check if the campaign exists
    const campaignExists = await prisma.campaign.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!campaignExists) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 },
      );
    }

    // Get total count of contributions
    const total = await prisma.contribution.count({
      where: { campaignId: id },
    });

    // Fetch contributions with related tier information
    const contributions = await prisma.contribution.findMany({
      where: { campaignId: id },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
      include: {
        tier: {
          select: {
            id: true,
            title: true,
            emoji: true,
          },
        },
      },
    });

    return NextResponse.json({
      contributions,
      meta: {
        total,
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error('Error fetching contributions:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch contributions',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

export type ContributionListResponse = {
  contributions: Contribution[];
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
};

export const dynamicParams = true;
