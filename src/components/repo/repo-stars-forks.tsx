"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis } from "recharts";
import { format } from "date-fns";

interface RepoStarsForksProps {
  data: {
    date: string;
    stars: number;
    forks: number;
  }[];
}

export function RepoStarsForks({ data }: RepoStarsForksProps) {
  const { t } = useLanguage();

  if (!data || data.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>{t.repo.starsForksEvolution}</CardTitle>
          <CardDescription>{t.repo.starsForksDescription}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[240px] text-muted-foreground">
          {t.repo.noStarsForksData}
        </CardContent>
      </Card>
    );
  }

  const chartConfig = {
    stars: {
      label: t.repo.stars,
      color: "#38bdf8",
    },
    forks: {
      label: t.repo.forks,
      color: "#f97316",
    },
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{t.repo.starsForksEvolution}</CardTitle>
        <CardDescription>{t.repo.starsForksDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[240px]">
          <LineChart data={data}>
            <XAxis
              dataKey="date"
              tickFormatter={(value: string) =>
                format(new Date(value), "MMM d")
              }
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
                  labelFormatter={(value) =>
                    typeof value === "string"
                      ? format(new Date(value), "PPP")
                      : value
                  }
                />
              }
            />
            <Line
              type="monotone"
              dataKey="stars"
              stroke="#38bdf8"
              strokeWidth={2}
              dot={false}
              name="stars"
            />
            <Line
              type="monotone"
              dataKey="forks"
              stroke="#f97316"
              strokeWidth={2}
              dot={false}
              name="forks"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
