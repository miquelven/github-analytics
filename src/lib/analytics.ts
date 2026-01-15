import { ContributionCalendar, GithubRepo, GithubUser } from "@/types/github";

export interface LanguageStat {
  language: string;
  count: number;
  percentage: number;
}

export interface CommitConsistency {
  totalContributions: number;
  activeDays: number;
  longestStreak: number;
  averagePerActiveDay: number;
  consistencyScore: number; // 0-100
}

export type DeveloperProfile = "Focused" | "Generalist" | "Balanced";

export interface Insight {
  type: "positive" | "neutral" | "trend";
  icon: "TrendingUp" | "Star" | "Zap" | "Award" | "Users" | "GitCommit";
  titleKey: string;
  params?: Record<string, string | number>;
}

export function calculateLanguageStats(repos: GithubRepo[]): LanguageStat[] {
  const stats: Record<string, number> = {};
  let total = 0;

  repos.forEach((repo) => {
    if (repo.language) {
      stats[repo.language] = (stats[repo.language] || 0) + 1;
      total++;
    }
  });

  if (total === 0) return [];

  return Object.entries(stats)
    .map(([language, count]) => ({
      language,
      count,
      percentage: (count / total) * 100,
    }))
    .sort((a, b) => b.count - a.count);
}

export function determineProfileType(stats: LanguageStat[]): DeveloperProfile {
  if (stats.length === 0) return "Balanced";

  const topLang = stats[0];
  if (stats.length === 1 || topLang.percentage > 70) return "Focused";

  // Se as 3 primeiras linguagens somam menos de 60%, é bem generalista
  const top3Sum = stats
    .slice(0, 3)
    .reduce((acc, curr) => acc + curr.percentage, 0);
  if (stats.length > 4 && top3Sum < 60) return "Generalist";

  return "Balanced";
}

export function calculateConsistency(
  calendar: ContributionCalendar | null
): CommitConsistency {
  if (!calendar) {
    return {
      totalContributions: 0,
      activeDays: 0,
      longestStreak: 0,
      averagePerActiveDay: 0,
      consistencyScore: 0,
    };
  }

  const weeks = calendar.weeks;
  let activeDays = 0;
  let currentStreak = 0;
  let longestStreak = 0;
  const totalContributions = calendar.totalContributions;

  weeks.forEach((week) => {
    week.contributionDays.forEach((day) => {
      if (day.contributionCount > 0) {
        activeDays++;
        currentStreak++;
      } else {
        if (currentStreak > longestStreak) longestStreak = currentStreak;
        currentStreak = 0;
      }
    });
  });
  // Check last streak
  if (currentStreak > longestStreak) longestStreak = currentStreak;

  // Simple consistency score logic
  // Base score on active days ratio (max 50 pts) + streak bonus (max 30 pts) + total volume bonus (max 20 pts)
  const totalDays = weeks.length * 7;
  const activeRatio = activeDays / totalDays;

  let score = activeRatio * 50; // Up to 50 points for being active every day
  score += Math.min(longestStreak, 30); // Up to 30 points for streaks
  score += Math.min(totalContributions / 100, 20); // Up to 20 points for volume

  return {
    totalContributions,
    activeDays,
    longestStreak,
    averagePerActiveDay: activeDays > 0 ? totalContributions / activeDays : 0,
    consistencyScore: Math.min(Math.round(score), 100),
  };
}

export function generateInsights(
  user: GithubUser,
  repos: GithubRepo[],
  consistency: CommitConsistency
): Insight[] {
  const insights: Insight[] = [];

  // 1. Quality over Quantity (High Avg Stars)
  const totalStars = repos.reduce((acc, r) => acc + r.stargazers_count, 0);
  const avgStars = repos.length > 0 ? totalStars / repos.length : 0;

  if (avgStars > 10) {
    // Baixei para 10 para ser mais fácil de testar, 50 é muito alto para maioria
    insights.push({
      type: "positive",
      icon: "Star",
      titleKey: "quality",
      params: { count: avgStars.toFixed(1) },
    });
  }

  // 2. Rising Star (Recent Activity)
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const recentRepos = repos.filter((r) => new Date(r.created_at) > oneYearAgo);
  const recentStars = recentRepos.reduce(
    (acc, r) => acc + r.stargazers_count,
    0
  );

  if (recentRepos.length >= 3 && recentStars > 5) {
    insights.push({
      type: "trend",
      icon: "TrendingUp",
      titleKey: "risingStar",
      params: { count: recentRepos.length, stars: recentStars },
    });
  }

  // 3. Consistency Machine
  if (consistency.longestStreak > 14 || consistency.activeDays > 150) {
    insights.push({
      type: "positive",
      icon: "Zap",
      titleKey: "consistent",
      params: { days: consistency.longestStreak },
    });
  }

  // 4. Veteran or Newcomer
  const createdDate = new Date(user.created_at);
  const now = new Date();
  const yearsActive = now.getFullYear() - createdDate.getFullYear();

  if (yearsActive >= 5) {
    insights.push({
      type: "neutral",
      icon: "Award",
      titleKey: "veteran",
      params: { years: yearsActive },
    });
  }

  // 5. Social Butterfly
  if (user.followers > 50 && user.followers > user.following * 2) {
    insights.push({
      type: "positive",
      icon: "Users",
      titleKey: "social",
      params: { count: user.followers },
    });
  }

  // 6. Workhorse (Muitas contribuições)
  if (consistency.totalContributions > 1000) {
    insights.push({
      type: "positive",
      icon: "GitCommit",
      titleKey: "workhorse",
      params: { count: consistency.totalContributions },
    });
  }

  return insights.slice(0, 3); // Max 3 insights
}
