import {
  getRepoDetails,
  getRepoLanguages,
  getRepoContributors,
  getRepoStargazers,
  getRepoIssuesSummary,
  getRepoEvents,
  getRepoFileCount,
  getRepoStarsTimeline,
  getRepoForksTimeline,
} from "@/lib/github";
import { RepoHeader } from "@/components/repo/repo-header";
import { RepoLanguages } from "@/components/repo/repo-languages";
import { RepoContributors } from "@/components/repo/repo-contributors";
import { RepoStargazers } from "@/components/repo/repo-stargazers";
import { RepoComplexity } from "@/components/repo/repo-complexity";
import { RepoIssuesActivity } from "@/components/repo/repo-issues-activity";
import { RepoStarsForks } from "@/components/repo/repo-stars-forks";
import { BackButton } from "@/components/back-button";
import { notFound } from "next/navigation";

interface RepoPageProps {
  params: {
    owner: string;
    repo: string;
  };
}

export default async function RepoPage({ params }: RepoPageProps) {
  const { owner, repo } = await params;
  const [
    repoDetails,
    languages,
    contributors,
    stargazers,
    issuesSummary,
    events,
    fileCount,
    starsTimeline,
    forksTimeline,
  ] = await Promise.all([
    getRepoDetails(owner, repo),
    getRepoLanguages(owner, repo),
    getRepoContributors(owner, repo),
    getRepoStargazers(owner, repo),
    getRepoIssuesSummary(owner, repo),
    getRepoEvents(owner, repo),
    getRepoFileCount(owner, repo),
    getRepoStarsTimeline(owner, repo),
    getRepoForksTimeline(owner, repo),
  ]);

  if (!repoDetails) {
    notFound();
  }

  const activityCounts = new Map<string, number>();

  events.forEach((event) => {
    if (!event.created_at) {
      return;
    }
    const day = event.created_at.slice(0, 10);
    activityCounts.set(day, (activityCounts.get(day) ?? 0) + 1);
  });

  const activityEntries = Array.from(activityCounts.entries()).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  let activityPeak: { date: string | null; count: number } | null = null;

  activityEntries.forEach(([date, count]) => {
    if (
      !activityPeak ||
      count > activityPeak.count ||
      date > activityPeak.date!
    ) {
      activityPeak = { date, count };
    }
  });

  const mergedStarsForks = (() => {
    const map = new Map<
      string,
      { date: string; stars: number; forks: number }
    >();

    starsTimeline.forEach((point) => {
      const existing = map.get(point.date) ?? {
        date: point.date,
        stars: 0,
        forks: 0,
      };
      existing.stars = point.value;
      map.set(point.date, existing);
    });

    forksTimeline.forEach((point) => {
      const existing = map.get(point.date) ?? {
        date: point.date,
        stars: 0,
        forks: 0,
      };
      existing.forks = point.value;
      map.set(point.date, existing);
    });

    return Array.from(map.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    );
  })();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <BackButton />
      </div>

      <RepoHeader repo={repoDetails} />

      <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <RepoLanguages languages={languages} />
        <RepoContributors contributors={contributors} />
        <RepoStargazers stargazers={stargazers} />
        <RepoComplexity fileCount={fileCount} sizeKb={repoDetails.size} />
        <RepoIssuesActivity
          issuesSummary={issuesSummary}
          activityPeak={activityPeak}
        />
        <RepoStarsForks data={mergedStarsForks} />
      </div>
    </div>
  );
}
