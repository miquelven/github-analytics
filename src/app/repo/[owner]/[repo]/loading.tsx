import { RepoCardSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
        <div className="space-y-4">
             <div className="h-8 w-48 bg-muted rounded animate-pulse" />
             <div className="h-4 w-96 bg-muted rounded animate-pulse" />
        </div>
        <RepoCardSkeleton />
    </div>
  );
}
