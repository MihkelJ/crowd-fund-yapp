import ContributorsCard from '@/components/contributorsCard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchCampaign, fetchContributions } from '@/lib/api';
import { AlertCircle, ArrowLeft } from 'lucide-react';
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
            <Link href={`/campaign/${campaign.id}`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
        </div>

        <div className="mb-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center transition-all bg-purple-100 dark:bg-donation-dark-selected/60 duration-700 delay-100">
            <div className="text-4xl">{campaign.emoji}</div>
          </div>
        </div>

        <CardTitle className="text-xl">{campaign.title}</CardTitle>
      </CardHeader>

      <CardContent className="px-6 gap-4 flex flex-col">
        {contributions?.contributions.map((contribution) => (
          <ContributorsCard key={contribution.id} contribution={contribution} />
        ))}
      </CardContent>
    </Card>
  );
}

export const dynamicParams = true;
