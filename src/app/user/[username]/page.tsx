import {
  getUser,
  getUserRepos,
  getUserOrgs,
  getUserEvents,
  getRepoReadme,
} from "@/lib/github";
import { UserHeader } from "@/components/user/user-header";
import { UserStats } from "@/components/user/user-stats";
import { LanguagesChart } from "@/components/user/languages-chart";
import { RepoList } from "@/components/user/repo-list";
import { UserOrgs } from "@/components/user/user-orgs";
import { UserActivity } from "@/components/user/user-activity";
import { ProfileReadme } from "@/components/user/profile-readme";
import { UserInsights } from "@/components/user/user-insights";
import { UsageHabits } from "@/components/user/usage-habits";
import { BackButton } from "@/components/back-button";
import { notFound } from "next/navigation";

interface UserPageProps {
  params: {
    username: string;
  };
}

export default async function UserPage({ params }: UserPageProps) {
  const { username } = await params;
  const [user, repos, orgs, events, readme] = await Promise.all([
    getUser(username),
    getUserRepos(username),
    getUserOrgs(username),
    getUserEvents(username),
    getRepoReadme(username, username),
  ]);

  if (!user) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6 flex items-center justify-between">
        <BackButton />
      </div>

      <UserHeader user={user} />

      <UserInsights user={user} repos={repos} />

      <ProfileReadme content={readme} />

      <UserOrgs orgs={orgs} />

      <UserStats user={user} repos={repos} />

      <div className="grid gap-8 md:grid-cols-3">
        <LanguagesChart repos={repos} />
        <RepoList repos={repos} />
        <UserActivity events={events} />
        <UsageHabits events={events} />
      </div>
    </div>
  );
}
