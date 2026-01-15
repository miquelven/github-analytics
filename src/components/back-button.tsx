"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/language-context";

export function BackButton() {
  const { t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  const getFallbackPath = () => {
    const parts = pathname.split("/").filter(Boolean);

    // Se estiver na tela de repo: /repo/[owner]/[repo] -> voltar para /user/[owner]
    if (parts[0] === "repo" && parts.length >= 2) {
      return `/user/${parts[1]}`;
    }

    // Se estiver na tela de usuário: /user/[owner] -> voltar para /
    if (parts[0] === "user") {
      return "/";
    }

    // Se estiver na tela de compare: /compare -> voltar para /
    if (parts[0] === "compare") {
      return "/";
    }

    // Padrão
    return "/";
  };

  const handleBack = () => {
    // Verifica se há histórico de navegação dentro do mesmo domínio
    // window.history.length > 1 indica que há páginas anteriores
    // document.referrer.includes(window.location.origin) garante que viemos do nosso próprio site
    const hasHistory =
      typeof window !== "undefined" &&
      window.history.length > 1 &&
      document.referrer.includes(window.location.origin);

    if (hasHistory) {
      router.back();
    } else {
      router.push(getFallbackPath());
    }
  };

  return (
    <Button variant="ghost" className="gap-2 pl-0" onClick={handleBack}>
      <ArrowLeft className="h-4 w-4" />
      {t.common.backToSearch}
    </Button>
  );
}
