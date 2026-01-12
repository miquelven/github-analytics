"use client";

import { Suspense } from "react";
import { CompareForm } from "@/components/compare/compare-form";
import { CompareResult } from "@/components/compare/compare-result";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { GithubUser } from "@/types/github";

interface CompareViewProps {
  user1Data: GithubUser | null;
  user2Data: GithubUser | null;
  notFoundUsers?: string[];
}

export function CompareView({
  user1Data,
  user2Data,
  notFoundUsers,
}: CompareViewProps) {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex flex-col items-center mb-8">
        <CompareForm />
      </div>

      {notFoundUsers && notFoundUsers.length > 0 && (
        <Alert variant="destructive" className="max-w-md mx-auto mt-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {t.compare.error} {notFoundUsers.join(", ")}
          </AlertDescription>
        </Alert>
      )}

      {user1Data && user2Data && (
        <Suspense
          fallback={<div className="text-center mt-8">{t.compare.loading}</div>}
        >
          <CompareResult user1={user1Data} user2={user2Data} />
        </Suspense>
      )}
    </div>
  );
}
