'use client';

import { CampaignWithStats, fetchCampaign } from '@/lib/api';
import { truncateAddress } from '@/lib/utils';
import { usePrimaryName } from '@justaname.id/react';
import { useQuery } from '@tanstack/react-query';
import YappSDK from '@yodlpay/yapp-sdk';
import { formatDistanceToNow, isPast } from 'date-fns';
import { Progress } from './ui/progress';

const sdk = new YappSDK();

const CampaignStatus = ({ campaign }: { campaign: CampaignWithStats }) => {
  const { primaryName } = usePrimaryName({
    address: campaign.creatorAddress,
  });

  const { data: newCampaign } = useQuery({
    queryKey: ['campaign', campaign.id],
    enabled: !!sdk.parsePaymentFromUrl()?.txHash,
    queryFn: async () => {
      const { txHash } = sdk.parsePaymentFromUrl();
      if (!txHash) return;

      const callback = await fetch('/api/v1/callback', {
        method: 'POST',
        body: JSON.stringify({ txHash }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!callback.ok) {
        throw new Error('Failed to update campaign');
      }

      const updated = await fetchCampaign(campaign.id);

      return updated;
    },
    retry: false,
  });

  const displayCampaign = newCampaign || campaign;

  return (
    <div className="w-full mb-4 transition-all duration-700 delay-250">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-gray-700 dark:text-donation-dark-text-secondary font-medium">
          ${displayCampaign.stats.raised.toLocaleString()} raised
        </span>
        <span className="text-sm text-gray-600 dark:text-donation-dark-gray-light">
          ${displayCampaign.goal.toLocaleString()} goal
        </span>
      </div>
      <Progress
        value={displayCampaign.stats.percentageRaised}
        className="h-2.5 bg-gray-100 dark:bg-donation-dark-gray rounded-full"
      />

      <div className="flex justify-between mt-2">
        <span className="text-xs text-gray-500 dark:text-donation-dark-gray-light">
          by {primaryName ?? truncateAddress(campaign.creatorAddress)}
        </span>
        <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
          {displayCampaign.endDate
            ? (() => {
                const endDate = new Date(displayCampaign.endDate);
                if (isPast(endDate)) {
                  return 'Ended';
                }

                return `${formatDistanceToNow(endDate)} left`;
              })()
            : '∞ days left'}
        </span>
      </div>
    </div>
  );
};

export default CampaignStatus;
