import { CampaignActions } from '@/components/CampaignActions';
import CampaignExpandableDescription from '@/components/CampaignExpandableDescription';
import CampaignStatus from '@/components/CampaignStatus';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchCampaign, fetchContributions } from '@/lib/api';
import { AlertCircle, ArrowLeft, Users } from 'lucide-react';
import Link from 'next/link';

export default async function CampaignDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch campaign data server-side
  let campaign;
  let contributions;
  let error;

  try {
    campaign = await fetchCampaign(id);
    contributions = await fetchContributions(id);
    console.log({ contributions, campaign });
  } catch (err) {
    error =
      err instanceof Error ? err : new Error('Failed to load campaign data');
    console.error('Error fetching campaign:', err);
  }

  // Handle error state
  if (error || !campaign) {
    return (
      <Alert variant="destructive" className="max-w-lg mx-auto mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error ? error.message : 'Failed to load campaign data'}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="w-full max-w-lg shadow-lg relative">
      <CardHeader className="flex flex-col items-center text-center">
        <div className="absolute left-6 top-6">
          <Button
            asChild
            variant="outline"
            size="icon"
            className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 shadow-sm"
            aria-label="Go back"
          >
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
        </div>
        {contributions?.contributions?.length &&
          contributions?.contributions?.length > 0 && (
            <div className="absolute right-6 top-6">
              <Button
                asChild
                variant="outline"
                size="icon"
                className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 shadow-sm"
              aria-label="Go back"
            >
              <Link href={`/campaign/${campaign.id}/contributors`}>
                <Users className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        )}

        <div className="mb-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center transition-all bg-purple-100 dark:bg-donation-dark-selected/60 duration-700 delay-100">
            <div className="text-4xl">{campaign.emoji}</div>
          </div>
        </div>

        <CardTitle className="text-xl">{campaign.title}</CardTitle>

        <CampaignExpandableDescription description={campaign.description} />
      </CardHeader>

      <CardContent className="px-6">
        <CampaignStatus campaign={campaign} />

        <div className="grid grid-cols-1 gap-4">
          <CampaignActions tiers={campaign.tiers} campaign={campaign} />
        </div>
      </CardContent>
    </Card>
  );
}

export const dynamicParams = true;
