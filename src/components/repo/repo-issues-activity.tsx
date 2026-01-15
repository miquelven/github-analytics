"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";
import { Progress } from "@/components/ui/progress";
import { AlertCircle } from "lucide-react";
import { format } from "date-fns";

interface RepoIssuesActivityProps {
  issuesSummary: {
    open: number;
    closed: number;
  };
  activityPeak: {
    date: string | null;
    count: number;
  } | null;
}

export function RepoIssuesActivity({
  issuesSummary,
  activityPeak,
}: RepoIssuesActivityProps) {
  const { t } = useLanguage();

  const totalIssues = issuesSummary.open + issuesSummary.closed;
  const openPercent = totalIssues
    ? (issuesSummary.open / totalIssues) * 100
    : 0;

  const hasActivity =
    activityPeak && activityPeak.date && activityPeak.count > 0;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{t.repo.issuesSummary}</CardTitle>
        <CardDescription>{t.repo.issuesSummaryDescription}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {t.repo.openIssues} {issuesSummary.open.toLocaleString()}
            </span>
            <span>
              {t.repo.closedIssues} {issuesSummary.closed.toLocaleString()}
            </span>
          </div>
          <Progress value={openPercent} />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{t.repo.openIssues}</span>
            <span>{totalIssues.toLocaleString()}</span>
          </div>
        </div>

        <div className="border-t pt-3 mt-1 space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <AlertCircle className="h-4 w-4 text-primary" />
            <span>{t.repo.activityPeak}</span>
          </div>
          {hasActivity ? (
            <div className="flex flex-col text-xs text-muted-foreground">
              <span>{t.repo.activityPeakLabel}</span>
              <span className="mt-1 font-medium text-foreground">
                {format(new Date(activityPeak.date as string), "MMM d, yyyy")} •{" "}
                {activityPeak.count.toLocaleString()} {t.repo.events}
              </span>
            </div>
          ) : (
            <div className="text-xs text-muted-foreground">
              {t.repo.noActivityData}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
