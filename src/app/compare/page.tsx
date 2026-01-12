import { getUser } from "@/lib/github";
import { CompareView } from "@/components/compare/compare-view";

interface ComparePageProps {
  searchParams: Promise<{
    user1?: string;
    user2?: string;
  }>;
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const params = await searchParams;
  const user1Name = typeof params.user1 === "string" ? params.user1 : undefined;
  const user2Name = typeof params.user2 === "string" ? params.user2 : undefined;

  let user1Data = null;
  let user2Data = null;
  let notFoundUsers: string[] = [];

  if (user1Name && user2Name) {
    const [u1, u2] = await Promise.all([
      getUser(user1Name),
      getUser(user2Name),
    ]);
    user1Data = u1;
    user2Data = u2;

    if (!user1Data) notFoundUsers.push(user1Name);
    if (!user2Data) notFoundUsers.push(user2Name);
  }

  return (
    <CompareView
      user1Data={user1Data}
      user2Data={user2Data}
      notFoundUsers={notFoundUsers.length > 0 ? notFoundUsers : undefined}
    />
  );
}
