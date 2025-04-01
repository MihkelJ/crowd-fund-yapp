'use client';

import { cn } from '@/lib/utils';
import { Card, CardContent } from './ui/card';
import ReactMarkdown from 'react-markdown';

type Reward = {
  amount: number;
  title: string;
  description: string;
  perk?: string;
  emoji?: string;
};

export const RewardCard = ({
  reward,
  selected,
  onClick,
}: {
  reward: Reward;
  selected: boolean;
  onClick?: (amount: number) => void;
}) => {
  return (
    <Card
      className={cn(
        'rounded-lg bg-gray-50 border transition-all duration-200 hover:shadow-lg cursor-pointer',
        selected &&
          'bg-purple-50 dark:bg-[#2A1A5E] border-[#4016ad] dark:border-[#8968e2]',
      )}
      onClick={() => onClick?.(reward.amount)}
    >
      <CardContent className="flex flex-col w-full">
        <div className="flex items-start gap-2">
          <RoundedSelected selected={selected} className="mt-3" />
          <div className="w-full">
            <div className="flex items-center justify-between">
              <p className="text-xl font-bold text-gray-800">
                ${reward.amount}
              </p>
              {reward.emoji && <span className="text-xl">{reward.emoji}</span>}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-gray-700">
                {reward.title}
              </p>
            </div>
            <div className="text-xs mt-1 font-medium leading-tight text-gray-700 prose prose-xs max-w-none">
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
                {reward.description}
              </ReactMarkdown>
            </div>
            {reward.perk && (
              <div className="mt-2 pl-2 border-l-2 border-gray-300 italic text-xs text-gray-600 prose prose-xs max-w-none">
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
                  {reward.perk}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const RoundedSelected = ({
  selected,
  className,
}: {
  selected: boolean;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0',
        selected
          ? 'border-[#4016ad] dark:border-[#8968e2] bg-purple-50 dark:bg-[#2A1A5E]'
          : 'border-gray-300 dark:border-donation-dark-gray-medium',
        className,
      )}
    >
      {selected && (
        <div className="w-2.5 h-2.5 bg-[#4016ad] dark:bg-[#8968e2] rounded-full"></div>
      )}
    </div>
  );
};
