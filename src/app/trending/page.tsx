import { searchRepos, searchUsers } from "@/lib/github";
import { TrendingView } from "@/components/trending/trending-view";

export const dynamic = "force-dynamic";

export default async function TrendingPage() {
  const [topRepos, topUsers] = await Promise.all([
    searchRepos("stars:>1000", "stars", "desc"),
    searchUsers("followers:>1000", "followers", "desc"),
  ]);

  return <TrendingView topRepos={topRepos} topUsers={topUsers} />;
}
