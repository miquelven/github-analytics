"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Lightbulb,
  Star,
  Users,
  Award,
  Gauge,
  Eye,
  EyeOff,
  TrendingUp,
  Zap,
  GitCommit,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { calculateConsistency, generateInsights } from "@/lib/analytics";

import {
  GithubUser,
  GithubRepo,
  GithubEvent,
  ContributionCalendar,
} from "@/types/github";

interface UserInsightsProps {
  user: GithubUser;
  repos: GithubRepo[];
  events?: GithubEvent[];
  contributions?: ContributionCalendar | null;
}

export function UserInsights({
  user,
  repos,
  events,
  contributions,
}: UserInsightsProps) {
  const { t } = useLanguage();
  const [showDevScore, setShowDevScore] = useState(false);

  const totalStarsFromRepos = repos.reduce(
    (acc, repo) => acc + repo.stargazers_count,
    0
  );
  const totalCommitsLast90Days =
    events?.reduce((acc, event) => {
      if (
        event.type !== "PushEvent" ||
        !event.created_at ||
        !event.payload.commits
      ) {
        return acc;
      }
      const createdAt = new Date(event.created_at);
      const now = new Date();
      const diffDays =
        (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays > 90) {
        return acc;
      }
      return acc + event.payload.commits.length;
    }, 0) ?? 0;

  const activeDaysLast90 =
    contributions?.weeks.reduce((acc, week) => {
      return (
        acc +
          week.contributionDays.filter((day) => {
            const date = new Date(day.date);
            const now = new Date();
            const diffDays =
              (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
            return diffDays <= 90 && day.contributionCount > 0;
          }).length || 0
      );
    }, 0) ?? 0;

  const languages = new Set(repos.map((r) => r.language).filter(Boolean));
  const publicReposCount = repos.filter((r) => !r.private && !r.fork).length;

  const starsScore = Math.min(totalStarsFromRepos / 20, 20);
  const commitsScore = Math.min(totalCommitsLast90Days / 15, 30);
  const frequencyScore = Math.min(activeDaysLast90 / 3, 25);
  const languagesScore = Math.min(languages.size * 3, 15);
  const publicProjectsScore = Math.min(publicReposCount / 2, 10);

  const devScore = Math.round(
    starsScore +
      commitsScore +
      frequencyScore +
      languagesScore +
      publicProjectsScore
  );

  const consistency = calculateConsistency(contributions);
  const automaticInsights = generateInsights(user, repos, consistency);

  const insights = automaticInsights.map((insight) => {
    let icon;
    switch (insight.icon) {
      case "TrendingUp":
        icon = <TrendingUp className="h-4 w-4" />;
        break;
      case "Star":
        icon = <Star className="h-4 w-4" />;
        break;
      case "Zap":
        icon = <Zap className="h-4 w-4" />;
        break;
      case "Award":
        icon = <Award className="h-4 w-4" />;
        break;
      case "Users":
        icon = <Users className="h-4 w-4" />;
        break;
      case "GitCommit":
        icon = <GitCommit className="h-4 w-4" />;
        break;
      default:
        icon = <Star className="h-4 w-4" />;
        break;
    }

    let color = "bg-gray-500/10 text-gray-500 border-gray-500/20";
    if (insight.type === "positive")
      color = "bg-green-500/10 text-green-500 border-green-500/20";
    if (insight.type === "trend")
      color = "bg-blue-500/10 text-blue-500 border-blue-500/20";
    if (insight.titleKey === "veteran")
      color = "bg-amber-500/10 text-amber-500 border-amber-500/20";

    const rawText =
      t.compare.result.insights[
        insight.titleKey as keyof typeof t.compare.result.insights
      ] || "";

    const parts = rawText.split(": ");
    let label = parts.length > 1 ? parts[0] : rawText;
    let description = parts.length > 1 ? parts.slice(1).join(": ") : "";

    if (insight.params) {
      Object.entries(insight.params).forEach(([key, value]) => {
        description = description.replace(`{${key}}`, value.toString());
        label = label.replace(`{${key}}`, value.toString());
      });
    }

    return {
      icon,
      label,
      description,
      color,
    };
  });

  if (insights.length === 0) return null;

  return (
    <div className="grid gap-4 mb-8">
      <Card className="col-span-full">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            {t.user.insights.title}
          </CardTitle>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setShowDevScore((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Gauge className="h-4 w-4 text-primary" />
              <span>Dev Score</span>
              {showDevScore ? (
                <EyeOff className="h-3 w-3" />
              ) : (
                <Eye className="h-3 w-3" />
              )}
            </button>
            <div
              className={`flex items-baseline gap-1 text-right transition-all duration-300 transform ${
                showDevScore
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 -translate-y-1 scale-95 pointer-events-none"
              }`}
            >
              <span className="text-2xl font-bold">{devScore}</span>
              <span className="text-xs text-muted-foreground">/ 100</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 p-3 rounded-lg border ${insight.color}`}
              >
                <div className="mt-0.5">{insight.icon}</div>
                <div>
                  <h4 className="font-semibold text-sm">{insight.label}</h4>
                  <p className="text-xs opacity-90">{insight.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
