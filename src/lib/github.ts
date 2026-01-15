import { Octokit } from "@octokit/rest";
import {
  GithubUser,
  GithubRepo,
  GithubEvent,
  GithubOrg,
  ContributionCalendar,
  GithubContributor,
  GithubStargazer,
  GithubSearchRepoResult,
  GithubSearchUserResult,
} from "@/types/github";

export const github = new Octokit({
  auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
  log: {
    debug: () => {},
    info: () => {},
    warn: console.warn,
    error: () => {},
  },
});

export const getUser = async (username: string): Promise<GithubUser | null> => {
  try {
    const { data } = await github.users.getByUsername({ username });
    return data as GithubUser;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export const getUserRepos = async (username: string): Promise<GithubRepo[]> => {
  try {
    const { data } = await github.repos.listForUser({
      username,
      sort: "updated",
      per_page: 100,
    });
    return data as unknown as GithubRepo[];
  } catch (error) {
    console.error("Error fetching repos:", error);
    return [];
  }
};

export const getRepoDetails = async (
  owner: string,
  repo: string
): Promise<GithubRepo | null> => {
  try {
    const { data } = await github.repos.get({ owner, repo });
    return data as unknown as GithubRepo;
  } catch (error) {
    console.error("Error fetching repo details:", error);
    return null;
  }
};

export const getRepoLanguages = async (
  owner: string,
  repo: string
): Promise<Record<string, number>> => {
  try {
    const { data } = await github.repos.listLanguages({ owner, repo });
    return data;
  } catch (error) {
    console.error("Error fetching repo languages:", error);
    return {};
  }
};

export const getUserEvents = async (
  username: string
): Promise<GithubEvent[]> => {
  try {
    const { data } = await github.activity.listPublicEventsForUser({
      username,
      per_page: 30,
    });
    return data as unknown as GithubEvent[];
  } catch (error) {
    console.error("Error fetching user events:", error);
    return [];
  }
};

export const getUserOrgs = async (username: string): Promise<GithubOrg[]> => {
  try {
    const { data } = await github.orgs.listForUser({ username });
    return data as GithubOrg[];
  } catch (error) {
    console.error("Error fetching user orgs:", error);
    return [];
  }
};

export const getRepoContributors = async (
  owner: string,
  repo: string
): Promise<GithubContributor[]> => {
  try {
    const { data } = await github.repos.listContributors({
      owner,
      repo,
      per_page: 10,
    });
    return data as unknown as GithubContributor[];
  } catch (error) {
    console.error("Error fetching contributors:", error);
    return [];
  }
};

export const getRepoReadme = async (
  owner: string,
  repo: string
): Promise<string | null> => {
  try {
    const { data } = await github.repos.getReadme({
      owner,
      repo,
      mediaType: {
        format: "raw",
      },
    });
    return data as unknown as string;
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      error.status === 404
    ) {
      return null;
    }
    console.error("Error fetching readme:", error);
    return null;
  }
};

export const getUserContributions = async (
  username: string
): Promise<ContributionCalendar | null> => {
  try {
    const query = `
      query($username: String!) {
        user(login: $username) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                  color
                }
              }
            }
          }
        }
      }
    `;

    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
      next: { revalidate: 3600 },
    });

    const data = await response.json();
    return data.data?.user?.contributionsCollection?.contributionCalendar;
  } catch (error) {
    console.error("Error fetching contributions:", error);
    return null;
  }
};

export const getRepoStargazers = async (
  owner: string,
  repo: string
): Promise<GithubStargazer[]> => {
  try {
    const { data } = await github.activity.listStargazersForRepo({
      owner,
      repo,
      per_page: 10,
      headers: {
        accept: "application/vnd.github.v3.star+json",
      },
    });
    return data as unknown as GithubStargazer[];
  } catch (error) {
    console.error("Error fetching stargazers:", error);
    return [];
  }
};

