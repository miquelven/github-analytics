"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";
import { ChartDownloadButton } from "@/components/chart-download-button";

import { GithubRepo } from "@/types/github";

interface LanguagesChartProps {
  repos: GithubRepo[];
  className?: string;
}

export function LanguagesChart({ repos, className }: LanguagesChartProps) {
  const { t } = useLanguage();
  const languagesMap = repos.reduce((acc: Record<string, number>, repo) => {
    if (repo.language) {
      acc[repo.language] = (acc[repo.language] || 0) + 1;
    }
    return acc;
  }, {});

  const data = Object.entries(languagesMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  if (data.length === 0) {
    return (
      <Card className={cn("col-span-1", className)}>
        <CardHeader>
          <CardTitle>{t.user.languages.title}</CardTitle>
          <CardDescription>{t.user.languages.description}</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
          {t.user.languages.noData}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("col-span-1 group relative", className)}>
      <ChartDownloadButton elementId="languages-chart" filename="languages-chart" />
      <CardHeader>
        <CardTitle>{t.user.languages.title}</CardTitle>
        <CardDescription>{t.user.languages.description}</CardDescription>
      </CardHeader>
      <CardContent className="pl-0">
        <div id="languages-chart" className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--background)",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                }}
                itemStyle={{ color: "var(--foreground)" }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
