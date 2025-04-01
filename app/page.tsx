export const dynamic = 'force-dynamic';

import { CampaignCard } from '@/components/CampaignCard';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { fetchCampaigns } from '@/lib/api';
import { HandHeart } from 'lucide-react';
import Link from 'next/link';

export default async function Home() {
  const response = await fetchCampaigns();

  return (
    <Card className="w-full max-w-lg shadow-lg rounded-3xl">
      <CardHeader className="flex flex-col items-center text-center">
        <div className="mb-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center transition-all bg-purple-100 dark:bg-donation-dark-selected/60 duration-700 delay-100">
            <HandHeart className="w-8 h-8 text-purple-600 dark:text-purple-300" />
          </div>
        </div>

        <CardTitle className="text-xl">Active Campaigns</CardTitle>
        <CardDescription>
          Support innovative projects and make a difference
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6">
        <div className="grid grid-cols-1 gap-4">
          {response.campaigns.length > 0 ? (
            response.campaigns.map((campaign) => (
              <Link
                href={`/campaign/${campaign.id}`}
                key={campaign.id}
                passHref
              >
                <CampaignCard campaign={campaign} />
              </Link>
            ))
          ) : (
            <p className="text-center py-4 text-gray-500">
              No active campaigns found
            </p>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Link href="/start-campaign" className="w-full">
          <Button className="w-full">Start Your Campaign</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
