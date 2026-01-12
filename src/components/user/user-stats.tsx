"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Star, GitFork, Eye } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

import { GithubUser, GithubRepo } from "@/types/github";

interface UserStatsProps {
  user: GithubUser;
  repos: GithubRepo[];
}

export function UserStats({ user, repos }: UserStatsProps) {
  const { t } = useLanguage();
  const totalStars = repos.reduce(
    (acc, repo) => acc + repo.stargazers_count,
    0
  );
  const totalForks = repos.reduce((acc, repo) => acc + repo.forks_count, 0);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t.user.publicRepos}
          </CardTitle>
          <Book className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{user.public_repos}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t.user.stats.stars}
          </CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalStars}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t.user.stats.forks}
          </CardTitle>
          <GitFork className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalForks}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t.user.publicGists}
          </CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{user.public_gists}</div>
        </CardContent>
      </Card>
    </div>
  );
}
