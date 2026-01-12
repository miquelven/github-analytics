"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Lightbulb,
  Star,
  Calendar,
  Code,
  Users,
  Award,
  Clock,
} from "lucide-react";
import { differenceInYears, parseISO } from "date-fns";
import { useLanguage } from "@/contexts/language-context";

import { GithubUser, GithubRepo } from "@/types/github";

interface UserInsightsProps {
  user: GithubUser;
  repos: GithubRepo[];
}

export function UserInsights({ user, repos }: UserInsightsProps) {
  const { t } = useLanguage();
  const insights = [];

  const accountAge = differenceInYears(new Date(), parseISO(user.created_at));
  if (accountAge >= 5) {
    insights.push({
      icon: <Clock className="h-4 w-4" />,
      label: t.user.insights.veteran,
      description: t.user.insights.veteranDesc.replace(
        "{years}",
        accountAge.toString()
      ),
      color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    });
  } else if (accountAge < 1) {
    insights.push({
      icon: <Award className="h-4 w-4" />,
      label: t.user.insights.newcomer,
      description: t.user.insights.newcomerDesc,
      color: "bg-green-500/10 text-green-500 border-green-500/20",
    });
  }

  if (user.followers > 1000) {
    insights.push({
      icon: <Users className="h-4 w-4" />,
      label: t.user.insights.influencer,
      description: t.user.insights.influencerDesc,
      color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    });
  } else if (user.followers > 100) {
    insights.push({
      icon: <Users className="h-4 w-4" />,
      label: t.user.insights.risingStar,
      description: t.user.insights.risingStarDesc,
      color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    });
  }

  const totalStars = repos.reduce(
    (acc, repo) => acc + repo.stargazers_count,
    0
  );
  if (totalStars > 500) {
    insights.push({
      icon: <Star className="h-4 w-4" />,
      label: t.user.insights.starHunter,
      description: t.user.insights.starHunterDesc.replace(
        "{stars}",
        totalStars.toString()
      ),
      color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    });
  }

  const languages = new Set(repos.map((r) => r.language).filter(Boolean));
  if (languages.size > 5) {
    insights.push({
      icon: <Code className="h-4 w-4" />,
      label: t.user.insights.polyglot,
      description: t.user.insights.polyglotDesc.replace(
        "{count}",
        languages.size.toString()
      ),
      color: "bg-pink-500/10 text-pink-500 border-pink-500/20",
    });
  }

  if (user.public_repos > 50) {
    insights.push({
      icon: <Calendar className="h-4 w-4" />,
      label: t.user.insights.prolific,
      description: t.user.insights.prolificDesc.replace(
        "{count}",
        user.public_repos.toString()
      ),
      color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    });
  }

  const langCounts: Record<string, number> = {};
  repos.forEach((r) => {
    if (r.language) langCounts[r.language] = (langCounts[r.language] || 0) + 1;
  });
  const topLang = Object.entries(langCounts).sort((a, b) => b[1] - a[1])[0];
  if (topLang && topLang[1] > 5) {
    insights.push({
      icon: <Code className="h-4 w-4" />,
      label: t.user.insights.specialist.replace("{lang}", topLang[0]),
      description: t.user.insights.specialistDesc.replace("{lang}", topLang[0]),
      color: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
    });
  }

  if (insights.length === 0) return null;

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          {t.user.insights.title}
        </CardTitle>
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
  );
}
