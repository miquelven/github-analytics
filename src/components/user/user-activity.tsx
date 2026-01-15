"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  GitCommit,
  GitPullRequest,
  Star,
  MessageSquare,
  Activity,
  CalendarDays,
  Flame,
} from "lucide-react";
import { format, endOfWeek, startOfMonth, startOfWeek } from "date-fns";
import { enUS, ptBR } from "date-fns/locale";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";
import { ActivityCalendar } from "react-activity-calendar";
import { useTheme } from "next-themes";
import { GithubEvent, ContributionCalendar } from "@/types/github";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

interface UserActivityProps {
  events: GithubEvent[];
  contributions?: ContributionCalendar | null;
}

export function UserActivity({ events, contributions }: UserActivityProps) {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const [granularity, setGranularity] = useState<"day" | "week" | "month">(
    "day"
  );

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

  const dailyData = useMemo(() => {
    if (!contributions) return [];

    const map = new Map<string, number>();

    contributions.weeks.forEach((week) => {
      week.contributionDays.forEach((day) => {
        map.set(day.date, (map.get(day.date) ?? 0) + day.contributionCount);
      });
    });

    const entries = Array.from(map.entries()).sort((a, b) =>
      a[0].localeCompare(b[0])
    );

    const recent = entries.slice(-30);

    return recent.map(([date, count]) => ({
      key: date,
      label: format(new Date(date), "MMM d", {
        locale: language === "pt" ? ptBR : enUS,
      }),
      count,
    }));
  }, [contributions, language]);

  const weeklyData = useMemo(() => {
    if (!contributions) return [];

    const map = new Map<string, { count: number; start: Date; end: Date }>();

    contributions.weeks.forEach((week) => {
      week.contributionDays.forEach((day) => {
        const d = new Date(day.date);
        const start = startOfWeek(d, { weekStartsOn: 1 });
        const end = endOfWeek(d, { weekStartsOn: 1 });
        const key = start.toISOString().slice(0, 10);
        const existing = map.get(key) ?? { count: 0, start, end };
        existing.count += day.contributionCount;
        map.set(key, existing);
      });
    });

    const entries = Array.from(map.entries()).sort((a, b) =>
      a[0].localeCompare(b[0])
    );

    const recent = entries.slice(-12);

    return recent.map(([key, value]) => ({
      key,
      label: `${format(value.start, "MMM d", {
        locale: language === "pt" ? ptBR : enUS,
      })}–${format(value.end, "MMM d", {
        locale: language === "pt" ? ptBR : enUS,
      })}`,
      count: value.count,
    }));
  }, [contributions, language]);

  const monthlyData = useMemo(() => {
    if (!contributions) return [];

    const map = new Map<string, { count: number; date: Date }>();

    contributions.weeks.forEach((week) => {
      week.contributionDays.forEach((day) => {
        const d = new Date(day.date);
        const start = startOfMonth(d);
        const key = start.toISOString().slice(0, 7);
        const existing = map.get(key) ?? { count: 0, date: start };
        existing.count += day.contributionCount;
        map.set(key, existing);
      });
    });

    const entries = Array.from(map.entries()).sort((a, b) =>
      a[0].localeCompare(b[0])
    );

    const recent = entries.slice(-12);

    return recent.map(([key, value]) => ({
      key,
      label: format(value.date, "MMM yyyy", {
        locale: language === "pt" ? ptBR : enUS,
      }),
      count: value.count,
    }));
  }, [contributions, language]);

  const timelineData =
    granularity === "day"
      ? dailyData
      : granularity === "week"
      ? weeklyData
      : monthlyData;

  const mostActiveDay =
    dailyData.length > 0
      ? dailyData.reduce(
          (max, item) => (item.count > max.count ? item : max),
          dailyData[0]
        )
      : null;

  const mostActiveWeek =
    weeklyData.length > 0
      ? weeklyData.reduce(
          (max, item) => (item.count > max.count ? item : max),
          weeklyData[0]
        )
      : null;

  const mostActiveMonth =
    monthlyData.length > 0
      ? monthlyData.reduce(
          (max, item) => (item.count > max.count ? item : max),
          monthlyData[0]
        )
      : null;

  const chartConfig = {
    contributions: {
      label: t.user.activity.timelineTitle,
      color: "#22c55e",
    },
  };

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

  const hasHeatmap = heatmapData.length > 0;
  const hasTimeline = timelineData.length > 0;
  const hasEvents = events && events.length > 0;

  if (!hasHeatmap && !hasTimeline && !hasEvents) {
    return null;
  }

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3 mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          {t.user.activity.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {heatmapData.length > 0 && (
          <div className="flex flex-col items-center justify-center p-4 border rounded-lg bg-card/50 w-full">
            <div className="w-full overflow-x-auto pb-2">
              <div className="min-w-[600px] flex justify-center">
                <ActivityCalendar
                  data={heatmapData}
                  theme={{
                    light: [
                      "#ebedf0",
                      "#9be9a8",
                      "#40c463",
                      "#30a14e",
                      "#216e39",
                    ],
                    dark: [
                      "#161b22",
                      "#0e4429",
                      "#006d32",
                      "#26a641",
                      "#39d353",
                    ],
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
        )}

        {timelineData.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {t.user.activity.timelineTitle}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t.user.activity.timelineDescription}
                </p>
              </div>
              <div className="inline-flex items-center gap-1 rounded-full border bg-card px-1 py-1 text-xs">
                <button
                  type="button"
                  onClick={() => setGranularity("day")}
                  className={`rounded-full px-2 py-0.5 ${
                    granularity === "day"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {t.user.activity.granularity.day}
                </button>
                <button
                  type="button"
                  onClick={() => setGranularity("week")}
                  className={`rounded-full px-2 py-0.5 ${
                    granularity === "week"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {t.user.activity.granularity.week}
                </button>
                <button
                  type="button"
                  onClick={() => setGranularity("month")}
                  className={`rounded-full px-2 py-0.5 ${
                    granularity === "month"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {t.user.activity.granularity.month}
                </button>
              </div>
            </div>
            <ChartContainer config={chartConfig} className="h-[220px] w-full">
              <BarChart data={timelineData}>
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  minTickGap={16}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={32}
                  tickFormatter={(value: number) => value.toLocaleString()}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      indicator="line"
                      labelFormatter={(value) => value}
                    />
                  }
                />
                <Bar
                  dataKey="count"
                  fill="#22c55e"
                  radius={[4, 4, 0, 0]}
                  name="contributions"
                />
                <ChartLegend content={<ChartLegendContent />} />
              </BarChart>
            </ChartContainer>

            {(mostActiveDay || mostActiveWeek || mostActiveMonth) && (
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1 text-sm font-medium">
                  <Flame className="h-4 w-4 text-orange-500" />
                  {t.user.activity.highProductivity}
                </div>
                {mostActiveDay && (
                  <div>
                    <span className="font-semibold">
                      {t.user.activity.mostActiveDay}:
                    </span>{" "}
                    {format(new Date(mostActiveDay.key), "PPP", {
                      locale: language === "pt" ? ptBR : enUS,
                    })}{" "}
                    • {mostActiveDay.count.toLocaleString()}{" "}
                    {t.user.activity.contributionsLabel}
                  </div>
                )}
                {mostActiveWeek && (
                  <div>
                    <span className="font-semibold">
                      {t.user.activity.mostActiveWeek}:
                    </span>{" "}
                    {mostActiveWeek.label} •{" "}
                    {mostActiveWeek.count.toLocaleString()}{" "}
                    {t.user.activity.contributionsLabel}
                  </div>
                )}
                {mostActiveMonth && (
                  <div>
                    <span className="font-semibold">
                      {t.user.activity.mostActiveMonth}:
                    </span>{" "}
                    {mostActiveMonth.label} •{" "}
                    {mostActiveMonth.count.toLocaleString()}{" "}
                    {t.user.activity.contributionsLabel}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {events && events.length > 0 && (
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
                      format(new Date(event.created_at), "PPP p", {
                        locale: language === "pt" ? ptBR : enUS,
                      })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
