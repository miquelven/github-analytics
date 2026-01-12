"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Trophy, Users, Book, ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { GithubUser } from "@/types/github";

interface CompareResultProps {
  user1: GithubUser;
  user2: GithubUser;
}

export function CompareResult({ user1, user2 }: CompareResultProps) {
  const { t } = useLanguage();
  
  const calculateScore = (user: GithubUser) => {
    return user.followers * 2 + user.public_repos + user.public_gists;
  };

  const score1 = calculateScore(user1);
  const score2 = calculateScore(user2);
  const winner =
    score1 > score2 ? user1.login : score2 > score1 ? user2.login : "Tie";

  const renderUserCard = (
    user: GithubUser,
    score: number,
    isWinner: boolean
  ) => (
    <Card
      className={`relative h-full transition-all duration-300 ${
        isWinner
          ? "border-primary shadow-lg scale-105 z-10"
          : "border-border opacity-90"
      }`}
    >
      {isWinner && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full flex items-center gap-2 shadow-lg animate-bounce">
          <Trophy className="h-4 w-4" />
          <span className="font-bold">{t.compare.result.winner}</span>
        </div>
      )}
      <CardHeader className="text-center pt-8">
        <div className="mx-auto mb-4 relative">
          <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
            <AvatarImage src={user.avatar_url} alt={user.login} />
            <AvatarFallback>
              {user.login.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <CardTitle className="flex flex-col items-center gap-2">
          <Link
            href={`/user/${user.login}`}
            className="hover:underline flex items-center gap-2"
          >
            {user.name || user.login}
            <ExternalLink className="h-4 w-4 opacity-50" />
          </Link>
          <span className="text-sm font-normal text-muted-foreground">
            @{user.login}
          </span>
        </CardTitle>
        <div className="mt-2">
          <Badge variant="secondary" className="text-lg px-4 py-1">
            {t.compare.result.score}: {score}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
              <Users className="h-4 w-4" />
              <span className="text-xs uppercase font-semibold">
                {t.compare.result.followers}
              </span>
            </div>
            <p className="text-2xl font-bold">{user.followers}</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
              <Users className="h-4 w-4" />
              <span className="text-xs uppercase font-semibold">
                {t.compare.result.following}
              </span>
            </div>
            <p className="text-2xl font-bold">{user.following}</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
              <Book className="h-4 w-4" />
              <span className="text-xs uppercase font-semibold">
                {t.compare.result.repos}
              </span>
            </div>
            <p className="text-2xl font-bold">{user.public_repos}</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
              <Book className="h-4 w-4" />
              <span className="text-xs uppercase font-semibold">
                {t.compare.result.gists}
              </span>
            </div>
            <p className="text-2xl font-bold">{user.public_gists}</p>
          </div>
        </div>

        <div className="space-y-2 text-sm text-center text-muted-foreground">
          {user.company && <p>🏢 {user.company}</p>}
          {user.location && <p>📍 {user.location}</p>}
          {user.blog && (
            <a
              href={
                user.blog.startsWith("http")
                  ? user.blog
                  : `https://${user.blog}`
              }
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              🔗 {t.compare.result.website}
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto mt-8 items-start">
      {renderUserCard(user1, score1, winner === user1.login)}
      {renderUserCard(user2, score2, winner === user2.login)}
    </div>
  );
}
