"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";

interface RepoContributorsProps {
  contributors: any[];
}

export function RepoContributors({ contributors }: RepoContributorsProps) {
  const { t } = useLanguage();
  if (!contributors || contributors.length === 0) {
    return null;
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{t.repo.contributors}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {contributors.map((contributor) => (
            <div
              key={contributor.id}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Link href={`/user/${contributor.login}`}>
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={contributor.avatar_url}
                      alt={contributor.login}
                    />
                    <AvatarFallback>
                      {contributor.login.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <Link
                  href={`/user/${contributor.login}`}
                  className="font-medium hover:underline"
                >
                  {contributor.login}
                </Link>
              </div>
              <div className="text-sm text-muted-foreground">
                {contributor.contributions} {t.repo.commits}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
