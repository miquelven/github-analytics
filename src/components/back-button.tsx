"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";

export function BackButton() {
  const { t } = useLanguage();

  return (
    <Link href="/">
      <Button variant="ghost" className="gap-2 pl-0">
        <ArrowLeft className="h-4 w-4" />
        {t.common.backToSearch}
      </Button>
    </Link>
  );
}
