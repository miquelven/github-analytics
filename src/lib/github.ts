import { Octokit } from "@octokit/rest";

export const github = new Octokit({
  auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
  log: {
    debug: () => {},
    info: () => {},
    warn: console.warn,
    error: console.error,
  },
});

export const getUser = async (username: string) => {
  try {
    const { data } = await github.users.getByUsername({ username });
    return data;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export const getUserRepos = async (username: string) => {
  try {
    const { data } = await github.repos.listForUser({
      username,
      sort: "updated",
      per_page: 100,
    });
    return data;
  } catch (error) {
    console.error("Error fetching repos:", error);
    return [];
  }
};

export const getRepoDetails = async (owner: string, repo: string) => {
  try {
    const { data } = await github.repos.get({ owner, repo });
    return data;
  } catch (error) {
    console.error("Error fetching repo details:", error);
    return null;
  }
};

export const getRepoLanguages = async (owner: string, repo: string) => {
  try {
    const { data } = await github.repos.listLanguages({ owner, repo });
    return data;
  } catch (error) {
    console.error("Error fetching repo languages:", error);
    return {};
  }
};

export const getUserEvents = async (username: string) => {
  try {
    const { data } = await github.activity.listPublicEventsForUser({
      username,
      per_page: 30,
    });
    return data;
  } catch (error) {
    console.error("Error fetching user events:", error);
    return [];
  }
};

export const getUserOrgs = async (username: string) => {
  try {
    const { data } = await github.orgs.listForUser({ username });
    return data;
  } catch (error) {
    console.error("Error fetching user orgs:", error);
    return [];
  }
};

export const getRepoContributors = async (owner: string, repo: string) => {
  try {
    const { data } = await github.repos.listContributors({
      owner,
      repo,
      per_page: 10,
    });
    return data;
  } catch (error) {
    console.error("Error fetching contributors:", error);
    return [];
  }
};

export const getRepoReadme = async (owner: string, repo: string) => {
  try {
    const { data } = await github.repos.getReadme({
      owner,
      repo,
      mediaType: {
        format: "raw",
      },
    });
    // @ts-expect-error - Octokit types might be slightly off for raw media type return
    return data as string;
  } catch (error) {
    console.error("Error fetching readme:", error);
    return null;
  }
};

export const getRepoStargazers = async (owner: string, repo: string) => {
  try {
    const { data } = await github.activity.listStargazersForRepo({
      owner,
      repo,
      per_page: 10,
      headers: {
        accept: "application/vnd.github.v3.star+json", // To get starred_at timestamp
      },
    });
    return data;
  } catch (error) {
    console.error("Error fetching stargazers:", error);
    return [];
  }
};

export const searchRepos = async (
  q: string,
  sort: "stars" | "forks" | "updated" = "stars",
  order: "desc" | "asc" = "desc"
) => {
  try {
    const { data } = await github.search.repos({
      q,
      sort,
      order,
      per_page: 10,
    });
    return data;
  } catch (error) {
    console.error("Error searching repos:", error);
    return null;
  }
};

export const searchUsers = async (
  q: string,
  sort: "followers" | "repositories" | "joined" = "followers",
  order: "desc" | "asc" = "desc"
) => {
  try {
    const { data } = await github.search.users({
      q,
      sort,
      order,
      per_page: 10,
    });
    return data;
  } catch (error) {
    console.error("Error searching users:", error);
    return null;
  }
};

export const getRateLimit = async () => {
  try {
    const { data } = await github.rateLimit.get();
    return data.rate;
  } catch (error) {
    console.error("Error fetching rate limit:", error);
    return null;
  }
};
