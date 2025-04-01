'use client';

import { truncateAddress } from '@/lib/utils';
import { useEnsAvatar, usePrimaryName } from '@justaname.id/react';
import { Contribution } from '@prisma/client';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import { Card, CardContent } from './ui/card';

const ContributorsCard = ({ contribution }: { contribution: Contribution }) => {
  const { primaryName } = usePrimaryName({
    address: contribution.contributorAddress,
  });
  const { avatar } = useEnsAvatar({
    ens: primaryName,
  });

  // Format the contribution date
  const formattedDate = contribution.createdAt
    ? formatDistanceToNow(new Date(contribution.createdAt), { addSuffix: true })
    : '';

  return (
    <Card className="rounded-lg bg-gray-50 border">
      <CardContent className="flex flex-col w-full">
        <div className="flex items-start gap-3 justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {avatar ? (
                <Image
                  src={avatar}
                  alt={
                    primaryName ??
                    truncateAddress(contribution.contributorAddress)
                  }
                  width={32}
                  height={32}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xs text-gray-500">
                  {truncateAddress(contribution.contributorAddress).substring(
                    0,
                    2,
                  )}
                </span>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">
                {primaryName ??
                  truncateAddress(contribution.contributorAddress)}
              </p>
              {formattedDate && (
                <p className="text-xs text-gray-500">{formattedDate}</p>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-gray-800">
              ${contribution.amount.toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContributorsCard;
