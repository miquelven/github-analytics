"use client";

import { useEffect, useState } from "react";
import { Github } from "lucide-react";
import { cn } from "@/lib/utils";

export function SplashScreen() {
  const [show, setShow] = useState(true);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setAnimate(true);
    }, 2000);

    const timer2 = setTimeout(() => {
      setShow(false);
    }, 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-500",
        animate ? "opacity-0" : "opacity-100"
      )}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Github className="h-16 w-16 animate-bounce text-primary" />
          <div className="absolute -bottom-2 left-1/2 h-2 w-8 -translate-x-1/2 rounded-full bg-primary/20 blur-sm" />
        </div>
        <h1 className="animate-pulse text-2xl font-bold tracking-tighter">
          GitHub Analytics
        </h1>
      </div>
    </div>
  );
}
