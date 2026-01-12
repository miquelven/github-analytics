"use client";

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import "github-markdown-css/github-markdown.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

interface ProfileReadmeProps {
  content: string | null;
}

export function ProfileReadme({ content }: ProfileReadmeProps) {
  const { t } = useLanguage();
  if (!content) return null;

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          {t.user.profileReadme}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full rounded-md border p-4 bg-white dark:bg-black/20">
          <div
            className="markdown-body"
            style={{ backgroundColor: "transparent" }}
          >
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
