import {
  calculateLanguageStats,
  determineProfileType,
  calculateConsistency,
  generateInsights,
} from "@/lib/analytics";
import * as GithubTypes from "@/types/github";

type CommitConsistency = ReturnType<typeof calculateConsistency>;
type ContributionCalendar = GithubTypes.ContributionCalendar;
type GithubRepo = GithubTypes.GithubRepo;
type GithubUser = GithubTypes.GithubUser;

const makeRepo = (overrides: Partial<GithubRepo>): GithubRepo => {
  return {
    id: 1,
    node_id: "",
    name: overrides.name ?? "repo",
    full_name: "owner/repo",
    private: false,
    owner: {} as GithubUser,
    html_url: "",
    description: overrides.description ?? null,
    fork: false,
    url: "",
    created_at: overrides.created_at ?? new Date().toISOString(),
    updated_at: overrides.updated_at ?? new Date().toISOString(),
    pushed_at: overrides.pushed_at ?? new Date().toISOString(),
    git_url: "",
    ssh_url: "",
    clone_url: "",
    svn_url: "",
    homepage: null,
    size: 0,
    stargazers_count: overrides.stargazers_count ?? 0,
    watchers_count: 0,
    language: overrides.language ?? null,
    has_issues: true,
    has_projects: true,
    has_downloads: true,
    has_wiki: true,
    has_pages: false,
    forks_count: overrides.forks_count ?? 0,
    mirror_url: null,
    archived: false,
    disabled: false,
    open_issues_count: 0,
    license: null,
    allow_forking: true,
    is_template: false,
    topics: [],
    visibility: "public",
    forks: 0,
    open_issues: 0,
    watchers: 0,
    default_branch: "main",
  };
};

const makeCalendar = (
  days: number[],
  totalContributions: number
): ContributionCalendar => {
  return {
    totalContributions,
    weeks: [
      {
        contributionDays: days.map((count, index) => ({
          contributionCount: count,
          date: `2024-01-${String(index + 1).padStart(2, "0")}`,
          color: "",
        })),
      },
    ],
  };
};

const makeUser = (overrides: Partial<GithubUser>): GithubUser => {
  return {
    login: overrides.login ?? "user",
    id: 1,
    node_id: "",
    avatar_url: "",
    gravatar_id: null,
    url: "",
    html_url: "",
    followers_url: "",
    following_url: "",
    gists_url: "",
    starred_url: "",
    subscriptions_url: "",
    organizations_url: "",
    repos_url: "",
    events_url: "",
    received_events_url: "",
    type: "User",
    site_admin: false,
    name: overrides.name ?? "User",
    company: null,
    blog: null,
    location: null,
    email: null,
    hireable: null,
    bio: null,
    twitter_username: null,
    public_repos: 0,
    public_gists: 0,
    followers: overrides.followers ?? 0,
    following: overrides.following ?? 0,
    created_at: overrides.created_at ?? "2020-01-01T00:00:00Z",
    updated_at: overrides.updated_at ?? "2024-01-01T00:00:00Z",
  };
};

describe("calculateLanguageStats", () => {
  it("retorna estatísticas de linguagens ordenadas", () => {
    const repos: GithubRepo[] = [
      makeRepo({ language: "TypeScript" }),
      makeRepo({ language: "TypeScript" }),
      makeRepo({ language: "JavaScript" }),
    ];

    const stats = calculateLanguageStats(repos);

    expect(stats[0].language).toBe("TypeScript");
    expect(stats[0].count).toBe(2);
    expect(Math.round(stats[0].percentage)).toBe(67);
    expect(stats[1].language).toBe("JavaScript");
    expect(stats[1].count).toBe(1);
  });
});

describe("determineProfileType", () => {
  it("classifica como Focused quando uma linguagem domina", () => {
    const stats = [
      { language: "TypeScript", count: 7, percentage: 80 },
      { language: "JavaScript", count: 2, percentage: 20 },
    ];

    const profile = determineProfileType(stats);

    expect(profile).toBe("Focused");
  });

  it("classifica como Generalist quando top3 é bem distribuído", () => {
    const stats = [
      { language: "TS", count: 2, percentage: 15 },
      { language: "JS", count: 2, percentage: 15 },
      { language: "Go", count: 2, percentage: 15 },
      { language: "Rust", count: 2, percentage: 25 },
      { language: "Python", count: 2, percentage: 30 },
    ];

    const profile = determineProfileType(stats);

    expect(profile).toBe("Generalist");
  });
});

describe("calculateConsistency", () => {
  it("retorna métricas vazias quando não há calendário", () => {
    const consistency = calculateConsistency(null);

    expect(consistency.totalContributions).toBe(0);
    expect(consistency.consistencyScore).toBe(0);
  });

  it("calcula streak e score com dias ativos", () => {
    const calendar = makeCalendar([1, 1, 0, 1, 1, 1, 0], 10);

    const consistency = calculateConsistency(calendar);

    expect(consistency.activeDays).toBe(5);
    expect(consistency.longestStreak).toBe(3);
    expect(consistency.totalContributions).toBe(10);
    expect(consistency.consistencyScore).toBeGreaterThan(0);
  });
});

describe("generateInsights", () => {
  const baseConsistency: CommitConsistency = {
    totalContributions: 0,
    activeDays: 0,
    longestStreak: 0,
    averagePerActiveDay: 0,
    consistencyScore: 0,
  };

  it("gera insight de qualidade quando média de estrelas é alta", () => {
    const repos: GithubRepo[] = [
      makeRepo({ stargazers_count: 20 }),
      makeRepo({ stargazers_count: 10 }),
    ];
    const user = makeUser({});

    const insights = generateInsights(user, repos, baseConsistency);

    const quality = insights.find((i) => i.titleKey === "quality");
    expect(quality).toBeDefined();
  });

  it("gera insight de consistência quando streak é alta", () => {
    const repos: GithubRepo[] = [];
    const user = makeUser({});
    const consistency: CommitConsistency = {
      ...baseConsistency,
      longestStreak: 15,
      totalContributions: 200,
    };

    const insights = generateInsights(user, repos, consistency);

    const consistent = insights.find((i) => i.titleKey === "consistent");
    expect(consistent).toBeDefined();
  });

  it("limita o número de insights a no máximo 3", () => {
    const repos: GithubRepo[] = [
      makeRepo({ stargazers_count: 100 }),
      makeRepo({ stargazers_count: 50 }),
      makeRepo({
        stargazers_count: 30,
        created_at: new Date().toISOString(),
      }),
      makeRepo({
        stargazers_count: 30,
        created_at: new Date().toISOString(),
      }),
      makeRepo({
        stargazers_count: 30,
        created_at: new Date().toISOString(),
      }),
    ];

    const user = makeUser({
      followers: 200,
      following: 10,
      created_at: "2010-01-01T00:00:00Z",
    });

    const consistency: CommitConsistency = {
      totalContributions: 2000,
      activeDays: 200,
      longestStreak: 30,
      averagePerActiveDay: 10,
      consistencyScore: 90,
    };

    const insights = generateInsights(user, repos, consistency);

    expect(insights.length).toBeLessThanOrEqual(3);
  });
});
