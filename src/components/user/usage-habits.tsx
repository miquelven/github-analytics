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
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import { Clock, Sunrise, Sun, Sunset, Moon } from "lucide-react";

interface GithubEvent {
  created_at: string;
  type: string;
}

interface UsageHabitsProps {
  events: GithubEvent[];
}

export function UsageHabits({ events }: UsageHabitsProps) {
  const { t } = useLanguage();

  if (!events || events.length === 0) {
    return null;
  }

  // Process events to get hour distribution
  const hours = Array(24).fill(0);
  events.forEach((event) => {
    const date = new Date(event.created_at);
    const hour = date.getHours();
    hours[hour]++;
  });

  const data = hours.map((count, hour) => ({
    hour: `${hour.toString().padStart(2, "0")}:00`,
    count,
    hourNum: hour,
  }));

  // Determine persona
  let periods = {
    insomniac: 0, // 00-06
    earlyBird: 0, // 06-12
    afternoon: 0, // 12-18
    nightOwl: 0, // 18-24
  };

  events.forEach((event) => {
    const hour = new Date(event.created_at).getHours();
    if (hour >= 0 && hour < 6) periods.insomniac++;
    else if (hour >= 6 && hour < 12) periods.earlyBird++;
    else if (hour >= 12 && hour < 18) periods.afternoon++;
    else periods.nightOwl++;
  });

  const maxPeriod = Object.entries(periods).reduce((a, b) =>
    a[1] > b[1] ? a : b
  )[0];

  const getPersona = () => {
    switch (maxPeriod) {
      case "insomniac":
        return {
          title: t.user.habits.personas.insomniac,
          desc: t.user.habits.personas.insomniacDesc,
          icon: <Moon className="h-12 w-12 text-indigo-400" />,
        };
      case "earlyBird":
        return {
          title: t.user.habits.personas.earlyBird,
          desc: t.user.habits.personas.earlyBirdDesc,
          icon: <Sunrise className="h-12 w-12 text-orange-400" />,
        };
      case "afternoon":
        return {
          title: t.user.habits.personas.afternoon,
          desc: t.user.habits.personas.afternoonDesc,
          icon: <Sun className="h-12 w-12 text-yellow-400" />,
        };
      case "nightOwl":
        return {
          title: t.user.habits.personas.nightOwl,
          desc: t.user.habits.personas.nightOwlDesc,
          icon: <Sunset className="h-12 w-12 text-purple-400" />,
        };
      default:
        return {
          title: t.user.habits.personas.afternoon,
          desc: t.user.habits.personas.afternoonDesc,
          icon: <Sun className="h-12 w-12 text-yellow-400" />,
        };
    }
  };

  const persona = getPersona();

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          {t.user.habits.title}
        </CardTitle>
        <CardDescription>{t.user.habits.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis
                  dataKey="hour"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  interval={3}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                {t.user.habits.timeOfDay}
                              </span>
                              <span className="font-bold text-muted-foreground">
                                {payload[0].payload.hour}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                {t.user.habits.commits}
                              </span>
                              <span className="font-bold">
                                {payload[0].value}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.hourNum >= 6 && entry.hourNum < 18
                          ? "#fbbf24" // Day (Yellow/Amber)
                          : "#818cf8" // Night (Indigo)
                      }
                      className="opacity-80 hover:opacity-100 transition-opacity"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-col items-center justify-center p-6 bg-muted/50 rounded-xl min-w-[200px] text-center">
            <div className="mb-4 p-4 bg-background rounded-full shadow-sm">
              {persona.icon}
            </div>
            <p className="text-sm text-muted-foreground mb-1">
              {t.user.habits.personas.title}
            </p>
            <h3 className="text-xl font-bold mb-2">{persona.title}</h3>
            <p className="text-sm text-muted-foreground">{persona.desc}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
