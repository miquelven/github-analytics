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

interface RepoLanguagesProps {
  languages: Record<string, number>;
}

export function RepoLanguages({ languages }: RepoLanguagesProps) {
  const { t } = useLanguage();
  const totalBytes = Object.values(languages).reduce(
    (acc, val) => acc + val,
    0
  );

  const data = Object.entries(languages)
    .map(([name, value]) => ({
      name,
      value,
      percent: ((value / totalBytes) * 100).toFixed(1),
    }))
    .sort((a, b) => b.value - a.value);

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#8dd1e1",
    "#a4de6c",
    "#d0ed57",
  ];

  if (data.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>{t.repo.languages}</CardTitle>
          <CardDescription>{t.repo.codebaseComposition}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px] text-muted-foreground">
          {t.repo.noLanguageData}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{t.repo.languages}</CardTitle>
        <CardDescription>{t.repo.codebaseComposition}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={2}
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
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="flex flex-col">
                          <span className="font-bold text-muted-foreground">
                            {item.name}
                          </span>
                          <span className="font-medium">{item.percent}%</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
