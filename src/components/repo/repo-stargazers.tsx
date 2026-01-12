"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useLanguage } from "@/contexts/language-context";
import { GithubStargazer } from "@/types/github";

interface RepoStargazersProps {
  stargazers: GithubStargazer[];
}

export function RepoStargazers({ stargazers }: RepoStargazersProps) {
  const { t } = useLanguage();
  if (!stargazers || stargazers.length === 0) {
    return null;
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
          {t.repo.stargazers}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {stargazers.map((star) => {
            const user = star.user;
            const starredAt = star.starred_at;

            return (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Link href={`/user/${user.login}`}>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar_url} alt={user.login} />
                      <AvatarFallback>
                        {user.login.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <Link
                    href={`/user/${user.login}`}
                    className="font-medium hover:underline"
                  >
                    {user.login}
                  </Link>
                </div>
                {starredAt && (
                  <div className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(starredAt), {
                      addSuffix: true,
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
