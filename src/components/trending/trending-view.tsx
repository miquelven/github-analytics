"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/language-context";
import { GithubRepo, GithubUser } from "@/types/github";

interface TrendingViewProps {
  topRepos: { items: GithubRepo[] } | null;
  topUsers: { items: GithubUser[] } | null;
}

export function TrendingView({ topRepos, topUsers }: TrendingViewProps) {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-2 mb-8">
        <TrendingUp className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">{t.trending.title}</h1>
      </div>

      <Tabs defaultValue="repos" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="repos">{t.trending.tabs.repos}</TabsTrigger>
          <TabsTrigger value="users">{t.trending.tabs.users}</TabsTrigger>
        </TabsList>

        <TabsContent value="repos">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {topRepos?.items.map((repo) => (
              <Card key={repo.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/repo/${repo.owner.login}/${repo.name}`}
                      className="hover:underline"
                    >
                      <CardTitle className="text-lg break-all">
                        {repo.full_name}
                      </CardTitle>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between gap-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {repo.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        {repo.stargazers_count.toLocaleString()}
                      </div>
                      {repo.language && (
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                          {repo.language}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="users">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {topUsers?.items.map((user) => (
              <Card key={user.id}>
                <CardContent className="pt-6 flex flex-col items-center text-center gap-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.avatar_url} alt={user.login} />
                    <AvatarFallback>
                      {user.login ? user.login.slice(0, 2).toUpperCase() : "??"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <Link
                      href={`/user/${user.login}`}
                      className="hover:underline"
                    >
                      <h3 className="font-bold text-lg">@{user.login}</h3>
                    </Link>
                  </div>
                  <Link href={`/user/${user.login}`} className="w-full">
                    <Button variant="outline" className="w-full">
                      {t.trending.viewProfile}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
