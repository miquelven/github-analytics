"use client";

import Link from "next/link";
import { Github, TrendingUp, Swords } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/contexts/language-context";

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();

  return (
    <>
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Github className="h-6 w-6" />
            <span className="hidden md:inline">GitHub Analytics</span>
          </Link>
          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/compare">
              <Button variant="ghost" className="gap-2 px-2 md:px-4">
                <Swords className="h-4 w-4" />
                <span className="hidden md:inline">{t.common.battle}</span>
              </Button>
            </Link>
            <Link href="/trending">
              <Button variant="ghost" className="gap-2 px-2 md:px-4">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden md:inline">{t.common.trending}</span>
              </Button>
            </Link>
            <LanguageToggle />
            <ModeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </>
  );
}
