"use client";

import { SearchForm } from "@/components/search-form";
import { RepoSearchForm } from "@/components/repo-search-form";
import { Github } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center space-y-8 text-center w-full max-w-2xl">
        <div className="rounded-full bg-muted p-4">
          <Github className="h-12 w-12" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            {t.home.title}
          </h1>
          <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed mx-auto">
            {t.home.subtitle}
          </p>
        </div>

        <Tabs defaultValue="user" className="w-full max-w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="user">{t.home.tabs.user}</TabsTrigger>
            <TabsTrigger value="repo">{t.home.tabs.repo}</TabsTrigger>
          </TabsList>
          <TabsContent value="user">
            <Card>
              <CardHeader>
                <CardTitle>{t.home.analyzeUser.title}</CardTitle>
                <CardDescription>
                  {t.home.analyzeUser.subtitle}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <SearchForm />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="repo">
            <Card>
              <CardHeader>
                <CardTitle>{t.home.analyzeRepo.title}</CardTitle>
                <CardDescription>
                  {t.home.analyzeRepo.subtitle}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <RepoSearchForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
