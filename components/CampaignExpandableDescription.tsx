'use client';

import { cn } from '@/lib/utils';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const CampaignExpandableDescription = ({
  description,
}: {
  description: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative w-full">
      <div
        className={cn(
          'text-sm text-muted-foreground text-left w-full prose prose-sm dark:prose-invert max-w-none relative',
          isExpanded ? 'max-h-[1000px]' : 'max-h-[100px] overflow-hidden',
        )}
      >
        <ReactMarkdown
          components={{
            ul: (props) => <ul className="list-disc pl-5 my-2" {...props} />,
            ol: (props) => <ol className="list-decimal pl-5 my-2" {...props} />,
            li: (props) => <li className="mb-1" {...props} />,
          }}
        >
          {description}
        </ReactMarkdown>

        {!isExpanded && (
          <div className="w-full h-12 bg-gradient-to-t from-background to-transparent absolute bottom-0 left-0 pointer-events-none" />
        )}
      </div>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-xs text-purple-600 dark:text-purple-400 mt-2 hover:underline"
      >
        {isExpanded ? 'Show less' : 'Read more'}
      </button>
    </div>
  );
};

export default CampaignExpandableDescription;
