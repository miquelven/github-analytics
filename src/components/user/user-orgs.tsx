"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";

import { GithubOrg } from "@/types/github";

interface UserOrgsProps {
  orgs: GithubOrg[];
}

export function UserOrgs({ orgs }: UserOrgsProps) {
  const { t } = useLanguage();
  if (!orgs || orgs.length === 0) {
    return null;
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-lg">{t.user.organizations}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          {orgs.map((org) => (
            <Link
              key={org.id}
              href={`https://github.com/${org.login}`}
              target="_blank"
              title={org.login}
            >
              <Avatar className="h-12 w-12 border-2 border-background shadow-sm hover:scale-110 transition-transform">
                <AvatarImage src={org.avatar_url} alt={org.login} />
                <AvatarFallback>
                  {org.login.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
