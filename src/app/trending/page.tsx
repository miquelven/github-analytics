import { searchRepos, searchUsers } from "@/lib/github";
import { TrendingView } from "@/components/trending/trending-view";

export const dynamic = "force-dynamic";

export default async function TrendingPage() {
  // Fetch top JS/TS/React related repos and users as a default "Trending" view
  // In a real app we might cache this or allow filtering
  const [topRepos, topUsers] = await Promise.all([
    searchRepos("stars:>1000", "stars", "desc"),
    searchUsers("followers:>1000", "followers", "desc"),
  ]);

  return <TrendingView topRepos={topRepos} topUsers={topUsers} />;
}
