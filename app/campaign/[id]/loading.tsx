import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function CampaignLoading() {
  return (
    <Card className="w-full max-w-lg shadow-lg">
      <CardHeader className="flex flex-col items-center text-center">
        <div className="mb-4">
          <Skeleton className="w-16 h-16 rounded-2xl" />
        </div>
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>

      <CardContent className="px-6">
        <div className="w-full mb-4">
          <div className="flex justify-between mb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-2.5 w-full rounded-full" />
          <div className="flex justify-between mt-2">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-lg" />
          ))}
        </div>
      </CardContent>

      <CardFooter>
        <Skeleton className="h-12 w-full" />
      </CardFooter>
    </Card>
  );
}
