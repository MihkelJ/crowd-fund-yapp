'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CampaignWithStats } from '@/lib/api';
import { truncateAddress } from '@/lib/utils';
import { usePrimaryName } from '@justaname.id/react';
import { formatDistanceToNow, isPast } from 'date-fns';
import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';

interface CampaignCardProps {
  campaign: CampaignWithStats;
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const { primaryName } = usePrimaryName({
    address: campaign.creatorAddress,
  });

  const dateString = useMemo(() => {
    const endDate = campaign.endDate ? new Date(campaign.endDate) : null;

    if (!endDate) {
      return '∞ days left';
    }

    if (isPast(endDate)) {
      return 'Ended';
    }

    return `${formatDistanceToNow(endDate, { addSuffix: true })}`;
  }, [campaign.endDate]);

  return (
    <Card className="cursor-pointer border hover:shadow-lg transition-all duration-300">
      <CardContent>
        <div className="flex items-start space-x-3">
          <div className="rounded-lg bg-purple-100 dark:bg-donation-dark-selected/60 flex items-center justify-center size-8">
            {campaign.emoji}
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900 dark:text-donation-dark-text mb-2 prose prose-sm max-w-none">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <h3>{children}</h3>,
                  ul: (props) => (
                    <ul className="list-disc pl-4 my-1" {...props} />
                  ),
                  ol: (props) => (
                    <ol className="list-decimal pl-4 my-1" {...props} />
                  ),
                  li: (props) => <li className="mb-0.5" {...props} />,
                }}
              >
                {campaign.title}
              </ReactMarkdown>
            </div>
            <div className="text-sm text-gray-600 dark:text-donation-dark-text-secondary mb-4 prose prose-sm max-w-none line-clamp-4">
              <ReactMarkdown
                components={{
                  ul: (props) => (
                    <ul className="list-disc pl-4 my-1" {...props} />
                  ),
                  ol: (props) => (
                    <ol className="list-decimal pl-4 my-1" {...props} />
                  ),
                  li: (props) => <li className="mb-0.5" {...props} />,
                }}
              >
                {campaign.description}
              </ReactMarkdown>
            </div>

            <div className="mt-4 mb-4">
              <div className="flex justify-between text-xs">
                <span className="text-gray-700 dark:text-donation-dark-text-secondary font-medium">
                  ${campaign.stats.raised.toLocaleString()} raised
                </span>
                <span className="text-gray-600 dark:text-donation-dark-gray-light">
                  ${campaign.goal.toLocaleString()} goal
                </span>
              </div>
              <Progress
                value={(campaign.stats.raised / campaign.goal) * 100}
                className="h-2 mt-1 bg-gray-100 dark:bg-donation-dark-gray rounded-full"
              />
            </div>

            <div className="flex justify-between items-center mt-4">
              <span className="text-xs text-gray-500 dark:text-donation-dark-gray-light">
                by {primaryName ?? truncateAddress(campaign.creatorAddress)}
              </span>
              <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                {dateString}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
