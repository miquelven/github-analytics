"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  GitCommit,
  GitPullRequest,
  Star,
  MessageSquare,
  Activity,
  CalendarDays,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";
import { ActivityCalendar } from "react-activity-calendar";
import { useTheme } from "next-themes";
import { GithubEvent, ContributionCalendar } from "@/types/github";

interface UserActivityProps {
  events: GithubEvent[];
  contributions?: ContributionCalendar | null;
}

export function UserActivity({ events, contributions }: UserActivityProps) {
  const { t } = useLanguage();
  const { theme } = useTheme();

  if (!events || events.length === 0) {
    return null;
  }

  const transformContributionData = () => {
    if (!contributions) return [];

    const data: { date: string; count: number; level: number }[] = [];

    contributions.weeks.forEach((week) => {
      week.contributionDays.forEach((day) => {
        let level = 0;
        if (day.contributionCount > 0) level = 1;
        if (day.contributionCount >= 3) level = 2;
        if (day.contributionCount >= 6) level = 3;
        if (day.contributionCount >= 10) level = 4;

        data.push({
          date: day.date,
          count: day.contributionCount,
          level,
        });
      });
    });

    return data;
  };

  const heatmapData = transformContributionData();

  const getEventIcon = (type: string | null) => {
    switch (type) {
      case "PushEvent":
        return <GitCommit className="h-4 w-4 text-blue-500" />;
      case "PullRequestEvent":
        return <GitPullRequest className="h-4 w-4 text-purple-500" />;
      case "WatchEvent":
        return <Star className="h-4 w-4 text-yellow-500" />;
      case "IssuesEvent":
      case "IssueCommentEvent":
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getEventDescription = (event: GithubEvent) => {
    const repoLink = (
      <Link
        href={`/repo/${event.repo.name}`}
        className="font-semibold hover:underline"
      >
        {event.repo.name}
      </Link>
    );

    switch (event.type) {
      case "PushEvent":
        return (
          <span>
            {t.user.activity.pushedTo}{" "}
            {event.payload.ref?.replace("refs/heads/", "")} {t.user.activity.at}{" "}
            {repoLink}
          </span>
        );
      case "PullRequestEvent":
        return (
          <span>
            {event.payload.action} {t.user.activity.pr} {repoLink}
          </span>
        );
      case "WatchEvent":
        return (
          <span>
            {t.user.activity.starred} {repoLink}
          </span>
        );
      case "IssuesEvent":
        return (
          <span>
            {event.payload.action} {t.user.activity.issue} {repoLink}
          </span>
        );
      case "CreateEvent":
        return (
          <span>
            {t.user.activity.created} {event.payload.ref_type}{" "}
            {event.payload.ref || ""} {t.user.activity.in} {repoLink}
          </span>
        );
      case "ForkEvent":
        return (
          <span>
            {t.user.activity.forked} {repoLink}
          </span>
        );
      default:
        return (
          <span>
            {event.type} {t.user.activity.on} {repoLink}
          </span>
        );
    }
  };

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3 mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          {t.user.activity.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="flex flex-col items-center justify-center p-4 border rounded-lg bg-card/50 w-full">
          <div className="w-full overflow-x-auto pb-2">
            <div className="min-w-[600px] flex justify-center">
              <ActivityCalendar
                data={heatmapData}
                theme={{
                  light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
                  dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
                }}
                colorScheme={theme === "dark" ? "dark" : "light"}
                blockRadius={2}
                blockSize={10}
                blockMargin={3}
                fontSize={12}
                showWeekdayLabels
                labels={{
                  months: t.user.activity.calendar.months,
                  weekdays: t.user.activity.calendar.weekdays,
                  totalCount: t.user.activity.calendar.totalCount,
                  legend: t.user.activity.calendar.legend,
                }}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1">
            <CalendarDays className="h-3 w-3" />
            {t.user.activity.contributionGraph}
          </p>
        </div>

        <div className="space-y-4">
          {events.slice(0, 10).map((event) => (
            <div
              key={event.id}
              className="flex items-start space-x-4 border-b pb-4 last:border-0"
            >
              <div className="mt-0.5">{getEventIcon(event.type)}</div>
              <div className="flex-1 space-y-1">
                <p className="text-sm text-foreground">
                  {getEventDescription(event)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {event.created_at &&
                    format(new Date(event.created_at), "PPP p")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
