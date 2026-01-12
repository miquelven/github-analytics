"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Star, GitFork, Calendar } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";

import { GithubRepo } from "@/types/github";

interface RepoListProps {
  repos: GithubRepo[];
}

export function RepoList({ repos }: RepoListProps) {
  const { t } = useLanguage();
  const [filter, setFilter] = useState("");

  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>{t.user.repos.title}</CardTitle>
        <CardDescription>{t.user.repos.subtitle}</CardDescription>
        <div className="pt-4">
          <Input
            placeholder={t.user.repos.filter}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          {filteredRepos.map((repo) => (
            <div
              key={repo.id}
              className="flex flex-col space-y-2 rounded-lg border p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <Link
                  href={repo.html_url}
                  target="_blank"
                  className="font-semibold hover:underline text-primary truncate min-w-0"
                >
                  {repo.name}
                </Link>
                <Badge variant={repo.private ? "secondary" : "outline"} className="shrink-0">
                  {repo.private ? t.user.repos.private : t.user.repos.public}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {repo.description || t.user.repos.noDescription}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {repo.language && (
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    {repo.language}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  {repo.stargazers_count}
                </div>
                <div className="flex items-center gap-1">
                  <GitFork className="h-3 w-3" />
                  {repo.forks_count}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {t.repo.updated}{" "}
                  {format(new Date(repo.updated_at), "MMM d, yyyy")}
                </div>
              </div>
            </div>
          ))}
          {filteredRepos.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              {t.user.repos.noResults}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
