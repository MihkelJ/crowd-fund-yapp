import React from 'react';
import { cn } from '@/lib/utils';
import { Pencil, Computer, Leaf, HandHeart } from 'lucide-react';

interface CampaignIconProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'education' | 'technology' | 'environment' | 'community' | 'custom';
  size?: 'sm' | 'md' | 'lg';
  customIcon?: React.ReactNode;
}

const CampaignIcon = ({
  type = 'community',
  size = 'md',
  customIcon,
  className,
  ...props
}: CampaignIconProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const getIcon = () => {
    if (customIcon) return customIcon;

    switch (type) {
      case 'education':
        return (
          <Pencil
            className={cn(
              iconSizeClasses[size],
              'text-purple-600 dark:text-purple-300',
            )}
          />
        );
      case 'technology':
        return (
          <Computer
            className={cn(
              iconSizeClasses[size],
              'text-purple-600 dark:text-purple-300',
            )}
          />
        );
      case 'environment':
        return (
          <Leaf
            className={cn(
              iconSizeClasses[size],
              'text-purple-600 dark:text-purple-300',
            )}
          />
        );
      case 'community':
      default:
        return (
          <HandHeart
            className={cn(
              iconSizeClasses[size],
              'text-purple-600 dark:text-purple-300',
            )}
          />
        );
    }
  };

  return (
    <div
      className={cn(
        sizeClasses[size],
        'rounded-lg bg-purple-100 dark:bg-donation-dark-selected/60 flex items-center justify-center',
        className,
      )}
      {...props}
    >
      {getIcon()}
    </div>
  );
};

export { CampaignIcon };
