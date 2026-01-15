"use client";

import { UserHeader } from "@/components/user/user-header";
import { UserStats } from "@/components/user/user-stats";
import { LanguagesChart } from "@/components/user/languages-chart";
import { RepoList } from "@/components/user/repo-list";
import { UserOrgs } from "@/components/user/user-orgs";
import { UserActivity } from "@/components/user/user-activity";
import { ProfileReadme } from "@/components/user/profile-readme";
import { UserInsights } from "@/components/user/user-insights";
import { BackButton } from "@/components/back-button";
import { ShareProfileButton } from "@/components/user/share-profile-button";
import { RecruiterView } from "@/components/user/recruiter-view";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/language-context";
import type {
  GithubUser,
  GithubRepo,
  GithubOrg,
  GithubEvent,
  ContributionCalendar,
} from "@/types/github";
import { LayoutDashboard, Briefcase, FolderGit2 } from "lucide-react";
import { ErrorBoundary } from "@/components/observability/error-boundary";

interface UserProfileContentProps {
  user: GithubUser;
  repos: GithubRepo[];
  orgs: GithubOrg[];
  events: GithubEvent[];
  readme: string | null;
  contributions: ContributionCalendar | null;
}

export function UserProfileContent({
  user,
  repos,
  orgs,
  events,
  readme,
  contributions,
}: UserProfileContentProps) {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto py-8 px-4">
      <ErrorBoundary>
        <Tabs defaultValue="overview" className="space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <BackButton />

            <div className="flex flex-col-reverse md:flex-row items-center gap-4 w-full md:w-auto">
              <TabsList className="grid w-full grid-cols-3 md:w-auto">
                <TabsTrigger value="overview" className="gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {t.user.tabs.overview}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="recruiter" className="gap-2">
                  <Briefcase className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {t.user.tabs.recruiter}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="repos" className="gap-2">
                  <FolderGit2 className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {t.user.tabs.repositories}
                  </span>
                </TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <ShareProfileButton username={user.login} />
              </div>
            </div>
          </div>

          <TabsContent
            value="overview"
            className="space-y-6 animate-in fade-in-50 duration-500"
          >
            <UserHeader user={user} />

            <UserInsights
              user={user}
              repos={repos}
              events={events}
              contributions={contributions}
            />

            <ProfileReadme content={readme} />

            <UserOrgs orgs={orgs} />

            <UserStats user={user} repos={repos} />

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <LanguagesChart repos={repos} />
              <UserActivity
                events={events}
                contributions={contributions}
                className="md:col-span-1 lg:col-span-1 mt-0"
              />
            </div>
          </TabsContent>

          <TabsContent value="recruiter">
            <RecruiterView user={user} repos={repos} />
          </TabsContent>

          <TabsContent value="repos">
            <RepoList repos={repos} />
          </TabsContent>
        </Tabs>
      </ErrorBoundary>
    </div>
  );
}
