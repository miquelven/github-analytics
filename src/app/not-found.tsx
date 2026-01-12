"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export default function NotFound() {
  const { t } = useLanguage();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <div className="rounded-full bg-muted p-6 mb-6">
        <FileQuestion className="h-12 w-12 text-muted-foreground" />
      </div>
      <h2 className="text-3xl font-bold tracking-tight mb-2">{t.common.notFound.title}</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        {t.common.notFound.description}
      </p>
      <Link href="/">
        <Button size="lg">{t.common.notFound.button}</Button>
      </Link>
    </div>
  );
}
