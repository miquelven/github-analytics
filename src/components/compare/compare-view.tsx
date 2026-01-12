"use client";

import { Suspense } from "react";
import { CompareForm } from "@/components/compare/compare-form";
import { CompareResult } from "@/components/compare/compare-result";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

interface CompareViewProps {
  user1Data: any;
  user2Data: any;
  notFoundUsers?: string[];
}

export function CompareView({ user1Data, user2Data, notFoundUsers }: CompareViewProps) {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            {t.compare.title}
        </h1>
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
        <Suspense fallback={<div className="text-center mt-8">{t.compare.loading}</div>}>
            <CompareResult user1={user1Data} user2={user2Data} />
        </Suspense>
      )}
    </div>
  );
}
