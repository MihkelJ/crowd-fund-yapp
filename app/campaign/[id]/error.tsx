'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { useEffect } from 'react';

export default function CampaignError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Campaign page error:', error);
  }, [error]);

  return (
    <Alert variant="destructive" className="max-w-lg mx-auto">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Something went wrong</AlertTitle>
      <AlertDescription>
        <p className="mb-4">{error.message || 'Failed to load campaign'}</p>
        <Button onClick={reset} variant="outline" size="sm">
          Try again
        </Button>
      </AlertDescription>
    </Alert>
  );
}
