import { getUser, getUserRepos, getUserContributions } from "@/lib/github";
import { CompareView } from "@/components/compare/compare-view";
import { GithubRepo } from "@/types/github";
import {
  calculateLanguageStats,
  calculateConsistency,
  determineProfileType,
  generateInsights,
} from "@/lib/analytics";

interface ComparePageProps {
  searchParams: Promise<{
    user1?: string;
    user2?: string;
  }>;
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const params = await searchParams;
  const user1Name = typeof params.user1 === "string" ? params.user1 : undefined;
  const user2Name = typeof params.user2 === "string" ? params.user2 : undefined;

  let user1Data = null;
  let user2Data = null;
  let user1Repos: GithubRepo[] = [];
  let user2Repos: GithubRepo[] = [];
  let user1Contributions = null;
  let user2Contributions = null;

  let user1Analytics = undefined;
  let user2Analytics = undefined;

  const notFoundUsers: string[] = [];

  if (user1Name && user2Name) {
    const [u1, r1, c1, u2, r2, c2] = await Promise.all([
      getUser(user1Name),
      getUserRepos(user1Name),
      getUserContributions(user1Name),
      getUser(user2Name),
      getUserRepos(user2Name),
      getUserContributions(user2Name),
    ]);
    user1Data = u1;
    user2Data = u2;
    user1Repos = r1;
    user2Repos = r2;
    user1Contributions = c1;
    user2Contributions = c2;

    if (!user1Data) notFoundUsers.push(user1Name);
    if (!user2Data) notFoundUsers.push(user2Name);

    // Process analytics
    if (user1Data) {
      const languages = calculateLanguageStats(r1);
      const consistency = calculateConsistency(c1);
      user1Analytics = {
        languages,
        consistency,
        profile: determineProfileType(languages),
        insights: generateInsights(user1Data, r1, consistency),
      };
    }

    if (user2Data) {
      const languages = calculateLanguageStats(r2);
      const consistency = calculateConsistency(c2);
      user2Analytics = {
        languages,
        consistency,
        profile: determineProfileType(languages),
        insights: generateInsights(user2Data, r2, consistency),
      };
    }
  }

  return (
    <CompareView
      user1Data={user1Data}
      user2Data={user2Data}
      user1Repos={user1Repos}
      user2Repos={user2Repos}
      user1Contributions={user1Contributions}
      user2Contributions={user2Contributions}
      user1Analytics={user1Analytics}
      user2Analytics={user2Analytics}
      notFoundUsers={notFoundUsers.length > 0 ? notFoundUsers : undefined}
    />
  );
}
