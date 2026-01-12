import {
  getRepoDetails,
  getRepoLanguages,
  getRepoContributors,
  getRepoStargazers,
} from "@/lib/github";
import { RepoHeader } from "@/components/repo/repo-header";
import { RepoLanguages } from "@/components/repo/repo-languages";
import { RepoContributors } from "@/components/repo/repo-contributors";
import { RepoStargazers } from "@/components/repo/repo-stargazers";
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
  const [repoDetails, languages, contributors, stargazers] = await Promise.all([
    getRepoDetails(owner, repo),
    getRepoLanguages(owner, repo),
    getRepoContributors(owner, repo),
    getRepoStargazers(owner, repo),
  ]);

  if (!repoDetails) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <BackButton />
      </div>

      <RepoHeader repo={repoDetails} />

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <RepoLanguages languages={languages} />
        <RepoContributors contributors={contributors} />
        <RepoStargazers stargazers={stargazers} />
      </div>
    </div>
  );
}
