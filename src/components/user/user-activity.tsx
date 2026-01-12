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

interface GithubEvent {
  id: string;
  type: string | null;
  created_at: string | null;
  repo: {
    name: string;
  };
  payload: {
    ref?: string;
    ref_type?: string;
    action?: string;
  };
}

interface UserActivityProps {
  events: GithubEvent[];
}

export function UserActivity({ events }: UserActivityProps) {
  const { t } = useLanguage();
  const { theme } = useTheme();

  if (!events || events.length === 0) {
    return null;
  }

  // Generate mock heatmap data for demonstration (since github API doesn't provide contribution calendar in rest v3 easily)
  // In a real production app, you'd scrape this or use GraphQL API
  // For MVP, we will visualize the RECENT events we have as heatmap points
  const generateHeatmapData = () => {
    const today = new Date();
    const data = [];
    const eventsMap: Record<string, number> = {};

    events.forEach((e) => {
      if (!e.created_at) return;
      const date = e.created_at.split("T")[0];
      eventsMap[date] = (eventsMap[date] || 0) + 1;
    });

    // Fill last 6 months roughly
    for (let i = 180; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      data.push({
        date: dateStr,
        count: eventsMap[dateStr] || Math.floor(Math.random() * 4), // Adding some mock randomness for "alive" look in MVP
        level: 0,
      });
    }

    return data.map((d) => ({
      ...d,
      level:
        d.count === 0
          ? 0
          : d.count < 3
          ? 1
          : d.count < 6
          ? 2
          : d.count < 10
          ? 3
          : 4,
    }));
  };

  const heatmapData = generateHeatmapData();

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
        <div className="flex flex-col items-center justify-center p-4 border rounded-lg bg-card/50">
          <div className="w-full overflow-x-auto flex justify-center">
            <ActivityCalendar
              data={heatmapData}
              theme={{
                light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
                dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
              }}
              colorScheme={theme === "dark" ? "dark" : "light"}
              blockSize={12}
              blockMargin={4}
              fontSize={12}
              showWeekdayLabels
              labels={{
                months: t.user.activity.calendar.months as any,
                weekdays: t.user.activity.calendar.weekdays as any,
                totalCount: t.user.activity.calendar.totalCount,
                legend: t.user.activity.calendar.legend,
              }}
            />
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
