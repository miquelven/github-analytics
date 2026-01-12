"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Swords } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export function CompareForm() {
  const { t } = useLanguage();
  const [user1, setUser1] = useState("");
  const [user2, setUser2] = useState("");
  const router = useRouter();

  const handleCompare = (e: React.FormEvent) => {
    e.preventDefault();
    if (user1.trim() && user2.trim()) {
      router.push(`/compare?user1=${user1.trim()}&user2=${user2.trim()}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-8 border rounded-lg bg-card/50 backdrop-blur-sm">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">{t.compare.title}</h2>
        <p className="text-muted-foreground">{t.compare.subtitle}</p>
      </div>

      <form
        onSubmit={handleCompare}
        className="flex flex-col md:flex-row gap-4 w-full max-w-2xl items-end"
      >
        <div className="flex-1 w-full space-y-2">
          <label
            htmlFor="user1"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t.compare.form.p1}
          </label>
          <Input
            id="user1"
            type="text"
            placeholder={t.compare.form.placeholder1}
            value={user1}
            onChange={(e) => setUser1(e.target.value)}
            className="bg-background"
            required
          />
        </div>

        <div className="flex items-center justify-center pb-2">
          <Swords className="h-6 w-6 text-muted-foreground hidden md:block" />
          <span className="md:hidden text-muted-foreground font-bold">{t.common.vs}</span>
        </div>

        <div className="flex-1 w-full space-y-2">
          <label
            htmlFor="user2"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t.compare.form.p2}
          </label>
          <Input
            id="user2"
            type="text"
            placeholder={t.compare.form.placeholder2}
            value={user2}
            onChange={(e) => setUser2(e.target.value)}
            className="bg-background"
            required
          />
        </div>

        <Button type="submit" size="lg" className="w-full md:w-auto">
          {t.compare.form.button}
        </Button>
      </form>
    </div>
  );
}