export const getRepoStarsTimeline = async (
  owner: string,
  repo: string
): Promise<{ date: string; value: number }[]> => {
  try {
    const { data } = await github.activity.listStargazersForRepo({
      owner,
      repo,
      per_page: 100,
      headers: {
        accept: "application/vnd.github.v3.star+json",
      },
    });

    const counts = new Map<string, number>();

    (data as unknown as GithubStargazer[]).forEach((star) => {
      if (!star.starred_at) {
        return;
      }
      const day = star.starred_at.slice(0, 10);
      counts.set(day, (counts.get(day) ?? 0) + 1);
    });

    const entries = Array.from(counts.entries()).sort((a, b) =>
      a[0].localeCompare(b[0])
    );

    let cumulative = 0;

    return entries.map(([date, count]) => {
      cumulative += count;
      return { date, value: cumulative };
    });
  } catch (error) {
    console.error("Error fetching stars timeline:", error);
    return [];
  }
};

export const getRepoForksTimeline = async (
  owner: string,
  repo: string
): Promise<{ date: string; value: number }[]> => {
  try {
    const { data } = await github.repos.listForks({
      owner,
      repo,
      per_page: 100,
      sort: "newest",
    });

    const counts = new Map<string, number>();

    (data as unknown as GithubRepo[]).forEach((fork) => {
      const day = fork.created_at.slice(0, 10);
      counts.set(day, (counts.get(day) ?? 0) + 1);
    });

    const entries = Array.from(counts.entries()).sort((a, b) =>
      a[0].localeCompare(b[0])
    );

    let cumulative = 0;

    return entries.map(([date, count]) => {
      cumulative += count;
      return { date, value: cumulative };
    });
  } catch (error) {
    console.error("Error fetching forks timeline:", error);
    return [];
  }
};

export const getRepoIssuesSummary = async (
  owner: string,
  repo: string
): Promise<{ open: number; closed: number }> => {
  try {
    const { data } = await github.issues.listForRepo({
      owner,
      repo,
      state: "all",
      per_page: 100,
    });
    const open = data.filter((issue) => issue.state === "open").length;
    const closed = data.filter((issue) => issue.state === "closed").length;
    return { open, closed };
  } catch (error) {
    console.error("Error fetching repo issues summary:", error);
    return { open: 0, closed: 0 };
  }
};

export const getRepoEvents = async (
  owner: string,
  repo: string
): Promise<GithubEvent[]> => {
  try {
    const { data } = await github.activity.listRepoEvents({
      owner,
      repo,
      per_page: 50,
    });
    return data as unknown as GithubEvent[];
  } catch (error) {
    console.error("Error fetching repo events:", error);
    return [];
  }
};

export const getRepoFileCount = async (
  owner: string,
  repo: string
): Promise<number | null> => {
  try {
    const { data } = await github.search.code({
      q: `repo:${owner}/${repo}`,
      per_page: 1,
    });
    return data.total_count;
  } catch (error) {
    console.error("Error fetching repo file count:", error);
    return null;
  }
};

export const searchRepos = async (
  q: string,
  sort: "stars" | "forks" | "updated" = "stars",
  order: "desc" | "asc" = "desc"
): Promise<GithubSearchRepoResult | null> => {
  try {
    const { data } = await github.search.repos({
      q,
      sort,
      order,
      per_page: 10,
    });
    return data as unknown as GithubSearchRepoResult;
  } catch (error) {
    console.error("Error searching repos:", error);
    return null;
  }
};

export const searchUsers = async (
  q: string,
  sort: "followers" | "repositories" | "joined" = "followers",
  order: "desc" | "asc" = "desc"
): Promise<GithubSearchUserResult | null> => {
  try {
    const { data } = await github.search.users({
      q,
      sort,
      order,
      per_page: 10,
    });
    return data as unknown as GithubSearchUserResult;
  } catch (error) {
    console.error("Error searching users:", error);
    return null;
  }
};
