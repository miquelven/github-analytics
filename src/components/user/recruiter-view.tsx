"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GithubUser, GithubRepo } from "@/types/github";
import { useLanguage } from "@/contexts/language-context";
import { differenceInYears, format } from "date-fns";
import { Star, GitFork, Calendar, MapPin, Building } from "lucide-react";
import Link from "next/link";

interface RecruiterViewProps {
  user: GithubUser;
  repos: GithubRepo[];
}

export function RecruiterView({ user, repos }: RecruiterViewProps) {
  const { t } = useLanguage();

  // Experience
  const experienceYears = differenceInYears(
    new Date(),
    new Date(user.created_at)
  );

  // Top Skills
  const languagesMap = repos.reduce((acc: Record<string, number>, repo) => {
    if (repo.language) {
      acc[repo.language] = (acc[repo.language] || 0) + 1;
    }
    return acc;
  }, {});

  const topSkills = Object.entries(languagesMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  // Featured Projects (Impact Sort)
  const featuredProjects = [...repos]
    .sort(
      (a, b) =>
        b.stargazers_count * 2 +
        b.forks_count -
        (a.stargazers_count * 2 + a.forks_count)
    )
    .slice(0, 4);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Summary */}
      <Card className="border-l-4 border-l-primary">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
              <AvatarImage src={user.avatar_url} alt={user.login} />
              <AvatarFallback>
                {user.login.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2 flex-1">
              <div>
                <h2 className="text-2xl font-bold">
                  {user.name || user.login}
                </h2>
                <p className="text-muted-foreground">@{user.login}</p>
              </div>
              {user.bio && (
                <p className="text-lg italic text-foreground/80">{user.bio}</p>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-2">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {t.recruiter.experience.replace(
                    "{years}",
                    experienceYears.toString()
                  )}
                </div>
                {user.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {user.location}
                  </div>
                )}
                {user.company && (
                  <div className="flex items-center gap-1">
                    <Building className="h-4 w-4" />
                    {user.company}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Skills Column */}
        <Card className="md:col-span-1 h-full">
          <CardHeader>
            <CardTitle>{t.recruiter.topSkills}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSkills.map((skill) => (
                <div key={skill.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-muted-foreground">
                      {skill.count} repos
                    </span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{
                        width: `${(skill.count / repos.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
              {topSkills.length === 0 && (
                <p className="text-muted-foreground text-sm">
                  No language data available.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Featured Projects Column */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-500" />
            {t.recruiter.featuredProjects}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredProjects.map((repo) => (
              <Card
                key={repo.id}
                className="flex flex-col h-full hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base font-bold truncate pr-2">
                      <Link
                        href={repo.html_url}
                        target="_blank"
                        className="hover:underline hover:text-primary"
                      >
                        {repo.name}
                      </Link>
                    </CardTitle>
                    {repo.language && (
                      <Badge variant="secondary" className="text-xs">
                        {repo.language}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between pt-0 pb-4">
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {repo.description || "No description provided."}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto">
                    <div className="flex items-center gap-1 font-medium text-foreground">
                      <Star className="h-3.5 w-3.5 text-amber-500" />
                      {repo.stargazers_count}
                    </div>
                    <div className="flex items-center gap-1">
                      <GitFork className="h-3.5 w-3.5" />
                      {repo.forks_count}
                    </div>
                    <div className="ml-auto">
                      Updated {format(new Date(repo.updated_at), "MMM yyyy")}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
