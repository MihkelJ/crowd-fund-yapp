'use client';

import { RewardCard } from '@/components/RewardCard';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import { Campaign, Tier } from '@prisma/client';
import YappSDK from '@yodlpay/yapp-sdk';
import { useState } from 'react';

interface CampaignActionsProps {
  tiers: Tier[];
  campaign: Campaign;
}

export function CampaignActions({ tiers, campaign }: CampaignActionsProps) {
  const [selectedReward, setSelectedReward] = useState<Tier | null>(null);

  const handlePayment = () => {
    const sdk = new YappSDK();

    if (!selectedReward) return;

    sdk.requestPayment(campaign.creatorAddress, {
      amount: selectedReward.amount,
      currency: 'USD',
      redirectUrl: `${window.location.origin}/campaign/${campaign.id}`,
      memo: selectedReward.id,
    });
  };

  return (
    <>
      {/* Display reward tiers */}
      {tiers.map((tier) => (
        <RewardCard
          key={tier.id}
          reward={{ ...tier }}
          selected={selectedReward === tier}
          onClick={() => setSelectedReward(tier)}
        />
      ))}

      {/* Payment button */}
      <CardFooter className="p-0 mt-4">
        <Button
          className="w-full"
          disabled={!selectedReward}
          variant="purple"
          size="lg"
          onClick={handlePayment}
        >
          Contribute ${selectedReward?.amount || 0} with Yodl
        </Button>
      </CardFooter>
    </>
  );
}
