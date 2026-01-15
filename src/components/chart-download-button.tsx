"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportChartToPNG } from "@/lib/export";

interface ChartDownloadButtonProps {
  elementId: string;
  filename: string;
}

export function ChartDownloadButton({ elementId, filename }: ChartDownloadButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background border shadow-sm z-10"
      onClick={(e) => {
        e.stopPropagation(); // Prevent triggering other card actions if any
        exportChartToPNG(elementId, filename);
      }}
      title="Download Chart Image"
    >
      <Download className="h-4 w-4" />
    </Button>
  );
}
