"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";
import { FileCode2, HardDrive } from "lucide-react";

interface RepoComplexityProps {
  fileCount: number | null;
  sizeKb: number | null;
}

export function RepoComplexity({ fileCount, sizeKb }: RepoComplexityProps) {
  const { t } = useLanguage();

  const hasFiles = typeof fileCount === "number";
  const hasSize = typeof sizeKb === "number";

  if (!hasFiles && !hasSize) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>{t.repo.complexity}</CardTitle>
          <CardDescription>{t.repo.complexityDescription}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[160px] text-muted-foreground">
          {t.repo.noLanguageData}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{t.repo.complexity}</CardTitle>
        <CardDescription>{t.repo.complexityDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
              <FileCode2 className="h-5 w-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">
                {t.repo.files}
              </span>
              <span className="text-lg font-semibold">
                {hasFiles ? fileCount?.toLocaleString() : "-"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
              <HardDrive className="h-5 w-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">
                {t.repo.sizeKb}
              </span>
              <span className="text-lg font-semibold">
                {hasSize ? sizeKb?.toLocaleString() : "-"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
