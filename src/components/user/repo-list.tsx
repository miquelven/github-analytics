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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, GitFork, Calendar, Zap, TrendingUp, Clock, Code } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";

import { GithubRepo } from "@/types/github";

interface RepoListProps {
  repos: GithubRepo[];
}

type SortOption = "impact" | "growth" | "activity" | "tech";

export function RepoList({ repos }: RepoListProps) {
  const { t } = useLanguage();
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("impact");
  const [selectedTech, setSelectedTech] = useState<string>("all");

  const languages = Array.from(
    new Set(repos.map((r) => r.language).filter(Boolean))
  ).sort() as string[];

  const getSortedRepos = () => {
    let filtered = repos.filter((repo) =>
      repo.name.toLowerCase().includes(filter.toLowerCase())
    );

    if (sortBy === "tech" && selectedTech !== "all") {
      filtered = filtered.filter((repo) => repo.language === selectedTech);
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "impact":
          // Impact score: Stars * 2 + Forks
          const impactA = a.stargazers_count * 2 + a.forks_count;
          const impactB = b.stargazers_count * 2 + b.forks_count;
          return impactB - impactA;
        case "growth":
          // Growth: Stars / Age in days
          const ageA = Math.max(
            1,
            differenceInDays(new Date(), new Date(a.created_at))
          );
          const ageB = Math.max(
            1,
            differenceInDays(new Date(), new Date(b.created_at))
          );
          const growthA = a.stargazers_count / ageA;
          const growthB = b.stargazers_count / ageB;
          return growthB - growthA;
        case "activity":
          return (
            new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()
          );
        case "tech":
          // Sort by language name, then stars
          const langCompare = (a.language || "").localeCompare(
            b.language || ""
          );
          if (langCompare !== 0) return langCompare;
          return b.stargazers_count - a.stargazers_count;
        default:
          return 0;
      }
    });
  };

  const sortedRepos = getSortedRepos();

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle>{t.user.repos.title}</CardTitle>
            <CardDescription>{t.user.repos.subtitle}</CardDescription>
          </div>
          <div className="w-full md:w-auto">
            <Tabs
              value={sortBy}
              onValueChange={(v) => {
                setSortBy(v as SortOption);
                if (v !== "tech") setSelectedTech("all");
              }}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="impact" title={t.user.repos.sort.impact}>
                  <Zap className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">
                    {t.user.repos.sort.impact}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="growth" title={t.user.repos.sort.growth}>
                  <TrendingUp className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">
                    {t.user.repos.sort.growth}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="activity"
                  title={t.user.repos.sort.activity}
                >
                  <Clock className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">
                    {t.user.repos.sort.activity}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="tech" title={t.user.repos.sort.tech}>
                  <Code className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">
                    {t.user.repos.sort.tech}
                  </span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
          <div className="pt-4 space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder={t.user.repos.filter}
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>

          {sortBy === "tech" && (
            <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2">
              <Badge
                variant={selectedTech === "all" ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/90"
                onClick={() => setSelectedTech("all")}
              >
                {t.user.repos.allTechs}
              </Badge>
              {languages.map((lang) => (
                <Badge
                  key={lang}
                  variant={selectedTech === lang ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/90"
                  onClick={() => setSelectedTech(lang)}
                >
                  {lang}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          {sortedRepos.map((repo) => (
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
                <Badge
                  variant={repo.private ? "secondary" : "outline"}
                  className="shrink-0"
                >
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
          {sortedRepos.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              {t.user.repos.noResults}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
