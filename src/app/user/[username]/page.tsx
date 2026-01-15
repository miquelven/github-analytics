import {
  getUser,
  getUserRepos,
  getUserOrgs,
  getUserEvents,
  getRepoReadme,
  getUserContributions,
} from "@/lib/github";
import { Metadata } from "next";
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
import { notFound } from "next/navigation";

interface UserPageProps {
  params: {
    username: string;
  };
}

export async function generateMetadata({
  params,
}: UserPageProps): Promise<Metadata> {
  const { username } = await params;
  const user = await getUser(username);

  if (!user) {
    return {
      title: "User Not Found - GitHub Analytics",
    };
  }

  return {
    title: `${user.name || user.login} - GitHub Analytics Profile`,
    description: `Check out ${
      user.name || user.login
    }'s GitHub statistics, insights, and top repositories on GitHub Analytics.`,
    openGraph: {
      title: `${user.name || user.login} - GitHub Analytics Profile`,
      description: user.bio || `GitHub analytics for ${user.login}`,
      images: [user.avatar_url],
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `${user.name || user.login} - GitHub Analytics`,
      description: user.bio || `GitHub analytics for ${user.login}`,
      images: [user.avatar_url],
    },
  };
}

export default async function UserPage({ params }: UserPageProps) {
  const { username } = await params;
  const [user, repos, orgs, events, readme, contributions] = await Promise.all([
    getUser(username),
    getUserRepos(username),
    getUserOrgs(username),
    getUserEvents(username),
    getRepoReadme(username, username),
    getUserContributions(username),
  ]);

  if (!user) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6 flex items-center justify-between">
        <BackButton />
        <ShareProfileButton username={username} />
      </div>

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

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <LanguagesChart repos={repos} />
        <RepoList repos={repos} />
        <UserActivity events={events} contributions={contributions} />
      </div>
    </div>
  );
}
