"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Users,
  Link as LinkIcon,
  Twitter,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/language-context";

import { GithubUser } from "@/types/github";

interface UserHeaderProps {
  user: GithubUser;
}

export function UserHeader({ user }: UserHeaderProps) {
  const { t } = useLanguage();

  const login = user?.login ?? "";
  const initials =
    login.length >= 2
      ? login.slice(0, 2).toUpperCase()
      : login.toUpperCase() || "??";

  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        <div className="flex flex-col items-start gap-6 md:flex-row">
          <Avatar className="h-24 w-24 md:h-32 md:w-32">
            <AvatarImage src={user?.avatar_url ?? ""} alt={login} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div>
              <h1 className="text-2xl font-bold">{user?.name ?? login}</h1>
              <Link
                href={user?.html_url ?? "#"}
                target="_blank"
                className="text-muted-foreground hover:underline"
              >
                @{login}
              </Link>
            </div>
            {user?.bio && <p className="text-muted-foreground">{user.bio}</p>}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {user?.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {user.location}
                </div>
              )}
              {user?.blog && (
                <div className="flex items-center gap-1">
                  <LinkIcon className="h-4 w-4" />
                  <Link
                    href={
                      user.blog.startsWith("http")
                        ? user.blog
                        : `https://${user.blog}`
                    }
                    target="_blank"
                    className="hover:underline"
                  >
                    {t.user.website}
                  </Link>
                </div>
              )}
              {user?.twitter_username && (
                <div className="flex items-center gap-1">
                  <Twitter className="h-4 w-4" />
                  <Link
                    href={`https://twitter.com/${user.twitter_username}`}
                    target="_blank"
                    className="hover:underline"
                  >
                    @{user.twitter_username}
                  </Link>
                </div>
              )}
              {user?.created_at && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {t.user.joined}{" "}
                  {format(new Date(user.created_at), "MMMM yyyy")}
                </div>
              )}
            </div>
            <div className="flex gap-4 pt-2">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span className="font-bold">{user?.followers ?? 0}</span>{" "}
                {t.user.followers}
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span className="font-bold">{user?.following ?? 0}</span>{" "}
                {t.user.following}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
