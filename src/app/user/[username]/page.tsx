import {
  getUser,
  getUserRepos,
  getUserOrgs,
  getUserEvents,
  getRepoReadme,
  getUserContributions,
} from "@/lib/github";
import { Metadata } from "next";
import { UserProfileContent } from "@/components/user/user-profile-content";
import { notFound } from "next/navigation";

interface UserPageProps {
  params: Promise<{
    username: string;
  }>;
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
    <UserProfileContent
      user={user}
      repos={repos}
      orgs={orgs}
      events={events}
      readme={readme}
      contributions={contributions}
    />
  );
}
