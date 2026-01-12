"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export function SearchForm() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { t } = useLanguage();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/user/${query.trim()}`);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex w-full max-w-sm items-center space-x-2"
    >
      <Input
        type="text"
        placeholder={t.common.searchPlaceholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="bg-background"
      />
      <Button type="submit">
        <Search className="h-4 w-4 mr-2" />
        {t.common.search}
      </Button>
    </form>
  );
}
