import prisma from '@/lib/prisma';
import sdk from '../../../../config/yodl';

const createResponse = (body: unknown, status: number) => {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export async function POST(req: Request) {

  try {
    const { txHash } = await req.json();

    if (!txHash) {
      return createResponse({ error: 'No txHash provided' }, 400);
    }

    const payment = await sdk.getPayment(txHash);

    if (!payment) {
      return createResponse({ error: 'Payment not found' }, 404);
    }

    const campaign = await prisma.campaign.findFirst({
      where: {
        creatorAddress: payment.receiverAddress,
        tiers: {
          some: {
            id: payment.memo,
          },
        },
        contributions: {
          none: {
            transactionHash: txHash,
          },
        },
      },
      include: {
        tiers: true,
      },
    });

    if (!campaign) {
      return createResponse({ error: 'Campaign not found or not valid' }, 404);
    }

    const tier = campaign.tiers.find(
      (tier) => tier.amount === parseFloat(payment.invoiceAmount),
    );

    if (!tier) {
      return createResponse({ error: 'Tier not found or not valid' }, 404);
    }

    await prisma.contribution.create({
      data: {
        campaignId: campaign.id,
        tierId: tier.id,
        amount: parseFloat(payment.invoiceAmount),
        contributorAddress: payment.senderAddress,
        transactionHash: txHash,
      },
    });

    const updatedCampaign = await prisma.campaign.findUnique({
      where: { id: campaign.id },
      include: {
        tiers: true,
      },
    });

    return createResponse(updatedCampaign, 200);
  } catch (error) {
    console.error(error);
    return createResponse({ error: 'Internal server error' }, 500);
  }
}
