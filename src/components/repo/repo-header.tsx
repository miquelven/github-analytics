"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GitFork, Star, Eye, Scale, Calendar } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/language-context";
import { GithubRepo } from "@/types/github";

interface RepoHeaderProps {
  repo: GithubRepo;
}

export function RepoHeader({ repo }: RepoHeaderProps) {
  const { t } = useLanguage();

  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Link
                  href={`/user/${repo.owner.login}`}
                  className="text-muted-foreground hover:underline"
                >
                  {repo.owner.login}
                </Link>
                <span className="text-muted-foreground">/</span>
                <h1 className="text-2xl font-bold">{repo.name}</h1>
                <Badge variant={repo.private ? "secondary" : "outline"}>
                  {repo.private ? t.user.repos.private : t.user.repos.public}
                </Badge>
              </div>
              <p className="text-muted-foreground mb-4 max-w-2xl">
                {repo.description || t.user.repos.noDescription}
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {repo.license && (
                  <div className="flex items-center gap-1">
                    <Scale className="h-4 w-4" />
                    {repo.license.name}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {t.repo.updated}{" "}
                  {format(new Date(repo.updated_at), "MMM d, yyyy")}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {t.repo.created}{" "}
                  {format(new Date(repo.created_at), "MMM d, yyyy")}
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <Link href={repo.html_url} target="_blank">
                <Button>{t.repo.viewOnGithub}</Button>
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 pt-4 border-t mt-2">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="font-bold text-lg">
                {repo.stargazers_count.toLocaleString()}
              </span>{" "}
              {t.repo.stars.toLowerCase()}
            </div>
            <div className="flex items-center gap-2">
              <GitFork className="h-5 w-5 text-blue-500" />
              <span className="font-bold text-lg">
                {repo.forks_count.toLocaleString()}
              </span>{" "}
              {t.repo.forks.toLowerCase()}
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-green-500" />
              <span className="font-bold text-lg">
                {(repo.subscribers_count || 0).toLocaleString()}
              </span>{" "}
              {t.repo.watchers.toLowerCase()}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg">
                {repo.open_issues_count.toLocaleString()}
              </span>{" "}
              {t.repo.openIssues.toLowerCase()}
            </div>
          </div>
          <div className="md:hidden w-full">
            <Link href={repo.html_url} target="_blank" className="w-full">
              <Button className="w-full">{t.repo.viewOnGithub}</Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
