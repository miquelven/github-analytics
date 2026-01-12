"use client";

import { useEffect, useState } from "react";
import { getRateLimit } from "@/lib/github";
import { Gauge } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLanguage } from "@/contexts/language-context";

export function RateLimitIndicator() {
  const { t } = useLanguage();
  const [rateLimit, setRateLimit] = useState<{
    limit: number;
    remaining: number;
    reset: number;
  } | null>(null);

  useEffect(() => {
    const fetchRateLimit = async () => {
      const data = await getRateLimit();
      if (data) {
        setRateLimit(data);
      }
    };

    fetchRateLimit();
    // Refresh every minute
    const interval = setInterval(fetchRateLimit, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!rateLimit) return null;

  const percentage = (rateLimit.remaining / rateLimit.limit) * 100;
  const resetTime = new Date(rateLimit.reset * 1000).toLocaleTimeString();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-background/80 px-3 py-1.5 text-xs font-medium shadow-lg backdrop-blur border">
            <Gauge
              className={`h-3.5 w-3.5 ${
                percentage < 20
                  ? "text-red-500"
                  : percentage < 50
                  ? "text-yellow-500"
                  : "text-green-500"
              }`}
            />
            <span>
              {rateLimit.remaining} / {rateLimit.limit}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t.common.apiRequestsRemaining}</p>
          <p className="text-xs text-muted-foreground">
            {t.common.resetsAt} {resetTime}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
